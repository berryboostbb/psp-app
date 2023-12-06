import { GST, Typography } from '@theme';
import useStyles from './style';
import { View } from 'react-native';
import { AppText, ImageViewWrapper, Overlay, ProcessingHeader, SuccessHeader } from '@components';
import { navigate } from '@services';
import { useDispatch, useSelector } from 'react-redux';
import { default as React, useEffect, useRef, useState } from 'react';
import { RouteProp, useTheme } from '@react-navigation/native';
import { exclaimation, tick } from '@assets';
import { setFinalTransaction, setManualCardEntry, setOrderData, setPrePrinted, setTransactionResponse } from '@redux';
import Pax from 'react-native-pax-library';
import io from 'socket.io-client';
import useCreateTransaction from '../../../db/hooks/useCreateTransaction';
import useAutoInvoiceTransactionList from '../../../db/hooks/useAutoInvoiceTransactionList';
import makeRequest from '../../../backend_emv/makeRequest';
import { errorList, languagePicker } from '@utils';
var currencyFormatter = require('currency-formatter');
import { CommonActions } from '@react-navigation/native';
import printCancelReceipt from '../../../shared/utils/cancelReceipt';
import { setTxn } from '@redux';

let socket = {};

interface Props {
    navigation: any;
    route: RouteProp<{
        params: {
            type?: any;
        };
    }>;
}

const LoadingProcess = ({ route, navigation }: Props) => {
    const { type } = route?.params;
    const dispatch = useDispatch();
    const myTheme: any = useTheme();
    const style = useStyles(myTheme.colors);
    const orderId = null;
    const { createTransaction } = useCreateTransaction();
    const [flag, setFlag] = useState('Processing');
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [notifyType, setNotifyType] = useState('');
    const ref: any = useRef();
    const transactionTimeout: any = useRef();

    const { cancelReceipt } = printCancelReceipt();
    let { getNewInvoiceNumber } = useAutoInvoiceTransactionList();
    const { signature } = useSelector((state: any) => state.common);
    const orderData = useSelector((state: any) => state.common.orderData);
    const { deviceMacAddress, manualCardEntry } = useSelector((state: any) => state.user);
    const language = useSelector((state: any) => state.user.languageType);
    const isRefund = useSelector((state: any) => state.common.isRefund);
    const { loggedInUser, terminalInfo, txn } = useSelector((state: any) => state.tms);
    const { tms_settings, storeId } = useSelector((state: any) => state.pr);

    const invoiceConfig = tms_settings?.transaction_settings?.invoice_number;
    const printerConfiguration = tms_settings?.printer;
    const surchargeConfig = tms_settings?.transaction_settings?.surcharge;
    const tipConfig = tms_settings?.transaction_settings?.tip_configuration;
    const terminal_mode = tms_settings?.terminal_configuration?.language_and_terminal_mode?.terminal_mode;

    var surcharge = 0;
    if (surchargeConfig?.debit_surcharge?.value || surchargeConfig?.credit_surcharge?.value) {
        if (orderData.orderAmount > surchargeConfig?.debit_surcharge?.limit && orderData.cardType === 'debit') surcharge = 0;
        else if (orderData?.cardType === 'debit' && surchargeConfig?.debit_surcharge?.value) {
            surcharge = surchargeConfig?.debit_surcharge?.fee;
        } else if (surchargeConfig?.credit_surcharge?.value) surcharge = surchargeConfig?.credit_surcharge?.fee;
        else surcharge = 0;
    } else {
        surcharge = 0;
    }

    useEffect(() => {
        socketTransaction();
    }, []);

    useEffect(() => {
        const timer2 = setTimeout(() => {
            if (type === 'tap' && flag === 'Approved') {
                navigate('TransactionMenu');
            }
            if ((type === 'manual' || type === 'insert' || type === 'tap' || type === 'swipe') && flag === 'Approved') {
                if (manualCardEntry || orderData?.entry_mode == 'S') {
                    navigate('Signature', { orderId: orderId });
                } else {
                    if (tms_settings?.printer?.merchant_receipt?.value) {
                        navigate('Receipt', { orderId: orderId });
                    } else {
                        navigate('TransactionMenu');
                    }
                }
            }
        }, 1500);

        return () => {
            clearTimeout(timer2);
            socket?.disconnect();
            socket = null;
        };
    }, [flag]);

    useEffect(() => {
        socket = io('wss://psp.plastk.ca', {
            allowEIO3: true,
            secure: true,
            multiplex: false,
            path: '/websocketsu',
            auth: {
                token: '',
            },
        });
    }, []);

    const displayMessage = (res: any) => {
        dispatch(setTransactionResponse(res));
        checkFlags(res);
    };

    const socketTransaction = async () => {
        const gettingAllKeys = txn;
        const { entry_mode, orderAmount, tip, cardNumber, cvv, exp_date, surcharge } = orderData;
        let functionName = isRefund ? 'return_refund_request' : 'purchase_request';
        if (manualCardEntry) functionName = 'manual_purchase_request';

        let cardDataInputMode, data;
        switch (entry_mode) {
            case 'S':
                cardDataInputMode = 'magnetic';
                break;
            case 'T':
                cardDataInputMode = 'proximityICCRules';
                break;
            default:
                cardDataInputMode = manualCardEntry ? 'manual' : 'icc';
        }

        const amountWithSurcharge = (Math.round(((orderAmount ?? 0) + (tip ?? 0) + (surcharge ?? 0) + Number.EPSILON) * 100) / 100).toFixed(2).replace('.', '');
        const amountWithoutSurcharge = (Math.round(((orderAmount ?? 0) + (tip ?? 0) + Number.EPSILON) * 100) / 100).toFixed(2).replace('.', '');

        const finalAmount = entry_mode !== 'T' ? amountWithSurcharge : amountWithoutSurcharge;
        const expiryDate = exp_date ? `${exp_date}/01` : '24/01/01';
        if (!manualCardEntry) {
            data = {
                card_data: {
                    transaction_number: '9',
                    'Custom MAC Data': '',
                    cardDataInputMode,
                    cardholderAuthMethod: 'terminalAcceptsOfflinePins',
                    PINBLOCK: gettingAllKeys['PINBLOCK']?.toString() ?? '',
                    'Pinpad Type': gettingAllKeys['Pinpad Type']?.toString() ?? '',
                    KSN: '',
                    OnlinePINFlag: gettingAllKeys['OnlinePINFlag']?.toString() ?? '',
                    EncryptedEMVTLVData: '',
                    EMVData: gettingAllKeys?.EMVData?.toString(),
                    cardHolderName: gettingAllKeys['cardHolderName']?.toString() ?? '',
                    'Entry Mode': gettingAllKeys['Entry Mode']?.toString() ?? '',
                    ContactlessTransactionPath: gettingAllKeys['ContactlessTransactionPath']?.toString() ?? '',
                    EncryptedSensitiveTLVData: '',
                    CVM: gettingAllKeys?.CVM?.toString() ?? '',
                    CustomEncryptedData: '[]',
                    'Luhn Validation Result': gettingAllKeys['Luhn Validation Result']?.toString() ?? '',
                    'Track1 Data': '',
                    PAN: gettingAllKeys?.PAN.toString(),
                    'Result Text': gettingAllKeys['Result Text']?.toString() ?? '',
                    'Track3 Data': '',
                    SignatureFlag: gettingAllKeys['SignatureFlag']?.toString() ?? '',
                    CVV: '',
                    'Track2 Data': gettingAllKeys['Track2 Data']?.toString() ?? '',
                    MaskedPAN: '',
                    'Result Code': gettingAllKeys['Result Code']?.toString() ?? '',
                    'Custom MAC KSN': '',
                    'Contactless Authorize Result': gettingAllKeys['Contactless Authorize Result']?.toString() ?? '',
                    TransactionType: '',
                    Zip: '',
                    ServiceCode: gettingAllKeys['ServiceCode']?.toString(),
                    'Expiry Date': gettingAllKeys['Expiry Date']?.toString(),
                    ETB: '',
                },
                serial_number: terminalInfo?.serialNo.toString(),
                amount: finalAmount,
                clear_pin: entry_mode !== 'S' && entry_mode !== 'T' && !manualCardEntry ? '3112' : '',
                terminal_id: '10015843',
                merchant_id: '136200499100000',
                san: '000000',
                mti: '0200',
                function_name: functionName,
                mac: deviceMacAddress,
            };
        } else {
            const cardNo = cardNumber.replace(/-/g, '');

            data = {
                card_data: {
                    PAN: cardNo,
                    CVV: cvv,
                    'Expiry Date': expiryDate,
                    'Entry Mode': 1,
                    cardDataInputMode,
                    cardholderAuthMethod: 'terminalAcceptsOfflinePins',
                },
                serial_number: terminalInfo?.serialNo.toString(),
                amount: amountWithSurcharge,
                clear_pin: entry_mode !== 'S' && entry_mode !== 'T' && !manualCardEntry ? '3112' : '',
                terminal_id: '10015843',
                merchant_id: '136200499100000',
                san: '000000',
                mti: '0200',
                function_name: functionName,
                mac: deviceMacAddress,
            };
        }

        console.log('orderDATA', JSON.stringify(orderData, null, 2));
        console.log('DATA_SENT_TO_MAKE_REQUEST:', JSON.stringify(data, null, 2));

        const { newObj } = await makeRequest({ ...data });
        // const { fieldDefinitions, received, newObj } = res;
        displayMessage(newObj);
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

    useEffect(() => {
        transactionTimeout.current = setTimeout(() => {
            setNotifyType('error');
            setOverlayVisible(true);
            ref.current.alertWithType('custom', 'Transaction Timeout', '');
            cancelReceipt();
            setTimeout(() => {
                setOverlayVisible(false);
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0, // Reset to the first screen in the stack
                        routes: [{ name: 'TransactionMenu' }], // Navigate to the specified screen
                    })
                );
            }, 5000);
        }, 30000);

        return () => {
            clearTimeout(transactionTimeout.current);
        };
    }, []);

    const padFunction = (number: any) => {
        let string = String(number);
        let sliced = string.slice(-4);
        let mask = String(sliced).padStart(string.length, '*');
        return mask;
    };

    const initPrinter = async (finalTransaction: any) => {
        let receipt = '';

        if (!printerConfiguration?.pre_print?.value) {
            Object.keys(printerConfiguration?.receipt_header_lines).map(key => {
                if (key !== 'value' && printerConfiguration?.receipt_header_lines[key] && key !== 'line_1') {
                    receipt += makeStringCenter(`${printerConfiguration?.receipt_header_lines[key]}`, 31, 'center') + '\n';
                }
            });
        }
        receipt += makeStringCenter('                              ', 31, 'center') + '\n';
        receipt += makeStringCenter('Merchant ID:', 13, 'left') + makeStringCenter(storeId ? storeId : '', 19, 'right') + '\n';

        receipt += makeStringCenter('Terminal ID:', 13, 'left') + makeStringCenter('10015843'.toUpperCase(), 19, 'right') + '\n';

        receipt += makeStringCenter('Clerk ID:', 13, 'left') + makeStringCenter(finalTransaction?.clerk_id ?? '', 19, 'right') + '\n';
        // }

        receipt += makeStringCenter(`Date:${finalTransaction?.date}`, 16, 'left') + makeStringCenter(`Time:${finalTransaction?.time}`, 16, 'right') + '\n';

        receipt += makeStringCenter(`Batch# ${finalTransaction?.batch_no}`, 16, 'left') + makeStringCenter(`Transaction# ${finalTransaction.transaction_no}`, 16, 'right') + '\n';

        receipt += makeStringCenter('Invoice#', 16, 'left') + makeStringCenter(finalTransaction?.invoice_no?.toUpperCase() ? finalTransaction?.invoice_no?.toUpperCase() : '', 16, 'right') + '\n';
        // }

        receipt += makeStringCenter(finalTransaction?.status === 'Refunded' ? 'Refund' : 'Sale', 31, 'center') + '\n\n';

        receipt +=
            makeStringCenter(manualCardEntry ? 'CREDIT' : finalTransaction?.card_type, 16, 'left') + makeStringCenter(padFunction(finalTransaction?.card_number.substring(8)), 16, 'right') + '\n';

        receipt +=
            makeStringCenter('Entry Method', 19, 'left') +
            makeStringCenter(manualCardEntry ? 'MANUAL' : orderData.entry_mode == 'S' ? 'SWIPE' : orderData.entry_mode == 'T' ? 'TAP' : 'CHIP', 13, 'right') +
            '\n';

        if (finalTransaction?.type === 'DEBIT') {
            receipt += makeStringCenter('Account Type:', 16, 'left') + makeStringCenter(orderData.entry_mode == 'T' ? 'DEFAULT' : finalTransaction?.account_type, 16, 'right') + '\n';
        }

        receipt += makeStringCenter('Ref.#', 16, 'left') + makeStringCenter(finalTransaction?.reference_id ? finalTransaction?.reference_id : '', 16, 'right') + '\n';

        receipt += makeStringCenter('Trace ID:', 16, 'left') + makeStringCenter(String(finalTransaction?.trace_id), 16, 'right') + '\n';
        if (!manualCardEntry && finalTransaction?.aid != '0') {
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
        if (manualCardEntry && finalTransaction?.transactionStatus == 'Approved') {
            receipt += '\n\n' + makeStringCenter('I AGREE TO PAY ABOVE TOTAL', 31, 'center') + '\n';
            receipt += makeStringCenter('AMOUNT ACCORDING TO CARD ISSUER', 31, 'center') + '\n';
            receipt += makeStringCenter('AGREEMENT (MERCHANT AGREEMENT', 31, 'center') + '\n';
            receipt += makeStringCenter('IF CREDIT VOUCHER)', 31, 'center') + '\n';
        } else {
            receipt += makeStringCenter('Application Label:', 19, 'left') + makeStringCenter(manualCardEntry ? 'CREDIT' : finalTransaction?.card_type, 13, 'right') + '\n';

            receipt += makeStringCenter('Application Pref.Name:', 22, 'left') + makeStringCenter(finalTransaction?.type, 10, 'right') + '\n';
            if (finalTransaction?.aid != '0') receipt += makeStringCenter('AID:', 16, 'left') + makeStringCenter(finalTransaction?.aid, 16, 'right') + '\n';
            if (finalTransaction?.tvr != '0') receipt += makeStringCenter('TVR:', 16, 'left') + makeStringCenter(finalTransaction?.tvr, 16, 'right') + '\n';
        }

        let receipt2 = '';

        if (manualCardEntry && finalTransaction?.transactionStatus == 'Approved') {
            if (signature) {
                receipt2 += makeStringCenter('X_______________________', 31, 'center') + '\n';
                receipt2 += makeStringCenter('SIGNATURE', 31, 'center') + '\n\n';
                receipt2 += makeStringCenter('00_' + finalTransaction?.transactionStatus + '_' + finalTransaction.responseCode, 31, 'center') + '\n';

                receipt2 += makeStringCenter('MERCHANT COPY', 31, 'center') + '\n';

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
                receipt += makeStringCenter('00_' + finalTransaction?.transactionStatus + '_' + finalTransaction.responseCode, 31, 'center') + '\n';

                receipt += makeStringCenter('MERCHANT COPY', 31, 'center') + '\n';
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
            if (orderData.entry_mode !== 'T' && orderData.entry_mode != 'S' && !manualCardEntry) {
                receipt += makeStringCenter('PIN VERIFIED', 31, 'center') + '\n';
            }
            receipt += makeStringCenter('00_' + finalTransaction?.transactionStatus + '_' + finalTransaction.responseCode, 31, 'center') + '\n';

            receipt += makeStringCenter('MERCHANT COPY', 31, 'center') + '\n';

            if (printerConfiguration?.receipt_footer_lines?.value) {
                Object.keys(printerConfiguration?.receipt_footer_lines).map(key => {
                    if (key !== 'value' && printerConfiguration?.receipt_footer_lines[key]) {
                        receipt += makeStringCenter(`${printerConfiguration?.receipt_footer_lines[key]}`, 31, 'center') + '\n';
                    }
                });
            }
        }

        console.log('receipttt.....', receipt);

        Pax.printStr('', '', receipt, Pax.FULL_CUT, '', printerConfiguration?.receipt_header_lines?.line_1);

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
    };

    const printDeclinedReceipt = async (transactionObject: any) => {
        declinedReceipt(transactionObject, manualCardEntry, signature);
    };

    const checkFlags = async (transactionRes: any) => {
        clearTimeout(transactionTimeout.current);

        var todayDate = new Date();
        let date = todayDate.toLocaleDateString('en-US');

        let invoiceNumber = '';
        if (invoiceConfig?.auto_increment?.value) {
            invoiceNumber = getNewInvoiceNumber();
        } else {
            invoiceNumber = orderData.invoiceNumber;
        }

        let todayTime = new Date();
        let time = todayTime.getHours() + ':' + todayTime.getMinutes() + ':' + todayTime.getSeconds();
        if (flag === 'Processing') {
            const transactionObject = {
                card_type: orderData?.cType,
                terminal_id: '10015843',
                merchant_id: '136200499100000',
                card_number: orderData?.cardNumber,
                type: orderData.cardType === 'debit' ? 'DEBIT' : 'CREDIT',
                account_type: orderData?.accountType ? orderData.accountType : '',
                invoice_no: invoiceNumber,
                sale_amount: parseFloat(orderData.orderAmount),
                tip_amount: isRefund ? 0 : parseFloat(orderData.tip),
                surcharge_amount: isRefund
                    ? 0
                    : surchargeConfig?.debit_surcharge?.value || surchargeConfig?.credit_surcharge?.value
                    ? orderData?.cardType === 'debit' && surchargeConfig?.debit_surcharge?.value
                        ? parseFloat(surcharge)
                        : orderData?.cardType === 'credit' && surchargeConfig?.credit_surcharge?.value
                        ? (parseFloat(orderData.orderAmount) / 100) * parseFloat(surcharge)
                        : 0
                    : 0,
                clerk_id: orderData?.clerkId,
                user_id: loggedInUser?._id ?? 'XXXX',
                pos_id: loggedInUser?._id ?? 'XXXX',
                service_code: '' ?? 'XXXX',
                time: time ?? 'XXXX',
                date: date ?? 'XXXX',
                entry_mode: manualCardEntry ? 'M' : orderData?.entry_mode ?? 'XXXX',
                transaction_no: invoiceNumber ?? 'XXXX',
                auth_no: manualCardEntry ? '0' : transactionRes?.['Authorization identification response'] ?? '0',
                reference_id: transactionRes?.['Retrieval reference number'] ?? 'XXXXX',
                batch_no: '001',
                is_auto_invoice: invoiceConfig?.auto_increment?.value,
                status: isRefund ? 'Refunded' : 'Sale',
                created_at: new Date(),
                aid: manualCardEntry ? '0' : transactionRes?.['aid'] ?? '0',
                tid: manualCardEntry ? '0' : transactionRes?.['tid'] ?? '0',
                tvr: manualCardEntry ? '0' : transactionRes?.['tvr'] ?? '0',
                tsi: manualCardEntry ? '0' : transactionRes?.['tsi'] ?? '0',
                responseCode: transactionRes?.['Response code'].substring(0, 3) ?? '',
                trace_id: transactionRes?.['System trace audit number'],
                transactionStatus: transactionRes?.['Response code'].substring(0, 3) == '000' ? 'Approved' : 'Declined',
            };

            if (!terminal_mode?.demo_mode?.value) {
                let res = createTransaction(transactionObject);
            }
            dispatch(setFinalTransaction(transactionObject));

            let errorMessage = '';
            let responseCode = transactionObject?.responseCode.substring(0, 3);
            dispatch(setTxn({}));

            if (responseCode == '000' || terminal_mode?.demo_mode?.value) {
                setFlag('Approved');
                dispatch(setPrePrinted(false));
            } else {
                errorList.map(el => {
                    if (responseCode == el.code) {
                        console.log('el......', el);
                        errorMessage = el.message;
                        setNotifyType('error');
                        setOverlayVisible(true);
                        ref.current.alertWithType('custom', errorMessage, '');
                        setTimeout(() => {
                            setOverlayVisible(false);
                            printDeclinedReceipt(transactionObject);
                            dispatch(setPrePrinted(false));

                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0, // Reset to the first screen in the stack
                                    routes: [{ name: 'TransactionMenu' }], // Navigate to the specified screen
                                })
                            );
                        }, 5000);
                        return;
                    } else {
                        errorMessage = 'Something Went Wrong';
                    }
                });

                console.log('founddd.....', errorMessage);
            }
        }
    };

    return (
        <View style={{ ...GST.MAIN, backgroundColor: '#fff' }}>
            {overlayVisible ? (
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
            ) : (
                <ProcessingHeader />
            )}
            {overlayVisible && (
                <View style={style.contentView}>
                    <AppText defaultTextColor title={languagePicker(language, 'Printing...')} size={Typography.FONTS.SIZE.XXLARGE} />
                </View>
            )}
            {!overlayVisible && <ImageViewWrapper flag={flag} type={type} viewStyle={{ ...GST.MAIN }} />}
        </View>
    );
};

export default LoadingProcess;
