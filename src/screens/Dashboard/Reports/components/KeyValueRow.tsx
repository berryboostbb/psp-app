import { AppText } from "@components";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface Props {
  keyStr: string;
  value: string;
  fontSize?: number;
  boldKey?: boolean;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
}

const KeyValueRow = ({
  keyStr,
  value,
  fontSize = 16,
  boldKey = false,
  style,
  textColor = "#4A5568",
}: Props) => {
  return (
    <View style={[styles.container, style]}>
      <AppText
        title={keyStr}
        size={fontSize}
        bold={boldKey}
        colorText={textColor}
      />
      <AppText title={value} size={fontSize} colorText={textColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default KeyValueRow;
