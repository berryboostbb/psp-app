import React, { useRef } from "react";
import AppText from "../AppText";
import { RF, Typography } from "@theme";
import { useTheme } from "@react-navigation/native";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

interface Props {
  value?: any;
  style?: any;
  type?: any;
  title?: string;
  onChangeText?: any;
  onPress?: () => void;
}

const Preset_Amount = (props: Props) => {
  const myTheme: any = useTheme();
  const styles = useStyles(myTheme.colors);
  const { title, onPress, style, value, onChangeText, type } = props;
  const inputRef = useRef<any>(null);

  const handleTouchInput = () => {
    inputRef.current.focus();
  };

  return (
    <View style={styles.view}>
      <AppText
        bold
        title={title}
        colorText={myTheme.colors.border}
        size={Typography.FONTS.SIZE.XLARGE}
      />

      <Pressable style={styles.inputView} onPress={handleTouchInput}>
        {type != "percent" && (
          <AppText
            defaultTextColor
            title={type == "percent" ? "%" : "$"}
            size={Typography.FONTS.SIZE.SMALL}
            textStyle={{
              fontFamily: "Plus Jakarta Sans",
            }}
          />
        )}
        <TextInput
          ref={inputRef}
          value={value}
          style={styles.input}
          textAlign={"center"}
          keyboardType={"phone-pad"}
          onChangeText={(text) => onChangeText(text)}
        />
        {type == "percent" && (
          <AppText
            defaultTextColor
            title={type == "percent" ? "%" : "$"}
            size={Typography.FONTS.SIZE.SMALL}
            textStyle={{
              fontFamily: "Plus Jakarta Sans",
            }}
          />
        )}
      </Pressable>
    </View>
  );
};

const useStyles = (colors: any) =>
  StyleSheet.create({
    inputView: {
      flexDirection: "row",
      alignItems: "center",
      width: RF(200),
      height: RF(60),
      marginTop: RF(10),
      borderRadius: RF(50),
      backgroundColor: colors.light_grey,
      justifyContent: "center",
    },
    input: {
      height: RF(60),
      fontFamily: "Plus Jakarta Sans",
    },
    view: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: RF(30),
    },
  });

export default Preset_Amount;
