import React, { useState, useEffect, useRef } from 'react';
import { GST, RF } from '@theme';
import { backArrow, cross, curvePoint, exclaimation, good, tick } from '@assets';
import { navigate, updateConfigurations } from '@services';
import { View, ScrollView } from 'react-native';
import { AppHeader, AppText, AppTextInput, Toggle_Box, Wrapper, ErrorHeader, PrimaryButton, SuccessHeader, Overlay } from '@components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTheme } from '@react-navigation/native';
import useStyles from './style';
import { useDispatch, useSelector } from 'react-redux';
import { languagePicker } from '@utils';
import { setTms_settings } from '@redux';

const EditFooterLines = ({ navigation }: any) => {
    const language = useSelector((state: any) => state.user.languageType);
    const { tms_settings } = useSelector((state: any) => state.pr);

    const footer_lines = tms_settings?.printer?.receipt_footer_lines;
    const [footerObj, setFoorterObj] = useState(footer_lines);
    const dispatch = useDispatch();

    const theme: any = useTheme();
    const style = useStyles(theme.colors);
    useEffect(() => {}, []);

    const handleUpdateLines = async (type: any, text: any) => {
        const cloneFooter = JSON.parse(JSON.stringify(footerObj));

        Object.keys(footerObj).map(key => {
            if (key == type) {
                cloneFooter[key] = text;
            }
        });

        setFoorterObj(cloneFooter);
    };

    const handleConfirm = async () => {
        const cloneSettings = JSON.parse(JSON.stringify(tms_settings));

        cloneSettings.printer.receipt_footer_lines['line_1'] = footerObj?.line_1;
        cloneSettings.printer.receipt_footer_lines['line_2'] = footerObj?.line_2;
        cloneSettings.printer.receipt_footer_lines['line_3'] = footerObj?.line_3;
        cloneSettings.printer.receipt_footer_lines['line_4'] = footerObj?.line_4;
        cloneSettings.printer.receipt_footer_lines['line_5'] = footerObj?.line_5;
        cloneSettings.printer.receipt_footer_lines['line_6'] = footerObj?.line_6;

        dispatch(setTms_settings(cloneSettings));
        let response = await updateConfigurations({ configuration: cloneSettings });
        if (response) {
            navigate('PrinterConfiguration', { type: 'editFooter' });
        }
    };
    return (
        //   <ErrorHeader
        //   source={curvePoint}
        //   tintColor={"#000"}
        //   colorText={theme?.colors?.black}
        //   title={"Footer Text Updated!"}
        //   titleImage={good}
        //   imageStyle={{marginTop:-30}}
        // />
        <Wrapper isPaddingH isTop>
            <AppHeader title={languagePicker(language, 'Edit Footer Lines')} showLeftIcon source={cross} backAction={() => navigate('Admin_Settings', { type: '' })} />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <View style={{ padding: RF(20) }}>
                    <AppTextInput
                        title={languagePicker(language, 'Footer Line') + ' 1'}
                        placeholder={languagePicker(language, 'Enter Text')}
                        // secureTextEntry={true}
                        value={footerObj?.line_1}
                        onChangeText={(txt: any) => handleUpdateLines('line_1', txt)}
                    />
                    <View style={style.topMarginView} />
                    <AppTextInput
                        title={languagePicker(language, 'Footer Line') + ' 2'}
                        placeholder={languagePicker(language, 'Enter Text')}
                        // secureTextEntry={true}
                        value={footerObj?.line_2}
                        onChangeText={(txt: any) => handleUpdateLines('line_2', txt)}
                    />
                    <View style={style.topMarginView} />
                    <AppTextInput
                        title={languagePicker(language, 'Footer Line') + ' 3'}
                        placeholder={languagePicker(language, 'Enter Text')}
                        // secureTextEntry={true}
                        value={footerObj?.line_3}
                        onChangeText={(txt: any) => handleUpdateLines('line_3', txt)}
                    />
                    <View style={style.topMarginView} />
                    <AppTextInput
                        title={languagePicker(language, 'Footer Line') + ' 4'}
                        placeholder={languagePicker(language, 'Enter Text')}
                        // secureTextEntry={true}
                        value={footerObj?.line_4}
                        onChangeText={(txt: any) => handleUpdateLines('line_4', txt)}
                    />
                    <View style={{ marginTop: RF(20) }} />
                    <AppTextInput
                        title={languagePicker(language, 'Footer Line') + ' 5'}
                        placeholder={languagePicker(language, 'Enter Text')}
                        // secureTextEntry={true}
                        value={footerObj?.line_5}
                        onChangeText={(txt: any) => handleUpdateLines('line_5', txt)}
                    />
                    <View style={{ marginTop: RF(20) }} />
                    <AppTextInput
                        title={languagePicker(language, 'Footer Line') + ' 6'}
                        placeholder={languagePicker(language, 'Enter Text')}
                        // secureTextEntry={true}
                        value={footerObj?.line_6}
                        onChangeText={(txt: any) => handleUpdateLines('line_6', txt)}
                        onSubmitEditing={() => navigation.navigate('PrinterConfiguration')}
                    />

                    <PrimaryButton title={languagePicker(language, 'Confirm')} buttonStyle={style.btn} bgColor={theme?.colors?.text} onPress={handleConfirm} />
                </View>
            </KeyboardAwareScrollView>
        </Wrapper>
    );
};

export default EditFooterLines;
