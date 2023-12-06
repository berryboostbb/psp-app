import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';

import { setInternetConnected, store } from '@redux';
import { getDeviceMac, navigationRef } from '@services';
import { defaultTheme } from '@theme';
import { toastConfig } from '@utils';
import { green, orange, wifiOff, wifiOn, tick, exclaimation } from '@assets';
import { CustomLoader, ErrorHeader, Overlay, SuccessHeader, DailyReportModal } from '@components';
import { RealmProvider } from './src/db/models';
import { useSocket } from '@hooks';

import Routes from './src/routes';

const App = () => {
    const ref = useRef<any>();
    const appTheme = defaultTheme;
    const netInfo = useNetInfo();
    const [notifyType, setNotifyType] = useState('');
    const [currentRoute, setCurrentRoute] = useState('');
    const [overlayVisible, setOverlayVisible] = useState(true);
    const [successOverlayVisible, setSuccessOverlayVisible] = useState(false);

    const showUpdate = (msg: any) => {
        setNotifyType('error');
        setSuccessOverlayVisible(true);
        ref?.current?.alertWithType('custom', msg, '');
        setTimeout(() => {
            setSuccessOverlayVisible(false);
        }, 3000);
    };

    const { terminalStatus, printModalVisible, doAutoPrint, _handleAfterReportPrint } = useSocket({
        showUpdate,
    });

    useLayoutEffect(() => {
        SplashScreen.hide();
        getDeviceMac();
    }, []);

    useEffect(() => {
        store.dispatch(setInternetConnected(netInfo.isConnected));

        if (netInfo.isConnected) {
            setOverlayVisible(true);

            setTimeout(() => {
                setOverlayVisible(false);
            }, 300);
        } else {
            setOverlayVisible(true);
        }
    }, [netInfo.isConnected]);

    const onStateChange = (state: any) => {
        setCurrentRoute(state?.routes[state.index]?.name);
    };

    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <RealmProvider>
                    <CustomLoader />
                    <NavigationContainer
                        theme={appTheme as any}
                        ref={navigationRef}
                        onReady={() => {
                            const currentRoute = navigationRef.current.getCurrentRoute();
                            setCurrentRoute(currentRoute.name);
                        }}
                        onStateChange={onStateChange}>
                        <Routes />
                        {overlayVisible && currentRoute != 'Offline' && (
                            <Overlay>
                                <ErrorHeader
                                    source={netInfo.isConnected ? green : orange}
                                    colorText={netInfo.isConnected ? appTheme?.colors?.text : appTheme?.colors?.white}
                                    title={netInfo.isConnected ? 'Internet Connection Successful' : 'No Internet Connection'}
                                    titleImage={netInfo.isConnected ? wifiOn : wifiOff}
                                />
                            </Overlay>
                        )}

                        {successOverlayVisible && (
                            <Overlay>
                                <SuccessHeader
                                    ref={ref}
                                    imageSrc={notifyType == 'success' ? tick : exclaimation}
                                    bgClr={notifyType == 'success' ? '#E3F8CFD9' : '#D74120E5'}
                                    error={notifyType == 'success' ? false : true}
                                    ml={notifyType == 'success' ? 90 : 133}
                                    t_ml={-70}
                                />
                            </Overlay>
                        )}

                        {terminalStatus == 'Blocked' && (
                            <View style={styles.blockedContainer}>
                                <View style={styles.blockedContent}>
                                    <Text style={styles.blockedText}>Blocked</Text>
                                </View>
                            </View>
                        )}
                        <Toast position="bottom" config={toastConfig} />
                    </NavigationContainer>
                    <DailyReportModal visible={printModalVisible && doAutoPrint} onHide={_handleAfterReportPrint} />
                </RealmProvider>
            </SafeAreaProvider>
        </Provider>
    );
};

const styles = StyleSheet.create({
    blockedContainer: {
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0.7,
        backgroundColor: 'black',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    blockedContent: {
        backgroundColor: 'red',
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    blockedText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
});

export default App;
