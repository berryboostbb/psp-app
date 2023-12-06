import {
  AppText,
  Wrapper,
  AppHeader,
  Toggle_Box,
  Border_Box,
  ErrorHeader,
} from "@components";
import useStyles from "./styles";
import { backArrow, cross, exclaimation, green } from "@assets";
import { RF, Typography } from "@theme";
import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { languagePicker, showToast } from "@utils";
import { useDispatch, useSelector } from "react-redux";
import { getPingConfiguration, navigate, PingService } from "@services";
import { useNetInfo } from "@react-native-community/netinfo";
import Ping from "react-native-ping";
import { log } from "react-native-reanimated";
import { setHostText } from "@redux";
const Network = ({ navigation }: any) => {
  const language = useSelector((state: any) => state.user.languageType);
  const myTheme: any = useTheme();
  const styles = useStyles(myTheme.colors);
  const [isEnabled, setIsEnabled] = useState(false);
  const [hostStatus, setHostStatus] = useState<any>(true);
  const [pingResult, setPingResult] = useState();
  const [pingTime, setPingTime] = useState(0);
  const [receiveHostSpeed, setReceiveHostSpeed] = useState<any>("00");
  const [sendHostSpeed, setSendHostSpeed] = useState<any>("00");
  const { hostText } = useSelector((state: any) => state.user);
  const [pingErrorShow, setPingErrorShow] = useState<any>();
  const dispatch = useDispatch();

  useEffect(() => {
    // const interval = setInterval(() => {
    //   pingHandle();
    // }, 2000);
    // pingHandle();
    // return () => clearInterval(interval);
  }, [hostText]);
  const handleToggleBtn = () => {
    setIsEnabled(!isEnabled);
  };
  const pingHandle = async () => {
    const r = await getPingConfiguration();
    if (r == 2 || r == 3) {
      setPingErrorShow(true);
      setTimeout(() => {
        setPingErrorShow(false);
      }, 1500);
    } else {
      setPingTime(r.ms);
      setReceiveHostSpeed(r.result.receivedNetworkSpeed);
      setSendHostSpeed(r.result.sendNetworkSpeed);
    }
  };

  return (
    <Wrapper>
      {pingErrorShow ? (
        <ErrorHeader
          source={green}
          colorText={myTheme?.colors?.text}
          title={"Please Fill Correct Host"}
          titleImage={exclaimation}
          tintColor={myTheme?.colors?.text}
          imageStyle={{ marginTop: -20 }}
        />
      ) : (
        <View style={styles.headerView}>
          <AppHeader
            title={languagePicker(language, "Network Connection")}
            showLeftIcon
            source={cross}
            backAction={() => navigate("Admin_Settings", { type: "" })}
          />
        </View>
      )}

      <ScrollView
        style={{ marginTop: RF(30), paddingHorizontal: RF(20) }}
        showsVerticalScrollIndicator={false}
      >
        <Toggle_Box
          title={languagePicker(language, "Host Settings")}
          heading={languagePicker(language, "Host Status")}
          isEnabled={hostStatus}
          subHeading={
            hostStatus
              ? languagePicker(language, "LOGGED ON")
              : languagePicker(language, "LOGGED OFF")
          }
          onToggle={() => {}}
        />

        {/* <AppText
            title={languagePicker(language, "Mac Key Change")}
            size={Typography.FONTS.SIZE.LARGE}
            colorText={myTheme.colors.primary}
            textStyle={{ marginVertical: RF(40) }}
          />

          <AppText
            title={languagePicker(language, "Cutout?????")}
            size={Typography.FONTS.SIZE.LARGE}
            colorText={myTheme.colors.primary}
          /> */}

        <Border_Box
          val1={"XX"}
          val2={"XX"}
          title={languagePicker(language, "Echo Test")}
          heading={languagePicker(language, "Mac Key:")}
          subHeading={languagePicker(language, "Cutout?????")}
          titleColor
        />

        <Border_Box
          val1={receiveHostSpeed}
          val2={sendHostSpeed}
          title={languagePicker(language, "Network Time-Out")}
          heading={languagePicker(language, "Connection Timeout (seconds)")}
          subHeading={languagePicker(language, "Recieve Timeout (seconds)")}
        />
        <Border_Box
          val1={"www.google.com"}
          val2={pingTime}
          val2Editable
          title={languagePicker(language, "Ping Network")}
          heading={languagePicker(language, "Host URL")}
          subHeading={languagePicker(language, "Ping Timout ( Seconds)")}
          headingColor
          val1Color
          onPress={pingHandle}
        />

        <View style={{ marginBottom: RF(40) }} />
      </ScrollView>
    </Wrapper>
  );
};

export default Network;
