import React, { useEffect, useState } from 'react';
import useStyles from './style';
import { cuveLogo, logo, person } from '@assets';
import { navigate, sendTextorEmail, sendToReceiptEmail } from '@services';
import { View, Image, ImageBackground, KeyboardAvoidingView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Wrapper, AppTextInput, PrimaryButton, CountryPickerInput } from '@components';
import { RF } from '@theme';
import { countryPicker, languagePicker } from '@utils';
var currencyFormatter = require('currency-formatter');

import { useSelector } from 'react-redux';
import { setTimeLayout, store } from '@redux';
import useTransactionList from '../../../db/hooks/useTransactionList';
import { receipt_data } from '../../../shared/utils/receipt_data';
import printCancelReceipt from '../../../shared/utils/cancelReceipt';

const RecieptMail = ({ route }: any) => {
    var currencyFormatter = require('currency-formatter');
    const { type, orderId } = route?.params;
    const language = useSelector((state: any) => state.user.languageType);
    const myTheme = useTheme();
    const style = useStyles(myTheme.colors);
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('1');
    const [phone, setPhone] = useState('');
    const [countrymodal, setCountrymodal] = useState(false);
    const [flagSign, setFlagSign] = useState(countryPicker[37].flag);
    const [errorModal, setErrormodal] = useState(false);
    const { tms_settings } = useSelector((state: any) => state.pr);
    const orderData = useSelector((state: any) => state.common.orderData);
    const { temrinalInfo } = store.getState().tms;
    const { storeId } = store.getState().pr;
    const merchant_passcode = tms_settings?.security?.merchant_passcode;
    const footer_lines = tms_settings?.printer?.receipt_footer_lines;
    const header_lines = tms_settings?.printer?.receipt_header_lines;
    // const { finalTransaction } = useSelector((state: any) => state.common);
    // console.log("======", finalTransaction);
    const { getLatestTransaction } = useTransactionList();
    const { sendSmsReceipt } = printCancelReceipt();
    const [entryMethod, setEntryMethod] = useState(orderData.entry_mode);
    const { settings, internet_Connected, manualCardEntry } = useSelector((state: any) => state.user);

    const hanldeCountryPicker = (text: any) => {
        setCountry(text);
    };

    useEffect(() => {
        // sendReceipt()
    }, []);
    const sendReceipt = async () => {
        // let res = await sendTextorEmail(
        //   {
        //     type: type == "textMessage" ? "number" : "email",
        //     number: type == "textMessage" ? "+" + country + phone : "",
        //     email: email,
        //   },
        //   orderId
        // );

        let finalTransaction = getLatestTransaction();
        if (finalTransaction === undefined) {
            console.log('DATA IS NOT DEFINED');
            return;
        }

        if (type != 'email') {
            const cleanedPhoneNumber = phone.replace(/\D/g, '');
            let res = await sendSmsReceipt(finalTransaction, '+' + country + cleanedPhoneNumber);
            if (res.status === 201) {
                if (merchant_passcode?.value) {
                    navigate('LockScreen');
                } else {
                    navigate('TransactionMenu', { type: type });
                }
            }
        } else {
            const receiptData = {
                // split,
                clerk_id: finalTransaction?.clerk_id ?? '',

                merchant_id: finalTransaction?.merchant_id ?? '',
                terminal_id: finalTransaction?.terminal_id ?? '',

                batch_number: finalTransaction?.batch_no ?? '',
                transaction_no: finalTransaction.transaction_no ?? '',
                invoice_number: finalTransaction?.invoice_no?.toUpperCase() ? finalTransaction?.invoice_no?.toUpperCase() : '',
                card_number: finalTransaction?.card_number.substring(8) ?? '',
                card_type: manualCardEntry ? 'Credit' : finalTransaction?.card_type,
                ref_number: finalTransaction?.reference_id ? finalTransaction?.reference_id : '',
                trace_id: finalTransaction?.trace_id ?? '',
                auth_id: finalTransaction?.auth_no ?? '',
                sale_amount: currencyFormatter.format(finalTransaction?.sale_amount ? finalTransaction?.sale_amount : '', {
                    code: 'CAD',
                }),
                tip_amount: currencyFormatter.format(finalTransaction?.tip_amount ? finalTransaction?.tip_amount : '', {
                    code: 'CAD',
                }),
                totalAmount: currencyFormatter.format(
                    parseFloat(parseFloat(finalTransaction?.tip_amount) + parseFloat(finalTransaction?.sale_amount) + parseFloat(finalTransaction?.surcharge_amount)),
                    {
                        code: 'CAD',
                    }
                ),
                surcharge_amount: currencyFormatter.format(finalTransaction?.surcharge_amount ? finalTransaction?.surcharge_amount : '', {
                    code: 'CAD',
                }),
                // total_amount: split?.total_amount,
                entry_mode: finalTransaction?.entry_mode,
                application_label: finalTransaction?.card_type ?? '',
                application_pref_name: finalTransaction?.type ?? '',
                d: finalTransaction?.date ?? '',
                t: finalTransaction?.time ?? '',

                header_1: header_lines.line_1 ?? '',
                header_2: header_lines.line_2 ?? '',
                header_3: header_lines.line_3 ?? '',
                header_4: header_lines.line_4 ?? '',
                header_5: header_lines.line_5 ?? '',
                header_6: header_lines.line_6 ?? '',
                footer_1: footer_lines?.line_1 ?? '',
                footer_2: footer_lines?.line_2 ?? '',
                footer_3: footer_lines?.line_3 ?? '',
                footer_4: footer_lines?.line_4 ?? '',
                footer_5: footer_lines?.line_5 ?? '',
                footer_6: footer_lines?.line_6 ?? '',
            };

            console.log(receiptData);

            console.log(receipt_data(receiptData), 'receipt_data(receiptData)receipt_data(receiptData)');

            const data = {
                personalizations: [
                    {
                        to: [{ email: email }],
                        subject: 'Hello Testing from huzaifa',
                    },
                ],
                from: { email: 'sender@example.com' },
                content: [{ type: 'text/html', value: receipt_data(receiptData) }],
            };
            let res: any = await sendToReceiptEmail(data);

            console.log(res, 'rererrrrrrrtttt');

            if (res.status === 202) {
                if (merchant_passcode?.value) {
                    navigate('LockScreen');
                } else {
                    navigate('TransactionMenu', { type: type });
                }
            }
        }
    };
    const handleCountryFlagSign = (flag: any) => {
        setFlagSign(flag);
    };
    const onchange = (text: any) => {
        setPhone(text);
        console.log(text);

        store.dispatch(setTimeLayout(text));
    };
    const handleCountryModal = () => {
        setCountrymodal(!countrymodal);
    };
    const modalClose = () => {
        setErrormodal(false);
    };

    return (
        <Wrapper viewStyle={style.wrapContainer}>
            <ImageBackground source={cuveLogo} imageStyle={{ resizeMode: 'contain' }} style={style.imgBackgroundView}>
                <Image source={logo} style={style.img} />
            </ImageBackground>
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                    paddingHorizontal: RF(30),
                }}>
                <KeyboardAvoidingView style={{ flex: 1, backgroundColor: 'white' }} keyboardVerticalOffset={10}>
                    {type == 'email' && (
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                paddingTop: RF(20),
                            }}>
                            <AppTextInput
                                placeholderTextColor={'#4A556880'}
                                title={languagePicker(language, 'Email Address')}
                                onChangeText={(txt: any) => {
                                    setEmail(txt.toLowerCase());
                                }}
                                textInputBag
                                placeholder={'Enter Email'}
                            />
                        </View>
                    )}

                    {type == 'textMessage' && (
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                            }}>
                            <CountryPickerInput
                                country={'+' + country}
                                flagSign={flagSign}
                                placeholder={'Mobile Number'}
                                image={person}
                                onchange={onchange}
                                value={phone}
                                countryModal={countrymodal}
                                handleCountryModal={handleCountryModal}
                                hanldeCountryPicker={hanldeCountryPicker}
                                handleCountryFlagSign={handleCountryFlagSign}
                            />
                        </View>
                    )}
                    <View style={style.wrapButton}>
                        <PrimaryButton
                            title={'Send Receipt'}
                            buttonStyle={style.btn}
                            bgColor={myTheme?.colors?.primary}
                            onPress={() => {
                                sendReceipt();
                            }}
                        />
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Wrapper>
    );
};
export default RecieptMail;
