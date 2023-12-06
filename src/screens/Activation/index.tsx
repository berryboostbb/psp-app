import { setPosId, setUsers, setApiKey, setStoreId, setPingTime, setStoreInfo, setDeviceName, setTms_settings, setTerminalActivated, setTerminalInfo, setTerminalStatus, set_bin_ranges } from '@redux';
import { Image, View, Platform, Keyboard, ImageBackground, KeyboardAvoidingView, NativeModules } from 'react-native';
import useStyles from './style';
import { useTheme } from '@react-navigation/native';
import React, { useRef, useState, useEffect } from 'react';
import { green, psp_background, whiteLogo, orange, exclaimation, tick, psp_backgroundLatest } from '@assets';
import { Overlay, AppTextInput, ErrorHeader, PrimaryButton, SuccessHeader } from '@components';
import { languagePicker } from '@utils';
import { activateTerminal } from '@services';
import { useDispatch, useSelector } from 'react-redux';
import { ASPECT_RATIO } from './../../shared/theme/responsive';
import { GST, RF } from '@theme';
import { useKeyboard } from '@hooks';

let interval: any;

const ActivationScreen = () => {
    const [activationCode, setActivationCode] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [errorText, setErrorText] = useState('');
    const inputRef: any = useRef();
    const inputRef1: any = useRef();
    const theme: any = useTheme();
    const styles = useStyles(theme.colors);
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : -220;
    const dispatch = useDispatch();
    const language = useSelector((state: any) => state.user.languageType);
    const { deviceMacAddress } = useSelector((state: any) => state.user);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const { terminalInfo } = useSelector((state: any) => state.tms);
    const [sNo, setSNo] = useState(terminalInfo?.serialNo ? terminalInfo?.serialNo : '');
    const { PaxPaymentModule } = NativeModules;

    const [secureEntry, setSecureEntry] = useState(true);
    const ref: any = useRef();
    const [notifyType, setNotifyType] = useState('');

    const isKeyboardVisible = useKeyboard();

    const handleActivate = () => {
        if (sNo) {
            let params = {
                otp: activationCode,
                serial_number: sNo,
                macAddress: deviceMacAddress,
                configuration: {},
            };

            activateTerminal(params)
                .then(res => {
                    if (res.success) {
                        dispatch(setApiKey(res?.data?.apiKey));
                        dispatch(setUsers(res?.data?.users));
                        dispatch(setStoreId(res?.data?.store_id));
                        dispatch(setPosId(res?.data?.store_id));
                        dispatch(setStoreInfo(res?.data?.store));
                        dispatch(setPingTime(parseInt(res?.data?.ping_time)));
                        dispatch(setTms_settings(res?.data?.configuration));
                        dispatch(setDeviceName(res?.data?.device_name));
                        dispatch(setTerminalStatus(res?.data?.device_staus));
                        dispatch(set_bin_ranges(res?.data?.store?.bin_ranges));

                        setNotifyType('success');
                        setOverlayVisible(true);
                        ref?.current?.alertWithType('custom', 'Activation Code Validated', '');
                        setTimeout(() => {
                            dispatch(setTerminalActivated(true));
                        }, 1000);
                    } else {
                        setNotifyType('error');
                        setOverlayVisible(true);
                        ref?.current?.alertWithType('custom', 'Invalid Code!', '');
                        // setErrorText("Invalid Code!");
                        setIsValid(false);
                    }
                })
                .catch(err => {
                    console.log('err...', err.response);
                });
        } else {
            setNotifyType('error');
            setOverlayVisible(true);
            ref?.current?.alertWithType('custom', 'Serial Number required', '');
        }
    };

    // TODO: remove after testing
    // useEffect(() => {

    //   const logMode = true;
    //   const encryptionFlag = '0'; // Set to 1 if encryption is enabled
    //   const tagList = '5F2A5F348284959A9C9F029F039F099F109F1A9F1E9F269F279F339F349F359F369F3750';
    //   const emvConfig = '07';

    //   // PaxPaymentModule.init('100', 'Sale', logMode, encryptionFlag, tagList, emvConfig, getData);

    //   return () => clearInterval(interval);
    // }, []);

    // const getData = async () => {
    //   let accountNumber = '';
    //   let encryptionType = "1";
    //   let keySlot = "1";
    //   let pinAlgorithm = "1";
    //   let emvKernal = "02";

    //   console.log({ accountNumber, encryptionType, keySlot, pinAlgorithm });

    //   await PaxPaymentModule.updatedAuthorizeCard(
    //     '100',
    //     accountNumber,
    //     encryptionType,
    //     keySlot,
    //     pinAlgorithm,
    //     getData2
    //   );
    // }

    // const getData2 = async (pinBlock, emvData, resultCode, resultMessage, signatureFlag, pinByPassStatus, ksn, cvm, pinPadType) => {
    //   console.log(pinBlock, emvData, resultCode, resultMessage, signatureFlag, pinByPassStatus, ksn, cvm, pinPadType, 'fecfecefce');

    // }

    const handleSecureEntry = () => {
        setSecureEntry(!secureEntry);
    };

    const handleSerialNo = (text: any) => {
        setSNo(text);
        // const cloneInfo = JSON.parse(JSON.stringify(terminalInfo));

        // cloneInfo.serialNo = text;

        // dispatch(setTerminalInfo(cloneInfo));
    };

    return (
        <View style={styles.container}>
            <ImageBackground style={[{ aspectRatio: 1 / 2 }]} source={psp_backgroundLatest} resizeMode="repeat">
                {overlayVisible && (
                    <View style={{ zIndex: 10 }}>
                        <Overlay>
                            <SuccessHeader
                                ref={ref}
                                imageSrc={notifyType == 'success' ? tick : exclaimation}
                                bgClr={notifyType == 'success' ? '#E3F8CFD9' : '#D74120E5'}
                                error={notifyType == 'success' ? false : true}
                                ml={notifyType == 'success' ? 110 : 133}
                            />
                        </Overlay>
                    </View>
                )}

                <Image style={styles.logo} source={whiteLogo} />

                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                    <View
                        style={[
                            {
                                paddingBottom: isKeyboardVisible ? RF(20) : RF(160),
                                flex: 1,
                            },
                            GST.CENTER,
                        ]}>
                        {/* {isValid ? (
            <Pressable style={styles.activationView} onPress={handleShowInput}>
              <AppText
                medium
                colorText={"#fff"}
                title={"Activation Code Entered is Valid"}
                size={Typography.FONTS.SIZE.LARGE}
              />
            </Pressable>
          ) : ( */}
                        {!terminalInfo?.serialNo && (
                            <View style={{}}>
                                <AppTextInput
                                    inputRef={inputRef}
                                    keyboardType="default"
                                    autoFocus
                                    value={sNo}
                                    title={''}
                                    // icon={secureEntry ? "md-eye-outline" : "md-eye-off-outline"}
                                    // onPressIcon={handleSecureEntry}
                                    placeholder={'Enter device serial No.'}
                                    viewStyle={styles.input}
                                    // secureTextEntry={secureEntry}
                                    onChangeText={(txt: any) => {
                                        handleSerialNo(txt);
                                    }}
                                    // onFocus={Keyboard.current.open}
                                    // onSubmitEditing={()=>}
                                    maxLength={32}
                                    onSubmitEditing={Keyboard.dismiss}
                                />
                                {/* {errorText !== "" && (
              <ErrorText
                title={errorText}
                tintColor={theme?.colors?.errColor}
              />
            )} */}
                            </View>
                        )}

                        <View style={{ marginBottom: RF(30) }}>
                            <AppTextInput
                                inputRef={inputRef1}
                                keyboardType="decimal-pad"
                                autoFocus
                                value={activationCode}
                                title={''}
                                icon={secureEntry ? 'md-eye-outline' : 'md-eye-off-outline'}
                                onPressIcon={handleSecureEntry}
                                placeholder={'Enter Your Activation Code'}
                                viewStyle={styles.input}
                                secureTextEntry={secureEntry}
                                onChangeText={(txt: any) => {
                                    setActivationCode(txt);
                                    setErrorText('');
                                    setOverlayVisible(false);
                                }}
                                // onFocus={Keyboard.current.open}
                                // onSubmitEditing={()=>}
                                maxLength={32}
                                onSubmitEditing={Keyboard.dismiss}
                            />
                            {/* {errorText !== "" && (
              <ErrorText
                title={errorText}
                tintColor={theme?.colors?.errColor}
              />
            )} */}
                        </View>
                        {/* )} */}

                        <PrimaryButton
                            title={
                                // isValid
                                //   ?
                                languagePicker(language, 'Activate')
                                // : languagePicker(language, "Confirm")
                            }
                            bgColor={theme?.colors?.white}
                            clr={theme?.colors?.text}
                            onPress={handleActivate}
                            buttonStyle={styles.btnStyle}
                        />
                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
        </View>
    );
};

export default ActivationScreen;
