import { GST, SCREEN_WIDTH, Typography } from "@theme";
import { login } from "@assets";
import { languagePicker, showToast, Titles } from "@utils";
import useStyles from "./style";
import { navigate, signin, getConfigurations } from "@services";

import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";

import { useTheme } from "@react-navigation/native";
import {
  AppText,
  AppTextInput,
  PrimaryButton,
  RememberMe,
  Wrapper,
} from "@components";
import { setIsLoggedIn, setPosId, setSettings } from "@redux";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const language = useSelector((state: any) => state.user.languageType);
  const myTheme: any = useTheme();
  const dispatch: any = useDispatch();
  const styles = useStyles(myTheme.colors);
  const [rememberEmail, setRememberEmail] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(true);

  const onPressToggleButton = () => {
    setRememberEmail(!rememberEmail);
  };
  const onClick = () => {};
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(false);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(true);
      }
    );
    return () => {
      // keyboardDidHideListener.remove(() => {});
      // keyboardDidShowListener.remove(() => {});
    };
  }, []);

  const onLogin = async () => {
    let res = await signin({
      email: email.trim(),
      password: password,
    });

    if (res.success) {
      //      console.log("----res log---", res.store_info);

      await AsyncStorage.setItem("passcode", res?.admin?.passcode);
      let check: any = await AsyncStorage.setItem("role", res?.admin?.role);
      dispatch(setPosId(res?.admin?._id));

      await AsyncStorage.setItem("isLoggedIn", "true");
      await AsyncStorage.setItem("token", res?.token);
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("passcode", res?.admin?.passcode);
      await AsyncStorage.setItem("role", res?.admin?.role);
      await AsyncStorage.setItem("merchantID", res?.admin?._id);
      await AsyncStorage.setItem("clerkID", res?.admin?.clerk_id.toString());
      await AsyncStorage.setItem("storeInfo", JSON.stringify(res?.store_info));

      dispatch(setIsLoggedIn(true));
    } else {
      showToast("Failed", res.message, false);
      // console.log("error........", res.message);
    }
  };

  return (
    <Wrapper>
      <ScrollView style={{ ...GST.MAIN }} keyboardShouldPersistTaps="always">
        {isKeyboardVisible && (
          <View style={styles.imgView}>
            <Image style={styles.img} source={login} />
          </View>
        )}
        <View style={[styles.wrapContainer]}>
          <KeyboardAvoidingView>
            <AppTextInput
              title={languagePicker(language, "Email Address")}
              onChangeText={(txt: any) => {
                setEmail(txt.toLowerCase());
              }}
              placeholder={languagePicker(language, "Email Address")}
            />
            <View style={styles.topMarginView} />
            <AppTextInput
              title={languagePicker(language, "Password")}
              secureTextEntry={true}
              onChangeText={(txt: any) => {
                setPassword(txt);
              }}
              placeholder={languagePicker(language, "Password")}
            />
            <View style={[styles.wrapRememberSection]}>
              <RememberMe
                rememberMe
                onClick={onClick}
                title={languagePicker(language, "Remember Me")}
                isToggle={rememberEmail}
                onPress={onPressToggleButton}
              />
              <AppText
                medium
                defaultTextColor
                size={SCREEN_WIDTH / 22}
                title={languagePicker(language, "Forgot Password")}
                onPress={() => navigate("ManagerPassword")}
              />
            </View>
            <View style={styles.wrapButton}>
              <PrimaryButton
                title={languagePicker(language, "Login")}
                buttonStyle={styles.btn}
                bgColor={myTheme?.colors?.text}
                onPress={() => {
                  onLogin();
                }}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </Wrapper>
  );
}
