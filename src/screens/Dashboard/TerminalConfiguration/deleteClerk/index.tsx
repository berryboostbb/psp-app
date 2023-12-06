import { RF } from "@theme";
import useStyles from "./styles";
import { View } from "react-native";
import { backArrow, cross } from "@assets";
import { setOrderData } from "@redux";
import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { navigate, verifyManagerPassword } from "@services";
import { AppHeader, AppTextInput, PrimaryButton, Wrapper } from "@components";
import { languagePicker } from "@utils";

const Delete_Clerk = ({ navigation }: any) => {
  const language = useSelector((state: any) => state.user.languageType);
  const theme: any = useTheme();
  const dispatch = useDispatch();
  const styles = useStyles(theme.colors);
  const [managerPassword, setManagerPassword] = useState("");
  const orderData = useSelector((state: any) => state.common.orderData);

  const onClick = async () => {
    let res = await verifyManagerPassword({ password: managerPassword });
    let data = { ...orderData };
    data.managerPassword = managerPassword;
    dispatch(setOrderData(data));
    navigate("ClerkId");
  };

  const onPress = () => {
    navigate("Clerk");
  };

  return (
    <Wrapper isPaddingH isTop>
      <AppHeader
        showLeftIcon
        source={cross}
        title={languagePicker(language, "Delete clerk/Server Id")}
        backAction={() => navigate("Admin_Settings", { type: "" })}
      />

      <View style={styles.view}>
        <AppTextInput
          autoFocus
          title={languagePicker(language, "Enter Clerk/Server Id")}
          placeholder={"XXXXXXXX"}
          style={styles.input}
          //   secureTextEntry={true}
          onChangeText={(txt: any) => {
            setManagerPassword(txt);
          }}
          onSubmitEditing={onClick}
        />
      </View>

      <PrimaryButton
        title={languagePicker(language, "Delete User")}
        bgColor={theme.colors.primary}
        buttonStyle={{
          width: RF(200),
          height: RF(60),
          alignSelf: "center",
          marginBottom: 10,
        }}
        style={{
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={onPress}
      />
    </Wrapper>
  );
};

export default Delete_Clerk;
