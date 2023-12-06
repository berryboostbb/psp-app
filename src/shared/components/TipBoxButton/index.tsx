import * as React from "react";
import { FunctionComponent } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  View,
  TextStyle,
} from "react-native";
import { horizontalScale, verticalScale, RF, GST, Typography } from "@theme";
import { useTheme } from "@react-navigation/native";
import AppText from "../AppText";

interface Props extends TouchableOpacityProps {
  title: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: string;
  loading?: boolean;
  large?: boolean;
  disabled?: boolean;
  disabledMessage?: boolean;
  titleColorProp?: string;
  onPress?: any;
  disableBackgroundColor?: boolean;
  doller?: any;
  percentage?: any;
  valueColor?: any;
  selected?: any;
  subTitle?: any;
}

const TipBoxButton = (props: Props) => {
  const colorTheme: any = useTheme();
  const {
    disableBackgroundColor,
    buttonStyle,
    onPress,
    title,
    doller,
    percentage,
    valueColor,
    selected,
    subTitle,
  } = props;

  return (
    <TouchableOpacity
      {...props}
      style={[
        styles.container,
        buttonStyle,
        {
          backgroundColor:
            selected == title ? colorTheme?.colors?.primary : "#f5f5f5",
        },
      ]}
    >
      {doller && (
        <View style={{ ...GST.ROW }}>
          {/* <AppText
            semiBold
            title={"$"}
            size={Typography.FONTS.SIZE.XLARGE}
            colorText={selected == title ? "white" : colorTheme?.colors?.text}
          /> */}
          <AppText
            semiBold
            title={title}
            size={Typography.FONTS.SIZE.XLARGE}
            colorText={selected == title ? "white" : colorTheme?.colors?.text}
          />
        </View>
      )}
      {percentage && (
        <View style={{ ...GST.CENTER }}>
          <View style={{ ...GST.ROW }}>
            <AppText
              medium
              title={title}
              size={Typography.FONTS.SIZE.XLARGE}
              colorText={selected == title ? "white" : colorTheme?.colors?.text}
            />
            {/* <AppText
              medium
              title={"%"}
              size={Typography.FONTS.SIZE.XLARGE}
              colorText={selected == title ? "white" : colorTheme?.colors?.text}
            /> */}
          </View>
          <View style={{ ...GST.ROW }}>
            <AppText
              medium
              title={subTitle}
              size={Typography.FONTS.SIZE.XSMALL}
              colorText={selected == title ? "white" : colorTheme?.colors?.text}
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default TipBoxButton;

const styles = StyleSheet.create({
  container: {
    width: RF(110),
    // padding: 10,
    height: RF(60),
    alignItems: "center",
    borderRadius: RF(100),
    justifyContent: "center",
  },
  text: {
    fontSize: RF(15),
  },
});
