import useStyles from './style';
import { badRequest, cross, declined, declinedFailed, declinedRed, declineFailed } from '@assets';
import { Image, View } from 'react-native';
import { Typography, SCREEN_WIDTH, SCREEN_HEIGHT, GST } from '@theme';
import { navigate, verifyClerkId, verifyInvoice } from '@services';
import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '@react-navigation/native';
import { AppHeader, AppText, InputField, Wrapper, ErrorText } from '@components';
import { useDispatch, useSelector } from 'react-redux';
import { setOrderData, setRefundData } from '@redux';
import { languagePicker, styles } from '@utils';
import moment from 'moment';
import Pax from 'react-native-pax-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
var currencyFormatter = require('currency-formatter');

const DeclinedTransaction = ({ navigation }: any) => {
    const language = useSelector((state: any) => state.user.languageType);
    const myTheme: any = useTheme();
    const style = useStyles(myTheme.colors);
    const isRefund = useSelector((state: any) => state.common.isRefund);

    const { settings } = useSelector((state: any) => state.user);
    const { posId } = useSelector((state: any) => state.pr);
    const { tms_settings } = useSelector((state: any) => state.pr);
    const surchargeConfig = tms_settings?.transaction_settings?.surcharge;
    const tipConfig = tms_settings?.transaction_settings?.tip_configuration;
    const orderData = useSelector((state: any) => state.common.orderData);

    const [errorCode, setErrorCode] = useState(false);

    var surcharge = 0;
    if (orderData.orderAmount > surchargeConfig?.debit_surcharge?.limit && orderData.cardType === 'debit') surcharge = 0;
    else if (orderData?.cardType === 'debit') {
        surcharge = surchargeConfig?.debit_surcharge?.fee;
    } else surcharge = surchargeConfig?.credit_surcharge?.fee;

    function makeStringCenter(str: any, counter: any, orientation: any) {
        // console.log(str, "opoppoopoo");
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

    const initPrinter = async (getFlag: boolean) => {
        let receipt = '';
        const merchantID = await AsyncStorage.getItem('merchantID');
        const clerkID = await AsyncStorage.getItem('clerkID');

        // console.log("no.....", );
        // receipt += makeStringCenter("PSP SERVICES", 31, "center") + "\n";
        // receipt += makeStringCenter(receiptDetail?.store_name, 31, "center") + "\n";
        // receipt +=
        //   makeStringCenter(
        //     receiptDetail?.split?.store_address1
        //       ? receiptDetail?.split?.store_address1
        //       : "..",
        //     31,
        //     "center"
        //   ) + "\n";

        // receipt +=
        //   makeStringCenter(
        //     receiptDetail?.split?.store_address2
        //       ? receiptDetail?.split?.store_address2
        //       : "..",
        //     31,
        //     "center"
        //   ) + "\n";

        // receipt += makeStringCenter("Header 5", 31, "center") + "\n";
        // receipt += makeStringCenter("Header 6", 31, "center") + "\n";

        receipt += makeStringCenter('                              ', 31, 'center') + '\n';
        // if (type?.includes("Merchant")) {
        receipt += makeStringCenter('Merchant ID:', 13, 'left') + makeStringCenter(merchantID ? padFunction(merchantID.substring(8)).toUpperCase() : '', 19, 'right') + '\n';

        receipt += makeStringCenter('Terminal ID:', 13, 'left') + makeStringCenter(posId ? posId.substring(8).toUpperCase() : '', 19, 'right') + '\n';

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

        receipt += makeStringCenter('Clerk ID:', 13, 'left') + makeStringCenter(clerkID ?? '', 19, 'right') + '\n';

        receipt += makeStringCenter(`Date:${moment(new Date()).format('DD/MM/YYYY')}`, 16, 'left') + makeStringCenter(`Time:${moment(new Date()).format('hh:mm:ss')}`, 16, 'right') + '\n';

        receipt += makeStringCenter(`Batch#`, 16, 'left') + makeStringCenter(`XXX`, 16, 'right') + '\n';

        receipt += makeStringCenter('Invoice #', 16, 'left') + makeStringCenter(orderData.invoiceNumber, 16, 'right') + '\n';

        receipt += makeStringCenter('Sale', 31, 'center') + '\n\n';

        receipt += makeStringCenter(orderData.cType, 16, 'left') + makeStringCenter('Entry Method', 16, 'right') + '\n';

        receipt +=
            makeStringCenter(
                padFunction(orderData.cardNumber.substring(8)),
                // padFunction(receiptDetail?.split?.card_number),
                19,
                'left'
            ) +
            makeStringCenter(orderData.entry_mode == 'S' ? 'SWIPE' : orderData.entry_mode == 'T' ? 'TAP' : 'CHIP', 13, 'right') +
            '\n';

        // if (receiptDetail?.order?.type === "DEBIT") {
        //     receipt +=
        //         makeStringCenter("Account Type:", 16, "left") +
        //         makeStringCenter(
        //             entryMethod == "T" ? "DEFAULT" : receiptDetail?.split?.account_type,
        //             16,
        //             "right"
        //         ) +
        //         "\n";
        // }

        receipt += makeStringCenter('Ref.#', 16, 'left') + makeStringCenter('XXXXXXXXX', 16, 'right') + '\n';

        receipt += makeStringCenter('Trace ID:', 16, 'left') + makeStringCenter(String('XXXXXXX'), 16, 'right') + '\n';

        receipt += makeStringCenter('Auth.#:', 16, 'left') + makeStringCenter('XXXXXXX', 16, 'right') + '\n';

        receipt +=
            makeStringCenter('Amount:', 19, 'left') +
            makeStringCenter(
                currencyFormatter.format(orderData.orderAmount ? orderData.orderAmount : '', {
                    code: 'CAD',
                }),
                13,
                'right'
            ) +
            '\n';

        if (tipConfig?.tip_screen?.value) {
            receipt +=
                makeStringCenter('TIP:', 19, 'left') +
                makeStringCenter(
                    currencyFormatter.format(orderData.tip ? orderData.tip : '', {
                        code: 'CAD',
                    }),
                    13,
                    'right'
                ) +
                '\n';
        }

        if (surchargeConfig?.debit_surcharge?.value || surchargeConfig?.credit_surcharge?.value) {
            receipt +=
                makeStringCenter('Surcharge:', 19, 'left') +
                makeStringCenter(
                    currencyFormatter.format(
                        orderData.cardType == 'debit' ? surchargeConfig?.debit_surcharge?.fee : (parseFloat(orderData.orderAmount) / 100) * surchargeConfig?.credit_surcharge?.fee,
                        {
                            code: 'CAD',
                        }
                    ),
                    13,
                    'right'
                ) +
                '\n';
        }

        receipt += makeStringCenter('_________________________________', 31, 'center') + '\n';
        let surcharge;
        surcharge = orderData.cardType == 'debit' ? surchargeConfig?.debit_surcharge?.fee : (parseFloat(orderData.orderAmount) / 100) * surchargeConfig?.credit_surcharge?.fee;
        surcharge = parseFloat(surcharge);
        let tip = parseFloat(orderData.tip);
        let orderAmount = orderData.orderAmount;
        receipt +=
            makeStringCenter('Total:', 16, 'left') +
            makeStringCenter(
                currencyFormatter.format(surcharge + tip + orderAmount, {
                    code: 'CAD',
                }),
                16,
                'right'
            ) +
            '\n';

        receipt += makeStringCenter('Application Label:', 19, 'left') + makeStringCenter(orderData.cType, 13, 'right') + '\n';

        receipt += makeStringCenter('Application Pref.Name:', 22, 'left') + makeStringCenter('XXXXXX', 10, 'right') + '\n';

        receipt += makeStringCenter('AID:', 16, 'left') + makeStringCenter('XXXXXXXXXXXXXXXX', 16, 'right') + '\n';

        receipt += makeStringCenter('TVR:', 16, 'left') + makeStringCenter('XXXXXXXXXX', 16, 'right') + '\n';
        receipt += makeStringCenter('TSI:', 16, 'left') + makeStringCenter('XXXX', 16, 'right') + '\n\n';

        // receipt += makeStringCenter("Customer Copy", 31, "center") + "\n";

        // receipt += makeStringCenter("Duplicate Copy", 31, "center") + "\n";
        receipt += makeStringCenter('XX-DECLINE-XX', 31, 'center') + '\n\n';
        receipt += makeStringCenter('Customer Copy', 31, 'center') + '\n';
        receipt += makeStringCenter('Merchant Copy', 31, 'center') + '\n';
        receipt += makeStringCenter('Duplicate Copy', 31, 'center') + '\n\n\n';

        // let url =
        // "https://tservice.plastk.ca/POS/orders/receipt-qr/" +
        // qrCodeResponse.orderId;

        let url = '';
        Pax.printStr('', url, receipt, Pax.FULL_CUT, '');
    };

    return (
        <Wrapper isPaddingH isTop>
            <View style={style.container}>
                <AppText center defaultTextColor title={!errorCode ? 'Transaction Declined' : 'Declined'} size={Typography.FONTS.SIZE.XLARGE} />

                <AppText center defaultTextColor textStyle={style.secondText} title={!errorCode ? 'Please Hand Device To Clerk' : 'Error 400: Bad Request'} size={Typography.FONTS.SIZE.SMALL} />
                <Image source={errorCode ? badRequest : declineFailed} style={style.image} />
            </View>
            {!errorCode && (
                <AppText
                    center
                    defaultTextColor
                    textStyle={style.bottomText}
                    title={'See Error Code'}
                    size={Typography.FONTS.SIZE.SMALL}
                    onPress={() => {
                        initPrinter();
                        setErrorCode(true);
                        setTimeout(() => {
                            navigate('TransactionMenu');
                        }, 8000);
                    }}
                />
            )}
        </Wrapper>
    );
};
export default DeclinedTransaction;
