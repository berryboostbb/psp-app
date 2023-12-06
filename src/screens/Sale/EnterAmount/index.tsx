import { cross, exclaimation, mannualSelected, tick } from '@assets';
import useStyles from './styles';
import { navigate } from '@services';
import { RF, Typography } from '@theme';
import { useDispatch, useSelector } from 'react-redux';
import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '@react-navigation/native';
import { TextInput, View, Text, InteractionManager, Pressable, Image } from 'react-native';
import { CurveHeader, AppText, Wrapper, ErrorText, Overlay, SuccessHeader, TouchInactivityDetector } from '@components';
import { setOrderData, setManualCardEntry, setTimeLayout } from '@redux';
import { languagePicker } from '@utils';
import { mannualCard } from '@assets';
var currencyFormatter = require('currency-formatter');
import { store } from '@redux';

const EnterAmount = ({ navigation }: any) => {
    const language = useSelector((state: any) => state.user.languageType);
    const inputRef: any = useRef();
    const myTheme: any = useTheme();
    const colorTheme = myTheme.colors;
    const dispatch: any = useDispatch();
    const styles = useStyles(colorTheme);
    const [amount, setAmount] = useState<any>(0.0);
    const [errorText, setErrorText] = useState('');
    const { flowType, internet_Connected, settings, manualCardEntry } = useSelector((state: any) => state.user);
    const { tms_settings } = useSelector((state: any) => state.pr);
    const language_and_terminal_config = tms_settings?.terminal_configuration?.language_and_terminal_mode;
    const terminal_mode = tms_settings.terminal_configuration.language_and_terminal_mode.terminal_mode;
    const orderData = useSelector((state: any) => state.common.orderData);
    const refundData = useSelector((state: any) => state.common.refundData);
    const isRefund = useSelector((state: any) => state.common.isRefund);
    !internet_Connected && navigate('Offline');
    const ref: any = useRef();
    const [notifyType, setNotifyType] = useState('');
    const [overlayVisible, setOverlayVisible] = useState(false);

    const onClick = () => {
        let data = { ...orderData };
        data.orderAmount = amount;
        dispatch(setOrderData(data));

        if (isRefund) {
            inputRef?.current?.blur();
            setTimeout(() => {
                inputRef?.current?.blur();
            }, 100);

            if (manualCardEntry) {
                navigate('ManualCard', {});
            } else {
                navigate('TapProcess', { type: 'login' });
            }
        } else {
            let result = isNaN(amount);
            if (!result && amount > 0.01 && amount < 999999.99) {
                navigate('TipDoller');
                if (tms_settings?.transaction_settings?.tip_configuration?.tip_screen?.value) {
                    navigate('TipDoller');
                } else {
                    if (manualCardEntry) {
                        navigate('ManualCard', {});
                    } else {
                        navigate('Merchant_Cart', { type: 'login' });
                    }
                }
            } else {
                setTimeout(() => {
                    setNotifyType('error');
                    setOverlayVisible(true);
                    ref?.current?.alertWithType('custom', 'Invalid amount!', '');
                }, 200);
            }
        }
    };

    const handleValueChange = (text: any) => {
        // setOverlayVisible(false);
        // store.dispatch(setTimeLayout(text));
        let result = isNaN(text);
        if (text < 0.01 || text > 999999.99 || result) {
            setErrorText('Amount limits are between $0.01 to $999,999.99');
        } else {
            setErrorText('');
        }
        // let data = { ...orderData };
        // data.orderAmount = parseFloat(text);
        // dispatch(setOrderData(data));
        setAmount(parseFloat(text) / 100);
    };
    useEffect(() => {
        dispatch(setManualCardEntry(false));
        let timeout: any = null;
        const unsubscribe = navigation.addListener('focus', () => {
            focusInputWithKeyboard();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return () => {
            clearTimeout(timeout);
            unsubscribe;
        };
    }, [navigation]);
    const focusInputWithKeyboard = () => {
        InteractionManager.runAfterInteractions(() => {
            inputRef?.current?.focus();
        });
    };
    const handleManualCardEntry = () => {
        dispatch(setManualCardEntry(!manualCardEntry));
    };
    const onOpen = () => {
        inputRef?.current?.blur();
        setTimeout(() => {
            inputRef?.current?.focus();
        }, 100);
    };

    return (
        <Wrapper>
            <TouchInactivityDetector reset={amount}>
                {overlayVisible && (
                    <View style={{ zIndex: 10 }}>
                        <Overlay>
                            <SuccessHeader
                                ref={ref}
                                ml={notifyType == 'success' ? 110 : 120}
                                imageSrc={notifyType == 'success' ? tick : exclaimation}
                                bgClr={notifyType == 'success' ? '#E3F8CFD9' : '#D74120E5'}
                                error={notifyType == 'success' ? false : true}
                                title_mT={notifyType == 'success' ? 92 : 90}
                            />
                        </Overlay>
                    </View>
                )}
                <CurveHeader
                    visible
                    adminVisible
                    source={cross}
                    title={currencyFormatter.format(amount, {
                        code: 'CAD',
                    })}
                    total={languagePicker(language, isRefund ? 'Refund Total' : 'Sale Total')}
                    inputRef={inputRef}
                />

                {manualCardEntry && (
                    <Text
                        style={{
                            fontFamily: 'Plus Jakarta Sans',
                            fontWeight: '600',
                            fontSize: RF(16),
                            textAlign: 'center',
                            marginTop: RF(15),
                            color: '#27548C',
                        }}>
                        Manual Entry Mode
                    </Text>
                )}

                {language_and_terminal_config?.terminal_mode?.manual_entry?.value && (
                    <Pressable
                        // TODO: NEED TO FIX
                        // style={[styles.mannualEntryButton, { top: terminal_mode?.demo_mode?.value !== undefined || terminal_mode?.demo_mode?.value !== null ? terminal_mode?.demo_mode?.value : 125 }]}
                        style={[styles.mannualEntryButton, { top: 125 }]}
                        onPress={handleManualCardEntry}
                        // disabled={language_and_terminal_config?.terminal_mode?.manual_entry}
                    >
                        <Image source={manualCardEntry ? mannualSelected : mannualCard} style={{ width: 40, height: 40 }} />
                    </Pressable>
                )}

                <View style={styles.view}>
                    <AppText medium defaultTextColor title={languagePicker(language, isRefund ? 'Enter Refund Amount' : 'Enter Sale Amount')} size={Typography.FONTS.SIZE.XLARGE} />

                    <Pressable onPress={onOpen} style={[styles.row, { height: 60, zIndex: 100, width: 200 }]}>
                        <TextInput
                            editable
                            autoFocus
                            value={amount}
                            ref={inputRef}
                            numberOfLines={1}
                            caretHidden={true}
                            onTouchStart={onOpen}
                            onSubmitEditing={onClick}
                            keyboardType="decimal-pad"
                            secureTextEntry={true}
                            onChangeText={text => handleValueChange(text)}
                            maxLength={8}
                            style={{
                                maxWidth: '85%',
                                fontSize: RF(52),
                                color: 'transparent',
                            }}
                            onLayout={() => inputRef?.current?.focus()}
                        />

                        {/* {amount !== "" && (
            <Text
              style={{
                color: "#000",
                fontSize: RF(52),
                paddingTop: 10.3,
              }}
            >
              .00
            </Text>
          )} */}
                    </Pressable>

                    <AppText
                        medium
                        size={Typography.FONTS.SIZE.LARGEST}
                        title={currencyFormatter.format(amount, {
                            code: 'CAD',
                        })}
                        textStyle={[
                            styles.txt,
                            {
                                maxWidth: '75%',
                                alignSelf: 'center',
                                position: 'absolute',
                                textAlign: 'center',
                                fontSize: RF(52),
                            },
                        ]}
                        onPress={() => focusInputWithKeyboard()}
                        colorText={colorTheme?.text}
                    />
                </View>
            </TouchInactivityDetector>
        </Wrapper>
    );
};
export default EnterAmount;
