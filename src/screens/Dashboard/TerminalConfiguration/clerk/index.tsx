import useStyles from "./styles";
import React from "react";
import { backArrow, cross } from "@assets";
import { useTheme } from "@react-navigation/native";
import { Wrapper, AppHeader, Pressable_Box, Toggle_Box } from "@components";
import { navigate, updateConfigurations } from "@services";
import { View } from "react-native";
import { RF } from "@theme";
import { useDispatch, useSelector } from "react-redux";
import { setSettings } from "@redux";
import { languagePicker } from "@utils";

const Clerk = () => {
  const language = useSelector((state: any) => state.user.languageType);
  const myTheme: any = useTheme();
  const styles = useStyles(myTheme.colors);
  const { settings } = useSelector((state: any) => state.user);

  const dispatch = useDispatch();

  const onClick = (type: any) => {
    if (type === "add") {
      navigate("Add_Clerk");
    } else if (type === "list") {
      navigate("Clerk_List");
    } else if (type === "delete") {
      navigate("Delete_Clerk");
    }
  };

  const handleToggle = async (type: any) => {
    let cloneSettings = settings.map((a: any) => ({ ...a }));

    if (type == "clerk") {
      cloneSettings[0].isEnabled = !cloneSettings[0]?.isEnabled;
    } else if (type == "invoice") {
      cloneSettings[1].isEnabled = !cloneSettings[1]?.isEnabled;
    }
    // else if (type == "merchant") {
    //   cloneSettings[6].isEnabled = !cloneSettings[6]?.isEnabled;
    // }
    let response = await updateConfigurations({ configuration: cloneSettings });
    dispatch(setSettings(cloneSettings));
  };

  return (
    <Wrapper isPaddingH isTop>
      <AppHeader
        title={languagePicker(language, "Clerk Server Maintenance")}
        showLeftIcon
        source={cross}
        backAction={() => navigate("Admin_Settings", { type: "" })}
      />
      <Toggle_Box
        isEnabled={settings[0]?.isEnabled}
        heading={languagePicker(language, "Clerk/Server Id")}
        subHeading={settings[0]?.isEnabled ? "Enabled" : "Disabled"}
        onToggle={() => handleToggle("clerk")}
      />

      {/* <Toggle_Box
        isEnabled={settings[6]?.isEnabled}
        heading={settings[6]?.title}
        subHeading={settings[6]?.isEnabled ? "Enabled" : "Disabled"}
        onToggle={() => handleToggle("merchant")}
      /> */}

      {/* <Toggle_Box
        isEnabled={settings[1]?.isEnabled}
        heading={settings[1]?.title}
        subHeading={settings[1]?.isEnabled ? "Enabled" : "Disabled"}
        onToggle={() => handleToggle("invoice")}
      /> */}

      <View style={{ marginTop: RF(30) }} />

      {/* <Pressable_Box
        title={languagePicker(language, "Add Clerk/Server")}
        onPress={() => onClick("add")}
      />
      <Pressable_Box
        title={languagePicker(language, "Clerk Server List")}
        onPress={() => onClick("list")}
      />
      <Pressable_Box
        title={languagePicker(language, "Delete Clerk/Server")}
        onPress={() => onClick("delete")}
      /> */}
    </Wrapper>
  );
};

export default Clerk;
