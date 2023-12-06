import {
  View,
  Image,
  StyleProp,
  ViewStyle,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import React from "react";
import { GST } from "@theme";
import AppText from "../AppText";
import { RF, Typography } from "@theme";
import { useTheme } from "@react-navigation/native";

interface Props extends TouchableOpacityProps {
  title?: any;
  icon?: any;
  small?: any;
  loading?: any;
  onPress?: any;
  disableBackgroundColor?: any;
  buttonStyle?: StyleProp<ViewStyle>;
}

const SecondaryButton = (props: Props) => {
  const colorTheme: any = useTheme();
  const {
    icon,
    small,
    title,
    loading,
    buttonStyle,
    disableBackgroundColor,
    onPress,
  } = props;

  return (
    <TouchableOpacity
      style={[
        small ? styles.smallContainer : styles.container,
        buttonStyle,
        {
          backgroundColor: !disableBackgroundColor
            ? colorTheme?.colors?.primary
            : colorTheme?.colors?.white,
        },
        { borderWidth: !disableBackgroundColor ? 0 : 1 },
        {
          borderColor: !disableBackgroundColor
            ? colorTheme?.colors?.primary
            : colorTheme?.colors?.light_grey,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={loading}
    >
      <View style={styles.view}>
        {icon && (
          <Image source={icon} style={[styles.icon]} resizeMode="contain" />
        )}
        {loading ? (
          <ActivityIndicator color={"black"} />
        ) : (
          <AppText
            semiBold
            title={title}
            colorText={
              !disableBackgroundColor
                ? colorTheme?.colors?.white
                : colorTheme?.colors?.text
            }
            size={Typography.FONTS.SIZE.XLARGE}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SecondaryButton;

const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    width: RF(260),
    height: RF(75),
    alignSelf: "center",
    borderRadius: Typography.RADIUS.FULL,
    ...GST.CENTER,
    marginBottom: Typography.MARGIN.NORMAL,
    flexDirection: "row",
  },
  smallContainer: {
    width: RF(220),
    height: RF(60),
    alignSelf: "center",
    borderRadius: Typography.RADIUS.FULL,
    ...GST.CENTER,
    marginBottom: Typography.MARGIN.NORMAL,
    flexDirection: "row",
    borderWidth: 0.2,
  },
  icon: {
    height: RF(30),
    width: RF(30),
    paddingVertical: 10,
    marginRight: Typography.MARGIN.LOW,
  },
  buttonText: {
    fontSize: Typography.FONTS.SIZE.SMALL,
  },
});
