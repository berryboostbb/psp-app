import * as React from "react";
import {
  StyleProp,
  ViewStyle,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import AppText from "../AppText";
import { useTheme } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import { horizontalScale, verticalScale, RF, Typography } from "@theme";

interface Props extends TouchableOpacityProps {
  clr?: any;
  title?: any;
  bgColor?: any;
  onPress?: () => void;
  disableBackgroundColor?: any;
  buttonStyle?: StyleProp<ViewStyle>;
}

const PrimaryButton = (props: Props) => {
  const colorTheme: any = useTheme();
  const { disableBackgroundColor, bgColor, buttonStyle, onPress, title, clr } =
    props;

  return (
    // <Animatable.View animation={onPress  && "bounce"}>
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        buttonStyle,
        {
          backgroundColor: bgColor ? bgColor : colorTheme?.colors?.text,
          borderColor:
            !disableBackgroundColor == false
              ? ""
              : colorTheme?.colors?.light_grey,
          borderWidth: !disableBackgroundColor == false ? 0.2 : 0,
        },
      ]}
    >
      <AppText
        medium
        title={title}
        size={Typography.FONTS.SIZE.MEDIUM}
        colorText={clr ? clr : colorTheme?.colors?.white}
      />
    </TouchableOpacity>
    // </Animatable.View>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  container: {
    width: RF(130),
    height: RF(40),
    borderRadius: RF(100),
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: RF(15),
    fontFamily: "Plus Jakarta Sans",
  },
});
