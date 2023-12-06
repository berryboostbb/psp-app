import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import { GST, RF, SCREEN_HEIGHT, SCREEN_WIDTH } from "@theme";
import { AppText } from "@components";
import {
  wifi,
  declined,
  curvePoint,
  warnIcon,
  yellow,
  orange,
  declinedWhite,
} from "@assets";
import ErrorHeader from "./../ErrorHeader/index";
import { navigate } from "@services";
import { useNavigation } from "@react-navigation/native";

interface Props {
  imageName?: any;
  titleError?: any;
  content?: any;
  error?: any;
  errorImage?: any;
}
const ErrorImageWrapper = (props: Props) => {
  const { imageName, titleError, content, error, errorImage } = props;
  const theme: any = useTheme();
  const styles = useStyles(theme.colors);
  const navigation: any = useNavigation();

  // useEffect(() => {
  //   setTimeout(() => {
  //     navigation.goBack();
  //   }, 3000);
  // }, []);

  return (
    <>
      {errorImage && (
        <ErrorHeader
          source={errorImage}
          colorText={"white"}
          title={"Transaction Declined"}
          titleImage={declinedWhite}
        />
      )}

      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <AppText title={titleError} size={28} medium defaultTextColor />
          <AppText
            title={content}
            size={17}
            medium
            defaultTextColor
            center
            textStyle={styles.contentText}
          />
        </View>
        <Image source={imageName} style={styles.image} />
      </View>
    </>
  );
};

export default ErrorImageWrapper;

const useStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      ...GST.CENTER,
    },
    image: {
      width: "100%",
      height: SCREEN_WIDTH / 3.9,
      resizeMode: "contain",
      marginTop: RF(40),
    },
    mainContainer: { paddingVertical: RF(20) },
    contentText: { paddingTop: RF(10) },
  });
