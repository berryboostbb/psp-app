import {
  Wrapper,
  AppHeader,
  Border_Box,
  AppTextInput,
  PrimaryButton,
} from "@components";
import { GST } from "@theme";
import useStyles from "./styles";
import { backArrow, cross } from "@assets";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { languagePicker } from "@utils";
import { useSelector } from "react-redux";
import { navigate } from "@services";

const Host = () => {
  const language = useSelector((state: any) => state.user.languageType);
  const myTheme: any = useTheme();
  const [mid, setMID] = useState("");
  const [tid, setTID] = useState("");
  const styles = useStyles(myTheme.colors);

  const onClick = () => {};

  return (
    <Wrapper isPaddingH isTop>
      <AppHeader
        title={languagePicker(language, "Host Settings")}
        showLeftIcon
        source={cross}
        backAction={() => navigate("Admin_Settings", { type: "" })}
      />
      <View style={GST.mt30} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <AppTextInput
          textStyle={{ color: myTheme.colors.border }}
          value={"xxxxxxxxxxxxxxxx"}
          title={languagePicker(language, "MID")}
          editable={false}
          style={styles.input}
          onChangeText={(txt: any) => {
            setMID(txt);
          }}
          onSubmitEditing={onClick}
        />

        <View style={GST.mt30} />

        <AppTextInput
          textStyle={{ color: myTheme.colors.border }}
          title={languagePicker(language, "TID")}
          value={"xxxxxxxxxxxxxxxx"}
          editable={false}
          style={styles.input}
          onChangeText={(txt: any) => {
            setTID(txt);
          }}
          onSubmitEditing={onClick}
        />

        <Border_Box
          title={languagePicker(language, "Host URL 1")}
          heading={languagePicker(language, "Host URL")}
          subHeading={languagePicker(language, "Host Port")}
          val1={"xxx.xxx.xxx.xxx"}
          val2={"xxxxx"}
        />
        <Border_Box
          title={languagePicker(language, "Host URL 2")}
          heading={languagePicker(language, "Host URL")}
          subHeading={languagePicker(language, "Host Port")}
          val1={"xxx.xxx.xxx.xxx"}
          val2={"xxxxx"}
        />

        <Border_Box
          title={languagePicker(language, "Batch URL 1")}
          heading={languagePicker(language, "Host URL")}
          subHeading={languagePicker(language, "Host Port")}
          val1={"xxx.xxx.xxx.xxx"}
          val2={"xxxxx"}
        />
        <Border_Box
          title={languagePicker(language, "Batch URL 2")}
          heading={languagePicker(language, "Host URL")}
          subHeading={languagePicker(language, "Host Port")}
          val1={"xxx.xxx.xxx.xxx"}
          val2={"xxxxx"}
        />

        <View style={{ alignItems: "center" }}>
          <PrimaryButton
            title={languagePicker(language, "Confirm")}
            buttonStyle={styles.btn}
          />
        </View>

        <View style={GST.mt30} />
      </ScrollView>
    </Wrapper>
  );
};

export default Host;
