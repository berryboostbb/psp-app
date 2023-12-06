import { RF, Typography } from '@theme';
import useStyles from './styles';
import React, { useState, useEffect } from 'react';
import { backArrow, cross } from '@assets';
import { useTheme } from '@react-navigation/native';
import { Wrapper, AppHeader, Toggle_Box, AppText, Pressable_Box } from '@components';
import { ScrollView } from 'react-native';
import { languagePicker } from '@utils';
import { useDispatch, useSelector } from 'react-redux';
import { lan_convert, setTms_settings } from '@redux';
import { navigate, updateConfigurations } from '@services';

const Language = ({ navigation }: any) => {
    const myTheme: any = useTheme();
    const dispatch = useDispatch();
    const styles = useStyles(myTheme.colors);
    const language = useSelector((state: any) => state.user.languageType);

    const [semi, setSemi] = useState(false);
    const [clerk, setClerk] = useState(false);
    const [manual, setManual] = useState(false);
    const [demo, setDemo] = useState(false);

    const { tms_settings } = useSelector((state: any) => state.pr);

    const language_and_terminal_mode = tms_settings?.terminal_configuration?.language_and_terminal_mode;
    const terminal_language = tms_settings?.terminal_configuration?.language_and_terminal_mode?.terminal_language;
    const terminal_mode = tms_settings?.terminal_configuration?.language_and_terminal_mode?.terminal_mode;

    // console.log(
    //   tms_settings?.terminal_configuration,
    //   "terminal_languageterminal_language",
    //   terminal_language
    // );

    const handleLanguage = async () => {
        const cloneSettings = JSON.parse(JSON.stringify(tms_settings));

        cloneSettings.terminal_configuration.language_and_terminal_mode.terminal_language['english'].value =
            !cloneSettings.terminal_configuration.language_and_terminal_mode?.terminal_language['english']?.value;

        cloneSettings.terminal_configuration.language_and_terminal_mode.terminal_language['french'].value =
            !cloneSettings.terminal_configuration.language_and_terminal_mode?.terminal_language['french']?.value;

        if (cloneSettings.terminal_configuration.language_and_terminal_mode.terminal_language['english'].value) {
            dispatch(lan_convert('eng'));
        } else {
            dispatch(lan_convert('fr'));
        }
        let response = await updateConfigurations({ configuration: cloneSettings });
        dispatch(setTms_settings(cloneSettings));
    };

    const handleDemoMode = async () => {
        const cloneSettings = JSON.parse(JSON.stringify(tms_settings));

        cloneSettings.terminal_configuration.language_and_terminal_mode.terminal_mode['demo_mode'].value =
            !cloneSettings.terminal_configuration.language_and_terminal_mode.terminal_mode['demo_mode'].value;

        let response = await updateConfigurations({ configuration: cloneSettings });

        dispatch(setTms_settings(cloneSettings));
    };

    return (
        <Wrapper isPaddingH isTop>
            <AppHeader title={languagePicker(language, 'Language & Terminal')} showLeftIcon source={cross} backAction={() => navigate('Admin_Settings', { type: '' })} />

            <ScrollView showsVerticalScrollIndicator={false}>
                {language_and_terminal_mode?._v && (
                    <>
                        <AppText title={languagePicker(language, 'Terminal Language')} size={Typography.FONTS.SIZE.XLARGE} defaultTextColor center medium textStyle={{ marginTop: RF(30) }} />
                        <Toggle_Box
                            heading={'English'}
                            isEnabled={terminal_language?.english?.value}
                            disabled={language_and_terminal_mode?._l}
                            subHeading={terminal_language?.english?.value ? languagePicker(language, 'ENABLED') : languagePicker(language, 'DISABLED')}
                            onToggle={handleLanguage}
                        />
                        <Toggle_Box
                            isEnabled={terminal_language?.french?.value}
                            disabled={language_and_terminal_mode?._l}
                            subHeading={terminal_language?.french?.value ? languagePicker(language, 'ENABLED') : languagePicker(language, 'DISABLED')}
                            onToggle={handleLanguage}
                            heading={'French'}
                        />
                    </>
                )}

                {language_and_terminal_mode?._v && (
                    <>
                        <AppText medium center defaultTextColor title={languagePicker(language, 'Terminal Mode')} size={Typography.FONTS.SIZE.XLARGE} textStyle={{ marginTop: RF(30) }} />

                        <Toggle_Box
                            isEnabled={terminal_mode?.demo_mode?.value}
                            disabled={language_and_terminal_mode?._l}
                            subHeading={terminal_mode?.demo_mode?.value ? languagePicker(language, 'ENABLED') : languagePicker(language, 'DISABLED')}
                            onToggle={handleDemoMode}
                            heading={languagePicker(language, 'Demo Mode')}
                        />
                    </>
                )}
            </ScrollView>
        </Wrapper>
    );
};

export default Language;
