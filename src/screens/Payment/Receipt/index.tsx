import useStyles from './style';
import { RF, Typography } from '@theme';
import { cuveLogo, gToB_Linear, logo } from '@assets';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { Image, ImageBackground, View } from 'react-native';
import { Wrapper, AppText, LinearButton, MiniOverlay } from '@components';
import Pax from 'react-native-pax-library';
import { useDispatch, useSelector } from 'react-redux';
import { setManualCardEntry, setOrderData, setSignature, store } from '@redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { languagePicker } from '@utils';
import { CommonActions } from '@react-navigation/native';

var currencyFormatter = require('currency-formatter');

const Receipt = ({ route, navigation }: any) => {
    const language = useSelector((state: any) => state.user.languageType);
    const dispatch = useDispatch();
    const myTheme: any = useTheme();
    const style = useStyles(myTheme.colors);
    const [selected, setSelected] = useState<any>(true);
    const [merchFlag, setMerchFlag] = useState<any>();
    const [printFlag, setPrintFlag] = useState<any>(false);
    const { orderId, type } = route?.params;
    const [onClick, setOnClick] = useState<any>('');
    const { manualCardEntry } = useSelector((state: any) => state.user);
    const { storeId, tms_settings } = store.getState().pr;
    const isRefund = useSelector((state: any) => state.common.isRefund);

    const terminal_mode = tms_settings?.terminal_configuration?.language_and_terminal_mode?.terminal_mode;
    const { finalTransaction, signature } = useSelector((state: any) => state.common);

    const printerConfiguration = tms_settings?.printer;

    const surchargeConfig = tms_settings?.transaction_settings?.surcharge;
    const tipConfig = tms_settings?.transaction_settings?.tip_configuration;

    const merchant_passcode = tms_settings?.terminal_configuration?.merchant_passcode;
    const orderData = useSelector((state: any) => state.common.orderData);
    const entryMethod = useState(orderData.entry_mode);

    useEffect(() => {
        setMerchFlag(true);
    }, []);

    useEffect(() => {
        if ((entryMethod == 'S' || manualCardEntry) && signature != undefined) {
            onPress();
        }
    }, [signature]);

    useEffect(() => {
        if (merchFlag && !manualCardEntry && entryMethod !== 'S') {
            onPress();
        }
    }, [merchFlag]);

    const onPressPrintReceipt = (isCustomer: boolean) => {
        setOnClick('print_receipt');
        initPrinter(false, isCustomer);
    };

    const onPress = (flag = false) => {
        if (entryMethod == 'T') {
            setTimeout(() => {
                if (merchant_passcode?.value) {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0, // Reset to the first screen in the stack
                            routes: [{ name: 'LockScreen' }], // Navigate to the specified screen
                        })
                    );
                } else {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0, // Reset to the first screen in the stack
                            routes: [{ name: 'TransactionMenu' }], // Navigate to the specified screen
                        })
                    );
                }
                dispatch(setSignature(null));
                dispatch(setManualCardEntry(false));
            }, 3000);
        } else {
            setSelected(true);
        }
        setTimeout(() => {
            if (isRefund) {
                initPrinter(flag, false);
                setTimeout(() => {
                    initPrinter(flag, true);
                }, 5000);
            } else {
                if (printerConfiguration?.both_receipt?.value) {
                    initPrinter(flag, false);

                    setTimeout(() => {
                        if (entryMethod !== 'T') {
                            initPrinter(flag, true);
                        }
                    }, 5000);
                } else {
                    if (printerConfiguration?.merchant_receipt?.value) {
                        initPrinter(flag, false);
                    }
                    // if (printerConfiguration?.customer_receipt?.value) {
                    //   initPrinter(flag, true);
                    // }
                }
            }
            // setTimeout(() => {
            //   onPressNoReciept();
            // }, 10000);
        }, 2000);
    };
    const onPressNoReciept = () => {
        setOnClick('no_receipt');
        setTimeout(() => {
            if (merchant_passcode?.value) {
                console.log('kkopkoppkopkmomojoij');

                navigation.dispatch(
                    CommonActions.reset({
                        index: 0, // Reset to the first screen in the stack
                        routes: [{ name: 'LockScreen' }], // Navigate to the specified screen
                    })
                );
            } else {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0, // Reset to the first screen in the stack
                        routes: [{ name: 'TransactionMenu' }], // Navigate to the specified screen
                    })
                );
            }
            dispatch(setManualCardEntry(false));
            dispatch(setSignature(null));
        }, 100);
    };
    const onPressEmail = () => {
        setOnClick('email');
        dispatch(setManualCardEntry(false));
        navigation.dispatch(
            CommonActions.reset({
                index: 0, // Reset to the first screen in the stack
                routes: [{ name: 'RecieptMail', params: { type: 'email', orderId: orderId } }], // Navigate to the specified screen
            })
        );
    };
    const onPressTextMessage = () => {
        setOnClick('text_message');
        dispatch(setManualCardEntry(false));

        navigation.dispatch(
            CommonActions.reset({
                index: 0, // Reset to the first screen in the stack
                routes: [
                    {
                        name: 'RecieptMail',
                        params: { type: 'textMessage', orderId: orderId },
                    },
                ], // Navigate to the specified screen
            })
        );
    };

    function makeStringCenter(str: any, counter: any, orientation: any) {
        let stl = str?.length;
        let half = parseInt(((counter - stl) / 2) as any);
        let margin = 0;
        let newStr = Array(counter).fill('');
        let count = 0;
        if (orientation === 'center') {
            newStr = newStr.map((v, i) => {
                if (i < half) {
                    return ' ';
                } else if (i > half + stl) {
                    return ' ';
                } else {
                    return str?.length ? str[count++] : '';
                }
            });
        } else if (orientation === 'right') {
            const remain = counter - stl - margin;
            newStr = newStr.map((v, i) => {
                if (i < remain) {
                    return ' ';
                } else {
                    return str?.length ? str[count++] : '';
                }
            });
            // newStr = newStr.reverse();
        } else if (orientation === 'left') {
            newStr = newStr.map((v, i) => {
                if (i < stl) {
                    return str?.length ? str[count++] : '';
                } else {
                    return ' ';
                }
            });
        }
        return newStr?.join('');
    }

    const padFunction = (number: any) => {
        let string = String(number);
        let sliced = string.slice(-4);
        let mask = String(sliced).padStart(string.length, '*');
        return mask;
    };

    const initPrinter = async (getFlag: boolean, isCustomer: boolean) => {
        setPrintFlag(getFlag);
        let receipt = '';
        const merchantID = await AsyncStorage.getItem('merchantID');
        const clerkID = await AsyncStorage.getItem('clerkID');

        if (!printerConfiguration?.pre_print?.value || isCustomer) {
            Object.keys(printerConfiguration?.receipt_header_lines).map(key => {
                if (key !== 'value' && printerConfiguration?.receipt_header_lines[key] && key !== 'line_1') {
                    receipt += makeStringCenter(`${printerConfiguration?.receipt_header_lines[key]}`, 31, 'center') + '\n';
                }
            });
            // receipt += makeStringCenter("PSP SERVICES", 31, "center") + "\n";
            // receipt += makeStringCenter(storeInfo?.name, 31, "center") + "\n";
            // receipt +=
            //   makeStringCenter(
            //     storeInfo?.address_1 ? storeInfo?.address_1 : "..",
            //     31,
            //     "center"
            //   ) + "\n";

            // receipt +=
            //   makeStringCenter(
            //     storeInfo?.address_2 ? storeInfo?.address_2 : "..",
            //     31,
            //     "center"
            //   ) + "\n";

            // receipt += makeStringCenter("Header 5", 31, "center") + "\n";
            // receipt += makeStringCenter("Header 6", 31, "center") + "\n";
        }
        receipt += makeStringCenter('                              ', 31, 'center') + '\n';
        // if (type?.includes("Merchant")) {
        receipt += makeStringCenter('Merchant ID:', 13, 'left') + makeStringCenter(storeId ? storeId : '', 19, 'right') + '\n';

        receipt += makeStringCenter('Terminal ID:', 13, 'left') + makeStringCenter('10015843'.toUpperCase(), 19, 'right') + '\n';

        // if (settings[0].isEnabled) {
        //   receipt +=
        //     makeStringCenter("ServerID:", 13, "left") +
        //     makeStringCenter(
        //       receiptDetail?.order?.server_id
        //         ? receiptDetail?.order?.server_id
        //         : "",
        //       19,
        //       "right"
        //     ) +
        //     "\n";
        // }

        // if (settings[0].isEnabled) {
        receipt += makeStringCenter('Clerk ID:', 13, 'left') + makeStringCenter(finalTransaction?.clerk_id ?? '', 19, 'right') + '\n';
        // }

        receipt += makeStringCenter(`Date:${finalTransaction?.date}`, 16, 'left') + makeStringCenter(`Time:${finalTransaction?.time}`, 16, 'right') + '\n';

        receipt += makeStringCenter(`Batch# ${finalTransaction?.batch_no}`, 16, 'left') + makeStringCenter(`Transaction# ${finalTransaction.transaction_no}`, 16, 'right') + '\n';

        // if (settings[1].isEnabled || receiptDetail?.order?.is_auto_invoice) {
        receipt += makeStringCenter('Invoice#', 16, 'left') + makeStringCenter(finalTransaction?.invoice_no?.toUpperCase() ? finalTransaction?.invoice_no?.toUpperCase() : '', 16, 'right') + '\n';
        // }

        receipt += makeStringCenter(finalTransaction?.status === 'Refunded' ? 'Refund' : 'Sale', 31, 'center') + '\n\n';

        receipt +=
            makeStringCenter(manualCardEntry || entryMethod == 'S' ? 'Credit' : finalTransaction?.card_type, 16, 'left') +
            makeStringCenter(padFunction(finalTransaction?.card_number.substring(8)), 16, 'right') +
            '\n';

        receipt +=
            makeStringCenter(
                'Entry Method',
                // padFunction(receiptDetail?.split?.card_number),
                19,
                'left'
            ) +
            makeStringCenter(manualCardEntry ? 'MANUAL' : entryMethod == 'S' ? 'SWIPE' : entryMethod == 'T' ? 'TAP' : 'CHIP', 13, 'right') +
            '\n';

        if (finalTransaction?.type === 'DEBIT') {
            receipt += makeStringCenter('Account Type:', 16, 'left') + makeStringCenter(entryMethod == 'T' ? 'DEFAULT' : finalTransaction?.account_type, 16, 'right') + '\n';
        }

        receipt += makeStringCenter('Ref.#', 16, 'left') + makeStringCenter(finalTransaction?.reference_id ? finalTransaction?.reference_id : '', 16, 'right') + '\n';

        receipt += makeStringCenter('Trace ID:', 16, 'left') + makeStringCenter(String(finalTransaction?.trace_id), 16, 'right') + '\n';
        if (!manualCardEntry && entryMethod !== 'S') {
            receipt += makeStringCenter('Auth.#:', 16, 'left') + makeStringCenter(finalTransaction?.auth_no, 16, 'right') + '\n';
        }

        receipt +=
            makeStringCenter('Amount:', 19, 'left') +
            makeStringCenter(
                currencyFormatter.format(finalTransaction?.sale_amount ? finalTransaction?.sale_amount : '', {
                    code: 'CAD',
                }),
                13,
                'right'
            ) +
            '\n';

        if (tipConfig?.tip_screen?.value && finalTransaction.status !== 'Refunded') {
            receipt +=
                makeStringCenter('TIP:', 19, 'left') +
                makeStringCenter(
                    currencyFormatter.format(finalTransaction?.tip_amount ? finalTransaction?.tip_amount : '', {
                        code: 'CAD',
                    }),
                    13,
                    'right'
                ) +
                '\n';
        }

        if (surchargeConfig?.debit_surcharge?.value || surchargeConfig?.credit_surcharge?.value) {
            if ((surchargeConfig?.debit_surcharge?.value && finalTransaction?.type === 'DEBIT') || (surchargeConfig?.credit_surcharge?.value && finalTransaction?.type === 'CREDIT')) {
                if (finalTransaction?.status != 'Refunded')
                    receipt +=
                        makeStringCenter('Surcharge:', 19, 'left') +
                        makeStringCenter(
                            currencyFormatter.format(finalTransaction?.surcharge_amount ? finalTransaction?.surcharge_amount : '', {
                                code: 'CAD',
                            }),
                            13,
                            'right'
                        ) +
                        '\n';
            }
        }

        receipt += makeStringCenter('_________________________________', 31, 'center') + '\n';
        if (finalTransaction?.status != 'Refunded') {
            receipt +=
                makeStringCenter('Total:', 16, 'left') +
                makeStringCenter(
                    currencyFormatter.format(parseFloat(finalTransaction?.sale_amount) + parseFloat(finalTransaction?.tip_amount) + parseFloat(finalTransaction?.surcharge_amount), {
                        code: 'CAD',
                    }),
                    16,
                    'right'
                ) +
                '\n';
        } else {
            receipt +=
                makeStringCenter('Total:', 16, 'left') +
                makeStringCenter(
                    currencyFormatter.format(parseFloat(finalTransaction?.sale_amount), {
                        code: 'CAD',
                    }),
                    16,
                    'right'
                ) +
                '\n';
        }

        receipt += makeStringCenter('Application Label:', 19, 'left') + makeStringCenter(finalTransaction?.card_type, 13, 'right') + '\n';

        receipt += makeStringCenter('Application Pref.Name:', 22, 'left') + makeStringCenter(finalTransaction?.type, 10, 'right') + '\n';
        if (finalTransaction?.aid != '0') receipt += makeStringCenter('AID:', 16, 'left') + makeStringCenter(finalTransaction?.aid, 16, 'right') + '\n';
        if (finalTransaction?.tvr != '0') receipt += makeStringCenter('TVR:', 16, 'left') + makeStringCenter(finalTransaction?.tvr, 16, 'right') + '\n';
        if (manualCardEntry || entryMethod == 'S') {
            receipt += '\n\n' + makeStringCenter('I AGREE TO PAY ABOVE TOTAL', 31, 'center') + '\n';
            receipt += makeStringCenter('AMOUNT ACCORDING TO CARD ISSUER', 31, 'center') + '\n';
            receipt += makeStringCenter('AGREEMENT (MERCHANT AGREEMENT', 31, 'center') + '\n';
            receipt += makeStringCenter('IF CREDIT VOUCHER)', 31, 'center') + '\n';
        }

        let receipt2 = '';

        if (manualCardEntry || entryMethod == 'S') {
            if (signature) {
                receipt2 += makeStringCenter('X_______________________', 31, 'center') + '\n';
                receipt2 += makeStringCenter('SIGNATURE', 31, 'center') + '\n\n';
                receipt2 += makeStringCenter('00_APPROVED_001', 31, 'center') + '\n';

                receipt2 += makeStringCenter(isCustomer ? 'CUSTOMER COPY' : 'MERCHANT COPY', 31, 'center') + '\n';

                if (printerConfiguration?.receipt_footer_lines?.value) {
                    Object.keys(printerConfiguration?.receipt_footer_lines).map(key => {
                        if (key !== 'value' && printerConfiguration?.receipt_footer_lines[key]) {
                            receipt2 += makeStringCenter(`${printerConfiguration?.receipt_footer_lines[key]}`, 31, 'center') + '\n';
                        }
                    });
                }
            } else {
                receipt += '\n\n\n\n' + makeStringCenter('X_______________________', 31, 'center') + '\n';
                receipt += makeStringCenter('SIGNATURE', 31, 'center') + '\n\n';
                receipt += makeStringCenter('00_APPROVED_001', 31, 'center') + '\n';

                receipt += makeStringCenter(isCustomer ? 'CUSTOMER COPY' : 'MERCHANT COPY', 31, 'center') + '\n';
                if (printerConfiguration?.receipt_footer_lines?.value) {
                    Object.keys(printerConfiguration?.receipt_footer_lines).map(key => {
                        if (key !== 'value' && printerConfiguration?.receipt_footer_lines[key]) {
                            receipt += makeStringCenter(`${printerConfiguration?.receipt_footer_lines[key]}`, 31, 'center') + '\n';
                        }
                    });
                }
            }
        } else {
            if (finalTransaction?.tsi != '0') receipt += makeStringCenter('TSI:', 16, 'left') + makeStringCenter(finalTransaction?.tsi, 16, 'right');
            if (entryMethod !== 'T') {
                receipt += makeStringCenter('PIN VERIFIED', 31, 'center') + '\n';
            }
            receipt += makeStringCenter('00_APPROVED_001', 31, 'center') + '\n';
            receipt += makeStringCenter(isCustomer ? 'CUSTOMER COPY' : 'MERCHANT COPY', 31, 'center') + '\n';

            if (printerConfiguration?.receipt_footer_lines?.value) {
                Object.keys(printerConfiguration?.receipt_footer_lines).map(key => {
                    if (key !== 'value' && printerConfiguration?.receipt_footer_lines[key]) {
                        receipt += makeStringCenter(`${printerConfiguration?.receipt_footer_lines[key]}`, 31, 'center') + '\n';
                    }
                });
            }
        }

        if (printerConfiguration?.merchant_receipt?.value) {
            if (manualCardEntry || entryMethod == 'S') {
                Pax.printStr('', signature, receipt, Pax.FULL_CUT, receipt2, !printerConfiguration?.pre_print?.value || isCustomer ? printerConfiguration?.receipt_header_lines?.line_1 : '');
            } else {
                Pax.printStr('', signature, receipt, Pax.FULL_CUT, '', isCustomer || !printerConfiguration?.pre_print?.value ? printerConfiguration?.receipt_header_lines?.line_1 : '');
            }
        }
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

        receipt2 = '';
        if (getFlag) {
            setTimeout(() => {
                if (merchant_passcode?.value) {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0, // Reset to the first screen in the stack
                            routes: [{ name: 'LockScreen' }], // Navigate to the specified screen
                        })
                    );
                } else {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0, // Reset to the first screen in the stack
                            routes: [{ name: 'TransactionMenu' }], // Navigate to the specified screen
                        })
                    );
                }
            }, 2000);
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
            dispatch(setManualCardEntry(false));
            dispatch(setSignature(null));
        } else {
            setSelected(false);
        }
    };

    // !internet_Connected && navigate("Offline");

    return (
        <Wrapper viewStyle={style.wrapContainer}>
            {terminal_mode?.demo_mode?.value && (
                <View style={{ backgroundColor: 'yellow', height: 20, zIndex: 100 }}>
                    <MiniOverlay bgColor={'#BF1313'} opacity={1}>
                        <AppText title={'Demo Mode'} bold center size={18} colorText={'#fff'} />
                    </MiniOverlay>
                </View>
            )}
            <ImageBackground source={cuveLogo} imageStyle={{ resizeMode: 'contain' }} style={style.imgBackgroundView}>
                <Image source={logo} style={style.img} />
            </ImageBackground>
            {selected ? (
                <View style={style.contentView}>
                    <AppText defaultTextColor title={type == 'email' ? 'Thank You!' : languagePicker(language, 'Printing...')} size={Typography.FONTS.SIZE.XXLARGE} />
                    {type == 'email' && <AppText defaultTextColor title={'Please pass the device to the clerk'} size={Typography.FONTS.SIZE.MEDIUM} />}
                    {printFlag && <AppText textStyle={style.textMarginTop} size={Typography.FONTS.SIZE.XLARGE} title={languagePicker(language, 'Please Provide Customer Receipt')} />}
                </View>
            ) : (
                <>
                    {entryMethod !== 'T' && (
                        <View>
                            <AppText center medium defaultTextColor title={languagePicker(language, 'Customer Receipt')} size={Typography.FONTS.SIZE.XLARGE} textStyle={{ marginTop: RF(20) }} />

                            <View style={style.secondaryBtnView}>
                                <LinearButton
                                    title={languagePicker(language, 'Print Receipt')}
                                    type="print_receipt"
                                    disabled={printerConfiguration?.customer_receipt?.value ? false : true}
                                    onClick={onClick}
                                    onPress={() => {
                                        onPressPrintReceipt(true);
                                    }}
                                />
                                <LinearButton src={gToB_Linear} title={'Email'} type="email" onClick={onClick} onPress={onPressEmail} />
                                <LinearButton title={'Text Message'} type="text_message" onClick={onClick} onPress={onPressTextMessage} />
                                <LinearButton src={gToB_Linear} title={languagePicker(language, 'No Receipt')} type="no_receipt" onClick={onClick} onPress={onPressNoReciept} />
                            </View>
                        </View>
                    )}
                </>
            )}
        </Wrapper>
    );
};

export default Receipt;
