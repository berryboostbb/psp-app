import { View, Image, StyleSheet, ImageStyle, StyleProp, ViewStyle, TouchableOpacity, ImageBackgroundProps, ImageBackground as DefaultImageBackground, Pressable } from 'react-native';
import React from 'react';
import { AppText, MiniOverlay } from '@components';
import { curveHeader } from '@assets';
import { useTheme } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/core';
import { horizontalScale, verticalScale, GST, Typography, RF, SCREEN_WIDTH } from '@theme';
import { navigate } from '@services';
import { useDispatch, useSelector } from 'react-redux';
import { setManualCardEntry, setOrderData, setPrePrinted } from '@redux';
import printCancelReceipt from '../../../shared/utils/cancelReceipt';
import SystemNavigationBar from 'react-native-system-navigation-bar';

interface Props extends ImageBackgroundProps {
    children?: any;
    imageStyle?: StyleProp<ImageStyle> | undefined;
    style?: StyleProp<ViewStyle> | undefined;
    imageRef?: any;
    adminVisible?: any;
    backAction?: () => void;
    visible?: any;
    logoVisible?: any;
    title?: any;
    total?: any;
    source?: any;
    refund?: any;
    onPressLeftIcon?: any;
    backVisible?: any;
    backPress?: any;
    goBack?: any;
    inputRef?: any;
}
const CurveHeader = (props: Props) => {
    const theme: any = useTheme();
    const navigation = useNavigation();
    const { adminVisible, source, visible, title, imageStyle, imageRef, backAction, total, refund, logoVisible, onPressLeftIcon, backVisible, backPress, goBack, inputRef } = props;

    const { cancelReceipt } = printCancelReceipt();

    const { tms_settings } = useSelector((state: any) => state.pr);
    const merchant_passcode = tms_settings?.terminal_configuration?.merchant_passcode;
    const terminal_mode = tms_settings?.terminal_configuration?.language_and_terminal_mode?.terminal_mode;

    const dispatch = useDispatch();

    const closeKeyboard = () => {
        inputRef?.current?.blur();
    };

    const handlePressCross = () => {
        cancelReceipt();
        dispatch(setManualCardEntry(false));
        closeKeyboard();
        SystemNavigationBar.navigationHide();

        if (merchant_passcode?.value) {
            navigate('LockScreen', { type: 'merchant' });
        } else {
            navigate('TransactionMenu');
        }
        dispatch(setPrePrinted(false));
    };

    return (
        <>
            {terminal_mode?.demo_mode?.value && (
                <MiniOverlay bgColor={'#BF1313'}>
                    <AppText title={'Demo Mode'} bold center size={18} colorText={'#fff'} />
                </MiniOverlay>
            )}
            <DefaultImageBackground source={curveHeader} resizeMode="contain" style={[styles.conatinerView, imageStyle, { marginTop: terminal_mode?.demo_mode?.value ? 18 : -10 }]}>
                <View style={styles.bgImageContainer}>
                    <Pressable style={{ flex: 1 }} activeOpacity={1} disabled={logoVisible ? true : false} onPress={goBack ? backPress : backVisible ? () => navigation.goBack() : handlePressCross}>
                        {visible && <Image style={styles.image} source={source} />}
                        {logoVisible && <Image style={styles.logoImage} source={source} />}
                    </Pressable>
                    <View style={styles.view}>
                        {adminVisible && (
                            <>
                                <AppText medium title={title} colorText={theme?.colors?.white} size={RF(42)} />
                                <AppText medium title={total} colorText={'#D4D6D7'} size={Typography.FONTS.SIZE.MEDIUM} textStyle={{ marginRight: 1 }} />
                            </>
                        )}
                    </View>
                </View>
            </DefaultImageBackground>
        </>
    );
};

const styles = StyleSheet.create({
    view: {
        alignItems: 'flex-end',
    },
    conatinerView: {
        width: '100%',
        height: RF(130),
        ...GST.CENTER,
        marginTop: -10,
        // backgroundColor: '#fff',
        resizeMode: 'contain',
    },
    bgImageContainer: {
        ...GST.ROW,
        paddingHorizontal: horizontalScale(30),
        alignItems: 'center',
        paddingBottom: 10,
    },
    image: {
        resizeMode: 'contain',
        width: horizontalScale(25),
        height: verticalScale(25),
        tintColor: 'white',
    },
    logoImage: {
        // resizeMode: "contain",
        width: horizontalScale(100),
        height: verticalScale(56.8),
        alignSelf: 'center',
        tintColor: 'white',
    },
});

export default CurveHeader;
