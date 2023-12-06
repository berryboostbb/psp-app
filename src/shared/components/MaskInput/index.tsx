import React from "react";
import MaskInput from "react-native-mask-input";
import { StyleSheet, View, ViewStyle, Image, Text } from "react-native";
import { RF } from "@theme";
import { useTheme } from "@react-navigation/native";
import { AppText } from "@components";

interface Props {
  icon: any;
  mask: any;
  value: any;
  error: any;
  title?: any;
  optional: any;
  maxLength?: any;
  placeholder: any;
  containerStyle: ViewStyle;
  onChangeText: (txt: any) => void;
  handleSubmitEditting: () => void;
  returnKeyType?: any;
  style?: any;
}

const MaskedTextInput = React.forwardRef((props: Partial<Props>, ref: any) => {
  const {
    icon,
    mask,
    title,
    error,
    value,
    optional,
    maxLength,
    placeholder,
    onChangeText,
    handleSubmitEditting,
    containerStyle,
    style,
  } = props;
  const theme: any = useTheme();
  const colorTheme = theme.colors;
  const styles = useStyles(colorTheme);
  return (
    <>
      <View style={[styles.inputContainer, containerStyle]}>
        <AppText
          bold
          title={title}
          defaultTextColor
          textStyle={styles.wd}
          size={RF(22)}
        />
        {/* <View style={styles.txt}>
            <Text style={styles.OptionalText}>{optional}</Text>
          </View> */}
        <View style={styles.iconInputContainer}>
          {/* {icon && (
            <Image source={flag} resizeMode="contain" style={styles.icon} />
          )} */}
          <MaskInput
            ref={ref}
            mask={mask}
            value={value}
            style={style ? style : styles.ml}
            maxLength={maxLength}
            keyboardType="phone-pad"
            placeholder={placeholder}
            onChangeText={onChangeText}
            onSubmitEditing={handleSubmitEditting}
            placeholderTextColor={colorTheme.gray}
            maskAutoComplete={true}
          />
        </View>
      </View>
      <View style={{ height: !!error ? RF(35) : RF(20) }}>
        {!!error && <Text style={styles.errorStyle}>{error}</Text>}
      </View>
    </>
  );
});

export default MaskedTextInput;

const useStyles = (colors: any) =>
  StyleSheet.create({
    ml: { width: "90%" },
    errorStyle: {
      color: "red",
      paddingTop: 3,
      fontSize: RF(14),
      marginLeft: 15,
      marginBottom: RF(10),
      // flex: 1,
      // backgroundColor: "green",
    },
    inputContainer: {},
    iconInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.light_grey,
      borderRadius: 40,
      height: RF(50),
      paddingLeft: 5,
    },
    input: {
      flex: 1,
      height: 40 > 50 ? 50 : 40,
      fontSize: 12.5,
    },
    icon: { width: RF(70), height: RF(40) },
    placeholderText: {},
    textContainer: {
      marginLeft: 20,
      marginTop: 15,
    },
    OptionalText: {
      color: "#a1c452",
      fontSize: 11,
      fontFamily: "Plus Jakarta Sans",
    },
    txt: {
      flex: 1,
      alignItems: "flex-end",
      marginRight: 10,
      paddingRight: 10,
    },
    wd: {
      width: "100%",
      marginBottom: 10,
      marginLeft: 15,
      fontFamily: "Plus Jakarta Sans",
    },
  });
