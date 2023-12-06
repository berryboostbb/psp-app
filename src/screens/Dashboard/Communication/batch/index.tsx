import { RF } from "@theme";
import useStyles from "./styles";
import React, { useState } from "react";
import { backArrow, clock, cross } from "@assets";
import { Image, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Wrapper, AppHeader, Toggle_Box, AppText } from "@components";
import { languagePicker } from "@utils";
import { useSelector } from "react-redux";
import { navigate } from "@services";

const Batch = () => {
  const language = useSelector((state: any) => state.user.languageType);
  const myTheme: any = useTheme();
  const styles = useStyles(myTheme.colors);
  const [merchant, setMerchant] = useState(true);
  const [auto, setAuto] = useState(false);

  // const handleToggleBtn = (type: any) => {
  //   if (type === "mer") {
  //     setNerchant(!merchant);
  //   } else if (type === "auto") {
  //     setAuto(!auto);
  //   }
  // };

  return (
    <Wrapper isPaddingH isTop>
      <AppHeader
        title={languagePicker(language, "Batch Parameter")}
        showLeftIcon
        source={cross}
        backAction={() => navigate("Admin_Settings", { type: "" })}
      />
      <Toggle_Box
        isEnabled={merchant}
        subHeading={
          merchant
            ? languagePicker(language, "ENABLED")
            : languagePicker(language, "DISABLED")
        }
        onToggle={() => setMerchant(!merchant)}
        heading={languagePicker(language, "Merchant Batch Close")}
      />
      <Toggle_Box
        isEnabled={auto}
        subHeading={
          auto
            ? languagePicker(language, "ENABLED")
            : languagePicker(language, "DISABLED")
        }
        onToggle={() => setAuto(!auto)}
        heading={languagePicker(language, "Auto Batch Close")}
      />

      <View
        style={{
          marginTop: RF(50),
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "35%",
            height: RF(50),
            borderRadius: RF(15),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: myTheme.colors.text,
          }}
        >
          <Image source={clock} style={{ width: 20, height: 20 }} />
          <AppText
            title={languagePicker(language, "Start Time")}
            colorText={"#fff"}
            size={15}
          />
        </View>

        <View
          style={{
            width: "35%",
            height: RF(50),
            borderRadius: RF(15),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 20,
            backgroundColor: myTheme.colors.text,
          }}
        >
          <Image source={clock} style={{ width: 20, height: 20 }} />
          <AppText
            title={languagePicker(language, "End Time")}
            colorText={"#fff"}
            size={15}
          />
        </View>
      </View>
    </Wrapper>
  );
};

export default Batch;
