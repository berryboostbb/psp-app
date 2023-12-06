import {
  StyleProp,
  TextInput,
  ViewStyle,
  TextStyle,
  StyleSheet,
  TextInputProps,
  Pressable,
  Text,
} from "react-native";
import React from "react";
import AppText from "../AppText";
import { useTheme } from "@react-navigation/native";
import { horizontalScale, verticalScale, RF, Typography } from "@theme";
import Ionicons from "react-native-vector-icons/Ionicons";

interface Props extends TextInputProps {
  style?: any;
  title?: string;
  autoFocus?: any;
  placeholder?: any;
  letterSpacing?: any;
  onSubmitEditing?: any;
  secureTextEntry?: any;
  viewStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  inputBackgroundColor?: boolean | undefined;
  placehldrTextColor?: boolean | undefined | string;
  defaultValue?: any;
  value?: any;
  editable?: any;
  onChangeText?: any;
  keyboardType?: any;
  inputRef?: any;
  textInputBag?: any;
  placeholderTextColor?: any;
  icon?: string;
  onPressIcon?: any;
}

const AppTextInput = (props: Props) => {
  // const AppTextInput = React.forwardRef((props: Partial<Props>, ref) => {
  const myTheme: any = useTheme();
  // const inputRef: any = useRef();
  const {
    title,
    style,
    value,
    editable,
    autoFocus,
    placeholder,
    keyboardType,
    defaultValue,
    letterSpacing,
    secureTextEntry,
    onSubmitEditing,
    onChangeText,
    inputRef,
    textInputBag,
    placeholderTextColor,
    icon,
    onPressIcon,
  } = props;

  const onOpen = () => {
    inputRef?.current?.blur();
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 100);
  };

  return (
    <>
      <AppText
        title={title}
        defaultTextColor
        size={Typography.FONTS.SIZE.LARGE}
        textStyle={[
          {
            paddingLeft: RF(20),
            fontFamily: "Plus Jakarta Sans",
            fontWeight: "700",
          },
          style,
        ]}
      />
      <Pressable onPress={onOpen} style={{ height: 60, zIndex: 100 }}>
        <TextInput
          {...props}
          value={value}
          editable={editable}
          keyboardType={keyboardType}
          defaultValue={defaultValue}
          autoFocus={autoFocus}
          placeholder={placeholder}
          placeholderTextColor={
            placeholderTextColor
              ? placeholderTextColor
              : myTheme?.colors?.border
          }
          style={[
            styles.inputContainer,
            {
              //#4A55681A #F6F8FA
              backgroundColor: textInputBag
                ? // ? myTheme?.colors?.background
                  "#4A55681A"
                : myTheme?.colors?.background,
              letterSpacing: letterSpacing,
            },
            props.viewStyle,
            props.textStyle,
          ]}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          ref={inputRef}
          onTouchStart={onOpen}
        />
        <Pressable
          onPress={onPressIcon}
          style={{ position: "absolute", right: 20, top: 20 }}>
          <Ionicons name={icon} size={20} />
        </Pressable>
      </Pressable>
    </>
  );
};

export default AppTextInput;

const styles = StyleSheet.create({
  inputContainer: {
    height: RF(50),
    width: horizontalScale(300),
    alignSelf: "center",
    borderRadius: RF(50),
    marginTop: verticalScale(10),
    paddingHorizontal: Typography?.PADDING.HIGH,
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "500",
    fontSize: RF(16),
  },
  text: {
    fontSize: RF(15),
  },
});
