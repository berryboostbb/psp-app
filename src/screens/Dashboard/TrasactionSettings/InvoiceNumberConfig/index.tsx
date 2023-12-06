import React, { useState } from 'react';
import { RF, Typography } from '@theme';
import { backArrow, cross } from '@assets';
import { ScrollView, View } from 'react-native';
import { navigate, updateConfigurations } from '@services';
import { AppHeader, AppText, Pressable_Box, Toggle_Box, Wrapper } from '@components';
import { setSettings, setTms_settings } from '@redux';
import { languagePicker } from '@utils';
import { useDispatch, useSelector } from 'react-redux';
const InvoiceNumberConfig = () => {
    const language = useSelector((state: any) => state.user.languageType);
    const { flowType } = useSelector((state: any) => state.user);
    const { tms_settings } = useSelector((state: any) => state.pr);
    const invoiceConfig = tms_settings?.transaction_settings?.invoice_number;

    const dispatch = useDispatch();

    const handleToggle = async (type: any) => {
        const cloneSettings = JSON.parse(JSON.stringify(tms_settings));

        cloneSettings.transaction_settings.invoice_number['auto_increment'].value = !cloneSettings.transaction_settings.invoice_number['auto_increment'].value;

        cloneSettings.transaction_settings.invoice_number['manual_entry'].value = !cloneSettings.transaction_settings.invoice_number['manual_entry'].value;

        let response = await updateConfigurations({ configuration: cloneSettings });

        dispatch(setTms_settings(cloneSettings));
    };

    return (
        <Wrapper isPaddingH isTop>
            <AppHeader title={languagePicker(language, 'Invoice Number Config')} showLeftIcon source={cross} backAction={() => navigate('Admin_Settings', { type: '' })} />

            <View style={{ marginTop: RF(30) }} />
            {/* <Toggle_Box
        isEnabled={invoiceObj?.isEnabled}
        heading={languagePicker(language, "Invoice Number")}
        subHeading={
          invoiceObj.isEnabled
            ? languagePicker(language, "ENABLED")
            : languagePicker(language, "DISABLED")
        }
        onToggle={handleMainToggle}
      /> */}
            {/* <AppText
        center
        title={languagePicker(language, "Select")}
        size={Typography.FONTS.SIZE.XLARGE}
        textStyle={{ marginTop: RF(30) }}
      /> */}

            <Toggle_Box
                isEnabled={invoiceConfig?.auto_increment?.value}
                heading={languagePicker(language, 'Auto Increment')}
                subHeading={invoiceConfig?.auto_increment?.value ? languagePicker(language, 'ENABLED') : languagePicker(language, 'DISABLED')}
                onToggle={() => handleToggle('auto_increment')}
            />
            <Toggle_Box
                isEnabled={invoiceConfig?.manual_entry?.value}
                heading={languagePicker(language, 'Manual Entry')}
                subHeading={invoiceConfig?.manual_entry?.value ? languagePicker(language, 'ENABLED') : languagePicker(language, 'DISABLED')}
                onToggle={() => handleToggle('manual_entry')}
            />
        </Wrapper>
    );
};

export default InvoiceNumberConfig;
