import {
  Wrapper,
  AppText,
  ErrorHeader,
  CurveHeader,
  PrimaryButton,
} from "@components";
import React from "react";
import useStyles from "./style";
import { navigate } from "@services";
import { Image, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { curvePoint, points, scanner } from "@assets";
import { languagePicker } from "@utils";
import { useSelector } from "react-redux";

export default function QRCode({ navigation }: any) {
  const language = useSelector((state: any) => state.user.languageType);
  const myTheme: any = useTheme();
  const style = useStyles(myTheme.colors);

  return (
    <>
      <Wrapper style={style.main}>
        <CurveHeader
          adminVisible
          title={"105.00"}
          total={languagePicker(language, "Sale Total")}
        />
        <ErrorHeader
          source={curvePoint}
          colorText={myTheme?.colors?.text}
          title={languagePicker(
            language,
            "Would you like to collect Plastk Reward Points?"
          )}
          titleImage={points}
          imageStyle={{ marginTop: -30 }}
        />

        <AppText
          title={languagePicker(language, "Scan QR Code")}
          defaultTextColor
          regular
          size={14}
          center
          textStyle={style.textTopMargin}
        />
        <Image source={scanner} style={style.img} />
        <View style={style.primaryBtnContainer}>
          <PrimaryButton
            title={languagePicker(language, "Skip")}
            clr={myTheme?.colors?.text}
            disableBackgroundColor={true}
            buttonStyle={style.primartBtn}
            bgColor={myTheme.colors.textInputBckground}
            onPress={() => navigation.goBack()}
          />
          <PrimaryButton
            title={languagePicker(language, "Use PIN")}
            bgColor={myTheme.colors.primary}
            buttonStyle={style.primartBtn}
            onPress={() => navigate("LoadingProcess", { type: "pin" })}
          />
        </View>
      </Wrapper>
    </>
  );
}
