import React from 'react';
import { RF } from '@theme';
import { backArrow, cross } from '@assets';
import { View } from 'react-native';
import { navigate } from '@services';
import { AppHeader, Pressable_Box, Wrapper } from '@components';
import { languagePicker } from '@utils';
import { useSelector } from 'react-redux';

const Transaction_Settings = () => {
    const language = useSelector((state: any) => state.user.languageType);
    const { tms_settings } = useSelector((state: any) => state.pr);
    const transactionSettings = tms_settings?.transaction_settings;
    const onClick = (type: any) => {
        if (type === 'tip') {
            navigate('Tip_Configuration');
        } else if (type === 'cashback') {
            navigate('Cashback_Config');
        } else if (type === 'surcharge') {
            navigate('Surcharge_Config');
        } else if (type === 'invoiceConfig') {
            navigate('InvoiceNumberConfig');
        }
    };

    return (
        <Wrapper isPaddingH isTop>
            <AppHeader title={languagePicker(language, 'Transactions Settings')} showLeftIcon source={cross} backAction={() => navigate('Admin_Settings', { type: '' })} />
            <View style={{ marginTop: RF(30) }} />
            {transactionSettings?.tip_configuration?._v && (
                <Pressable_Box disable={transactionSettings?.tip_configuration?._l} title={languagePicker(language, 'Tip Configuration')} onPress={() => onClick('tip')} />
            )}

            {transactionSettings?.surcharge?._v && <Pressable_Box disable={transactionSettings?.surcharge?._l} title={languagePicker(language, 'Surcharge')} onPress={() => onClick('surcharge')} />}
            {/* <Pressable_Box
        title={languagePicker(language, "Cashback")}
        onPress={() => onClick("cashback")}
      /> */}

            {transactionSettings?.invoice_number?._v && (
                <Pressable_Box disable={transactionSettings?.invoice_number?._l} title={languagePicker(language, 'Invoice Number')} onPress={() => onClick('invoiceConfig')} />
            )}
        </Wrapper>
    );
};

export default Transaction_Settings;
