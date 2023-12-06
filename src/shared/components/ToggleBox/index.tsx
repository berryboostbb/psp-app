import React from 'react';
import AppText from '../AppText';
import { RF, Typography } from '@theme';
import { useTheme } from '@react-navigation/native';
import ToggleSwitch from 'toggle-switch-react-native';
import { StyleSheet, TouchableOpacity, View, Pressable } from 'react-native';

interface Props {
    style?: any;
    heading?: any;
    title?: string;
    onToggle?: any;
    subHeading?: any;
    isEnabled?: any;
    storeTheme?: any;
    disabled?: any;
    pressableTitle?: any;
    onPress?: () => void;
    onPressTitle?: () => void;
}

const Toggle_Box = (props: Props) => {
    const { title, style, onPress, heading, onToggle, isEnabled, storeTheme, disabled, subHeading, onPressTitle, pressableTitle } = props;
    const theme: any = useTheme();
    const styles = useStyles(theme.colors);

    return (
        <View>
            {title && <AppText bold title={title} defaultTextColor size={Typography.FONTS.SIZE.LARGE} textStyle={[{ paddingLeft: RF(25) }, style]} />}
            <Pressable style={styles.main} onPress={onPress}>
                <View style={styles.txtView}>
                    <View>
                        <AppText
                            medium
                            title={heading}
                            // defaultTextColor
                            colorText={disabled ? theme.colors.dim_grey : theme.colors.text}
                            size={Typography.FONTS.SIZE.XLARGE}
                        />
                        <AppText
                            regular
                            // defaultTextColor
                            colorText={disabled ? theme.colors.dim_grey : theme.colors.text}
                            title={subHeading}
                            size={Typography.FONTS.SIZE.MEDIUM}
                        />
                        {pressableTitle && (
                            <TouchableOpacity onPress={onPressTitle} disabled={disabled} style={{ marginTop: RF(10), width: '90%' }}>
                                <AppText
                                    medium
                                    title={pressableTitle}
                                    // colorText={theme.colors.primary}
                                    colorText={disabled ? theme.colors.dim_grey : theme.colors.primary}
                                    size={Typography.FONTS.SIZE.LARGE}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                    <ToggleSwitch isOn={isEnabled} disabled={disabled} onColor={'green'} offColor="#dcdcdc" onToggle={onToggle} />
                </View>
            </Pressable>
        </View>
    );
};

const useStyles = (colors: any) =>
    StyleSheet.create({
        txtView: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '110%',
        },
        main: {
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: RF(120),
            paddingHorizontal: RF(35),
            marginTop: RF(20),
            borderWidth: 1,
            borderColor: colors.light_grey,
            borderRadius: RF(16),
        },
    });

export default Toggle_Box;
