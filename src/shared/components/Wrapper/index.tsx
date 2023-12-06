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
import { useKeyboard } from "@hooks";

interface Props extends TouchableOpacityProps {
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
  viewStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disableBackgroundColor?: boolean;
  isPaddingH?: any;
  isTop?: any;
  flagStatus?: any;
}
const Wrapper = (props: Props) => {
  const theme: any = useTheme();
  const styles = useStyles(theme.colors);
  const keybaordCheck = useKeyboard();

  return (
    <View
      {...props}
      style={[
        styles.container,
        props.viewStyle,
        {
          paddingTop: props?.isTop ? RF(20) : 0,
          paddingHorizontal: props?.isPaddingH ? RF(20) : 0,
          // width: SCREEN_WIDTH,
          // height: SCREEN_HEIGHT,
        },
      ]}
    >
      <View
        style={{
          height: keybaordCheck ? 0 : 0,
        }}
      >
        <StatusBar
          // translucent
          backgroundColor={theme?.colors?.text}
          // barStyle={theme.colors.STATUS_BAR_STYLE}
          barStyle="light-content"
          hidden={props.flagStatus}
        />
      </View>

      {props.children}
    </View>
  );
};

const useStyles = StyleSheet.create((color: any) => ({
  container: { flex: 1, backgroundColor: color.white },
}));

export default Wrapper;
