import React, { useEffect, useRef, useState } from 'react';
import { RF } from '@theme';
import { backArrow, cross, exclaimation, good, green } from '@assets';
import { navigate } from '@services';
import { View } from 'react-native';
import { AppHeader, ErrorHeader, Overlay, Pressable_Box, SuccessHeader, Test_Wrapper, Wrapper } from '@components';
import { languagePicker } from '@utils';
import { useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { RouteProp, useTheme } from '@react-navigation/native';
import { log } from 'react-native-reanimated';

interface Props {
    navigation: any;
    route: RouteProp<{
        params: {
            type?: any;
        };
    }>;
}

const Admin_Settings = ({ navigation, route }: Props) => {
    const { type } = route?.params;
    const language = useSelector((state: any) => state.user.languageType);
    const { showPasscodeUpdate } = useSelector((state: any) => state.user);
    const { tms_settings } = useSelector((state: any) => state.pr);

    const merchant_passcode = tms_settings?.terminal_configuration?.merchant_passcode;
    const ref: any = useRef();
    const [notifyType, setNotifyType] = useState('');
    const [overlayVisible, setOverlayVisible] = useState(false);
    const theme: any = useTheme();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (type == 'updatePasscode' && !overlayVisible) {
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
        ref?.current?.alertWithType('custom', 'Merchant Passcode updated!', '');
    };

    const onClick = (type: any) => {
        if (type === 'communication') {
            navigate('Communication');
        } else if (type === 'terminal') {
            navigate('Terminal_Configuration');
        } else if (type === 'transaction') {
            navigate('Transaction_Settings');
        } else if (type === 'printer') {
            navigate('PrinterConfiguration', { type: '' });
        } else if (type === 'rewards') {
            navigate('');
        } else if (type === 'manager') {
            navigate('ManagerPassword');
        } else if (type === 'merchant_passcode') {
            navigate('MerchantPasscodeSettings');
        }
    };
    const onBackAction = () => {
        merchant_passcode?.value ? navigate('LockScreen') : navigate('TransactionMenu');
    };

    return (
        <View
            style={{
                padding: RF(20),
                backgroundColor: theme.colors.white,
                flex: 1,
            }}>
            {overlayVisible && (
                <View style={{ zIndex: 10 }}>
                    <Overlay opacity={1} bgColor={'#000'}>
                        <SuccessHeader
                            ref={ref}
                            width={RF(30)}
                            fontSize={RF(20)}
                            ml={notifyType == 'success' ? 100 : 120}
                            img_mT={notifyType == 'success' ? 95 : 97}
                            t_ml={notifyType == 'success' ? -80 : -70}
                            title_mT={notifyType == 'success' ? 85 : 90}
                            imageSrc={notifyType == 'success' ? good : exclaimation}
                            bgClr={notifyType == 'success' ? '#E3F8CFD9' : '#D74120E5'}
                            tintClr={notifyType == 'success' ? theme.colors.toggleColor : '#000'}
                        />
                    </Overlay>
                </View>
            )}
            {/* {showPasscodeUpdate && (
        <View style={{ position: "absolute", width: "110%", zIndex: 10 }}>
          <ErrorHeader
            source={green}
            colorText={theme?.colors?.text}
            title={"Merchant Passcode Updated!"}
            titleImage={good}
          />
        </View>
      )} */}

            <AppHeader title={languagePicker(language, 'Admin Settings')} showLeftIcon source={cross} backAction={() => onBackAction()} />
            {/* <ScrollView>
        {Object.keys(tms_settings).map((key, index) => (
          <Pressable_Box
            key={index}
            // title={languagePicker(language, "Communications")}
            title={key}
            onPress={() => onClick("communication")}
          />
        ))}
      </ScrollView> */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={{ marginTop: RF(30) }} />

                {tms_settings?.communication?._v && (
                    <Pressable_Box disable={tms_settings?.communication?._l} title={languagePicker(language, 'Communications')} onPress={() => onClick('communication')} />
                )}

                {/* {tms_settings?.batch_close_parameter?._v && (
          <Pressable_Box
            disable={tms_settings?.batch_close_parameter?._l}
            title={"Batch Close Parameter"}
            onPress={() => onClick("batch_close")}
          />
        )} */}

                {tms_settings?.terminal_configuration?._v && (
                    <Pressable_Box disable={tms_settings?.terminal_configuration?._l} title={languagePicker(language, 'Terminal Configuration')} onPress={() => onClick('terminal')} />
                )}

                {tms_settings?.transaction_settings?._v && (
                    <Pressable_Box
                        // disable={tms_settings?.transaction_settings?._l}
                        title={languagePicker(language, 'Transaction Settings')}
                        onPress={() => onClick('transaction')}
                    />
                )}

                {tms_settings?.printer?._v && <Pressable_Box disable={tms_settings?.printer?._l} title={languagePicker(language, 'Printer')} onPress={() => onClick('printer')} />}

                {/* <Pressable_Box
          title={languagePicker(language, "Rewards")}
          onPress={() => onClick("rewards")}
        /> */}
            </ScrollView>
        </View>
    );
};

export default Admin_Settings;
