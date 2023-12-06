import React, { useState } from 'react';
import { View } from 'react-native';
import styles from './styles';
import { AppHeader, AppText, InputField, Wrapper } from '@components';
import { Typography } from '@theme';
import { useDispatch, useSelector } from 'react-redux';
import { cross } from '@assets';
import { setOrderData, setRefNumber } from '@redux';
import { navigate } from '@services';
import { RF } from '@theme';

const ReferenceInputScreen = () => {
    const dispatch = useDispatch();
    const language = useSelector((state: any) => state.user.languageType);
    const [referenceNumber, setReferenceNumber] = useState('');
    const { tms_settings } = useSelector((state: any) => state.pr);
    const common = useSelector((state: any) => state.common);
    console.log('Common Data: ', common);
    const _handleChangeReference = (value: any) => {
        setReferenceNumber(value);
    };

    const _handleSubmit = () => {
        dispatch(setRefNumber({ referenceNumber }));
    };

    const handlePressCross = () => {
        dispatch(
            setOrderData({
                tip: 0.0,
                clerkId: '',
                invoiceNumber: '',
                merchantPasscode: '',
                tipType: '',
                surcharge: 0,
                orderAmount: 0.0,
                cardType: '',
                referenceNumber: null,
            })
        );
        if (tms_settings?.security?.merchant_passcode?.value) {
            navigate('LockScreen', { type: 'merchant' });
        } else {
            navigate('TransactionMenu');
        }
    };

    return (
        <Wrapper isPaddingH isTop>
            <AppHeader showLeftIcon source={cross} title="" backAction={handlePressCross} />
            <View style={styles.container}>
                <AppText center defaultTextColor title="Enter Reference Number" size={Typography.FONTS.SIZE.XLARGE} />
                <InputField value={referenceNumber} keyboardType={'default'} onSubmitEditing={_handleSubmit} onChangeText={_handleChangeReference} maxLength={20} fontSize={RF(16)} />
            </View>
        </Wrapper>
    );
};

export default ReferenceInputScreen;
