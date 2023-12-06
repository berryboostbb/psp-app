import {
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
  TouchableOpacityProps,
  StatusBar,
} from "react-native";
import React from "react";
import { RF, SCREEN_HEIGHT, SCREEN_WIDTH } from "@theme";
import { useTheme } from "@react-navigation/native";

interface Props extends TouchableOpacityProps {
  style?: any;
  bgColor?: any;
  icon?: string;
  onPress?: any;
  title?: string;
  children?: any;
  large?: boolean;
  colorTheme?: any;
  loading?: boolean;
  disabled?: boolean;
  titleColorProp?: string;
  disabledMessage?: boolean;
  viewStyle?: any;
  textStyle?: StyleProp<TextStyle>;
  disableBackgroundColor?: boolean;
  isPaddingH?: any;
  isTop?: any;
}
const Test_Wrapper = (props: Props) => {
  const theme: any = useTheme();
  const styles = useStyles(theme.colors);

  return (
    <View
      style={[
        styles.container,
        props.viewStyle,
        {
          paddingTop: props?.isTop ? RF(20) : 0,
          paddingHorizontal: props?.isPaddingH ? RF(20) : 0,
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
        },
      ]}
    >
      <StatusBar
        // translucent
        backgroundColor={theme?.colors?.text}
        // barStyle={theme.colors.STATUS_BAR_STYLE}
      />
      {props.children}
    </View>
  );
};

const useStyles = StyleSheet.create((color: any) => ({
  container: { backgroundColor: color.white },
}));

export default Test_Wrapper;
