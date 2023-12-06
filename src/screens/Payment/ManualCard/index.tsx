import { KeyboardAvoidingView, View, ScrollView, Keyboard } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { AppText, CurveHeader, MaskedTextInput, TouchInactivityDetector, Wrapper } from '@components';
import useStyles from './style';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RF, Typography, verticalScale } from '@theme';
import { GetCardType, languagePicker, makeStringCenter } from '@utils';
import { navigate, ParseEMV } from '@services';
import { setOrderData, setTimeLayout, store } from '@redux';
import Pax from 'react-native-pax-library';
import { cross } from '@assets';

var currencyFormatter = require('currency-formatter');

const ManualCard = () => {
    const theme: any = useTheme();
    const colorTheme = theme.colors;
    const styles = useStyles(theme.colors);
    const orderData = useSelector((state: any) => state.common.orderData);
    const language = useSelector((state: any) => state.user.languageType);
    const [cardNumber, setcardNumber] = React.useState('');
    const [expiry, setExpiry] = React.useState('');
    const [cvv, setCvv] = React.useState('');
    const [cardError, setCardError] = useState('');
    const [expiryError, setExpiryError] = useState('');
    const [cvvError, setCvvError] = useState('');
    const [keyboardShown, setKeyboardShown] = useState(false);
    const dispatch = useDispatch();
    const [flag, setFlag] = useState(false);
    const { tms_settings } = useSelector((state: any) => state.pr);
    const isRefund = useSelector((state: any) => state.common.isRefund);

    const printerConfiguration = tms_settings?.printer;
    const surchargeConfig = tms_settings?.transaction_settings?.surcharge;
    const tipConfig = tms_settings?.transaction_settings?.tip_configuration;
    const cardRef = useRef<any>(null);
    const expiryRef = useRef<any>(null);
    const cvvRef = useRef<any>(null);

    const handleSubmit = async (type: any) => {
        cvvRef.current.focus();
        if (cardNumber == '') {
            setCardError('Card Number Required');
        }
        if (expiry == '') {
            setExpiryError('Expiry Date Required');
        }
        if (cvv == '') {
            setCvvError('CVV Required');
        }
        if (cardNumber.length < 19 || cardNumber == '') {
            setCardError('Card Number Required');
        } else if (expiry.length < 4 || expiry == '') {
            setExpiryError('Expiry Date Required');
        } else if (expiry.length < 3 || cvv == '') {
            setCvvError('CVV Required');
        } else {
            let result = expiry.split('/');

            let exp = result[1] + '/' + result[0];

            let params = {
                manual: true,
                pan: cardNumber,
                cvv: cvv,
                exp_date: exp,
            };

            let data = { ...orderData };
            data.entry_mode = 'manual';
            data.cardType = 'credit';
            data.cType = GetCardType(cardNumber);
            data.cardNumber = cardNumber;
            data.cvv = cvv;
            data.exp_date = exp;
            data.surcharge = (parseFloat(orderData.orderAmount) / 100) * parseFloat(surchargeConfig?.credit_surcharge?.fee);
            dispatch(setOrderData(data));
            navigate('LoadingProcess', { type: 'manual' });
        }
    };

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

    useEffect(() => {
        if (printerConfiguration?.pre_print?.value) {
            if (!flag) initPrinter();
            setFlag(true);
        }
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardShown(true);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardShown(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <Wrapper viewStyle={styles.main}>
            <TouchInactivityDetector expiry={expiry} cvv={cvv} reset={cardNumber}>
                <CurveHeader
                    visible
                    adminVisible
                    source={cross}
                    title={currencyFormatter.format(
                        isRefund || !surchargeConfig?.credit_surcharge?.value
                            ? parseFloat(orderData.orderAmount)
                            : parseFloat(orderData.orderAmount) + parseFloat(orderData.tip) + (parseFloat(orderData.orderAmount) / 100) * parseFloat(surchargeConfig?.credit_surcharge?.fee),
                        {
                            code: 'CAD',
                        }
                    )}
                    total={isRefund ? 'Refund Total' : 'Sale Total'}
                />
                <AppText
                    bold
                    title={'Manual Card Entry'}
                    defaultTextColor
                    textStyle={{
                        paddingHorizontal: RF(20),
                        fontFamily: 'Plus Jakarta Sans',
                    }}
                    size={RF(30)}
                />

                <ScrollView style={{ flex: 1 }}>
                    <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={80}>
                        <View style={styles.view}>
                            <View style={styles.rowView}>
                                <AppText defaultTextColor title={languagePicker(language, !isRefund ? 'Sale' : 'Refund')} size={Typography.FONTS.SIZE.XLARGE} medium />
                                <View style={styles.row}>
                                    <AppText
                                        semiBold
                                        defaultTextColor
                                        title={currencyFormatter.format(parseFloat(orderData.orderAmount), {
                                            code: 'CAD',
                                        })}
                                        size={Typography.FONTS.SIZE.XLARGE}
                                    />
                                </View>
                            </View>

                            <View style={[styles.lineView, { borderBottomColor: colorTheme.border }]} />
                            {!isRefund && tipConfig?.tip_screen?.value && (
                                <View style={[styles.rowView, { paddingTop: verticalScale(18) }]}>
                                    <AppText defaultTextColor title={languagePicker(language, 'Tip Amount')} size={19} />
                                    <View style={styles.row}>
                                        <AppText
                                            semiBold
                                            defaultTextColor
                                            title={currencyFormatter.format(parseFloat(orderData.tip), {
                                                code: 'CAD',
                                            })}
                                            size={19}
                                        />
                                    </View>
                                </View>
                            )}

                            {!isRefund && surchargeConfig?.credit_surcharge?.value && (
                                <View style={[styles.rowView, { paddingTop: verticalScale(5) }]}>
                                    <>
                                        <AppText defaultTextColor title={languagePicker(language, 'Surcharge')} size={19} />

                                        <View style={styles.row}>
                                            <AppText
                                                semiBold
                                                defaultTextColor
                                                title={currencyFormatter.format((parseFloat(orderData.orderAmount) / 100) * parseFloat(surchargeConfig?.credit_surcharge?.fee), {
                                                    code: 'CAD',
                                                })}
                                                size={19}
                                            />
                                        </View>
                                    </>
                                </View>
                            )}

                            <MaskedTextInput
                                icon
                                ref={cardRef}
                                title={'Enter Card Number'}
                                value={cardNumber}
                                mask={[/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                placeholder={'0000 - 0000 - 0000 - 0000'}
                                handleSubmitEditting={() => handleSubmit('card')}
                                containerStyle={{ marginTop: RF(45) }}
                                error={cardError ? cardError : ''}
                                onChangeText={(val: any) => {
                                    setcardNumber(val);
                                    setCardError('');
                                    if (val.length === 19) {
                                        expiryRef.current.focus();
                                    }
                                }}
                                style={{
                                    width: '100%',
                                    fontSize: RF(22),
                                    height: RF(60),
                                    letterSpacing: 3,
                                    fontFamily: 'Plus Jakarta Sans',
                                    fontWeight: '500',
                                }}
                            />
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: '30%',
                                }}>
                                <View>
                                    <MaskedTextInput
                                        icon
                                        ref={expiryRef}
                                        title={'Enter Expiration Date'}
                                        value={expiry}
                                        mask={[/\d/, /\d/, '/', /\d/, /\d/]}
                                        error={expiryError ? expiryError : ''}
                                        placeholder={'01/23'}
                                        handleSubmitEditting={() => handleSubmit('expiry')}
                                        onChangeText={(val: any) => {
                                            setExpiry(val);
                                            setExpiryError('');
                                            setCvvError('');
                                            if (val.length === 5) {
                                                cvvRef.current.focus();
                                            }
                                        }}
                                        style={{
                                            width: '100%',
                                            fontSize: RF(22),
                                            height: RF(60),
                                            letterSpacing: 3,
                                            fontFamily: 'Plus Jakarta Sans',
                                            fontWeight: '500',
                                        }}
                                    />
                                </View>
                                <View style={{}}>
                                    <MaskedTextInput
                                        icon
                                        ref={cvvRef}
                                        title={'CVV'}
                                        value={cvv}
                                        mask={[/\d/, /\d/, /\d/]}
                                        error={cvvError ? cvvError : ''}
                                        placeholder={'123'}
                                        containerStyle={{ marginLeft: RF(15), width: RF(160) }}
                                        handleSubmitEditting={() => handleSubmit('cvv')}
                                        onChangeText={(val: any) => {
                                            setCvv(val);
                                            setCvvError('');
                                            store.dispatch(setTimeLayout(val));
                                        }}
                                        style={{
                                            width: '100%',
                                            fontSize: RF(22),
                                            height: RF(60),
                                            letterSpacing: 3,
                                            fontFamily: 'Plus Jakarta Sans',
                                            fontWeight: '500',
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </TouchInactivityDetector>
        </Wrapper>
    );
};

export default ManualCard;
