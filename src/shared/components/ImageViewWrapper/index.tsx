import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacityProps,
  Image,
} from "react-native";
import React from "react";
import AppText from "../AppText";
import { useSelector } from "react-redux";
import { GST, RF, SCREEN_HEIGHT, Typography } from "@theme";
import { LottieAnimation } from "@components";
import { useTheme } from "@react-navigation/native";
import {
  checkMarkJson,
  animBackground,
  logoJson,
  processingAnim,
  processing_gif,
} from "@assets";
import { languagePicker } from "@utils";

interface Props extends TouchableOpacityProps {
  type?: any;
  flag?: any;
  children?: any;
  imageName?: any;
  viewStyle?: any;
}

const ImageViewWrapper = (props: Props) => {
  const language = useSelector((state: any) => state.user.languageType);
  const theme: any = useTheme();
  const { type, children, imageName, viewStyle, flag } = props;
  const { flowType } = useSelector((state: any) => state.user);
  const orderData = useSelector((state: any) => state.common.orderData);

  return (
    <View style={[styles.container, viewStyle]}>
      {children}
      {/* <Image style={[styles.image]} source={imageName} /> */}
      {flag === "Processing" ? (
        // <ImageBackground
        //   source={animBackground}
        //   imageStyle={{ resizeMode: "contain" }}
        //   style={styles.imgBackgroundView}
        // >
        // </ImageBackground>
        <View
          style={{
            position: "absolute",
          }}
        >
          {/* <LottieAnimation source={processingAnim} height={640} /> */}
          <Image
            source={processing_gif}
            style={{
              height: SCREEN_HEIGHT,
              resizeMode: "contain",
              top: -80,
            }}
          />
        </View>
      ) : (
        <View
          style={{
            position: "absolute",
            top: 30,
          }}
        >
          <LottieAnimation source={checkMarkJson} height={300} />
        </View>
      )}

      <View
        style={{
          ...GST.CENTER,
          position: "absolute",
          bottom: 80,
        }}
      >
        <AppText
          semiBold
          defaultTextColor
          size={Typography.FONTS.SIZE.XXXLARGE}
          title={
            flag === "Processing"
              ? languagePicker(language, "Processing")
              : languagePicker(language, "Approved")
          }
        />
        <AppText
          textStyle={{ marginVertical: RF(10) }}
          defaultTextColor
          size={Typography.FONTS.SIZE.LARGE}
          title={
            flag === "Processing"
              ? languagePicker(language, "Please Wait....")
              : languagePicker(language, "Thank You!")
          }
        />

        {orderData.entry_mode == "C" && (
          <>
            {flag == "Approved" ? (
              <AppText
                defaultTextColor
                size={Typography.FONTS.SIZE.LARGE}
                title={
                  type == "insert"
                    ? languagePicker(language, "Please Remove Card")
                    : languagePicker(language, "Please Hand Device to Clerk")
                }
              />
            ) : (
              <AppText
                colorText={"#D74120"}
                title={
                  type == "insert"
                    ? languagePicker(language, "Do Not Remove Card")
                    : null
                }
                size={Typography.FONTS.SIZE.XLARGE}
                textStyle={{ marginVertical: RF(10) }}
              />
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...GST.CENTER,
    backgroundColor: "white",
  },
  image: {
    height: RF(340),
    resizeMode: "contain",
  },
  imgBackgroundView: {
    width: "100%",
    height: RF(300),
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ImageViewWrapper;
