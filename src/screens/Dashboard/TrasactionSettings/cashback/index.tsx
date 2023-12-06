import { GST, RF } from "@theme";
import { backArrow, cross } from "@assets";
import { View } from "react-native";
import React, { useState } from "react";
import {
  AppHeader,
  CustomInput,
  Pressable_Box,
  Toggle_Box,
  Wrapper,
} from "@components";
import { useSelector } from "react-redux";
import { languagePicker } from "@utils";
import { navigate } from "@services";
const Cashback_Config = () => {
  const language = useSelector((state: any) => state.user.languageType);
  const [other, setOther] = useState(false);
  const [editLimit, setEditLimit] = useState(false);
  const [preset, setPreset] = useState(false);
  const [cashback, setCashback] = useState(false);
  const [limitInput, setLimitInput] = useState("");
  const [presetInput, setPresetInput] = useState("");
  const [editPreset, setEditPreset] = useState(false);
  const [presetAmount, setPresetAmount] = useState(false);
  const [presetAmount_Title, setPresetAmount_Title] = useState("");

  const onClick = (type: any) => {
    if (type === "cashback") {
      setCashback(!cashback);
    } else if (type === "other") {
      setOther(!other);
    } else if (type === "preset") {
      setPreset(!preset);
    }
  };

  const onPressCashback = () => {
    setEditLimit(true);
  };

  const onPressPreset = () => {
    setEditPreset(true);
  };

  const onChangeText = (text: any) => {
    setLimitInput(text);
  };

  const onSubmitEditing_Limit = () => {
    setEditLimit(false);
  };

  const onPress = (type: any) => {
    setEditPreset(false);
    setPresetAmount(true);
    if (type === "one") {
      setPresetAmount_Title("Pre-set Amount 1");
    } else if (type === "two") {
      setPresetAmount_Title("Pre-set Amount 2");
    } else if (type === "three") {
      setPresetAmount_Title("Pre-set Amount 3");
    }
  };

  const onSubmitPreset_Amount = () => {
    setPresetAmount(false);
  };

  const onChangeText_Preset = (text: any) => {
    setPresetInput(text);
  };

  return (
    <Wrapper isPaddingH isTop>
      <AppHeader
        title={languagePicker(language, "Cashback Config")}
        showLeftIcon
        source={cross}
        backAction={() => navigate("Admin_Settings", { type: "" })}
      />
      <View style={{ marginTop: RF(30) }} />
      {editLimit ? (
        <>
          <View style={{ flex: 1, ...GST.CENTER }}>
            <CustomInput
              value={limitInput}
              onChangeText={onChangeText}
              title={languagePicker(language, "Enter Cashback Limit Amount")}
              onSubmitEditing={onSubmitEditing_Limit}
            />
          </View>
        </>
      ) : editPreset ? (
        <>
          <Pressable_Box
            dollarText
            title={languagePicker(language, "Pre-set Amount 1")}
            onPress={() => onPress("one")}
          />
          <Pressable_Box
            dollarText
            title={languagePicker(language, "Pre-set Amount 2")}
            onPress={() => onPress("two")}
          />
          <Pressable_Box
            dollarText
            title={languagePicker(language, "Pre-set Amount 3")}
            onPress={() => onPress("three")}
          />
        </>
      ) : presetAmount ? (
        <CustomInput
          value={presetInput}
          title={presetAmount_Title}
          onChangeText={onChangeText_Preset}
          onSubmitEditing={onSubmitPreset_Amount}
        />
      ) : (
        <>
          <Toggle_Box
            isEnabled={cashback}
            subHeading={languagePicker(language, "ENABLED")}
            heading={languagePicker(language, "Cashback (Limit: ") + "$0.00)"}
            onToggle={() => onClick("cashback")}
            pressableTitle={languagePicker(language, "EDIT CASHBACK LIMIT")}
            onPressTitle={onPressCashback}
          />
          <Toggle_Box
            isEnabled={other}
            subHeading={languagePicker(language, "DISABLED")}
            heading={languagePicker(language, "Other Amount")}
            onToggle={() => onClick("other")}
          />
          <Toggle_Box
            isEnabled={preset}
            subHeading={languagePicker(language, "DISABLED")}
            onToggle={() => onClick("preset")}
            heading={languagePicker(language, "Pre-set Cashback Amount")}
            pressableTitle={languagePicker(language, "EDIT PRESET AMOUNT")}
            onPressTitle={onPressPreset}
          />
        </>
      )}
    </Wrapper>
  );
};

export default Cashback_Config;
