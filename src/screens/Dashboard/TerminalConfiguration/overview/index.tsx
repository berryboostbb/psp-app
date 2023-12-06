import React from 'react';
import { RF } from '@theme';
import { backArrow, cross } from '@assets';
import { View } from 'react-native';
import { navigate, updateConfigurations } from '@services';
import { AppHeader, Pressable_Box, Toggle_Box, Wrapper } from '@components';
import { languagePicker } from '@utils';
import { useDispatch, useSelector } from 'react-redux';
import { setSettings, setTms_settings } from '@redux';
const Terminal_Configuration = () => {
    const language = useSelector((state: any) => state.user.languageType);
    const { settings } = useSelector((state: any) => state.user);
    const { tms_settings } = useSelector((state: any) => state.pr);

    const terminalConfig = tms_settings?.terminal_configuration;
    const merchant_passcode = tms_settings?.terminal_configuration?.merchant_passcode;

    console.log('merchant_passcode', merchant_passcode);

    const dispatch = useDispatch();

    const onClick = (type: any) => {
        if (type === 'lang') {
            navigate('Language');
        } else if (type === 'clerk/serverList') {
            // navigate("ClerkServerMaintenance");
            navigate('Clerk_List');
        } else if (type === 'merchant_passcode') {
            navigate('MerchantPasscodeSettings');
        } else if (type === 'manager') {
            navigate('ManagerPassword');
        }
    };

    const handleToggle = async () => {
        const cloneSettings = JSON.parse(JSON.stringify(tms_settings));

        cloneSettings.terminal_configuration['merchant_passcode'].value = !cloneSettings.terminal_configuration['merchant_passcode'].value;

        let response = await updateConfigurations({ configuration: cloneSettings });

        dispatch(setTms_settings(cloneSettings));
    };

    return (
        <Wrapper isPaddingH isTop>
            <AppHeader title={languagePicker(language, 'Terminal Configuration')} showLeftIcon source={cross} backAction={() => navigate('Admin_Settings', { type: '' })} />
            <View style={{ marginTop: RF(30) }} />

            {terminalConfig?.language_and_terminal_mode?._v && (
                <Pressable_Box disable={terminalConfig?.language_and_terminal_mode?._l} title={languagePicker(language, 'Language & Terminal Mode')} onPress={() => onClick('lang')} />
            )}

            {terminalConfig?.clerk_server_maintenance?._v && (
                <Pressable_Box disable={terminalConfig?.clerk_server_maintenance?._l} title={languagePicker(language, 'Clerk Server Maintenance')} onPress={() => onClick('clerk/serverList')} />
            )}

            {merchant_passcode?._v && (
                <Toggle_Box
                    isEnabled={merchant_passcode?.value}
                    disabled={merchant_passcode?._l}
                    heading={'Merchant Passcode'}
                    subHeading={merchant_passcode?.value ? 'Enabled' : 'Disabled'}
                    pressableTitle={'Edit Passcode'}
                    onPressTitle={() => navigate('MerchantPasscodeSettings')}
                    onToggle={handleToggle}
                />
            )}

            {/* 

      <Pressable_Box
        title={languagePicker(language, "Reset Merchant Passcode")}
        onPress={() => onClick("merchant_passcode")}
      /> */}

            {/* <Pressable_Box
        title={languagePicker(language, "Manager Password")}
        onPress={() => onClick("manager")}
      /> */}
        </Wrapper>
    );
};

export default Terminal_Configuration;
