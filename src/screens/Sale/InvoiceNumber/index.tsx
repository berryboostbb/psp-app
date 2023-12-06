import { AppText, Wrapper, ErrorText, AppHeader, InputField, Overlay, SuccessHeader, TouchInactivityDetector } from '@components';
import { cross, exclaimation, tick } from '@assets';
import useStyles from './style';
import { navigate } from '@services';
import { setOrderData, setRefundData, setTimeLayout, store } from '@redux';
import { languagePicker } from '@utils';
import { Typography, GST } from '@theme';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { View, InteractionManager, Pressable } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';

const InvoiceNumber = ({ navigation }: any) => {
    const inputRef: any = useRef();
    const myTheme: any = useTheme();
    const dispatch: any = useDispatch();
    const style = useStyles(myTheme.colors);
    const [errorText, setErrorText] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const { tms_settings } = useSelector((state: any) => state.pr);
    const language = useSelector((state: any) => state.user.languageType);
    const orderData = useSelector((state: any) => state.common.orderData);
    const ref: any = useRef();
    const [notifyType, setNotifyType] = useState('');
    const [overlayVisible, setOverlayVisible] = useState(false);
    const merchant_passcode = tms_settings?.terminal_configuration?.merchant_passcode;

    const handleChange = (text: any) => {
        setInvoiceNumber(text.toUpperCase());
    };
    useEffect(() => {
        setErrorText('');
        // if (invoiceNumber.length > 1 && invoiceNumber.length < 8) {
        //   setErrorText("Invalid Invoice Number");
        // }
    }, [invoiceNumber]);

    const handlePressCross = () => {
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
        if (merchant_passcode?.value) {
            navigate('LockScreen', { type: 'merchant' });
        } else {
            navigate('TransactionMenu');
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            focusInputWithKeyboard();
        });
        return () => {
            unsubscribe;
        };
    }, [navigation]);

    const focusInputWithKeyboard = () => {
        InteractionManager.runAfterInteractions(() => {
            inputRef?.current?.focus();
        });
    };

    const onTextChange = (code: any) => {
        setInvoiceNumber(code);
        // store.dispatch(setTimeLayout(code));
        // setOverlayVisible(false);
    };

    return (
        <Wrapper isPaddingH isTop>
            <AppHeader showLeftIcon source={cross} title="" backAction={handlePressCross} />
            <TouchInactivityDetector reset={invoiceNumber}>
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

                <View style={style.container}>
                    <AppText center defaultTextColor title={languagePicker(language, 'Enter Invoice Number')} size={Typography.FONTS.SIZE.XLARGE} />
                    <InputField
                        value={invoiceNumber.toUpperCase()}
                        inputRef={inputRef}
                        keyboardType={'default'}
                        onSubmitEditing={async () => {
                            let data = { ...orderData };
                            data.invoiceNumber = invoiceNumber;
                            dispatch(setOrderData(data));
                            if (invoiceNumber.length >= 1) {
                                navigate('EnterAmount');
                                setNotifyType('success');
                            } else {
                                setNotifyType('error');
                                setOverlayVisible(true);
                                ref.current.alertWithType('custom', 'Invalid Invoice Number', '');
                            }
                        }}
                        onChangeText={onTextChange}
                    />
                </View>
            </TouchInactivityDetector>
        </Wrapper>
    );
};
export default InvoiceNumber;
