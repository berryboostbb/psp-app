import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Keyboard, TouchableNativeFeedback } from 'react-native';
import { useKeyboard } from '@hooks';
import { navigate } from '@services';
import { setOrderData, store } from '@redux';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorHeader, Overlay } from '@components';
import { exclaimation, yellow } from '@assets';
import { useTheme } from '@react-navigation/native';
import printCancelReceipt from '../../../shared/utils/cancelReceipt';

const UserInactivity = React.memo((props: any) => {
    const theme: any = useTheme();
    const dispatch = useDispatch();
    const { tms_settings } = useSelector((state: any) => state.pr);
    const merchant_passcode = tms_settings?.terminal_configuration?.merchant_passcode;
    const { timeLayout } = store.getState().user;
    const { tmsTime } = store.getState().tms;
    const isKeyboard = useKeyboard();
    const { screen, flag } = props;
    const [timer, setTimer] = useState<any>(0);
    const [timerOverall, setTimerOverall] = useState<any>(0);
    const [touchStarted, setTouchStarted] = useState(true);
    const { cancelReceipt } = printCancelReceipt();

    var timeForInactivity: any;
    screen == 'SaleWelcome' && (timeForInactivity = tmsTime?.credit_debit_sale?.sale_welcome);
    screen == 'LockScreen' && (timeForInactivity = tmsTime?.credit_debit_sale?.lock_screen);
    screen == 'TransactionMenu' && (timeForInactivity = tmsTime?.credit_debit_sale?.transaction_menu);
    screen == 'ClerkId' && (timeForInactivity = tmsTime?.credit_debit_sale?.clerk_id);
    screen == 'InvoiceNumber' && (timeForInactivity = tmsTime?.credit_debit_sale?.invoice_number);
    screen == 'EnterAmount' && (timeForInactivity = tmsTime?.credit_debit_sale?.enter_amout);
    screen == 'TipDoller' && (timeForInactivity = tmsTime?.credit_debit_sale?.tip_doller);
    screen == 'Merchant_Cart' && (timeForInactivity = tmsTime?.credit_debit_sale?.merchant_cart);
    screen == 'TapProcess' && (timeForInactivity = tmsTime?.credit_debit_sale?.tap_process);
    screen == 'Tap_Merchant_Cart' && (timeForInactivity = tmsTime?.credit_debit_sale?.tap_merchant_cart);
    screen == 'SelectAccount' && (timeForInactivity = tmsTime?.credit_debit_sale?.select_account);
    screen == 'pin_entry_prompt' && (timeForInactivity = tmsTime?.credit_debit_sale?.pin_entry_prompt);
    screen == 'LoadingProcess' && (timeForInactivity = 100000000000000000000);

    var interval: any;
    var interval1: any;
    var intervalOverall: any;
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            if (touchStarted) {
                interval = setInterval(() => {
                    setTimer((prevTimer: any) => prevTimer + 1);
                }, 1000);

                intervalOverall = setInterval(() => {
                    setTimerOverall((prevTimer: any) => prevTimer + 1);
                }, 1000);
            }
        }
        return () => {
            clearInterval(interval);
            clearInterval(intervalOverall);
        };
    }, []);
    useEffect(() => {
        setTimer(0);
    }, [props.screen, timeLayout]);
    useEffect(() => {
        if (timerOverall == 30) {
            setTimerOverall(0);
        }
        setTimerOverall(0);
    }, [props.screen]);
    useEffect(() => {
        if (!timeForInactivity) {
        } else {
            if (timer == timeForInactivity || timerOverall == 30) {
                if (
                    screen == 'ClerkId' ||
                    screen == 'InvoiceNumber' ||
                    screen == 'Merchant_Cart' ||
                    screen == 'EnterAmount' ||
                    screen == 'TipDoller' ||
                    screen == 'TapProcess' ||
                    screen == 'Tap_Merchant_Cart' ||
                    screen == 'LockScreen'
                ) {
                    console.log('4567876678908607890456789057987459067845906790467904576');
                    cancelReceipt();

                    // printCancelReceipt();
                    // dispatch(
                    //   setOrderData({
                    //     tip: 0.0,
                    //     clerkId: "",
                    //     invoiceNumber: "",
                    //     merchantPasscode: "",
                    //     tipType: "",
                    //     surcharge: 0,
                    //     orderAmount: 0.0,
                    //     cardType: "",
                    //   })
                    // );
                    merchant_passcode?.value ? navigate('LockScreen') : navigate('TransactionMenu');
                } else if (screen == 'LockScreen') {
                    navigate('SaleWelcome');
                } else {
                    navigate('SaleWelcome');
                }
            }
        }
    }, [timer, timerOverall]);
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            if (flag) {
                setTimeout(() => {
                    clearInterval(interval);
                    clearInterval(interval1);
                    setTimer(0);
                }, 1000);
            }
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            if (flag) {
                interval1 = setInterval(() => {
                    setTimer((prevTimer: any) => prevTimer + 1);
                }, 1000);
            }
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
            clearInterval(interval);
            clearInterval(interval1);
        };
    }, []);
    const resetTimer = () => {
        setTimer(0);
    };
    const resetOverAllTimer = () => {
        setTimer(0);
    };
    const handlePress = () => {
        if (!touchStarted) {
            setTouchStarted(true);
        } else {
            resetTimer();
        }
    };
    const handleLongPress = () => {
        resetTimer();
    };
    const layoutChange = () => {
        setTimer(0);
        if (isKeyboard) {
            resetTimer();
        }
    };

    return (
        <>
            <TouchableNativeFeedback {...props} onLongPress={handleLongPress} onPress={handlePress} onLayout={() => layoutChange()}>
                <View style={{ flex: 1 }}>
                    <>
                        {screen !== 'SaleWelcome' &&
                        screen !== 'DeclinedTransaction' &&
                        screen !== 'Delete_Clerk' &&
                        screen !== 'Clerk_List' &&
                        screen !== 'Surcharge_Config' &&
                        screen !== 'Add_Clerk' &&
                        screen !== 'Language' &&
                        screen !== 'Clerk' &&
                        screen !== 'Terminal_Configuration' &&
                        screen !== 'Cashback_Config' &&
                        screen !== 'Edit_Tip_Amount' &&
                        screen !== 'Transaction_Settings' &&
                        screen !== 'Communication' &&
                        screen !== 'Batch' &&
                        screen !== 'Network' &&
                        screen !== 'Host' &&
                        screen !== 'Merchant_Login' &&
                        screen !== 'Admin_Settings' &&
                        screen !== 'ManagerPassword' &&
                        screen !== 'Dashboard' &&
                        screen !== 'Settings' &&
                        screen !== 'PrinterConfiguration' &&
                        screen !== 'EditFooterLines' &&
                        screen !== 'ReportsSection' &&
                        screen !== 'BatchClose' &&
                        screen !== 'OpenBatchTerminal' &&
                        screen !== 'TransactionDetailReport' &&
                        screen !== 'SummaryReport' &&
                        screen !== 'TipTotals' &&
                        screen !== 'SearchFilter' &&
                        screen !== 'TerminalConfigurationReport' &&
                        screen !== 'EmvParametersReport' &&
                        screen !== 'ClerkServerPrintReport' &&
                        screen !== 'ClerkServerReport' &&
                        screen !== 'DeclineTransactionReport' &&
                        screen !== 'EMVParameterReport' &&
                        screen !== 'Offline' &&
                        screen !== 'ClerkServerMaintenance' &&
                        screen !== 'InvoiceNumberConfig' &&
                        screen !== 'MerchantPasscodeSettings' &&
                        screen !== 'ManualCard' &&
                        screen !== 'Signature' &&
                        screen !== 'Receipt' &&
                        screen !== 'RecieptMail' &&
                        screen !== 'Drawer' &&
                        screen !== 'LoadingProcess' &&
                        screen !== 'ManagerPassword' &&
                        screen !== 'ActivationScreen' &&
                        screen !== 'Merchant_Cart' &&
                        screen !== 'TipDoller' &&
                        screen !== 'TapProcess' &&
                        screen !== 'SelectAccount' &&
                        screen !== 'Tap_Merchant_Cart' &&
                        screen !== 'TransactionMenu' &&
                        screen !== 'PaymentMethod' &&
                        screen !== 'CustomerPayWithPoint' &&
                        screen !== 'QRCode' &&
                        screen !== 'SettlementReport' &&
                        screen !== 'TerminalTotals' &&
                        timerOverall >= 26 &&
                        timerOverall <= 30 ? (
                            <View style={{ zIndex: 10 }}>
                                <Overlay>
                                    <ErrorHeader
                                        source={yellow}
                                        colorText={theme?.colors?.text}
                                        title={`${31 - timerOverall} seconds will be left!`}
                                        titleImage={exclaimation}
                                        tintColor={theme?.colors?.text}
                                    />
                                </Overlay>
                            </View>
                        ) : null}
                    </>
                    {props.children}
                </View>
            </TouchableNativeFeedback>
        </>
    );
});

export default UserInactivity;
