import {
  Wrapper,
  AppHeader,
  AppTextInput,
  AppText,
  TipBoxButton,
  LinearButton,
  ErrorText,
  Overlay,
  ErrorHeader,
} from "@components";
import { GST, RF, Typography } from "@theme";
import useStyles from "./styles";
import { backArrow, cross, green } from "@assets";
import React, { useState } from "react";
import { View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { create_Clerk_Server, navigate } from "@services";
import { useDispatch, useSelector } from "react-redux";
import { languagePicker } from "@utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { setUsers } from "@redux";
import { log } from "react-native-reanimated";

const Add_Clerk = () => {
  const language = useSelector((state: any) => state.user.languageType);
  const myTheme: any = useTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [clicked, setClicked] = useState("");
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const styles = useStyles(myTheme.colors);
  const [selected, setSelected] = useState("Clerk");
  const { users } = useSelector((state: any) => state.tms);
  const dispatch = useDispatch();

  // const onClick = () => {
  //   navigate("Clerk");
  // };

  const handleSelected = (text: any) => {
    setSelected(text);
  };

  const handleSubmit = (type: any) => {
    let err = { ...error };
    setClicked(type);
    setTimeout(() => {
      setClicked("");
    }, 500);

    let flag = true;
    if (firstName == "") {
      err.firstName = "First name required!";
      flag = false;
    }

    if (lastName == "") {
      err.lastName = "Last name required!";
      flag = false;
    }

    if (email == "") {
      err.email = "Email required!";
      flag = false;
    }

    setError(err);

    if (flag) {
      let params = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        type: selected == "Clerk" ? "clerk" : "server",
      };
      let tempUsers = [...users];
      create_Clerk_Server(params)
        .then((res) => {
          if (res?.success) {
            tempUsers.push(res.data);
            dispatch(setUsers(tempUsers));
            setOverlayVisible(true);
            setTimeout(() => {
              navigate("Clerk_List");
            }, 1000);
          }
        })
        .catch((err) => {
          console.log("err......", err);
        });
    }
  };

  return (
    <>
      {overlayVisible && (
        <View style={{ zIndex: 10 }}>
          <Overlay>
            <ErrorHeader
              source={green}
              colorText={myTheme?.colors?.text}
              title={`${selected} has been created successfuly!`}
              // titleImage={netInfo.isConnected ? wifiOn : wifiOff}
            />
          </Overlay>
        </View>
      )}

      <Wrapper isPaddingH isTop>
        <AppHeader
          title="Add Clerk/Server"
          showLeftIcon
          source={cross}
          backAction={() => navigate("Admin_Settings", { type: "" })}
        />

        <View style={{ marginTop: RF(60) }} />

        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <AppTextInput
            placeholder={languagePicker(language, "First Name")}
            textStyle={{ color: myTheme.colors.border }}
            value={firstName}
            title={languagePicker(language, "First Name")}
            style={styles.input}
            onChangeText={(txt: any) => {
              setFirstName(txt);
              setError({
                firstName: "",
                lastName: "",
                email: "",
              });
            }}
            // onSubmitEditing={onClick}
          />
          {error.firstName !== "" && (
            <ErrorText
              title={error.firstName}
              tintColor={myTheme?.colors?.errColor}
            />
          )}
          <View style={GST.mt30} />

          <AppTextInput
            placeholder={languagePicker(language, "Last Name")}
            textStyle={{ color: myTheme.colors.border }}
            value={lastName}
            title={languagePicker(language, "Last Name")}
            style={styles.input}
            onChangeText={(txt: any) => {
              setLastName(txt);
              setError({
                firstName: "",
                lastName: "",
                email: "",
              });
            }}
            // onSubmitEditing={onClick}
          />
          {error.lastName !== "" && (
            <ErrorText
              title={error.lastName}
              tintColor={myTheme?.colors?.errColor}
            />
          )}

          <View style={GST.mt30} />

          <AppTextInput
            placeholder={"example@example.com"}
            textStyle={{ color: myTheme.colors.border }}
            title={languagePicker(language, "Add Email")}
            value={email}
            style={styles.input}
            onChangeText={(txt: any) => {
              setEmail(txt);
              setError({
                firstName: "",
                lastName: "",
                email: "",
              });
            }}
            // onSubmitEditing={onClick}
          />
          {error.email !== "" && (
            <ErrorText
              title={error.email}
              tintColor={myTheme?.colors?.errColor}
            />
          )}

          <AppText
            medium
            center
            defaultTextColor
            title={"Chose Type (Clerk/Server)"}
            size={Typography.FONTS.SIZE.XLARGE}
            textStyle={{ marginTop: RF(30) }}
          />

          <View style={GST.mt30} />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
              paddingHorizontal: 20,
            }}
          >
            <TipBoxButton
              doller
              title={"Clerk"}
              selected={selected}
              onPress={() => handleSelected("Clerk")}
            />
            <TipBoxButton
              doller
              title={"Server"}
              selected={selected}
              onPress={() => handleSelected("Server")}
            />
          </View>

          <View style={{ alignItems: "center", width: "100%", marginTop: 15 }}>
            <LinearButton
              title={"Submit"}
              // icon={transaction}
              type="submit"
              onClick={clicked}
              onPress={() => handleSubmit("submit")}
            />
          </View>
        </KeyboardAwareScrollView>
      </Wrapper>
    </>
  );
};

export default Add_Clerk;
