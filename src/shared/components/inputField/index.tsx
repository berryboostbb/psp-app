import React from "react";
import { RF } from "@theme";
import { useTheme } from "@react-navigation/native";
import { Pressable, StyleSheet, TextInput } from "react-native";

const InputField = ({
  inputRef,
  value,
  onSubmitEditing,
  keyboardType,
  onChangeText,
  maxLength = 8,
  fontSize = RF(52),
}: {
  inputRef?: any;
  value?: any;
  onSubmitEditing?: any;
  keyboardType: any;
  onChangeText?: any;
  maxLength?: number | undefined;
  fontSize?: any;
}) => {
  const theme: any = useTheme();

  const onOpen = () => {
    inputRef?.current?.blur();
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 100);
  };

  return (
    <Pressable onPress={onOpen} style={{ height: 100, zIndex: 100 }}>
      <TextInput
        onTouchStart={onOpen}
        spellCheck={false}
        autoCorrect={false}
        autoFocus
        maxLength={maxLength}
        value={value}
        ref={inputRef}
        placeholder={""}
        keyboardType={keyboardType}
        style={[styles.inputContainer, { fontSize: fontSize }]}
        onSubmitEditing={onSubmitEditing}
        onChangeText={(text) => onChangeText(text)}
        placeholderTextColor={theme?.colors?.text}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    fontSize: RF(52),
    letterSpacing: 5,
    textAlign: "center",
    fontWeight: "400",
    fontFamily: "Plus Jakarta Sans",
  },
});

export default InputField;
