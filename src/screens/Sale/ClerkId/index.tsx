import { View, Animated, Pressable, ImageBackground, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { Pin, AppText, Wrapper, Overlay, AppHeader, SuccessHeader, TouchInactivityDetector } from '@components';
import useStyles from './style';
import { navigate } from '@services';
import { languagePicker } from '@utils';
import { GST, RF, Typography } from '@theme';
import { useTheme } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentClerkId, setOrderData, setTimeLayout } from '@redux';
import { cross, exclaimation, psp_background, psp_backgroundLatest, tick } from '@assets';
import { useKeyboard } from '@hooks';

const ClerkId = ({ navigation, route }: any) => {
    const isKeyboardVisible = useKeyboard();
    const language = useSelector((state: any) => state.user.languageType);
    const inputRef: any = useRef();
    const myTheme: any = useTheme();
    const dispatch: any = useDispatch();
    const anim = useRef(new Animated.Value(0));
    const { tms_settings } = useSelector((state: any) => state.pr);
    const { users } = useSelector((state: any) => state.tms);
    // console.log("users.....", users);

    const invoiceConfig = tms_settings?.transaction_settings?.invoice_number;
    const isRefund = useSelector((state: any) => state.common.isRefund);
    const orderData = useSelector((state: any) => state.common.orderData);
    const [code, setCode] = useState<any>();
    const styles = useStyles(myTheme?.colors);
    const [loading, setLoading] = useState(false);
    const ref: any = useRef();
    const [notifyType, setNotifyType] = useState('');
    const [overlayVisible, setOverlayVisible] = useState(false);
    const { type } = route.params;

    // console.log("uuu......", users);

    useEffect(() => {
        let timeout: any = null;
        const unsubscribe = navigation.addListener('focus', () => {
            timeout = setTimeout(() => {
                inputRef?.current?.blur();
                inputRef?.current?.focus();
            }, 100);
        });

        return () => {
            clearTimeout(timeout);
            unsubscribe;
        };
    }, [navigation]);

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

    const verifyClerkID = async (cod: any) => {
        let userFound = false;
        let matchedUser: any = null;

        users.map((u: any) => {
            if (cod == u?.clerk_id) {
                userFound = true;
                matchedUser = u;
            }
        });

        if (userFound) {
            if (type == 'settings' || type == 'reports' || type == 'refund') {
                let data = { ...orderData };
                data.clerkId = cod;
                dispatch(setOrderData(data));
                if (matchedUser?.type == 'manager' || matchedUser?.type == 'owner') {
                    if (type == 'settings') {
                        dispatch(setCurrentClerkId(cod));
                        navigate('Admin_Settings', { type: '' });
                    }
                    if (type == 'reports') {
                        navigate('ReportsSection', {});
                    }
                    if (type == 'refund') {
                        navigate('EnterAmount');
                    }
                } else {
                    setLoading(false);
                    shake();
                    setTimeout(() => {
                        setCode('');
                        setNotifyType('error');
                        setOverlayVisible(true);

                        ref.current.alertWithType('custom', 'You are not a manager', '');
                    }, 200);
                }
            } else {
                let data = { ...orderData };
                data.clerkId = cod;
                dispatch(setOrderData(data));
                setNotifyType('success');
                setOverlayVisible(true);

                if (invoiceConfig?.manual_entry?.value) {
                    navigate('InvoiceNumber');
                } else {
                    navigate('EnterAmount');
                }
            }
        } else {
            setLoading(false);
            shake();
            setTimeout(() => {
                setCode('');
                setNotifyType('error');
                setOverlayVisible(true);
                if (type == 'settings' || type == 'reports' || type == 'refund') {
                    ref.current.alertWithType('custom', 'Invalid Authorize ID', '');
                } else {
                    ref.current.alertWithType('custom', 'Invalid Clerk / Server ID', '');
                }
            }, 200);
        }
    };

    const onOpen = () => {
        inputRef?.current?.blur();
        setTimeout(() => {
            inputRef?.current?.focus();
        }, 100);
    };

    const onTextChange = (code: any) => {
        setCode(code);
        setOverlayVisible(false);
        // dispatch(setTimeLayout(code));
    };

    return (
        <Wrapper>
            <TouchInactivityDetector reset={code}>
                <Pressable onPress={onOpen} style={{ flex: 1 }}>
                    <ImageBackground style={[{ aspectRatio: 1 / 2 }]} source={psp_backgroundLatest} resizeMode="repeat">
                        {overlayVisible && (
                            <View style={{ zIndex: 10 }}>
                                <Overlay>
                                    <SuccessHeader
                                        ref={ref}
                                        ml={notifyType == 'success' ? 110 : 120}
                                        imageSrc={notifyType == 'success' ? tick : exclaimation}
                                        bgClr={notifyType == 'success' ? '#E3F8CFD9' : '#D74120E5'}
                                        error={notifyType == 'success' ? false : true}
                                        title_mT={notifyType == 'success' ? 92 : 90}
                                    />
                                </Overlay>
                            </View>
                        )}
                        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                            <View style={{ paddingTop: RF(20), paddingHorizontal: RF(20) }}>
                                <AppHeader title="" showLeftIcon source={cross} inputRef={inputRef} headerBackground headerColor LeftIconColor />
                            </View>
                            <Pressable
                                style={[
                                    {
                                        paddingBottom: isKeyboardVisible ? 0 : RF(120),
                                        flex: 1,
                                    },
                                    GST.CENTER,
                                ]}
                                onPress={onOpen}>
                                <AppText
                                    center
                                    medium
                                    colorText={myTheme.colors.white}
                                    title={type == 'settings' || type == 'reports' || type == 'refund' ? 'Enter Authorize ID' : languagePicker(language, 'Enter Clerk ID')}
                                    size={Typography.FONTS.SIZE.XLARGE}
                                />
                                <View style={styles.view}>
                                    <Animated.View style={{ transform: [{ translateX: anim.current }] }}>
                                        <Pressable onPress={onOpen}>
                                            <Pin code={code} setCode={setCode} pinColor={'white'} inputRef={inputRef} onSubmitEditing={verifyClerkID} onTextChange={onTextChange} />
                                        </Pressable>
                                    </Animated.View>
                                </View>
                                {/* {errorText !== "" && (
              <ErrorText
                title={errorText}
                tintColor={myTheme?.colors?.errColor}
              />
            )} */}

                                {loading && <ActivityIndicator size="small" color={'#fff'} />}
                                {/* {loading && (
              <>
                <LottieAnimation source={circularLoader} height={200} />
              </>
            )} */}
                            </Pressable>
                        </KeyboardAvoidingView>
                    </ImageBackground>
                </Pressable>
            </TouchInactivityDetector>
        </Wrapper>
    );
};
export default ClerkId;
