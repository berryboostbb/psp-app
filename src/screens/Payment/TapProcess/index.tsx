import React, { useEffect, useRef, useState } from 'react';
import { setOrderData, setPrePrinted, setTimeLayout, setTxn } from '@redux';
import { FlatList, NativeModules, Text, TouchableOpacity } from 'react-native';
import { navigate } from '@services';
import SInfo from 'react-native-sensitive-info';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { FlatHeader, Wrapper, AppText, SuccessHeader, TouchInactivityDetector, MiniOverlay } from '@components';
import { Image, View, StyleSheet, Alert } from 'react-native';
import { yellow, tick, exclaimation, tap, mastercard, visa, americanexpress, jcb, interac } from '@assets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GST, RF, Typography, verticalScale, horizontalScale } from '@theme';
import { GetCardType, languagePicker, makeStringCenter } from '@utils';
import Pax from 'react-native-pax-library';
import { getApplicationLable } from '../../../shared/utils/emvParser';

var currencyFormatter = require('currency-formatter');

let iconData = [
    { name: 'Interac', img: interac },
    { name: 'Visa', img: visa },
    { name: 'MasterCard', img: mastercard },
    { name: 'American Express', img: americanexpress },
    { name: 'JCB', img: jcb },
];

const TapProcess = (props: any) => {
    const language = useSelector((state: any) => state.user.languageType);
    const theme: any = useTheme();
    const { flowType, internet_Connected, prePrinted } = useSelector((state: any) => state.user);
    const intervalRef = useRef<any>(null);
    const orderData = useSelector((state: any) => state.common.orderData);

    const isRefund = useSelector((state: any) => state.common.isRefund);
    const dispatch = useDispatch();
    const [countError, setCountError] = useState(0);
    const [flag, setFlag] = useState(false);
    const [restrictError, setrestrictError] = useState(false);
    const [tapError, settapError] = useState(false);

    const { bin_ranges } = useSelector((state: any) => state.tms);
    const { tms_settings } = useSelector((state: any) => state.pr);
    const printerConfiguration = tms_settings?.printer;
    const surchargeConfig = tms_settings?.transaction_settings?.surcharge;
    const merchant_passcode = tms_settings?.terminal_configuration?.merchant_passcode;
    const ref: any = useRef();
    const [notifyType, setNotifyType] = useState('');
    const [overlayVisible, setOverlayVisible] = useState(false);
    const { PaxPaymentModule } = NativeModules;
    const tapLimit = tms_settings?.transaction_settings?.tap_limit?.fee;
    const terminal_mode = tms_settings?.terminal_configuration?.language_and_terminal_mode?.terminal_mode;

    const makeIconData = () => {
        // check the length
        let tempArr = JSON.parse(JSON.stringify(iconData));
        console.log(bin_ranges, 'eioruwiorewuiou');

        for (let i = 0; i < bin_ranges?.length; i++) {
            for (let j = 0; j < tempArr?.length; j++) {
                if (bin_ranges[i]?.card == tempArr[j]?.name) {
                    Object.assign(tempArr[j], { active: bin_ranges[i]?.active });
                }

                if (bin_ranges[i]?.card == 'Visa') {
                    if (bin_ranges[i]?.active) {
                        Object.assign(tempArr[0], { active: true });
                    } else {
                        Object.assign(tempArr[0], { active: false });
                    }
                }
            }
        }

        console.log('temp...', tempArr);

        iconData = tempArr;
    };

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // dispatch(setTimeLayout(20000));
            makeIconData();
        });

        return () => {
            // dispatch(setTimeLayout(null));
            unsubscribe;
        };
    }, [props.navigation]);

    React.useEffect(() => {
        if (printerConfiguration?.pre_print?.value) {
            if (!prePrinted) {
                if (!flag) initPrinter();
                setFlag(true);

                dispatch(setPrePrinted(true));
            }
        }

        SInfo.deleteItem('cardHolderName', {
            sharedPreferencesName: 'SharedPreferenceHelper',
            keychainService: '',
        });

        console.log('orderData', JSON.stringify(orderData, null, 2));
        let finalAmount = (orderData.amount ?? (Math.round(((orderData.orderAmount ?? 0) + (orderData.tip ?? 0) + Number.EPSILON) * 100) / 100).toFixed(2)).toString().split('.').join('');

        // INIT: amount, type, logMode, encryptionFlag, tagList, callback
        const logMode = true;
        const encryptionFlag = '0'; // Set to 1 if encryption is enabled
        const tagList = '5F2A5F348284959A9C9F029F039F099F109F1A9F1E9F269F279F339F349F359F369F3750';
        const emvConfig = '01';

        PaxPaymentModule.init(finalAmount, isRefund ? 'Return' : 'Sale', logMode, encryptionFlag, tagList, emvConfig, getData);
    }, []);

    const initPrinter = async () => {
        let receipt = '';
        Object.keys(printerConfiguration?.receipt_header_lines).map(key => {
            if (key !== 'value' && printerConfiguration?.receipt_header_lines[key] && key !== 'line_1') {
                receipt += makeStringCenter(`${printerConfiguration?.receipt_header_lines[key]}`, 31, 'center') + '\n';
            }
        });

        let url = '';
        if (printerConfiguration?.pre_print?.value) {
            Pax.printStr('pre', url, receipt, Pax.FULL_CUT, '', printerConfiguration?.receipt_header_lines?.line_1);
        }
    };

    const checkBINRange = async (PAN: any) => {
        // get restricted pins from your redux

        let restricted_pin = JSON.parse(JSON.stringify(bin_ranges));

        //if the BINRanges are not set then just let them pass

        if (!restricted_pin?.length) return true;

        const getLongestStrLength = (arr: any) => {
            let modifiedArr = arr.map((str: any) => {
                if (str.includes('-')) {
                    return str.split('-')[1];
                }

                return str;
            });

            let longest = 0;

            for (let i = 0; i < modifiedArr.length; i++) {
                if (modifiedArr[i].length > longest) {
                    longest = modifiedArr[i].length;
                }
            }

            return longest;
        };

        restricted_pin = restricted_pin.sort((a, b) => {
            return getLongestStrLength(b.ranges) - getLongestStrLength(a.ranges);
        });

        let foundPin = false;

        for (let i = 0; i < restricted_pin.length; i++) {
            let { ranges, active } = restricted_pin[i];

            if (!active) continue;

            for (let j = 0; j < ranges.length; j++) {
                let range = ranges[j];

                if (range.includes('-')) {
                    let [start, end] = range.split('-').map(_ => _.trim());

                    let splicedPAN = PAN.slice(0, end.length);

                    if (Number(splicedPAN) >= Number(start) && Number(splicedPAN) <= Number(end)) {
                        foundPin = true;

                        break;
                    }
                } else {
                    let splicedPAN = PAN.slice(0, range.length);

                    if (Number(splicedPAN) === Number(range)) {
                        foundPin = true;

                        break;
                    }
                }
            }

            if (foundPin) break;
        }

        console.log('return..', foundPin);

        if (foundPin) return true;

        return false;
    };

    const getData = async (response, err) => {
        const data = JSON.parse(response);
        dispatch(setTxn(data));
        console.log('CARD_DATA', JSON.stringify(data, null, 2));

        const gettingAllKeys: any = data;

        let card_number = null;
        if (gettingAllKeys.hasOwnProperty('cardHolderName') && gettingAllKeys['Entry Mode'] !== '') {
            let checkCard = await checkBINRange(gettingAllKeys.PAN);

            card_number = gettingAllKeys.PAN;
            let application_label = gettingAllKeys['Entry Mode'] == 1 ? 'credit' : getApplicationLable(gettingAllKeys?.EMVData);

            if (gettingAllKeys['Entry Mode'] == 1) {
                let type = GetCardType(card_number);

                let data = { ...orderData };
                data.entry_mode = 'S';
                data.cardType = application_label;
                data.cType = type;
                data.cardNumber = card_number;

                dispatch(setOrderData(data));

                // let str = "";
                // Object.keys(gettingAllKeys).map((key: any) => {
                //   str += key + " :  " + gettingAllKeys[key] + "\n\n";
                // });

                // Alert.alert(
                //   "Card Info",
                //   str,
                //   [
                //     {
                //       text: "OK",
                //       onPress: () => {
                if (gettingAllKeys['Result Text'] == 'OK') {
                    if (!isRefund) {
                        if (surchargeConfig?.debit_surcharge?.value || surchargeConfig?.credit_surcharge?.value) {
                            navigate('Tap_Merchant_Cart', {
                                type: 'pending',
                                cardType: application_label,
                            });
                        } else {
                            navigate('LoadingProcess', { type: 'swipe' });
                        }
                    } else {
                        navigate('LoadingProcess', { type: 'swipe' });
                    }
                } else {
                    setNotifyType('error');
                    setOverlayVisible(true);
                    ref?.current?.alertWithType('custom', gettingAllKeys['Result Text'], '');

                    setTimeout(() => {
                        if (isRefund) {
                            navigate('EnterAmount');
                        } else {
                            navigate('Merchant_Cart', { type: 'login' });
                        }
                    }, 5000);
                }
            } else {
                if (gettingAllKeys['Result Code'] == '000000') {
                    if (gettingAllKeys['Entry Mode'] == 2 && tapLimit < orderData?.orderAmount) {
                        setNotifyType('error');
                        setOverlayVisible(true);
                        settapError(true);
                        ref?.current?.alertWithType('custom', 'Cannot Tap. Please Try Insert.', '');
                        setTimeout(() => {
                            settapError(false);
                            if (isRefund) {
                                navigate('EnterAmount');
                            } else {
                                navigate('Merchant_Cart', { type: 'login' });
                            }
                        }, 5000);
                    } else {
                        if (checkCard) {
                            let type = GetCardType(card_number);

                            let data = { ...orderData };
                            data.entry_mode = gettingAllKeys['Entry Mode'] == 2 ? 'T' : 'C';
                            data.cardType = application_label;
                            data.cType = type;

                            data.cardNumber = card_number;
                            dispatch(setOrderData(data));

                            let str = '';
                            Object.keys(gettingAllKeys).map((key: any) => {
                                str += key + ' :  ' + gettingAllKeys[key] + '\n\n';
                            });

                            // Alert.alert(
                            //   "Card Info",
                            //   str,
                            //   [
                            //     {
                            //       text: "OK",
                            //       onPress: () => {
                            if (!isRefund) {
                                if (surchargeConfig?.debit_surcharge?.value || surchargeConfig?.credit_surcharge?.value) {
                                    navigate('Tap_Merchant_Cart', {
                                        type: 'pending',
                                        cardType: application_label,
                                        // cardType: "debit",
                                    });
                                } else {
                                    if (gettingAllKeys['Entry Mode'] == 2) {
                                        navigate('LoadingProcess', { type: 'insert' });
                                    } else {
                                        navigate('SelectAccount', { type: 'insert' });
                                    }
                                }
                            } else {
                                if (gettingAllKeys['Entry Mode'] == 2) {
                                    navigate('LoadingProcess', { type: 'insert' });
                                } else {
                                    navigate('SelectAccount', { type: 'insert' });
                                }
                            }
                            // onPay()
                            //       },
                            //     },
                            //   ],
                            //   { cancelable: false }
                            // );
                        } else {
                            setNotifyType('error');
                            setOverlayVisible(true);

                            if (gettingAllKeys['Entry Mode'] == 2 && tapLimit < orderData?.orderAmount) {
                                setrestrictError(false);
                            } else {
                                setrestrictError(true);
                            }

                            ref?.current?.alertWithType('custom', 'Card Restricted!', '');
                            setTimeout(() => {
                                setrestrictError(false);
                                if (isRefund) {
                                    navigate('EnterAmount');
                                } else {
                                    navigate('Merchant_Cart', { type: 'login' });
                                }
                            }, 5000);
                        }
                    }
                } else {
                    setNotifyType('error');
                    setOverlayVisible(true);
                    if (countError > 3) {
                        ref?.current?.alertWithType('custom', 'Tap not accepted. Please insert your card or try another card.', '');
                    } else {
                        ref?.current?.alertWithType('custom', 'Card chip error. Please Try Again.', '');
                    }
                    setCountError(countError + 1);
                    setTimeout(() => {
                        if (isRefund) {
                            navigate('EnterAmount');
                        } else {
                            navigate('Merchant_Cart', { type: 'login' });
                        }
                    }, 5000);
                }
            }
        }
    };

    const onPressTap = () => {
        if (flowType === 'Debit_Refund' || flowType === 'debExcl') {
            navigate('LoadingProcess', { type: 'tap' });
        } else {
            navigate('Tap_Merchant_Cart', { type: 'tap' });
        }
    };

    const handleCrossButton = () => {
        PaxPaymentModule.reset();
        if (merchant_passcode?.value) {
            navigate('LockScreen', {});
        } else {
            navigate('TransactionMenu', {});
        }

        dispatch(setPrePrinted(false));

        dispatch(
            setOrderData({
                tip: 0.0,
                clerkId: '',
                invoiceNumber: '',
                merchantPasscode: '',
                tipType: '',
                surcharge: 0,
                orderAmount: 0.0,
                cardType: '',
            })
        );
    };

    !internet_Connected && navigate('Offline');

    return (
        <Wrapper>
            <TouchInactivityDetector>
                <View style={styles.mainContainer}>
                    <FlatHeader up disabled cross_icon imageName={tap} onPress={onPressTap} title={'TAP OR SWIPE ABOVE'} handleCrossButton={handleCrossButton} />
                    {terminal_mode?.demo_mode?.value && (
                        <View style={{ marginTop: -7 }}>
                            <MiniOverlay bgColor={'#BF1313'}>
                                <AppText title={'Demo Mode'} bold center size={18} colorText={'#fff'} />
                            </MiniOverlay>
                        </View>
                    )}
                </View>

                {overlayVisible && (
                    <View style={styles.mt}>
                        <SuccessHeader
                            yellow
                            ref={ref}
                            title_mT={90}
                            width={RF(30)}
                            ml={restrictError ? 125 : yellow || tapError ? 98 : 133}
                            t_ml={yellow ? -70 : -68}
                            imageSrc={notifyType == 'success' ? tick : exclaimation}
                            error={notifyType == 'success' ? false : yellow ? false : true}
                        />
                    </View>
                )}

                <View style={GST.flex}>
                    <View style={styles.mainView}>
                        <AppText
                            regular
                            defaultTextColor
                            title={currencyFormatter.format(parseFloat(orderData?.orderAmount) + parseFloat(orderData?.tip), {
                                code: 'CAD',
                            })}
                            size={RF(70)}
                            textStyle={styles.txt}
                        />
                        <AppText
                            regular
                            defaultTextColor
                            textStyle={flowType == 'debIncl' || flowType == 'credIncl' ? null : styles.pb}
                            title={languagePicker(language, 'Tap,Insert or Swipe')}
                            size={30}
                            // onPress={() => navigate("TipDoller")}
                        />

                        {(surchargeConfig?.debit_surcharge?.value || surchargeConfig?.credit_surcharge?.value) && (flowType == 'debIncl' || flowType == 'credIncl') && !isRefund && (
                            <>
                                <AppText
                                    semiBold
                                    colorText="red"
                                    textStyle={{
                                        marginTop: 15,
                                        fontFamily: 'Plus Jakarta Sans',
                                    }}
                                    title={languagePicker(language, 'Pending Surcharge')}
                                    size={Typography.FONTS.SIZE.LARGE}
                                />
                            </>
                        )}

                        <View style={styles.iconView}>
                            <FlatList
                                data={iconData}
                                contentContainerStyle={{
                                    alignItems: 'center',
                                }}
                                showsHorizontalScrollIndicator={false}
                                numColumns={Math.ceil(iconData.length / 2)}
                                renderItem={({ item }: any) => <>{item?.active && <Image source={item.img} style={styles.img} />}</>}
                                keyExtractor={(item: any) => item}
                            />
                        </View>
                    </View>

                    <View style={styles.lastView}>
                        <FlatHeader disabled imageName={tap} imageStyle={styles.last} title={'INSERT CHIP CARDS BELOW'} />
                    </View>
                </View>
            </TouchInactivityDetector>
        </Wrapper>
    );
};
export default TapProcess;

const styles = StyleSheet.create({
    mainContainer: {
        zIndex: 10,
    },
    image: { height: 24, width: 24 },
    txt: { marginBottom: 15, fontFamily: 'Plus Jakarta Sans' },
    mt: { marginTop: -35 },
    pb: {
        paddingBottom: RF(20),
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: '400',
    },
    lastView: {
        backgroundColor: '#fff',
        justifyContent: 'flex-end',
    },
    mainView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -50,
    },
    img: {
        width: 60,
        height: 40,
        marginRight: 8,
        marginTop: 8,
    },
    iconView: {
        flex: 1,
        position: 'absolute',
        bottom: 40,
    },
    last: {
        width: '100%',
        resizeMode: 'contain',
        backgroundColor: '#fff',
        height: RF(60),
        marginBottom: -5,
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    wd: { width: RF(350) },
    total: {
        paddingVertical: RF(32),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btn: { width: RF(142), height: RF(50) },
    view: { marginHorizontal: 25, marginTop: 40 },
    main: { paddingTop: 0, paddingHorizontal: 0 },
    wrapButton: {
        ...GST.mid_row,
        paddingTop: verticalScale(90),
        paddingHorizontal: RF(20),
    },
    rowView: {
        ...GST.mid_row,
        paddingTop: verticalScale(45),
    },
    lineView: {
        borderBottomWidth: horizontalScale(0.25),
        paddingTop: verticalScale(18),
        borderColor: '#4A55681A',
        opacity: 0.5,
    },
});
