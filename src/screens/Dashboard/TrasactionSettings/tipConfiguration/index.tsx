import React, { useState } from 'react';
import { RF, Typography } from '@theme';
import { backArrow, cross } from '@assets';
import { ScrollView, View } from 'react-native';
import { navigate, updateConfigurations } from '@services';
import { AppHeader, AppText, Pressable_Box, Toggle_Box, Wrapper } from '@components';
import { setSettings, setTms_settings } from '@redux';
import { languagePicker } from '@utils';
import { useDispatch, useSelector } from 'react-redux';
const Tip_Configuration = () => {
    const language = useSelector((state: any) => state.user.languageType);
    const { flowType } = useSelector((state: any) => state.user);
    const { tms_settings } = useSelector((state: any) => state.pr);
    const tipConfiguration = tms_settings?.transaction_settings?.tip_configuration;
    const dispatch = useDispatch();

    const handleEditPress = (type: any) => {
        navigate('Edit_Tip_Amount', {
            type: type,
        });
    };

    const handleToggle = async (type: any) => {
        const cloneSettings = JSON.parse(JSON.stringify(tms_settings));
        if (type == 'tip_screen') {
            cloneSettings.transaction_settings.tip_configuration.tip_screen.value = !cloneSettings.transaction_settings.tip_configuration.tip_screen.value;

            if (!cloneSettings.transaction_settings.tip_configuration.tip_screen.value) {
                cloneSettings.transaction_settings.tip_configuration.percentage_tip_amount.value = false;

                cloneSettings.transaction_settings.tip_configuration.dollar_tip_amount.value = false;
            } else {
                cloneSettings.transaction_settings.tip_configuration.percentage_tip_amount.value = true;

                cloneSettings.transaction_settings.tip_configuration.dollar_tip_amount.value = true;
            }
        }

        if (type == 'percentage_tip_amount') {
            cloneSettings.transaction_settings.tip_configuration.percentage_tip_amount.value = !cloneSettings.transaction_settings.tip_configuration.percentage_tip_amount.value;

            if (!cloneSettings.transaction_settings.tip_configuration.percentage_tip_amount.value && !cloneSettings.transaction_settings.tip_configuration.dollar_tip_amount.value) {
                cloneSettings.transaction_settings.tip_configuration.tip_screen.value = false;
            } else {
                cloneSettings.transaction_settings.tip_configuration.tip_screen.value = true;
            }
        }

        if (type == 'dollar_tip_amount') {
            cloneSettings.transaction_settings.tip_configuration.dollar_tip_amount.value = !cloneSettings.transaction_settings.tip_configuration.dollar_tip_amount.value;

            if (!cloneSettings.transaction_settings.tip_configuration.percentage_tip_amount.value && !cloneSettings.transaction_settings.tip_configuration.dollar_tip_amount.value) {
                cloneSettings.transaction_settings.tip_configuration.tip_screen.value = false;
            } else {
                cloneSettings.transaction_settings.tip_configuration.tip_screen.value = true;
            }
        }

        let response = await updateConfigurations({ configuration: cloneSettings });

        dispatch(setTms_settings(cloneSettings));
    };

    return (
        <Wrapper isPaddingH isTop>
            <AppHeader title={languagePicker(language, 'Tip Configuration')} showLeftIcon source={cross} backAction={() => navigate('Admin_Settings', { type: '' })} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={{ marginTop: RF(30) }} />

                <Toggle_Box
                    isEnabled={tipConfiguration?.tip_screen?.value}
                    heading={languagePicker(language, 'Tip Screen')}
                    subHeading={tipConfiguration?.tip_screen?.value ? languagePicker(language, 'ENABLED') : languagePicker(language, 'DISABLED')}
                    onToggle={() => handleToggle('tip_screen')}
                />

                <>
                    <AppText center title={languagePicker(language, 'Select Tip Type')} size={Typography.FONTS.SIZE.XLARGE} textStyle={{ marginTop: RF(30) }} defaultTextColor />

                    <Toggle_Box
                        isEnabled={tipConfiguration?.percentage_tip_amount?.value}
                        heading={languagePicker(language, 'Percentage Tip Amounts')}
                        subHeading={tipConfiguration?.percentage_tip_amount?.value ? languagePicker(language, 'ENABLED') : languagePicker(language, 'DISABLED')}
                        pressableTitle={languagePicker(language, 'EDIT AMOUNT')}
                        onPressTitle={() => handleEditPress('percent')}
                        onToggle={() => handleToggle('percentage_tip_amount')}
                    />

                    <Toggle_Box
                        isEnabled={tipConfiguration?.dollar_tip_amount?.value}
                        heading={languagePicker(language, 'Dollar Tip Amounts')}
                        subHeading={tipConfiguration?.dollar_tip_amount?.value ? languagePicker(language, 'ENABLED') : languagePicker(language, 'DISABLED')}
                        pressableTitle={languagePicker(language, 'EDIT AMOUNT')}
                        onPressTitle={() => handleEditPress('dollar')}
                        onToggle={() => handleToggle('dollar_tip_amount')}
                    />
                </>
            </ScrollView>
        </Wrapper>
    );
};

export default Tip_Configuration;
