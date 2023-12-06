import React from "react";
import AppText from "../AppText";
import { RF, Typography } from "@theme";
import { useTheme } from "@react-navigation/native";
import { StyleSheet, Text, TextInput, View } from "react-native";

const CustomInput = ({
  dollar,
  value,
  title,
  inputRef,
  percentage,
  onChangeText,
  keyboardType,
  onSubmitEditing,
}: {
  percentage?: any;
  dollar?: any;
  title?: any;
  value?: any;
  inputRef?: any;
  keyboardType?: any;
  onChangeText?: any;
  onSubmitEditing?: () => void;
}) => {
  const theme: any = useTheme();

  return (
    <View style={styles.container}>
      <AppText
        center
        defaultTextColor
        size={Typography.FONTS.SIZE.XLARGE}
        title={title}
      />

      <View style={styles.row}>
        {!dollar && (
          <AppText
            regular
            title={"$"}
            defaultTextColor
            textStyle={styles.txt}
            colorText={"#4A556840"}
            size={42}
          />
        )}
        <TextInput
          autoFocus={true}
          value={value}
          ref={inputRef}
          placeholder={"0"}
          numberOfLines={1}
          keyboardType="numeric"
          onSubmitEditing={onSubmitEditing}
          placeholderTextColor={theme?.colors?.text}
          onChangeText={(text) => onChangeText(text)}
          style={{
            maxWidth: "60%",
            fontSize: RF(52),
            fontWeight: "400",
            fontFamily: "Plus Jakarta Sans",
          }}
          onLayout={() => inputRef?.current?.focus()}
          autoFocus
        />
        {/* {value !== "" && ( */}
        {/* <Text
          style={{
            color: "#000",
            fontSize: RF(52),
            paddingTop: 10.3,
            fontWeight: "400",
            fontFamily: "Plus Jakarta Sans",
          }}
        >
          .00
        </Text> */}
        {percentage && (
          <AppText
            regular
            title={"%"}
            defaultTextColor
            textStyle={styles.txt}
            colorText={"#4A556840"}
            size={42}
          />
        )}
        {/* )} */}
      </View>
      {/* <AppText title={"hggyy"} defaultTextColor size={17} medium /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  txt: { paddingTop: RF(13) },
  container: {
    //

    marginTop: -60,
    alignItems: "center",
  },
  inputContainer: {
    fontSize: RF(52),
    letterSpacing: 5,
    textAlign: "center",
    fontWeight: "400",
    fontFamily: "Plus Jakarta Sans",
  },
});

export default CustomInput;
