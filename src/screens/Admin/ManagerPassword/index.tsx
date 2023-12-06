import React, { useState } from "react";
import { RF } from "@theme";
import useStyles from "./style";
import { languagePicker, Titles } from "@utils";
import { navigate } from "@services";
import { View, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
import { AppHeader, AppTextInput, Wrapper, PrimaryButton } from "@components";
import { useDispatch, useSelector } from "react-redux";

export default function ManagerPassword() {
  const language = useSelector((state: any) => state.user.languageType);
  const myTheme: any = useTheme();
  const style = useStyles(myTheme.colors);
  const [errorText, setErrorText] = useState("");

  return (
    <>
      <Wrapper isTop>
        <AppHeader
          title={languagePicker(language, "Manager Password Update")}
        />
        <View style={style.wrapContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <AppTextInput
              placeholder={languagePicker(language, "Enter Current Password")}
              title={languagePicker(language, "Enter Current Password")}
              textStyle={{ marginBottom: RF(30) }}
              style={{ marginLeft: RF(30) }}
            />
            <AppTextInput
              viewStyle={{}}
              title={languagePicker(language, "Create New Password")}
              placeholder={languagePicker(language, "Create New Password")}
              textStyle={{ marginBottom: RF(30) }}
              style={{ marginLeft: RF(30) }}
            />
            <AppTextInput
              title={languagePicker(language, "Re-enter New Password")}
              placeholder={languagePicker(language, "Re-enter New Password")}
              style={{ marginLeft: RF(30) }}
            />
            <View
              style={{
                height: RF(160),
                paddingBottom: 5,
                justifyContent: "flex-end",
              }}
            >
              <PrimaryButton
                title={languagePicker(language, "Next")}
                bgColor={myTheme?.colors?.text}
                onPress={() => navigate("Login")}
                buttonStyle={{ alignSelf: "center" }}
              />
            </View>
          </ScrollView>
        </View>
      </Wrapper>
    </>
  );
}
