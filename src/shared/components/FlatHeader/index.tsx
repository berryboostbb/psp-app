import React from 'react';
import { useTheme } from '@react-navigation/native';
import { RF, horizontalScale, verticalScale, Typography } from '@theme';
import { StyleSheet, TouchableOpacity, ImageBackground, Text, Image, View } from 'react-native';
import { cross, down_arrow, up_arrow } from '@assets';
import AppText from '../AppText';

const ImageBackgroundWrapper = ({
    title,
    up,
    source,
    onPress,
    disabled,
    imageName,
    imageStyle,
    cross_icon,
    handleCrossButton,
}: {
    up?: any;
    title?: any;
    source?: any;
    disabled?: any;
    imageName?: any;
    cross_icon?: any;
    imageStyle?: any;
    onPress?: () => void;
    handleCrossButton?: any;
}) => {
    const theme = useTheme();

    return (
        <TouchableOpacity onPress={onPress} disabled={disabled}>
            <ImageBackground source={imageName} resizeMode="contain" style={[styles.bgImageContainer, imageStyle]}>
                {cross_icon && (
                    <TouchableOpacity style={styles.crossButton} onPress={handleCrossButton}>
                        <Image source={cross} style={styles.image} />
                    </TouchableOpacity>
                )}

                <View style={styles.view}>
                    <AppText
                        title={title}
                        colorText={'white'}
                        size={Typography.FONTS.SIZE.LARGE}
                        textStyle={{
                            fontWeight: '300',
                            left: up ? 30 : 15,
                            fontFamily: 'Plus Jakarta Sans',
                        }}
                    />

                    <Image source={up ? up_arrow : down_arrow} style={styles.up} />
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    view: {
        marginLeft: RF(20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    up: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        marginLeft: RF(50),
    },
    crossButton: {
        marginLeft: -60,
    },
    bgImageContainer: {
        width: '100%',
        resizeMode: 'contain',
        backgroundColor: 'transparent',
        height: RF(65),
        marginTop: -7,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    image: {
        resizeMode: 'contain',
        width: horizontalScale(25),
        height: verticalScale(25),
    },
});

export default ImageBackgroundWrapper;
