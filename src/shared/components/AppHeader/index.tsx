import React from 'react';
import AppText from '../AppText';
import { RF, Typography } from '@theme';
import { useTheme } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/core';
import { StyleSheet, TouchableOpacity, View, Image, Pressable } from 'react-native';
import HorizontalSpacer from '../HorizontalSpacer';
import { navigate } from '@services';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { useDispatch, useSelector } from 'react-redux';
import { setPrePrinted } from '@redux';
import { MiniOverlay } from '@components';

interface Props {
    source?: any;
    title?: string;
    textStyle?: any;
    showLeftIcon?: any;
    showRightIcon?: any;
    showSecondaryRightIcon?: boolean;
    secondaryRightIcon?: any;
    onPressRightIcon?: any;
    onPressSecondaryRightIcon?: any;
    rightIcon?: any;
    headerBackground?: any;
    backAction?: any;
    onPressLogo?: () => void;
    headerColor?: any;
    LeftIconColor?: any;
    size?: any;
    textColor?: string;
    rightIconStyle?: any;
    inputRef?: any;
}

const AppHeader = (props: Props) => {
    const {
        size,
        title,
        source,
        textStyle,
        backAction,
        showLeftIcon,
        showRightIcon,
        onPressRightIcon,
        rightIcon,
        headerBackground,
        headerColor,
        LeftIconColor,
        textColor,
        showSecondaryRightIcon,
        secondaryRightIcon,
        onPressSecondaryRightIcon,
        rightIconStyle,
        inputRef,
    } = props;
    const myTheme: any = useTheme();
    const navigation = useNavigation();
    const styles = useStyles(myTheme.colors);
    const dispatch = useDispatch();
    const { tms_settings } = useSelector((state: any) => state.pr);

    const terminal_mode = tms_settings?.terminal_configuration?.language_and_terminal_mode?.terminal_mode;

    setTimeout(() => {}, 300);

    const closeKeyboard = () => {
        inputRef?.current?.blur();
    };
    const handleBack = () => {
        closeKeyboard();
        navigate('TransactionMenu');
        SystemNavigationBar.navigationHide();
        dispatch(setPrePrinted(false));
    };
    return (
        <>
            {terminal_mode?.demo_mode?.value && (
                <MiniOverlay bgColor={'#BF1313'}>
                    <AppText title={'Demo Mode'} bold center size={18} colorText={'#fff'} />
                </MiniOverlay>
            )}
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: headerBackground ? 'transparent' : myTheme?.colors?.white,
                        marginTop: terminal_mode?.demo_mode?.value ? 10 : 0,
                    },
                ]}>
                <View style={styles.left}>
                    {showLeftIcon && (
                        <Pressable activeOpacity={1} style={[styles.backView, {}]} onPress={backAction ? backAction : () => handleBack()}>
                            <Image source={source} style={[styles.img, { tintColor: LeftIconColor ? myTheme.colors.white : '#000' }]} />
                        </Pressable>
                    )}
                </View>

                <View style={styles.txt}>
                    <AppText
                        medium
                        title={title}
                        textStyle={textStyle}
                        size={size ? size : Typography.FONTS.SIZE.XXLARGE}
                        center
                        colorText={headerColor ? 'white' : textColor || myTheme.colors.text}
                    />
                </View>

                <View style={styles.right}>
                    {showRightIcon && (
                        <TouchableOpacity activeOpacity={1} onPress={onPressRightIcon} style={styles.rightButton}>
                            <Image source={rightIcon} style={[styles.rightIcon, rightIconStyle]} />
                        </TouchableOpacity>
                    )}
                    {showSecondaryRightIcon && (
                        <>
                            <HorizontalSpacer spaceFactor={0.5} />
                            <TouchableOpacity activeOpacity={1} onPress={onPressSecondaryRightIcon} style={styles.rightButton}>
                                <Image source={secondaryRightIcon} style={[styles.rightIcon, rightIconStyle]} />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </>
    );
};

const useStyles = (colors: any) =>
    StyleSheet.create({
        rightIcon: { width: RF(32), height: RF(32) },
        txt: {
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
        },
        img: {
            width: RF(30),
            height: RF(30),
            resizeMode: 'contain',
        },
        container: {
            width: '100%',
            flexDirection: 'row',
        },
        rightButton: {
            alignItems: 'center',
            marginRight: Typography.MARGIN.LOW,
        },
        right: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        icon: {
            width: RF(22),
            height: RF(25),
        },
        logo: {
            height: RF(25),
            width: RF(40),
        },
        title: {
            width: RF(200),
            color: colors.psp_text,
            fontSize: RF(20),
        },
        backView: {
            paddingHorizontal: 10,
            alignItems: 'center',
        },
        left: {
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

export default AppHeader;
