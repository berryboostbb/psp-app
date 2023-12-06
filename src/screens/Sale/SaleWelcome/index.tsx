import React from "react";
import useStyles from "./style";
import {
  idleAnim,
  psp_animationLogo,
  psp_animation1,
  psp_backgroundAnimation,
  psp_logoAnimation,
  psp_logoAnimation1,
  processing_gif,
  Tag,
} from "@assets";
import { RF, Typography } from "@theme";
import { AppText } from "@components";
import Lottie from "lottie-react-native";
import { Image, ImageBackground, Pressable, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setOrderData } from "@redux";
import { navigate } from "@services";
import { WIDTH, languagePicker } from "@utils";

const SaleWelcome = ({ navigation }: any) => {
  const language = useSelector((state: any) => state.user.languageType);
  const theme: any = useTheme();
  const styles = useStyles(theme.colors);
  const dispatch = useDispatch();
  const { settings } = useSelector((state: any) => state.user);
  const orderData = useSelector((state: any) => state.common.orderData);
  const { deviceName } = useSelector((state: any) => state.pr);

  let temp = {
    tip: 0.0,
    clerkId: "",
    invoiceNumber: "",
    merchantPasscode: "",
    tipType: "",
    surcharge: 0,
    orderAmount: 0.0,
    cardType: "",
  };

  return (
    <Pressable onPress={() => navigation.goBack()}>
      <View>
        {deviceName !== "" && (
          <ImageBackground
            source={Tag}
            style={{
              height: 28,
              position: "absolute",
              zIndex: 10,
              justifyContent: "center",
              width: WIDTH / 2.8,
            }}
          >
            <AppText
              title={deviceName}
              colorText={theme.colors.white}
              size={16}
              center
              textStyle={{ paddingTop: RF(3) }}
            />
          </ImageBackground>
        )}

        <View style={styles.container}>
          <Image source={psp_logoAnimation1} style={styles.lottie} />
        </View>
        <AppText
          medium
          center
          textStyle={styles.mt}
          title={languagePicker(language, "Welcome / Bonjour!")}
          colorText={theme?.colors?.white}
          size={Typography.FONTS.SIZE.LARGER}
        />

        <AppText
          medium
          center
          textStyle={styles.bottom}
          colorText={theme?.colors?.white}
          title={languagePicker(language, "Tap anywhere to continue")}
          size={Typography.FONTS.SIZE.XLARGE}
        />
      </View>
    </Pressable>
  );
};

export default SaleWelcome;
