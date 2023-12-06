import { Wrapper, LinearButton, SecondaryButton, ImageBackgroundWrapper, Overlay, ErrorHeader, UserInactivityTest } from '@components';
import React, { useState } from 'react';
import useStyles from './style';
import { View } from 'react-native';
import { navigate } from '@services';
import { GenericNavigation, languagePicker } from '@utils';
import { RouteProp, useRoute, useTheme } from '@react-navigation/native';
import { adminName, admin, transaction, report, setting, green, orange, admin_background, gToB_Linear, dashboardbackgroundLatest } from '@assets';
import { useSelector } from 'react-redux';
import useCreateTransaction from '../../../db/hooks/useCreateTransaction';

// interface Props extends GenericNavigation {}

interface Props {
    navigation: any;
    route: RouteProp<{
        params: {
            type?: any;
        };
    }>;
}

export default function Dashboard({ navigation, route }: Props) {
    const { createTransaction } = useCreateTransaction();

    const [errorVisible, setErrorVisible] = useState(false);
    const [errorText, setErrorText] = useState('');
    const { languageType } = useSelector((state: any) => state.user);
    const { tms_settings } = useSelector((state: any) => state.pr);

    const { storeInfo } = useSelector((state: any) => state.pr);

    const merchant_passcode = tms_settings?.terminal_configuration?.merchant_passcode;

    const [onClick, setOnClick] = useState<any>('transaction');

    const myTheme: any = useTheme();
    const styles = useStyles(myTheme.colors);

    const on_Click = async (type: any) => {
        setOnClick(type);

        setTimeout(async () => {
            if (type === 'transaction') {
                if (merchant_passcode?.value) {
                    navigate('LockScreen', { type: 'merchant' });
                } else {
                    navigate('TransactionMenu');
                }
            }

            if (type === 'reports') {
                // navigate("Merchant_Login", { type: "reports" });
                // navigate("ReportsSection", {});
                navigate('ClerkId', { type: type });
            }

            if (type == 'settings') {
                // navigate("Merchant_Login", { type: "settings" });
                navigate('ClerkId', { type: type });
                // navigate("Admin_Settings");
            }

            setOnClick('');
        }, 100);
    };

    const _handleAddTransaction = () => {};

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setOnClick('transaction');
        });
        return unsubscribe;
    }, [navigation]);
    const routePath = useRoute();
    const currentRoute = routePath.name;

    return (
        <Wrapper
            viewStyle={{
                paddingTop: 0,
                paddingHorizontal: 0,
            }}>
            {errorVisible && (
                <View style={{ zIndex: 10 }}>
                    <Overlay>
                        <ErrorHeader
                            source={orange}
                            colorText={myTheme?.colors?.text}
                            title={errorText}
                            // titleImage={netInfo.isConnected ? wifiOn : wifiOff}
                        />
                    </Overlay>
                </View>
            )}
            <ImageBackgroundWrapper source={dashboardbackgroundLatest} text={storeInfo?.name} />
            <View style={styles.container}>
                <LinearButton title={languagePicker(languageType, 'Transaction Menu')} icon={transaction} type="transaction" onClick={onClick} onPress={() => on_Click('transaction')} />

                <LinearButton icon={report} title={languagePicker(languageType, 'Reports')} type="reports" onClick={onClick} onPress={() => on_Click('reports')} src={gToB_Linear} />
                <LinearButton icon={setting} title={languagePicker(languageType, 'Settings')} type="settings" onClick={onClick} onPress={() => on_Click('settings')} />
                {/* <LinearButton
          icon={setting}
          title="Add Transaction"
          type="settings"
          onClick={onClick}
          onPress={_handleAddTransaction}
        /> */}
            </View>
        </Wrapper>
    );
}
