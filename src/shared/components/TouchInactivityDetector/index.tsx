import { exclaimation, yellow } from '@assets';
import { ErrorHeader, Overlay } from '@components';
import { useIsFocused, useRoute } from '@react-navigation/native';

import { setOrderData, store } from '@redux';
import { navigate } from '@services';
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { TouchableWithoutFeedback, View, Text, InteractionManager } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import printCancelReceipt from '../../../shared/utils/cancelReceipt';

interface Props {
    children?: any;
}

const TouchInactivityDetector = (props: Props) => {
    const { tmsTime } = store.getState().tms;
    const { timeLayout } = store.getState().user;
    const { tms_settings } = useSelector((state: any) => state.pr);

    const merchant_passcode = tms_settings?.terminal_configuration?.merchant_passcode;
    const routePath = useRoute();
    const screen = routePath.name;
    const dispatch = useDispatch();
    const [resetTimer, setResetTimer] = useState(false);
    const [counter, setCounter] = useState(0);

    const [calculatedTimeForInactivity, setCalculatedTimeForInactivity] = useState(null);

    const [counterForInactivity, setCounterForInactivity] = useState(null);

    const isFocused = useIsFocused();
    let intervalRef = useRef<any>(null);
    let intervalRef2 = useRef<any>(null);
    let countRef = useRef<any>(counter);
    let countRefTotal = useRef<any>(0);

    const { cancelReceipt } = printCancelReceipt();

    // const timeForInactivity = useMemo(() => {
    // let calculatedTimeForInactivity = 0;
    const calculateTime = () => {
        if (tmsTime && screen) {
            if (screen === 'TapProcess') {
                setCalculatedTimeForInactivity(parseInt(tmsTime.credit_debit_sale.tap_screen_time));
                setCounterForInactivity(tmsTime.credit_debit_sale.tap_screen_counter);
                setCounter(tmsTime.credit_debit_sale.other_screen_time);
            } else if (screen === 'SelectAccount') {
                setCalculatedTimeForInactivity(parseInt(tmsTime.credit_debit_sale.pin_screen_time));
                setCounterForInactivity(tmsTime.credit_debit_sale.pin_screen_counter);
                setCounter(tmsTime.credit_debit_sale.other_screen_time);
            } else {
                setCalculatedTimeForInactivity(parseInt(tmsTime.credit_debit_sale.other_screen_time));
                setCounterForInactivity(tmsTime.credit_debit_sale.other_screen_counter);
                setCounter(tmsTime.credit_debit_sale.other_screen_time);
            }
        }
    };

    // return calculatedTimeForInactivity;
    // }, [tmsTime, screen]);

    const handlescreenTouch = (type = '') => {
        if (calculatedTimeForInactivity != null) {
            if (countRef.current <= 10 && counterForInactivity > 1) {
                setCounterForInactivity(counterForInactivity - 1);
                setCounter(calculatedTimeForInactivity);
                countRef.current = calculatedTimeForInactivity;
                //     }

                clearTimeout(intervalRef2.current);
                setResetTimer(!resetTimer);
            }
        }
    };

    useEffect(() => {
        calculateTime();
    }, []);

    // useEffect(() => {
    //   if (calculatedTimeForInactivity) {
    //     if (!isFocused) {
    //       clearTimeout(intervalRef.current);
    //     } else {
    //       intervalRef.current = setTimeout(() => {
    //         // navigate("SaleWelcome");

    //         // timeoutNavigate()
    //       }, 5000);
    //     }
    //   }
    //   return () => {
    //     clearTimeout(intervalRef.current);
    //   };
    // }, [isFocused, resetTimer, timeLayout]);

    // useEffect(() => {
    //   if (calculatedTimeForInactivity) {

    //   }
    // }, [calculatedTimeForInactivity])

    const timeoutNavigate = () => {
        // if (calculatedTimeForInactivity!=0) {

        // } else {

        if (['ClerkId', 'InvoiceNumber', 'Merchant_Cart', 'EnterAmount', 'TipDoller', 'TapProcess', 'Tap_Merchant_Cart', 'LockScreen'].includes(screen)) {
            if (['Merchant_Cart', 'EnterAmount', 'TipDoller', 'TapProcess', 'Tap_Merchant_Cart'].includes(screen)) {
                cancelReceipt();
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
            }

            merchant_passcode?.value ? navigate('LockScreen') : navigate('TransactionMenu');
        } else if (screen == 'LockScreen') {
            navigate('SaleWelcome');
        } else {
            navigate('SaleWelcome');
        }
    };

    useEffect(() => {
        if (!isFocused) {
            clearTimeout(intervalRef2.current);
        } else {
            intervalRef2.current = setInterval(() => {
                setCounter(countRef.current - 1);
            }, 1000);
        }

        return () => {
            clearTimeout(intervalRef2.current);
        };
    }, [isFocused, resetTimer]);
    useEffect(() => {
        if (calculatedTimeForInactivity != null) {
            handlescreenTouch();
        }
    }, [props?.reset, props?.cvv, props?.expiry]);

    useEffect(() => {
        if (calculatedTimeForInactivity != null) {
            countRef.current = counter;
            countRefTotal.current += 1;

            if (countRef.current == 0 || counterForInactivity == 0) {
                timeoutNavigate();
            } else if (counterForInactivity != 0 && countRef.current == 0) handlescreenTouch();
        }
    }, [counter]);

    return (
        <TouchableWithoutFeedback onPress={() => handlescreenTouch('touched')} onLayout={() => handlescreenTouch('touched')}>
            <View style={{ flex: 1 }}>
                {screen !== 'TransactionMenu' && countRef.current <= 10 && countRef.current >= 1 && (
                    <View style={{ zIndex: 10 }}>
                        <Overlay>
                            <ErrorHeader source={yellow} colorText={'black'} title={`${counter} seconds will be left!`} titleImage={exclaimation} tintColor={'black'} />
                        </Overlay>
                    </View>
                )}
                {props.children}
            </View>
        </TouchableWithoutFeedback>
    );
};

export default TouchInactivityDetector;
