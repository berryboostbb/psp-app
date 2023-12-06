import React from "react";
import AppText from "../AppText";
import { exclaimation } from "@assets";
import { RF, Typography } from "@theme";
import { Image, StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";

const ErrorText = ({
  title,
  tintColor,
  size,
}: {
  title?: any;
  tintColor?: any;
  size?: any;
}) => {
  const theme: any = useTheme();

  return (
    <View style={styles.view}>
      <Image
        source={exclaimation}
        style={[styles.img, { tintColor: tintColor }]}
      />
      <AppText
        semiBold
        title={title}
        textStyle={styles.txt}
        colorText={theme.colors.errColor}
        size={Typography.FONTS.SIZE.LARGE}
        // size={RF(size)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: { flexDirection: "row", marginTop: RF(20), marginLeft: RF(40) },
  txt: { width: RF(200), marginLeft: RF(2), fontFamily: "Plus Jakarta Sans" },
  img: {
    width: RF(30),
    height: RF(20),
    resizeMode: "contain",
  },
});

export default ErrorText;
