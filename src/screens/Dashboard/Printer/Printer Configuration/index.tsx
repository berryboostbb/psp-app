import React, { useState, useEffect, useRef } from 'react';
import { RF } from '@theme';
import { backArrow, exclaimation, good, green, tick } from '@assets';
import { navigate, updateConfigurations } from '@services';
import { View, ScrollView } from 'react-native';
import { AppHeader, AppText, Overlay, SuccessHeader, Toggle_Box, Wrapper } from '@components';
import { RouteProp, useTheme } from '@react-navigation/native';
import useStyles from './style';
import { useDispatch, useSelector } from 'react-redux';
import { languagePicker } from '@utils';
import { setConfiguration, setSettings, setTms_settings } from '@redux';

interface Props {
    navigation: any;
    route: RouteProp<{
        params: {
            type?: any;
        };
    }>;
}

const PrinterConfiguration = ({ navigation, route }: Props) => {
    const language = useSelector((state: any) => state.user.languageType);
    const theme: any = useTheme();
    const { type } = route?.params;
    const style = useStyles(theme.colors);
    const [isEnabled, setIsEnabled] = useState<any>(false);
    const [prePrint, setPrePrint] = useState<any>();
    const [bothReceipt, setBothReceipt] = useState<any>(false);
    const dispatch = useDispatch();
    const [merchantReceipt, setMerchantReceipt] = useState<any>(false);
    const [customerReceipt, setCustomerReceipt] = useState<any>(false);
    const [recieptfooterLine, setRecieptfooterLine] = useState<any>(false);
    const { tms_settings } = useSelector((state: any) => state.pr);
    const printerConfiguration = tms_settings?.printer;
    const ref: any = useRef();
    const [notifyType, setNotifyType] = useState('');
    const [overlayVisible, setOverlayVisible] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (type == 'editFooter' && !overlayVisible) {
                overlay();
            }
            setTimeout(() => {
                setOverlayVisible(false);
            }, 10000);
        });
        return () => {
            unsubscribe;
        };
    }, [navigation]);

    const overlay = async () => {
        setNotifyType('success');
        await setOverlayVisible(true);
        ref?.current?.alertWithType('custom', 'Footer Text Updated!', '');
    };

    const handleToggle = async (type: any) => {
        const cloneSettings = JSON.parse(JSON.stringify(tms_settings));

        if (type == 'pre_print') {
            cloneSettings.printer.pre_print.value = !cloneSettings.printer.pre_print.value;
        }

        if (type == 'receipt_footer_lines') {
            cloneSettings.printer.receipt_footer_lines.value = !cloneSettings.printer.receipt_footer_lines.value;
        }

        dispatch(setTms_settings(cloneSettings));
        let response = await updateConfigurations({ configuration: cloneSettings });
    };

    const handleSubToggle = async (type: any) => {
        const cloneSettings = JSON.parse(JSON.stringify(tms_settings));

        if (type == 'both_receipt') {
            cloneSettings.printer.both_receipt.value = !cloneSettings.printer.both_receipt.value;

            if (!cloneSettings.printer.both_receipt.value) {
                cloneSettings.printer.merchant_receipt.value = false;
                cloneSettings.printer.customer_receipt.value = false;
            } else {
                cloneSettings.printer.merchant_receipt.value = true;
                cloneSettings.printer.customer_receipt.value = true;
            }
        } else {
            if (type == 'merchant_receipt') {
                cloneSettings.printer.merchant_receipt.value = !cloneSettings.printer.merchant_receipt.value;

                if (!cloneSettings.printer.merchant_receipt.value) {
                    cloneSettings.printer.both_receipt.value = false;
                }
            }

            if (type == 'customer_receipt') {
                cloneSettings.printer.customer_receipt.value = !cloneSettings.printer.customer_receipt.value;

                if (!cloneSettings.printer.customer_receipt.value) {
                    cloneSettings.printer.both_receipt.value = false;
                }
            }

            if (cloneSettings.printer.merchant_receipt.value && cloneSettings.printer.customer_receipt.value) {
                cloneSettings.printer.both_receipt.value = true;
            }
        }

        dispatch(setTms_settings(cloneSettings));
        let response = await updateConfigurations({ configuration: cloneSettings });
    };

    return (
        <>
            {overlayVisible && (
                <View style={{ zIndex: 10 }}>
                    <Overlay>
                        <SuccessHeader
                            ref={ref}
                            ml={notifyType == 'success' ? 120 : 120}
                            imageSrc={notifyType == 'success' ? good : exclaimation}
                            bgClr={notifyType == 'success' ? '#E3F8CFD9' : '#D74120E5'}
                            title_mT={notifyType == 'success' ? 92 : 90}
                            tintClr={notifyType == 'success' ? theme.colors.toggleColor : '#000'}
                            img_mT={notifyType == 'success' ? 102 : 97}
                        />
                    </Overlay>
                </View>
            )}
            <Wrapper isPaddingH isTop>
                <AppHeader title={languagePicker(language, 'Printer Configuration')} showLeftIcon source={backArrow} backAction={() => navigate('Admin_Settings', { type: '' })} />
                {/* <AppText
        title={languagePicker(language, "Debit Surcharge")}
        medium
        center
        textStyle={style.topMarginView}
        size={17}
        defaultTextColor
      /> */}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={style.toggleBoxView}>
                        <Toggle_Box
                            isEnabled={printerConfiguration?.pre_print?.value}
                            heading={languagePicker(language, 'Pre-Print')}
                            subHeading={printerConfiguration?.pre_print?.value ? languagePicker(language, 'ENABLED') : languagePicker(language, 'DISABLED')}
                            onToggle={() => {
                                handleToggle('pre_print');
                            }}
                        />
                        <Toggle_Box
                            isEnabled={printerConfiguration?.both_receipt?.value}
                            heading={languagePicker(language, 'Both Receipts')}
                            subHeading={printerConfiguration?.both_receipt?.value ? languagePicker(language, 'ENABLED') : languagePicker(language, 'DISABLED')}
                            onToggle={() => {
                                handleSubToggle('both_receipt');
                            }}
                        />
                        <Toggle_Box
                            isEnabled={printerConfiguration?.merchant_receipt?.value}
                            heading={'Merchant Receipt Only '}
                            subHeading={printerConfiguration?.merchant_receipt?.value ? languagePicker(language, 'ENABLED') : languagePicker(language, 'DISABLED')}
                            onToggle={() => handleSubToggle('merchant_receipt')}
                        />
                        <Toggle_Box
                            isEnabled={printerConfiguration?.customer_receipt?.value}
                            heading={'Customer Receipt Only'}
                            subHeading={printerConfiguration?.customer_receipt?.value ? languagePicker(language, 'ENABLED') : languagePicker(language, 'DISABLED')}
                            onToggle={() => handleSubToggle('customer_receipt')}
                        />
                        <Toggle_Box
                            isEnabled={printerConfiguration?.receipt_footer_lines?.value}
                            heading={languagePicker(language, 'Reciept Footer Lines')}
                            subHeading={printerConfiguration?.receipt_footer_lines?.value ? languagePicker(language, 'ENABLED') : languagePicker(language, 'DISABLED')}
                            pressableTitle={languagePicker(language, 'Edit Footer Text')}
                            onPressTitle={() => navigate('EditFooterLines')}
                            onToggle={() => handleToggle('receipt_footer_lines')}
                        />
                    </View>
                </ScrollView>
            </Wrapper>
        </>
    );
};

export default PrinterConfiguration;
