import React, { useState, useEffect, useRef } from "react";
import { cross } from "@assets";
import useStyles from "./styles";
import {
  KeyboardAvoidingView,
  View,
  Platform,
  InteractionManager,
} from "react-native";
import { RF, Typography } from "@theme";
import { navigate, verifyManagerPassword } from "@services";
import { useTheme } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";
import { setOrderData } from "@redux";
import {
  AppHeader,
  AppText,
  AppTextInput,
  Wrapper,
  ErrorText,
} from "@components";
import { languagePicker } from "@utils";

const Merchant_Login = ({ navigation, route }: any) => {
  const language = useSelector((state: any) => state.user.languageType);
  const theme: any = useTheme();
  const { type } = route.params;
  const dispatch = useDispatch();
  const styles = useStyles(theme.colors);
  const orderData = useSelector((state: any) => state.common.orderData);
  const [managerPassword, setManagerPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [flag, setFlag] = useState<any>(false);
  const inputRef: any = useRef();
  const keyboardVerticalOffset = Platform.OS === "ios" ? 40 : 0;
  const onClick = async () => {
    let res = await verifyManagerPassword({ password: managerPassword });
    let data = { ...orderData };
    data.managerPassword = managerPassword;
    dispatch(setOrderData(data));
    if (res.success) {
      if (type == "settings") {
        navigate("Admin_Settings", { type: "" });
      } else if (type == "reports") {
        navigate("ReportsSection", {});
      } else {
        navigate("ClerkId");
      }
    } else {
      setErrorText("Invalid Manager Password");
    }
  };

  useEffect(() => {
    setErrorText("");
  }, [managerPassword]);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      focusInputWithKeyboard();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);
  const focusInputWithKeyboard = () => {
    InteractionManager.runAfterInteractions(() => {
      inputRef?.current?.focus();
    });
  };
  return (
    <Wrapper isPaddingH isTop>
      <AppHeader
        showRightIcon
        showLeftIcon
        source={cross}
        title={languagePicker(language, "Manager Password")}
        textStyle={styles.header}
      />
      <View style={styles.view}>
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <AppTextInput
            inputRef={inputRef}
            autoFocus
            title={languagePicker(language, "Password")}
            letterSpacing={4}
            style={styles.input}
            secureTextEntry={true}
            onChangeText={(txt: any) => {
              setManagerPassword(txt);
            }}
            onSubmitEditing={onClick}
            maxLength={32}
          />
        </KeyboardAvoidingView>
        {errorText !== "" && (
          <ErrorText title={errorText} tintColor={theme?.colors?.errColor} />
        )}
        <View style={styles.txt}>
          <AppText
            semiBold
            title={languagePicker(language, "Forgot Password")}
            size={Typography.FONTS.SIZE.LARGE}
            colorText={theme.colors.primary}
            bolder
            onPress={() => setFlag(!flag)}
          />
          {flag && (
            <>
              <AppText
                title={languagePicker(
                  language,
                  "Please call 1-800-848-2974 Ext 2 or email"
                )}
                semiBold
                size={Typography.FONTS.SIZE.SMALL}
                colorText={theme.colors.primary}
                textStyle={{ paddingTop: RF(10) }}
              />
              <AppText
                semiBold
                title={languagePicker(
                  language,
                  "merchantservices@pspservicesco.com"
                )}
                size={Typography.FONTS.SIZE.SMALL}
                colorText={theme.colors.primary}
              />
            </>
          )}
        </View>
      </View>
    </Wrapper>
  );
};

export default Merchant_Login;
