import {
  View,
  Image,
  StyleProp,
  ViewStyle,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import React from "react";
import AppText from "../AppText";
import { linear } from "@assets";
import { RF, Typography } from "@theme";
import { useTheme } from "@react-navigation/native";
import Overlay from "../Overlay";

interface Props extends TouchableOpacityProps {
  icon?: any;
  title?: any;
  type?: any;
  onClick?: any;
  onPress?: any;
  src?: any;
  buttonStyle?: StyleProp<ViewStyle>;
}

const LinearButton = (props: Props) => {
  const colorTheme: any = useTheme();
  const { title, onPress, icon, onClick, type, disabled, src } = props;

  return (
    <TouchableOpacity
      {...props}
      onPress={onPress}
      style={[
        styles.btn,
        {
          backgroundColor:
            onClick === type ? colorTheme?.colors?.primary : "transparent",
        },
      ]}
    >
      <ImageBackground
        source={src ? src : onClick === type ? 0 : linear}
        style={styles.img}
        imageStyle={[
          styles.smallContainer,
          {
            opacity:
              disabled &&
              (type == "sale" || type == "refund" || type == "reprint_receipt")
                ? 0.2
                : 1,
          },
        ]}
      >
        <View style={styles.view}>
          {icon && (
            <Image
              source={icon}
              style={[
                styles.icon,
                {
                  tintColor: onClick == type ? colorTheme.colors.white : "#000",
                },
              ]}
              resizeMode="contain"
            />
          )}
          <AppText
            semiBold
            title={title}
            size={Typography.FONTS.SIZE.XLARGE}
            textStyle={{
              opacity:
                disabled &&
                (type == "sale" ||
                  type == "refund" ||
                  type == "reprint_receipt")
                  ? 0.2
                  : 1,
              fontFamily: "Plus Jakarta Sans",
              fontWeight: "500",
            }}
            colorText={
              onClick === type
                ? colorTheme.colors.white
                : colorTheme?.colors?.text
            }
          />
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default LinearButton;

const styles = StyleSheet.create({
  img: {
    marginBottom: RF(10),
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    width: "60%",
    height: RF(73),
    marginBottom: RF(20),
    borderRadius: RF(40),
  },
  smallContainer: {
    height: RF(73),
    resizeMode: "contain",
  },
  view: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: RF(20),
  },
  icon: {
    height: RF(30),
    width: RF(30),
    marginRight: Typography.MARGIN.LOW,
  },
  buttonText: {
    fontSize: Typography.FONTS.SIZE.SMALL,
    fontFamily: "Plus Jakarta Sans",
  },
});
