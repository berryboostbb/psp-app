import { RF } from '@theme';
import { backArrow, cross } from '@assets';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { AppHeader, Preset_Amount, PrimaryButton, Wrapper } from '@components';
import { RouteProp, useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setSettings, setTms_settings } from '@redux';
import { navigate, updateConfigurations } from '@services';
import useStyles from './styles';
import { languagePicker } from '@utils';
interface Props {
    type?: any;
    route: RouteProp<{
        params: {
            type?: any;
        };
    }>;
}

const Edit_Tip_Amount = (props: Props) => {
    const language = useSelector((state: any) => state.user.languageType);
    const { tms_settings } = useSelector((state: any) => state.pr);
    const tipConfiguration = tms_settings?.transaction_settings?.tip_configuration;
    const percentageTip = tipConfiguration.percentage_tip_amount;
    const dollarTip = tipConfiguration.dollar_tip_amount;

    const [amount_1, setAmount_1] = useState(dollarTip?.amount_1?.value);
    const [amount_2, setAmount_2] = useState(dollarTip?.amount_2?.value);
    const [amount_3, setAmount_3] = useState(dollarTip?.amount_3?.value);

    const [percent_1, setPercent_1] = useState(percentageTip.amount_1.value);
    const [percent_2, setPercent_2] = useState(percentageTip.amount_2.value);
    const [percent_3, setPercent_3] = useState(percentageTip.amount_3.value);

    const { type } = props?.route?.params;
    const dispatch = useDispatch();
    const theme: any = useTheme();
    const style = useStyles(theme.colors);

    const onChangePercent = async (text: any, typ: any, subType: any) => {
        if (subType == 'amount_1') {
            if (typ == 'percent') {
                setPercent_1(text);
            }
            if (typ == 'dollar') {
                setAmount_1(text);
            }
        }

        if (subType == 'amount_2') {
            if (typ == 'percent') {
                setPercent_2(text);
            }
            if (typ == 'dollar') {
                setAmount_2(text);
            }
        }

        if (subType == 'amount_3') {
            if (typ == 'percent') {
                setPercent_3(text);
            }
            if (typ == 'dollar') {
                setAmount_3(text);
            }
        }
    };

    const handleConfirm = async (typ: any) => {
        const cloneSettings = JSON.parse(JSON.stringify(tms_settings));

        if (typ == 'percent') {
            cloneSettings.transaction_settings.tip_configuration.percentage_tip_amount['amount_1'].value = percent_1;

            cloneSettings.transaction_settings.tip_configuration.percentage_tip_amount['amount_2'].value = percent_2;

            cloneSettings.transaction_settings.tip_configuration.percentage_tip_amount['amount_3'].value = percent_3;
        }

        if (typ == 'dollar') {
            cloneSettings.transaction_settings.tip_configuration.dollar_tip_amount['amount_1'].value = amount_1;

            cloneSettings.transaction_settings.tip_configuration.dollar_tip_amount['amount_2'].value = amount_2;

            cloneSettings.transaction_settings.tip_configuration.dollar_tip_amount['amount_3'].value = amount_3;
        }

        dispatch(setTms_settings(cloneSettings));
        let response = await updateConfigurations({ configuration: cloneSettings });
        navigate('Tip_Configuration');
    };

    return (
        <Wrapper isPaddingH isTop>
            <AppHeader title={languagePicker(language, 'Tip Configuration')} showLeftIcon source={cross} backAction={() => navigate('Admin_Settings', { type: '' })} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginTop: RF(30) }} />

                {type == 'percent' ? (
                    <>
                        <Preset_Amount
                            value={percent_1}
                            type={type}
                            title={languagePicker(language, 'Preset Percentage Amount') + ' 1'}
                            onChangeText={(text: any) => onChangePercent(text, type, 'amount_1')}
                        />

                        <Preset_Amount
                            value={percent_2}
                            type={type}
                            title={languagePicker(language, 'Preset Percentage Amount') + ' 2'}
                            onChangeText={(text: any) => onChangePercent(text, type, 'amount_2')}
                        />
                        <Preset_Amount
                            value={percent_3}
                            type={type}
                            title={languagePicker(language, 'Preset Percentage Amount') + ' 3'}
                            onChangeText={(text: any) => onChangePercent(text, type, 'amount_3')}
                        />
                    </>
                ) : (
                    <>
                        <Preset_Amount
                            value={amount_1}
                            type={type}
                            title={languagePicker(language, 'Preset Dollar Amount') + ' 1'}
                            onChangeText={(text: any) => onChangePercent(text, type, 'amount_1')}
                        />
                        <Preset_Amount
                            value={amount_2}
                            type={type}
                            title={languagePicker(language, 'Preset Dollar Amount') + ' 2'}
                            onChangeText={(text: any) => onChangePercent(text, type, 'amount_2')}
                        />
                        <Preset_Amount
                            value={amount_3}
                            type={type}
                            title={languagePicker(language, 'Preset Dollar Amount') + ' 3'}
                            onChangeText={(text: any) => onChangePercent(text, type, 'amount_3')}
                        />
                    </>
                )}

                <PrimaryButton title={languagePicker(language, 'Confirm')} buttonStyle={style.btn} bgColor={theme?.colors?.text} onPress={() => handleConfirm(type)} />
            </ScrollView>
        </Wrapper>
    );
};

export default Edit_Tip_Amount;
