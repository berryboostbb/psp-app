import { Image, StyleSheet, ImageStyle, StyleProp, ViewStyle, ImageBackgroundProps, ImageBackground as DefaultImageBackground, ImageBackground } from 'react-native';
import React from 'react';
import { cuveLogo, lessCurve, logo } from '@assets';
import { useTheme } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/core';
import { RF } from '@theme';
import { useDispatch, useSelector } from 'react-redux';
import { MiniOverlay } from '@components';
import AppText from '../AppText';
import { View } from 'react-native';

interface Props extends ImageBackgroundProps {
    imageStyle?: StyleProp<ImageStyle> | undefined;
    source?: any;
}

const ProcessingHeader = (props: Props) => {
    const { source, imageStyle } = props;
    const { tms_settings } = useSelector((state: any) => state.pr);

    const terminal_mode = tms_settings?.terminal_configuration?.language_and_terminal_mode?.terminal_mode;

    return (
        <View>
            {terminal_mode?.demo_mode?.value && (
                <View style={{ backgroundColor: 'yellow', height: 20, zIndex: 100 }}>
                    <MiniOverlay bgColor={'#BF1313'} opacity={1}>
                        <AppText title={'Demo Mode'} bold center size={18} colorText={'#fff'} />
                    </MiniOverlay>
                </View>
            )}
            <ImageBackground source={lessCurve} imageStyle={{ resizeMode: 'contain' }} style={[styles.imgBackgroundView, { marginTop: -1 }]}>
                <Image source={logo} style={styles.img} />
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    imgBackgroundView: {
        width: '100%',
        height: RF(200),
        marginTop: -20,
        justifyContent: 'center',
        zIndex: 100,
    },
    img: {
        width: '100%',
        height: RF(80),
        resizeMode: 'contain',
        marginTop: -20,
    },
});

export default ProcessingHeader;
