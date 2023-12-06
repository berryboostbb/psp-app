import { StyleSheet, Text, View, TouchableOpacity, Image, Platform } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import useStyles from './style';
import { useTheme } from '@react-navigation/native';
import { AppText, LinearButton, TouchInactivityDetector, Wrapper } from '@components';
import { Typography } from '@theme';
import { Sign } from '@components';
import { cross } from '@assets';
import { useDispatch, useSelector } from 'react-redux';
import { navigate } from '@services';
import Pax from 'react-native-pax-library';
import { setOrderData, setSignature, setTms_settings } from '@redux';

const Signature = (props: any) => {
    const { orderId } = props.route.params;
    // const orderId = "1234";
    const [signatureText, setSignatureText] = useState('');
    const orderData = useSelector((state: any) => state.common.orderData);
    const [screenMode, setScreenMode] = useState('landscape');

    const { tms_settings } = useSelector((state: any) => state.pr);
    const theme: any = useTheme();

    const styles = useStyles(theme.colors);
    const dispatch = useDispatch();

    // useEffect(() => {
    //   setScreenMode("landscape");

    //   return () => {
    //     console.log("unmount............");

    //     setScreenMode("portrait");
    //   };
    // }, []);

    const signRef = useRef<any>(null);

    const handleSignature = (text: any) => {
        setSignatureText(text);
    };
    const handleClear = () => {
        signRef.current.resetImage();
    };

    const handleConfirm = (signText: any) => {
        signRef.current.saveImage();

        setScreenMode('portrait');
        dispatch(setSignature(signText.encoded));
        navigate('Receipt', { orderId: orderId });
    };

    const handleSignOnReceipt = () => {
        setScreenMode('portrait');
        dispatch(setSignature(''));
        if (tms_settings?.printer?.merchant_receipt?.value) {
            navigate('Receipt', { orderId: orderId });
        } else {
            navigate('TransactionMenu');
        }
    };

    return (
        <Wrapper isPaddingH>
            <TouchInactivityDetector>
                {/* <AppText
        medium
        defaultTextColor
        title={"Customer Signature"}
        size={26}
        textStyle={styles.heading}
      /> */}

                <View style={styles.container}>
                    <Sign ref={signRef} onOK={handleConfirm} colors={theme.colors} viewMode={screenMode} />
                    <AppText
                        defaultTextColor
                        title={'Sign here'}
                        size={Typography.FONTS.SIZE.LARGE}
                        textStyle={{
                            position: 'absolute',
                            left: 25,
                            top: 20,
                        }}
                    />
                    <TouchableOpacity
                        onPress={handleClear}
                        style={{
                            position: 'absolute',
                            right: 25,
                            top: 20,
                        }}>
                        <Image source={cross} style={{ height: 35, width: 35, tintColor: '#000' }} />
                    </TouchableOpacity>
                    <View
                        style={{
                            height: 1,
                            borderWidth: 0.5,
                            borderColor: '#000',
                            width: '90%',
                            position: 'absolute',
                            top: 190,
                            borderStyle: 'dashed',
                        }}
                    />
                </View>
                <View style={{ alignItems: 'center', width: '100%' }}>
                    <AppText defaultTextColor title={'By signing, I agree to pay the total amount'} size={16} />
                    <AppText defaultTextColor title={'pursuant to the card issuer agreement'} size={16} textStyle={{ marginBottom: 10, fontFamily: 'Plus Jakarta Sans' }} />

                    <View style={styles.row}>
                        <TouchableOpacity style={styles.btn} onPress={handleSignOnReceipt}>
                            <AppText defaultTextColor title={'Sign on Receipt'} size={Typography.FONTS.SIZE.LARGE} textStyle={{ fontFamily: 'Plus Jakarta Sans' }} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.btn,
                                {
                                    backgroundColor: theme.colors.primary,
                                    borderColor: theme.colors.primary,
                                },
                            ]}
                            onPress={handleConfirm}>
                            <AppText colorText={'#fff'} title={'Confirm'} size={Typography.FONTS.SIZE.LARGE} textStyle={{ fontFamily: 'Plus Jakarta Sans' }} />
                        </TouchableOpacity>
                    </View>
                    {/* <LinearButton
          title={"Sign on Receipt"}
          type="on_receipt"
          // disabled={!internet_Connected && true}
          onPress={handleSignOnReceipt}
          onClick={""}
        />
        <LinearButton
          title={"Confirm"}
          type="confirm"
          // disabled={!internet_Connected && true}
          onPress={handleConfirm}
          onClick={"confirm"}
        /> */}
                </View>
            </TouchInactivityDetector>
        </Wrapper>
    );
};

export default Signature;
