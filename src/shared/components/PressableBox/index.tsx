import React from 'react';
import AppText from '../AppText';
import { nextArrow } from '@assets';
import { RF, SCREEN_WIDTH, Typography } from '@theme';
import { useTheme } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, Image, StyleProp, ViewStyle } from 'react-native';

interface Props {
    clr?: any;
    title?: string;
    dollarText?: any;
    onPress?: () => void;
    disable?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
}

const Pressable_Box = ({ containerStyle = {}, ...props }: Props) => {
    const { title, onPress, dollarText, clr, disable } = props;
    const myTheme: any = useTheme();
    const styles = useStyles(myTheme.colors);

    return (
        <TouchableOpacity {...props} style={[styles.main, containerStyle]} onPress={onPress} disabled={disable}>
            <AppText
                semiBold
                title={title}
                size={SCREEN_WIDTH / 18}
                // size={Typography.FONTS.SIZE.XLARGE}
                defaultTextColor={false}
                colorText={disable ? myTheme.colors.dim_grey : clr ? clr : myTheme.colors.text}
            />
            {dollarText && <AppText semiBold title={'($0.00'} size={Typography.FONTS.SIZE.XLARGE} colorText={myTheme.colors.light_grey} />}
            <Image source={nextArrow} style={[styles.img, { tintColor: disable && myTheme.colors.dim_grey }]} />
        </TouchableOpacity>
    );
};

const useStyles = (colors: any) =>
    StyleSheet.create({
        main: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: RF(80),
            paddingHorizontal: RF(35),
            marginTop: RF(10),
        },
        img: {
            width: RF(30),
            height: RF(30),
            tintColor: '#000',
            resizeMode: 'contain',
        },
    });

export default Pressable_Box;
