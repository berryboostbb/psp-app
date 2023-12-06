import { Animated, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AppHeader,
  AppText,
  ErrorHeader,
  ErrorText,
  Pin,
  Wrapper,
} from "@components";
import { cross, green } from "@assets";
import { GST, Typography } from "@theme";
import { languagePicker } from "@utils";
import { useDispatch, useSelector } from "react-redux";
import { navigate, updatePasscode } from "@services";
import { useTheme } from "@react-navigation/native";
import { setShowPasscodeUpdate } from "@redux";

const MerchantPasscodeSettings = ({ navigation }: any) => {
  const language = useSelector((state: any) => state.user.languageType);
  const [code, setCode] = useState<any>();
  const [currentScreen, setCurrentScreen] = useState("new");
  const [currentPasscode, setCurrentPasscode] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [errorText, setErrorText] = useState("");
  const anim = useRef(new Animated.Value(0));
  const theme: any = useTheme();
  const ref: any = useRef();
  const [notifyType, setNotifyType] = useState("");
  const [overlayVisible, setOverlayVisible] = useState(false);
  const dispatch = useDispatch();
  const inputRef: any = useRef();

  const shake = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim.current, {
          toValue: -2,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(anim.current, {
          toValue: 2,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(anim.current, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 2 }
    ).start();
  }, []);
  useEffect(() => {
    let timeout: any = null;
    const unsubscribe = navigation.addListener("focus", () => {
      // setMerchantCode("");
      // setCode("");
      timeout = setTimeout(() => {
        inputRef?.current?.blur();
        inputRef?.current?.focus();
      }, 100);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe;
    };
  }, [navigation]);
  const onSubmit = (cod: any) => {
    setTimeout(() => {
      if (currentScreen == "current") {
        setCurrentScreen("new");
      } else if (currentScreen == "new") {
        setCurrentScreen("confirm");
      } else {
        if (newPasscode == cod) {
          let params = {
            passcode: newPasscode,
          };

          updatePasscode(params)
            .then((res) => {
              if (res.success) {
                navigate("Admin_Settings", { type: "updatePasscode" });
                // dispatch(setShowPasscodeUpdate(true));
                // setTimeout(() => {
                //   dispatch(setShowPasscodeUpdate(false));
                // }, 1500);1
              } else {
                // setErrorText("Incorrect Current Passcode");
                setTimeout(() => {
                  setErrorText("");
                  setCurrentPasscode("");
                  setNewPasscode("");
                  setConfirmPasscode("");
                  setCurrentScreen("new");
                }, 1500);
              }
            })
            .catch((err) => console.log("errr.......", err.response));
        } else {
          shake();
          setConfirmPasscode("");
          setErrorText("Confirm passcode must be same");

          setTimeout(() => {
            setErrorText("");
          }, 1500);
        }
      }
    }, 400);
  };
  const onTextChange = (code: any) => {
    if (currentScreen == "current") {
      setCurrentPasscode(code);
    } else if (currentScreen == "new") {
      setNewPasscode(code);
    } else {
      setConfirmPasscode(code);
    }
    setOverlayVisible(false);
  };

  return (
    <Wrapper isPaddingH isTop>
      <AppHeader title="Reset Merchant Passcode" showLeftIcon source={cross} />

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <AppText
          title={
            currentScreen == "current"
              ? languagePicker(language, "Enter Current Passcode")
              : currentScreen == "new"
              ? languagePicker(language, "Create New Passcode")
              : languagePicker(language, "Confirm New Passcode")
          }
          size={Typography.FONTS.SIZE.XXLARGE}
        />
        <Animated.View style={{ transform: [{ translateX: anim.current }] }}>
          <Pin
            onTextChange={onTextChange}
            code={
              currentScreen == "current"
                ? currentPasscode
                : currentScreen == "new"
                ? newPasscode
                : confirmPasscode
            }
            setCode={
              currentScreen == "current"
                ? setCurrentPasscode
                : currentScreen == "new"
                ? setNewPasscode
                : setConfirmPasscode
            }
            onSubmitEditing={onSubmit}
            ref={inputRef}
          />
        </Animated.View>
        {errorText !== "" && (
          <ErrorText title={errorText} tintColor={theme?.colors?.errColor} />
        )}
      </View>
    </Wrapper>
  );
};

export default MerchantPasscodeSettings;

const styles = StyleSheet.create({});
