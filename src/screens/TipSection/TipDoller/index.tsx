import { AppText, Wrapper, CurveHeader, TipBoxButton, PrimaryButton, AmountTextInput, ErrorImageWrapper, ErrorHeader, TouchInactivityDetector } from '@components';
import { cross, orange, exclaimation, green, backArrow } from '@assets';
import useStyles from './styles';
import { GST, RF, Typography } from '@theme';
import { navigate } from '@services';
import { setOrderData, setTimeLayout, store } from '@redux';

import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, InteractionManager, Alert, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { languagePicker } from '@utils';

var currencyFormatter = require('currency-formatter');

const TipDoller = ({ navigation }: any) => {
    const language = useSelector((state: any) => state.user.languageType);
    const theme: any = useTheme();
    const styles = useStyles(theme.colors);
    const [selected, setSelected] = useState(null);
    const [tipAmount, setTipAmount] = useState(0.0);
    const [otherTip, setOtherTipAmount] = useState(0.0);
    const inputRef: any = useRef();
    const myTheme: any = useTheme();
    const [tipErrorShow, setTipErrorShow] = useState<any>('');
    const [showOtherAmount, setShowOtherAmount] = useState(false);
    const { tmsTime } = store.getState().tms;

    const orderData = useSelector((state: any) => state.common.orderData);
    const { settings, internet_Connected, manualCardEntry } = useSelector((state: any) => state.user);
    const { tms_settings } = useSelector((state: any) => state.pr);
    const tipConfiguration = tms_settings?.transaction_settings?.tip_configuration;

    const dispatch = useDispatch();

    useEffect(() => {
        let timeout: any = null;
        timeout = setTimeout(() => {
            inputRef?.current?.blur();
        }, 100);
    }, []);

    const focusInputWithKeyboard = () => {
        let timeout: any = null;
        timeout = setTimeout(() => {
            inputRef?.current?.blur();
            inputRef?.current?.focus();
        }, 100);
    };

    const handleSelected = (value: any, type: any, amount: any) => {
        setOtherTipAmount(0.0);
        if (type === '$') {
            setTipAmount(amount);
            addTip(amount);
        } else {
            setTipAmount((orderData.orderAmount / 100) * parseFloat(amount));
            addTip((orderData.orderAmount / 100) * parseFloat(amount));
        }

        if (value || amount == 0) {
            setTipErrorShow(false);
        }
        setSelected(value);
    };

    const addTip = async (tipValue: any) => {
        if (tipValue == 0.0) {
            setTipErrorShow(true);
        } else {
            let data = { ...orderData };
            console.log(tipValue, 'tipValuetipValue');

            data.tip = Number(tipValue);
            dispatch(setOrderData(data));

            if (manualCardEntry) {
                navigate('ManualCard', {});
            } else {
                navigate('Merchant_Cart', { type: 'login' });
            }
            // }, 5);
            setTipErrorShow(false);
            setShowOtherAmount(false);
        }
    };
    !internet_Connected && navigate('Offline');

    const handleOtherTip = () => {
        setShowOtherAmount(true);
        focusInputWithKeyboard();
    };

    const submitOtherTip = () => {
        addTip(tipAmount);
    };

    return (
        <>
            <Wrapper>
                <TouchInactivityDetector reset={otherTip}>
                    {tipErrorShow ? (
                        <ErrorHeader source={green} colorText={theme?.colors?.text} title={'Please Fill Tip Amount'} titleImage={exclaimation} tintColor={theme?.colors?.text} />
                    ) : (
                        <CurveHeader
                            adminVisible
                            visible
                            source={showOtherAmount ? backArrow : cross}
                            title={currencyFormatter.format(orderData.orderAmount, {
                                code: 'CAD',
                            })}
                            total={languagePicker(language, 'Sale Total')}
                            goBack={showOtherAmount ? true : false}
                            backPress={() => setShowOtherAmount(false)}
                        />
                    )}

                    {showOtherAmount ? (
                        <>
                            <AppText center defaultTextColor title={languagePicker(language, 'Other Tip Amount')} textStyle={styles.textTopMargin} size={Typography.FONTS.SIZE.XLARGE} />
                            {/* )} */}
                            <TouchableOpacity onPress={focusInputWithKeyboard} style={[styles.row, { justifyContent: 'center' }]}>
                                <TextInput
                                    value={otherTip}
                                    ref={inputRef}
                                    numberOfLines={1}
                                    // autoFocus
                                    caretHidden={true}
                                    maxLength={8}
                                    keyboardType="decimal-pad"
                                    secureTextEntry={true}
                                    onChangeText={(txt: any) => {
                                        setSelected(null);
                                        setOtherTipAmount(parseFloat(txt) / 100);
                                        setTipAmount(parseFloat(txt) / 100);
                                        // store.dispatch(setTimeLayout(txt));
                                    }}
                                    style={{
                                        fontSize: RF(52),
                                        width: '80%',
                                        alignSelf: 'center',
                                        color: 'transparent',
                                    }}
                                    onSubmitEditing={submitOtherTip}
                                    // onLayout={() => inputRef?.current?.focus()}
                                />

                                <AppText
                                    medium
                                    size={Typography.FONTS.SIZE.LARGEST}
                                    title={currencyFormatter.format(otherTip, {
                                        code: 'CAD',
                                    })}
                                    textStyle={[
                                        {
                                            maxWidth: '75%',
                                            alignSelf: 'center',
                                            position: 'absolute',
                                            textAlign: 'center',
                                            fontSize: RF(52),
                                        },
                                    ]}
                                    colorText={myTheme.colors?.text}
                                />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <View style={{ flex: 1, marginTop: RF(60) }}>
                                {manualCardEntry && (
                                    <Text
                                        style={{
                                            fontFamily: 'Plus Jakarta Sans',
                                            fontWeight: '600',
                                            fontSize: RF(16),
                                            textAlign: 'center',
                                            color: '#27548C',
                                        }}>
                                        Manual Entry Mode
                                    </Text>
                                )}

                                <AppText center defaultTextColor title={languagePicker(language, 'Enter Tip Amount')} textStyle={styles.textTopMargin} size={Typography.FONTS.SIZE.__LARGE} />

                                {tipConfiguration?.dollar_tip_amount?.value && (
                                    <View style={styles.tipDollerContiner}>
                                        <TipBoxButton
                                            doller
                                            title={`$${tipConfiguration?.dollar_tip_amount?.amount_1?.value}`}
                                            selected={selected}
                                            onPress={() => handleSelected(`$${tipConfiguration?.dollar_tip_amount?.amount_1?.value}`, '$', tipConfiguration?.dollar_tip_amount?.amount_1?.value)}
                                        />
                                        <TipBoxButton
                                            doller
                                            title={`$${tipConfiguration?.dollar_tip_amount?.amount_2?.value}`}
                                            selected={selected}
                                            onPress={() => handleSelected(`$${tipConfiguration?.dollar_tip_amount?.amount_2?.value}`, '$', tipConfiguration?.dollar_tip_amount?.amount_2?.value)}
                                        />
                                        <TipBoxButton
                                            doller
                                            title={`$${tipConfiguration?.dollar_tip_amount?.amount_3?.value}`}
                                            selected={selected}
                                            onPress={() => handleSelected(`$${tipConfiguration?.dollar_tip_amount?.amount_3?.value}`, '$', tipConfiguration?.dollar_tip_amount?.amount_3?.value)}
                                        />
                                    </View>
                                )}

                                {tipConfiguration?.percentage_tip_amount?.value && (
                                    <View style={styles.tippPercentageContiner}>
                                        <TipBoxButton
                                            percentage
                                            title={`${tipConfiguration?.percentage_tip_amount?.amount_1?.value}%`}
                                            subTitle={currencyFormatter.format((orderData.orderAmount / 100) * tipConfiguration?.percentage_tip_amount?.amount_1?.value, {
                                                code: 'CAD',
                                                // format: "%v %s",
                                            })}
                                            selected={selected}
                                            onPress={() =>
                                                handleSelected(`${tipConfiguration?.percentage_tip_amount?.amount_1?.value}%`, '%', tipConfiguration?.percentage_tip_amount?.amount_1?.value)
                                            }
                                        />
                                        <TipBoxButton
                                            percentage
                                            title={`${tipConfiguration?.percentage_tip_amount?.amount_2?.value}%`}
                                            subTitle={currencyFormatter.format((orderData.orderAmount / 100) * tipConfiguration?.percentage_tip_amount?.amount_2?.value, {
                                                code: 'CAD',
                                                // format: "%v %s",
                                            })}
                                            selected={selected}
                                            onPress={() =>
                                                handleSelected(`${tipConfiguration?.percentage_tip_amount?.amount_2?.value}%`, '%', tipConfiguration?.percentage_tip_amount?.amount_2?.value)
                                            }
                                        />
                                        <TipBoxButton
                                            percentage
                                            title={`${tipConfiguration?.percentage_tip_amount?.amount_3?.value}%`}
                                            subTitle={currencyFormatter.format((orderData.orderAmount / 100) * tipConfiguration?.percentage_tip_amount?.amount_3?.value, {
                                                code: 'CAD',
                                                // format: "%v %s",
                                            })}
                                            selected={selected}
                                            onPress={() =>
                                                handleSelected(`${tipConfiguration?.percentage_tip_amount?.amount_3?.value}%`, '%', tipConfiguration?.percentage_tip_amount?.amount_3?.value)
                                            }
                                        />
                                    </View>
                                )}

                                <View style={styles.primaryBtnContainer}>
                                    <PrimaryButton
                                        title={languagePicker(language, 'No Tip')}
                                        clr={theme?.colors?.text}
                                        disableBackgroundColor={true}
                                        buttonStyle={styles.primartBtn}
                                        bgColor={theme.colors.textInputBckground}
                                        onPress={() => {
                                            let data = { ...orderData };
                                            data.tip = 0;
                                            dispatch(setOrderData(data));
                                            if (manualCardEntry) {
                                                navigate('ManualCard', {});
                                            } else {
                                                navigate('Merchant_Cart', { type: 'login' });
                                            }
                                        }}
                                    />
                                    <PrimaryButton title={languagePicker(language, 'Other Amount')} bgColor={theme.colors.primary} buttonStyle={styles.primartBtn} onPress={handleOtherTip} />
                                </View>
                            </View>
                        </>
                    )}
                </TouchInactivityDetector>
            </Wrapper>
        </>
    );
};

export default TipDoller;
