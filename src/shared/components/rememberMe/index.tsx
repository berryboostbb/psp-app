import {
  horizontalScale,
  moderateScale,
  verticalScale,
  RF,
  HP,
  WP,
  GST,
  Typography,
  SCREEN_WIDTH,
} from "@theme";
import React from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ViewStyle,
  Text,
  TouchableOpacityProps,
  StyleProp,
  TextStyle,
} from "react-native";
import ToggleSwitch from "toggle-switch-react-native";
import AppText from "../AppText";
import { useTheme } from "@react-navigation/native";

interface Props extends TouchableOpacityProps {
  onPress?: () => void;
  setRememberEmail?: any;
  isToggle?: any;
  onPressForgotPass?: () => void;
  title?: any;
  rememberMe?: any;
  style?: any;
  onClick?: () => void;
  viewStyle?: ViewStyle;
}
const RememberMe = (props: Props) => {
  const { isToggle, onPress, title } = props;
  const myTheme: any = useTheme();

  return (
    <View style={[{ ...GST.mid_row }]}>
      <ToggleSwitch
        onColor={myTheme?.colors?.toggleColor}
        offColor={myTheme?.colors?.border}
        isOn={isToggle}
        onToggle={onPress}
      />
      <AppText
        textStyle={styles.txt}
        title={title}
        defaultTextColor
        size={SCREEN_WIDTH / 22}
        medium
      />
    </View>
  );
};

const styles = StyleSheet.create({
  passwordText: {},
  forgotView: {
    flexDirection: "row",
  },
  txt: {
    paddingLeft: RF(10),
    alignSelf: "center",
    marginRight: 20,
    fontFamily: "Plus Jakarta Sans",
  },
});

export default RememberMe;
