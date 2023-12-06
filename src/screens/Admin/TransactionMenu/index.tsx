import { logo, gToB_Linear, tick, exclaimation, green } from '@assets';
import useStyles from './style';
import { Text, View, NativeModules } from 'react-native';
import { navigate } from '@services';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp, useRoute, useTheme } from '@react-navigation/native';
import SInfo from 'react-native-sensitive-info';
import { Wrapper, LinearButton, CurveHeader, AppText, TouchInactivityDetector, Overlay, SuccessHeader, ErrorHeader, MiniOverlay } from '@components';
import { RF } from '@theme';
import { useIsFocused } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Pax from 'react-native-pax-library';
var currencyFormatter = require('currency-formatter');
import { languagePicker, makeStringCenter } from '@utils';
import { setIsRefund, setNotifyConfigUpdate, setTms_settings, store } from '@redux';
import io from 'socket.io-client';
import useTransactionList from '../../../db/hooks/useTransactionList';

import printCancelReceipt from '../../../shared/utils/cancelReceipt';

let socket: any = {};
interface Props {
    navigation: any;
    route: RouteProp<{
        params: {
            type?: any;
        };
    }>;
}
const TransactionMenu = ({ navigation, route }: Props) => {
    const dispatch = useDispatch();
    const language = useSelector((state: any) => state.user.languageType);
    const myTheme: any = useTheme();
    const styles = useStyles(myTheme.colors);
    const [onClick, setOnClick] = useState<any>('sale');
    const [receiptDetail, setReceiptDetail] = useState<any>(null);
    const [printerError, showPrinterError] = useState<any>(false);

    const { internet_Connected } = useSelector((state: any) => state.user);
    const intervalRef = useRef<any>(null);
    const { notifyConfigUpdate, updatedConfigs } = useSelector((state: any) => state.tms);
    const { tms_settings } = useSelector((state: any) => state.pr);

    const ref: any = useRef();

    const isFocused = useIsFocused();
    const { PaxPaymentModule } = NativeModules;

    const surchargeConfig = tms_settings?.transaction_settings?.surcharge;
    const tipConfig = tms_settings?.transaction_settings?.tip_configuration;
    const printerConfiguration = tms_settings?.printer;
    const { cancelReceiptGlobal, customerReceipt } = printCancelReceipt();
    const { getLatestTransaction } = useTransactionList();

    const [successOverlayVisible, setSuccessOverlayVisible] = useState(false);

    const showUpdate = () => {
        setSuccessOverlayVisible(true);

        setTimeout(() => {
            setSuccessOverlayVisible(false);
        }, 3000);
    };

    // TODO: remove after testing
    // useEffect(() => {
    //     const logMode = true;
    //     const encryptionFlag = '0'; // Set to 1 if encryption is enabled
    //     const tagList = '5F2A5F348284959A9C9F029F039F099F109F1A9F1E9F269F279F339F349F359F369F3750';
    //     const emvConfig = '07';

    //     // PaxPaymentModule.init('100', 'Sale', logMode, encryptionFlag, tagList, emvConfig, getData);
    //     PaxPaymentModule.init('100', 'Sale', logMode, encryptionFlag, tagList, emvConfig, (re: string) => console.log(JSON.parse(re)));
    // }, []);

    // const getData = async (response: string) => {
    //     let data = JSON.parse(response);
    //     let accountNumber = data.PAN;
    //     let encryptionType = '1';
    //     let keySlot = '1';
    //     const tagList = '5F2A5F348284959A9C9F029F039F099F109F1A9F1E9F269F279F339F349F359F369F3750';

    //     console.log({ accountNumber, encryptionType, keySlot });

    //     await PaxPaymentModule.updatedAuthorizeCard('100', accountNumber, encryptionType, keySlot, tagList, re => {
    //         console.log({ re });
    //     });
    // };

    React.useEffect(() => {
        if (isFocused) {
            setOnClick('sale');
            updateSettings();
        }
    }, [navigation, notifyConfigUpdate, isFocused]);

    const updateSettings = () => {
        console.log('ccc.........', updatedConfigs);
        if (notifyConfigUpdate) {
            dispatch(setTms_settings(updatedConfigs));
            showUpdate();
            setTimeout(() => {
                dispatch(setNotifyConfigUpdate(false));
            }, 5000);
        }
    };
    const transactionCallback = () => {
        console.log('transactionCallbacktransactionCallback');
    };

    const setPrinterError = status => {
        if (status == 0) {
            if (receiptDetail.transactionStatus === 'Cancel') {
                cancelReceiptGlobal(receiptDetail);
            } else initPrinter();
        } else {
            console.log('Out of paper');
            showPrinterError(true);
            ref.current.alertWithType('custom', 'Printer out of paper', '');
            setTimeout(() => {
                showPrinterError(false);
            }, 7000);
        }
    };

    const on_Click = async (type: any) => {
        setOnClick(type);
        setTimeout(async () => {
            if (type === 'refund') {
                dispatch(setIsRefund(true));
                navigate('ClerkId', { type: 'refund' });
            }

            if (type === 'reprint_receipt') {
                let res = getLatestTransaction();
                if (res === undefined) {
                    console.log('DATA IS NOT DEFINED');
                    return;
                }
                console.log('Latest Transaction: ', res);
                setReceiptDetail(res);
            }

            if (type === 'admin_menu') {
                navigate('Dashboard');
            }
            if (type == 'sale') {
                dispatch(setIsRefund(false));
                navigate('ClerkId', { type: onClick });
            }
            setOnClick('');
        }, 100);
    };
    React.useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    React.useEffect(() => {
        if (receiptDetail != null) {
            console.log(receiptDetail.transactionStatus, 'receiptDetail.transactionStatus');
            PaxPaymentModule.checkPrinterStatus(status => setPrinterError(status));
        }
    }, [receiptDetail]);

    const initPrinter = async () => {
        let receipt = '';

        Object.keys(printerConfiguration?.receipt_header_lines).map(key => {
            if (key !== 'value' && printerConfiguration?.receipt_header_lines[key] && key !== 'line_1') {
                receipt += makeStringCenter(`${printerConfiguration?.receipt_header_lines[key]}`, 31, 'center') + '\n';
            }
        });
        receipt += makeStringCenter('                              ', 31, 'center') + '\n';

        receipt += makeStringCenter('Clerk ID:', 13, 'left') + makeStringCenter(receiptDetail?.clerk_id?.toString() ?? '', 19, 'right') + '\n';
        receipt += makeStringCenter(`Date:${receiptDetail?.date}`, 16, 'left') + makeStringCenter(`Time:${receiptDetail?.time}`, 16, 'right') + '\n';

        receipt += makeStringCenter('Invoice #', 16, 'left') + makeStringCenter(receiptDetail?.invoice_no?.toUpperCase() ? receiptDetail?.invoice_no?.toUpperCase() : '', 16, 'right') + '\n';
        console.log('resceipt.....', 'receiptDetail');

        receipt += makeStringCenter(receiptDetail?.status == 'Refunded' ? 'Refund' : 'Sale', 31, 'center') + '\n\n';

        receipt +=
            makeStringCenter(receiptDetail?.entry_mode == 'M' ? 'CREDIT' : receiptDetail?.card_type, 16, 'left') +
            makeStringCenter(padFunction(receiptDetail?.card_number.substring(8)), 16, 'right') +
            '\n';

        receipt +=
            makeStringCenter('Entry Method', 19, 'left') +
            makeStringCenter(receiptDetail?.entry_mode == 'S' ? 'SWIPE' : receiptDetail?.entry_mode == 'T' ? 'TAP' : receiptDetail?.entry_mode == 'M' ? 'MANUAL' : 'CHIP', 13, 'right') +
            '\n';

        if (receiptDetail?.type === 'DEBIT') {
            receipt += makeStringCenter('Account Type:', 16, 'left') + makeStringCenter(receiptDetail?.entry_mode == 'T' ? 'DEFAULT' : receiptDetail?.account_type, 16, 'right') + '\n';
        }
        receipt += makeStringCenter('Ref.#', 16, 'left') + makeStringCenter(receiptDetail?.reference_id ? receiptDetail?.reference_id : '', 16, 'right') + '\n';
        if (receiptDetail?.auth_no != '0') receipt += makeStringCenter('Auth.#:', 16, 'left') + makeStringCenter(receiptDetail?.auth_no ? String(receiptDetail?.auth_no) : '', 16, 'right') + '\n';

        receipt +=
            makeStringCenter('Amount:', 19, 'left') +
            makeStringCenter(
                currencyFormatter.format(receiptDetail?.sale_amount ? receiptDetail?.sale_amount : '', {
                    code: 'CAD',
                }),
                13,
                'right'
            ) +
            '\n';

        if (receiptDetail?.status !== 'Refunded') {
            if (tipConfig?.tip_screen?.value) {
                receipt +=
                    makeStringCenter('TIP:', 19, 'left') +
                    makeStringCenter(
                        currencyFormatter.format(
                            receiptDetail?.tip_amount ? receiptDetail?.tip_amount : '',

                            {
                                code: 'CAD',
                            }
                        ),

                        13,

                        'right'
                    ) +
                    '\n';
            }
        }
        if (receiptDetail?.status !== 'Refunded' && parseFloat(receiptDetail?.surcharge_amount) > 0) {
            if (surchargeConfig?.debit_surcharge?.value || surchargeConfig?.credit_surcharge?.value) {
                receipt +=
                    makeStringCenter('Surcharge:', 19, 'left') +
                    makeStringCenter(
                        currencyFormatter.format(receiptDetail?.surcharge_amount ? receiptDetail?.surcharge_amount : '', {
                            code: 'CAD',
                        }),
                        13,
                        'right'
                    ) +
                    '\n';
            }
        }
        receipt += makeStringCenter('_________________________________', 31, 'center') + '\n';
        receipt +=
            makeStringCenter('Total:', 16, 'left') +
            makeStringCenter(
                currencyFormatter.format(parseFloat(receiptDetail?.surcharge_amount) + parseFloat(receiptDetail?.tip_amount) + parseFloat(receiptDetail?.sale_amount), {
                    code: 'CAD',
                }),
                16,
                'right'
            ) +
            '\n';

        receipt += makeStringCenter('Application Label:', 19, 'left') + makeStringCenter(receiptDetail?.entry_mode == 'M' ? 'CREDIT' : receiptDetail?.card_type, 13, 'right') + '\n';

        receipt += makeStringCenter('Application Pref.Name:', 22, 'left') + makeStringCenter(receiptDetail?.type, 10, 'right') + '\n';
        if (receiptDetail?.aid != '0') receipt += makeStringCenter('AID:', 16, 'left') + makeStringCenter(receiptDetail?.aid, 16, 'right') + '\n';

        if (receiptDetail?.tvr != '0') receipt += makeStringCenter('TVR:', 16, 'left') + makeStringCenter(receiptDetail?.tvr, 16, 'right') + '\n';

        if (receiptDetail?.tsi != '0') receipt += makeStringCenter('TSI:', 16, 'left') + makeStringCenter(receiptDetail?.tsi, 16, 'right') + '\n';
        if (receiptDetail?.entry_mode !== 'T' && receiptDetail?.entry_mode !== 'S' && receiptDetail?.entry_mode !== 'M') {
            receipt += makeStringCenter('PIN VERIFIED', 31, 'center') + '\n';
        }
        receipt += makeStringCenter('00_' + receiptDetail?.transactionStatus + '_' + receiptDetail.responseCode, 31, 'center') + '\n';

        receipt += makeStringCenter('Customer Copy'.toUpperCase(), 31, 'center') + '\n';

        if (printerConfiguration?.receipt_footer_lines?.value) {
            Object.keys(printerConfiguration?.receipt_footer_lines).map(key => {
                if (key !== 'value' && printerConfiguration?.receipt_footer_lines[key]) {
                    receipt += makeStringCenter(`${printerConfiguration?.receipt_footer_lines[key]}`, 31, 'center') + '\n';
                }
            });
        }
        let url = '';
        if (printerConfiguration?.customer_receipt?.value) {
            Pax.printStr('', url, receipt, Pax.FULL_CUT, '', printerConfiguration?.receipt_header_lines?.line_1);
            setOnClick('sale');
        }
    };
    const padFunction = (number: any) => {
        let string = String(number);
        let sliced = string.slice(-4);
        let mask = String(sliced).padStart(string.length, '*');
        return mask;
    };

    return (
        <Wrapper>
            <TouchInactivityDetector>
                <CurveHeader logoVisible source={logo} />
                {successOverlayVisible && (
                    <Overlay>
                        <ErrorHeader source={green} colorText={myTheme?.colors?.text} title={'Config Updated!'} titleImage={tick} />
                    </Overlay>
                )}

                {printerError && (
                    <Overlay>
                        <SuccessHeader ref={ref} ml={120} imageSrc={exclaimation} bgClr={'#D74120E5'} error={true} title_mT={90} />
                    </Overlay>
                )}

                {/* <View
          style={{
            flex: 1,
            position: "absolute",
            left: 0,
            top: 0,
            opacity: 0.9,
            backgroundColor: "black",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "red",
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>
              Blocked
            </Text>
          </View>
        </View> */}

                <View style={styles.mainView}>
                    <AppText title={languagePicker(language, 'Transaction Menu')} medium center size={22} defaultTextColor textStyle={{ marginBottom: RF(35) }} />
                    <LinearButton
                        src={gToB_Linear}
                        title={languagePicker(language, 'Sale')}
                        disabled={!internet_Connected && true}
                        type="sale"
                        onClick={!internet_Connected ? '' : onClick}
                        onPress={() => on_Click('sale')}
                    />
                    <LinearButton title={languagePicker(language, 'Refund')} type="refund" disabled={!internet_Connected && true} onClick={onClick} onPress={() => on_Click('refund')} />
                    <LinearButton
                        src={gToB_Linear}
                        title={languagePicker(language, 'Reprint Receipt')}
                        type="reprint_receipt"
                        disabled={!internet_Connected && true}
                        onPress={() => on_Click('reprint_receipt')}
                        onClick={onClick}
                    />
                    <LinearButton title={languagePicker(language, 'Admin Menu')} type="admin_menu" onPress={() => on_Click('admin_menu')} onClick={onClick} />
                </View>
            </TouchInactivityDetector>
        </Wrapper>
    );
};

export default TransactionMenu;
