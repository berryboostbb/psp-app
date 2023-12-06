import {
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React from "react";
import AppText from "../AppText";
import { useTheme } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import { RF, horizontalScale, verticalScale, Typography } from "@theme";

const ErrorHeader = ({
  txt,
  title,
  source,
  onPress,
  colorText,
  tintColor,
  imageStyle,
  titleImage,
}: {
  txt?: any;
  title?: any;
  source?: any;
  tintColor?: any;
  colorText?: any;
  imageStyle?: any;
  titleImage?: any;
  onPress?: () => void;
}) => {
  const theme: any = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "transparent",
        height: RF(120),
      }}
    >
      <ImageBackground
        source={source}
        resizeMode="contain"
        style={[styles.bgImageContainer, imageStyle]}
      >
        <Image
          style={[styles.img, { tintColor: tintColor }]}
          source={titleImage}
        />
        <AppText
          regular
          colorText={colorText}
          textStyle={styles.txt}
          size={Typography.FONTS.SIZE.MEDIUM}
          title={title}
          center
        />
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  txt: { marginLeft: RF(20), fontFamily: "Plus Jakarta Sans" },
  img: {
    width: RF(35),
    height: RF(40),
    resizeMode: "contain",
  },
  bgImageContainer: {
    resizeMode: "contain",
    height: RF(132),
    marginTop: -10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    resizeMode: "contain",
    width: horizontalScale(105),
    height: verticalScale(118),
    alignSelf: "center",
    marginTop: RF(30),
  },
});

export default ErrorHeader;
