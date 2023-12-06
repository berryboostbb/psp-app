import { RF, Typography } from '@theme';
import { backArrow, cross } from '@assets';
import { View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { AppHeader, AppText, CustomInput, ErrorText, Toggle_Box, Wrapper } from '@components';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setTms_settings } from '@redux';
import { navigate, updateConfigurations } from '@services';
import { languagePicker } from '@utils';

var currencyFormatter = require('currency-formatter');

const Surcharge_Config = () => {
    const language = useSelector((state: any) => state.user.languageType);
    const theme: any = useTheme();
    const dispatch = useDispatch();
    const { settings } = useSelector((state: any) => state.user);
    const { tms_settings } = useSelector((state: any) => state.pr);
    const surchargeConfig = tms_settings?.transaction_settings?.surcharge;
    let surchargeObj: any = null;
    settings.map((obj: any, index: any) => {
        if (index == 3) {
            surchargeObj = obj;
        }
    });
    const [surchargeValue, setSurchargeValue] = useState(surchargeObj?.debit_surcharge?.fee);
    const [surchargeLimit, setSurchargeLimit] = useState(surchargeObj?.debit_surcharge?.limit);

    const [transactionLimit, setTransactionLimit] = useState(false);

    const [errorText, setErrorText] = useState('');

    const [credit, setCredit] = useState(false);
    const [debit, setDebit] = useState(false);

    const [creditAmount, setCreditAmount] = useState<any>(surchargeObj?.credit_surcharge?.fee);

    const onPressTitle = (type: any) => {
        if (type === 'credit') {
            setCredit(!credit);
        } else if (type === 'debit') {
            setDebit(!debit);
        }
    };

    useEffect(() => {
        if (creditAmount) {
            setErrorText('');
        }
    }, [creditAmount]);

    const handleToggle = async (type: any) => {
        const cloneSettings = JSON.parse(JSON.stringify(tms_settings));
        Object.keys(cloneSettings?.transaction_settings?.surcharge).map(key => {
            if (type == key) {
                cloneSettings.transaction_settings.surcharge[key].value = !cloneSettings.transaction_settings.surcharge[key].value;
            }
        });

        let response = await updateConfigurations({ configuration: cloneSettings });

        dispatch(setTms_settings(cloneSettings));
    };

    const handleChange = (type: any, txt: any) => {
        if (type == 'limit') {
            setSurchargeLimit(txt);
        }

        if (type == 'debit') {
            setSurchargeValue(txt);
        }

        if (type == 'credit') {
            setCreditAmount(txt);
        }
    };

    const handleSubmit = async (type: any) => {
        const cloneSettings = JSON.parse(JSON.stringify(tms_settings));

        if (type == 'limit') {
            setTransactionLimit(false);
            cloneSettings.transaction_settings.surcharge['debit_surcharge'].limit = surchargeLimit;
        }

        if (type == 'debit') {
            cloneSettings.transaction_settings.surcharge['debit_surcharge'].fee = surchargeValue;
            setDebit(false);
            setTransactionLimit(true);
        }

        if (type == 'credit') {
            if (creditAmount > 2.4) {
                setErrorText('Maximum Limit is 2.4%');
                setCredit(true);
            } else {
                cloneSettings.transaction_settings.surcharge['credit_surcharge'].fee = creditAmount;
                setCredit(false);
            }
        }

        let response = await updateConfigurations({ configuration: cloneSettings });

        dispatch(setTms_settings(cloneSettings));
    };

    return (
        <Wrapper isPaddingH isTop>
            <AppHeader
                showLeftIcon
                source={credit || debit ? cross : backArrow}
                title={credit || debit ? languagePicker(language, 'Surcharge Config') : languagePicker(language, 'Surcharge Config')}
                backAction={() => navigate('Admin_Settings', { type: '' })}
            />

            <View style={{ marginTop: RF(30) }} />

            {debit ? (
                <>
                    <AppText center medium defaultTextColor title={languagePicker(language, 'Debit Surcharge')} size={Typography.FONTS.SIZE.XLARGE} />
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <CustomInput value={surchargeValue} onChangeText={(txt: any) => handleChange('debit', txt)} onSubmitEditing={() => handleSubmit('debit')} />
                    </View>
                </>
            ) : credit ? (
                <>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                        }}>
                        <CustomInput
                            percentage
                            dollar={true}
                            value={creditAmount}
                            title={languagePicker(language, 'Enter Fee Percentage')}
                            onChangeText={(txt: any) => handleChange('credit', txt)}
                            onSubmitEditing={() => handleSubmit('credit')}
                        />

                        {errorText !== '' && <ErrorText title={errorText} tintColor={theme?.colors?.errColor} />}
                    </View>
                </>
            ) : transactionLimit ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                    }}>
                    <CustomInput
                        value={surchargeLimit}
                        onChangeText={(txt: any) => handleChange('limit', txt)}
                        onSubmitEditing={() => handleSubmit('limit')}
                        title={'Debit surcharge is applied for equal to or below the above amount.'}
                    />
                </View>
            ) : (
                <>
                    <>
                        <AppText center medium defaultTextColor title={languagePicker(language, 'Debit Surcharge')} size={Typography.FONTS.SIZE.XLARGE} />
                        <Toggle_Box
                            isEnabled={surchargeConfig?.debit_surcharge?.value}
                            subHeading={surchargeConfig?.debit_surcharge?.value ? languagePicker(language, 'ENABLED') : languagePicker(language, 'DISABLED')}
                            onPressTitle={() => onPressTitle('debit')}
                            onToggle={() => handleToggle('debit_surcharge')}
                            heading={`Debit Surcharge (${currencyFormatter.format(surchargeConfig?.debit_surcharge?.fee, {
                                code: 'CAD',
                                // format: "%v %s",
                            })})`}
                            pressableTitle={'SET TRANSACTION LIMIT & SURCHARGE FEE'}
                        />
                    </>

                    <>
                        <AppText center medium defaultTextColor title={languagePicker(language, 'Credit Surcharge')} size={Typography.FONTS.SIZE.XLARGE} textStyle={{ marginTop: RF(20) }} />

                        <Toggle_Box
                            isEnabled={surchargeConfig?.credit_surcharge?.value}
                            subHeading={surchargeConfig?.credit_surcharge?.value ? languagePicker(language, 'ENABLED') : languagePicker(language, 'DISABLED')}
                            onToggle={() => handleToggle('credit_surcharge')}
                            heading={`Credit Surcharge (${currencyFormatter.format(surchargeConfig?.credit_surcharge?.fee, {
                                code: 'CAD',
                                // symbol: "%",
                                format: '%v %',
                            })})`}
                            pressableTitle={languagePicker(language, 'CREDIT SURCHARGE FEE')}
                            onPressTitle={() => onPressTitle('credit')}
                        />
                    </>
                </>
            )}
        </Wrapper>
    );
};

export default Surcharge_Config;
