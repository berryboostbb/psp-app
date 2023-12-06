import styles from './styles';
import { ActivityIndicator, ImageBackground, View, Animated, InteractionManager, SafeAreaView } from 'react-native';
import { RF, Typography } from '@theme';
import { LogOut, navigate } from '@services';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RouteProp, useTheme } from '@react-navigation/native';
import { AppHeader, AppText, Overlay, Pin, SuccessHeader } from '@components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLoggedIn, setLoggedInUser, setPosId } from '@redux';
import { Tag, psp_background, tick, exclaimation, psp_backgroundLatest } from '@assets';
import { useKeyboard } from '@hooks';
import { WIDTH } from '@utils';
import { StatusBar } from 'react-native';

interface Props {
    navigation: any;
    route: RouteProp<{
        params: {
            type?: any;
        };
    }>;
}

const LockScreen = ({ navigation, route }: Props) => {
    const theme: any = useTheme();
    const { type } = route?.params;
    const [code, setCode] = useState<any>('');
    const [password, setPassword] = useState<any>('');
    const [confirmCode, setConfirmCode] = useState<any>();
    const [merchantCode, setMerchantCode] = useState<any>();
    const inputRef: any = useRef();
    const [errorText, setErrorText] = useState('');
    const { users } = useSelector((state: any) => state.tms);

    const { deviceName } = useSelector((state: any) => state.pr);
    const [onClick, setOnClick] = useState<any>('');
    const [loading, setLoading] = useState(false);
    const anim = useRef(new Animated.Value(0));
    const dispatch = useDispatch();
    const keybaordCheck = useKeyboard();
    const ref: any = useRef();
    const [notifyType, setNotifyType] = useState('');
    const [overlayVisible, setOverlayVisible] = useState(false);

    const shake = useCallback(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(anim.current, {
                    toValue: -2,
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(anim.current, {
                    toValue: 2,
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(anim.current, {
                    toValue: 0,
                    duration: 50,
                    useNativeDriver: true,
                }),
            ]),
            { iterations: 2 }
        ).start();
    }, []);

    // useEffect(() => {
    //   shake();
    // }, []);

    // if (!internet_Connected) {
    //   return (
    //     <ErrorImageWrapper
    //       titleError={"No Internet Connection"}
    //       content={"Connect to the internet to continue"}
    //       imageName={wifi}
    //     />
    //   );
    // }

    useEffect(() => {
        if (type === 'merchant') {
            setPassword('merchant');
            setCode('');
            setConfirmCode('');
        }
        if (type === 'login') {
            setPassword('password');
        }
    }, []);

    // useEffect(() => {
    //   if (code || merchantCode || confirmCode) {
    //     setErrorText("");
    //   }
    // }, [merchantCode, code, confirmCode]);

    useEffect(() => {
        let timeout: any = null;
        const unsubscribe = navigation.addListener('focus', () => {
            setMerchantCode('');
            setCode('');
            // timeout = setTimeout(() => {
            //   inputRef.current?.blur();
            //   inputRef.current?.focus();
            // }, 100);
            focusInputWithKeyboard();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return () => {
            clearTimeout(timeout);
            unsubscribe;
        };
    }, [navigation]);
    const focusInputWithKeyboard = () => {
        InteractionManager.runAfterInteractions(() => {
            inputRef?.current?.focus();
        });
    };

    const onHandleChange = async (cod: any) => {
        setLoading(true);
        let flag = false;

        users?.map((u: any) => {
            if (u.passcode == cod) {
                dispatch(setLoggedInUser(u));
                flag = true;
            }
        });

        if (flag) {
            setTimeout(() => {
                setLoading(false);
                navigate('TransactionMenu');
            }, 200);
        } else {
            setLoading(false);
            shake();
            setTimeout(() => {
                setMerchantCode('');
                // setErrorText("Invalid Passcode");
                setNotifyType('error');
                setOverlayVisible(true);
                ref.current.alertWithType('custom', 'Invalid Code!', '');
            }, 200);

            setTimeout(() => {
                inputRef?.current?.blur();
                inputRef?.current?.focus();
                setErrorText('');
            }, 1500);
        }
    };
    const on_Click = (type: any) => {
        setLoading(true);
        LogOut()
            .then(async res => {
                setOnClick(type);
                await AsyncStorage.setItem('passcode', '');
                dispatch(setPosId(''));
                await AsyncStorage.setItem('isLoggedIn', 'false');
                await AsyncStorage.setItem('token', '');
                await AsyncStorage.setItem('email', '');
                await AsyncStorage.setItem('passcode', '');
                await AsyncStorage.setItem('role', '');
                await AsyncStorage.setItem('merchantID', '');
                await AsyncStorage.setItem('clerkID', '');
                dispatch(setIsLoggedIn(false));
            })
            .catch(err => console.log('err....', err))
            .finally(() => setLoading(false));
    };
    const onTextChange = (code: any) => {
        setMerchantCode(code);
        setOverlayVisible(false);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar hidden={true} />
            {overlayVisible && (
                <View style={{ zIndex: 10 }}>
                    <Overlay>
                        <SuccessHeader
                            ref={ref}
                            imageSrc={notifyType == 'success' ? tick : exclaimation}
                            bgClr={notifyType == 'success' ? '#E3F8CFD9' : '#D74120E5'}
                            error={notifyType == 'success' ? false : true}
                            ml={notifyType == 'success' ? 100 : 133}
                            img_mT={notifyType == 'success' ? 95 : 102}
                            title_mT={notifyType == 'success' ? 92 : 95}
                        />
                    </Overlay>
                </View>
            )}

            {deviceName !== '' && (
                <ImageBackground
                    source={Tag}
                    style={{
                        height: 28,
                        position: 'absolute',
                        zIndex: 10,
                        justifyContent: 'center',
                        width: WIDTH / 2.8,
                    }}>
                    <AppText title={deviceName} colorText={theme.colors.white} size={16} center textStyle={{ paddingTop: RF(3) }} />
                </ImageBackground>
            )}
            <ImageBackground style={{ flex: 1 }} source={psp_backgroundLatest}>
                <View style={{ position: 'absolute', top: 90 }}>
                    <AppHeader title={type === 'merchant' ? 'Merchant Passcode' : ''} headerBackground headerColor />
                </View>
                <View style={styles.container}>
                    <AppText title={type === 'merchant' ? 'Enter Your Passcode' : ''} medium size={Typography.FONTS.SIZE.LARGE} colorText={'white'} />
                    <View style={styles.margin} />
                    <Animated.View style={{ transform: [{ translateX: anim.current }] }}>
                        <Pin
                            pinColor={'white'}
                            code={type === 'merchant' && merchantCode}
                            setCode={type === 'merchant' && setMerchantCode}
                            ref={inputRef}
                            onSubmitEditing={onHandleChange}
                            onTextChange={onTextChange}
                        />
                    </Animated.View>
                    {loading && <ActivityIndicator size="small" color={'#fff'} />}
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default LockScreen;

// let params = {
//   passcode: cod,
//   type: "manager",
// };
// verifyPasscode(params)
//   .then((res) => {})
//   .catch(() => {});

// if (cod?.length == 4) {
//   if (type == "login" && password == "password") {
//     setPassword("confirmpassword");
//     setTimeout(() => {
//       inputRef.current?.blur();
//     }, 200);

//     setTimeout(() => {
//       inputRef.current?.focus();
//     }, 200);
//   }

//   if (type == "login" && password == "confirmpassword") {
//     if (code == cod) {
//       const email = await AsyncStorage.getItem("email");
//       let res = await setPasscode({
//         email: email,
//         passcode: cod,
//       });
//       if (res.success) {
//         await AsyncStorage.setItem("passcode", "done");
//         navigate("Dashboard");
//         setPassword("merchant");
//       }
//     } else {
//       shake();
//       setTimeout(() => {
//         setConfirmCode("");
//       }, 200);

//       setErrorText("Confirm passcode must be same");

//       setTimeout(() => {
//         inputRef.current?.blur();
//         inputRef.current?.focus();
//         setErrorText("");
//       }, 1500);
//     }
//   }

//   if (type == "merchant" && password == "merchant") {
//     var res2 = await verifyClerkId({
//       type: "merchant",
//       passcode: cod,
//     });
//     if (res2.success == false) {
//       shake();
//       setTimeout(() => {
//         setMerchantCode("");
//       }, 200);

//       setErrorText(res2.message);
//       setTimeout(() => {
//         inputRef.current?.blur();
//         inputRef.current?.focus();
//         setErrorText("");
//       }, 1500);
//     } else {
//       navigate("TransactionMenu");
//     }
//   }
// }
