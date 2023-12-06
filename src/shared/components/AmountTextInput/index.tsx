import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInput,
  TextInputProps,
} from "react-native";
import React from "react";
import { AppText } from "@components";
import { useTheme } from "@react-navigation/native";
import { verticalScale, Typography, RF } from "@theme";

interface Props extends TextInputProps {
  inputStyle?: StyleProp<ViewStyle>;
  textInputStyle?: StyleProp<TextStyle>;
  iconColor?: string;
  inputRef?: any;
  value?: any;
  onSubmitEditing?: any;
  amountTitle?: string;
}
const AmountTextInput = (props: Props) => {
  const { amountTitle } = props;
  const theme: any = useTheme();
  const styles = useStyles(theme.colors);

  return (
    <View style={{ marginTop: 30 }}>
      <AppText
        center
        defaultTextColor
        title={amountTitle}
        size={Typography.FONTS.SIZE.XLARGE}
        textStyle={{ paddingTop: verticalScale(30) }}
      />
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <AppText
          center
          medium
          title={"$"}
          textStyle={{ opacity: 0.5 }}
          size={Typography.FONTS.SIZE.LARGER}
        />
        <TextInput
          {...props}
          placeholder={"0"}
          keyboardType="numeric"
          value={props.value}
          style={[styles.inputContainer]}
          placeholderTextColor={theme.colors.text}
          onChangeText={props.onChangeText}
        ></TextInput>
      </View>
    </View>
  );
};

export default AmountTextInput;

const useStyles = StyleSheet.create((color: any) => ({
  inputContainer: {
    fontSize: RF(62),
  },
}));
