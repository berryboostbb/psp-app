import { Pin, AppText, Wrapper, CurveHeader, LinearButton, PrimaryButton, Overlay, SuccessHeader } from '@components';
import styles from './styles';
import { NativeModules, View } from 'react-native';
import { navigate } from '@services';
import { GST, Typography } from '@theme';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { setOrderData, setTxn } from '@redux';
import { languagePicker } from '@utils';
import { exclaimation, tick } from '@assets';
import SInfo from 'react-native-sensitive-info';

var currencyFormatter = require('currency-formatter');
var interval: any;

const SelectAccount = ({ navigation }: any) => {
    const language = useSelector((state: any) => state.user.languageType);
    const inputRef: any = useRef();
    const myTheme: any = useTheme();
    const [code, setCode] = useState<any>();
    const [onClick, setOnClick] = useState<any>('');
    const [selectAcc, setSelectAcc] = useState<any>();
    const [loading, setLoading] = useState<Boolean>(true);
    const { orderData } = useSelector((state: any) => state.common);
    const { internet_Connected } = useSelector((state: any) => state.user);
    const { tms_settings } = useSelector((state: any) => state.pr);
    const { txn } = useSelector((state: any) => state.tms);
    const surchargeConfig = tms_settings?.transaction_settings?.surcharge;
    const { PaxPaymentModule } = NativeModules;
    const dispatch = useDispatch();
    const ref: any = useRef();
    const notifyType = '';
    const [overlayVisible, setOverlayVisible] = useState(false);

    React.useEffect(() => {
        let timeout: any = null;
        const unsubscribe = navigation.addListener('focus', () => {
            SInfo.deleteItem('Pin_Result_Text', {
                sharedPreferencesName: 'SharedPreferenceHelper',
                keychainService: '',
            });
            timeout = setTimeout(() => {
                inputRef?.current?.blur();
                inputRef?.current?.focus();
            }, 100);
        });
        return () => {
            clearTimeout(timeout);
            unsubscribe;
        };
    }, [navigation]);

    const onSubmit = () => {
        navigate('LoadingProcess', { type: 'insert' });
    };

    const openKeyBoard = () => {
        setTimeout(() => {
            inputRef?.current?.blur();
            inputRef?.current?.focus();
        }, 200);
    };

    useEffect(() => {
        if (orderData.cardType == 'credit') {
            on_Click('');
            setSelectAcc(true);
            openKeyBoard();
        }
    }, []);

    const on_Click = (type: any) => {
        setOnClick(type);
        openKeyBoard();

        setTimeout(async () => {
            let data = { ...orderData };
            data.accountType = type;
            dispatch(setOrderData(data));

            if (orderData.entry_mode == 'T') {
                navigate('LoadingProcess', { type: 'insert' });
            } else {
                setSelectAcc(true);
                const gettingAllKeys = txn;
                let accountNumber = gettingAllKeys['PAN'];
                let encryptionType = '1';
                let keySlot = '1';
                const tagList = '5F2A5F348284959A9C9F029F039F099F109F1A9F1E9F269F279F339F349F359F369F3750';

                const { orderAmount, tip, surcharge } = orderData;
                const amountWithSurcharge = (Math.round(((orderAmount ?? 0) + (tip ?? 0) + (surcharge ?? 0) + Number.EPSILON) * 100) / 100).toFixed(2).replace('.', '');
                console.log({ amountWithSurcharge, accountNumber, encryptionType, keySlot, tagList });

                await PaxPaymentModule.updatedAuthorizeCard(amountWithSurcharge, accountNumber, encryptionType, keySlot, tagList, getData);

                return () => clearInterval(interval);
            }
        }, 200);
    };

    const getData = async (response: string) => {
        const data = JSON.parse(response);
        const setData = { ...txn, ...data };
        dispatch(setTxn(setData));

        setLoading(false);
        const gettingAllKeys = data;

        console.log('gettingAllKeysgettingAllKeys', JSON.stringify(setData, null, 2));

        if (gettingAllKeys.hasOwnProperty('Pin_Result_Text')) {
            if (txn['Entry Mode'] == 4) {
                navigate('LoadingProcess', { type: 'insert' });
            }
        }
    };

    const btnClick = () => {
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
        navigate('TransactionMenu');
    };
    !internet_Connected && navigate('Offline');

    const onTextChange = (code: any) => {
        setCode(code);
        setOverlayVisible(false);
    };

    return (
        <Wrapper viewStyle={styles.main}>
            {overlayVisible && (
                <View style={{ zIndex: 10 }}>
                    <Overlay>
                        <SuccessHeader
                            ref={ref}
                            imageSrc={notifyType == 'success' ? tick : exclaimation}
                            bgClr={notifyType == 'success' ? '#E3F8CFD9' : 'red'}
                            error={notifyType == 'success' ? false : true}
                        />
                    </Overlay>
                </View>
            )}

            <CurveHeader
                visible
                adminVisible
                title={
                    orderData.cardType === 'debit'
                        ? currencyFormatter.format(parseFloat(orderData.orderAmount) + parseFloat(orderData.tip) + parseFloat(surchargeConfig?.debit_surcharge?.fee), {
                              code: 'CAD',
                          })
                        : currencyFormatter.format(parseFloat(orderData.orderAmount) + parseFloat(orderData.tip) + (parseFloat(orderData.orderAmount) / 100) * surchargeConfig?.credit_surcharge?.fee, {
                              code: 'CAD',
                          })
                }
                total={languagePicker(language, 'Sale Total')}
            />

            {!selectAcc && (
                <AppText
                    medium
                    center
                    defaultTextColor
                    textStyle={[GST.pt, { fontFamily: 'Plus Jakarta Sans' }]}
                    title={languagePicker(language, 'Select Account')}
                    size={Typography.FONTS.SIZE.XXLARGE}
                />
            )}
            {!loading && (
                <View style={styles.txtView}>
                    {selectAcc ? (
                        <View style={GST.AIC}>
                            <AppText title={languagePicker(language, 'Enter Your PIN')} size={Typography.FONTS.SIZE.XXLARGE} />
                            <Pin code={code} setCode={setCode} onSubmitEditing={onSubmit} ref={inputRef} onTextChange={onTextChange} />
                        </View>
                    ) : (
                        <>
                            <View style={styles.mt}>
                                <LinearButton title={languagePicker(language, 'Chequing')} type="chequing" onClick={onClick} onPress={() => on_Click('chequing')} />
                                <LinearButton title={languagePicker(language, 'Saving')} type="saving" onClick={onClick} onPress={() => on_Click('saving')} />
                            </View>
                        </>
                    )}
                </View>
            )}
            {!selectAcc && (
                <>
                    <View style={styles.btn}>
                        <PrimaryButton
                            clr={'#D74120'}
                            title={languagePicker(language, 'Cancel')}
                            buttonStyle={styles.wd}
                            disableBackgroundColor={true}
                            onPress={() => btnClick()}
                            bgColor={myTheme.colors.textInputBckground}
                        />
                    </View>
                </>
            )}
        </Wrapper>
    );
};

export default SelectAccount;
