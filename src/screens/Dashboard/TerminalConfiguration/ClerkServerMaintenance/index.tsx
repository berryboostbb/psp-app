import React from "react";
import { RF } from "@theme";
import { backArrow, cross } from "@assets";
import { View } from "react-native";
import { navigate } from "@services";
import { AppHeader, Pressable_Box, Wrapper } from "@components";
import { languagePicker } from "@utils";
import { useDispatch, useSelector } from "react-redux";
const ClerkServerMaintenance = () => {
  const language = useSelector((state: any) => state.user.languageType);
  const onClick = (type: any) => {
    if (type === "lang") {
      navigate("Language");
    }
    if (type === "addClerk") {
      navigate("Add_Clerk");
    }
    if (type === "clerkList") {
      navigate("Clerk_List");
    }
    if (type === "delteClerk") {
      navigate("Delete_Clerk");
    } else if (type === "clerkServerMaintenance") {
      navigate("Clerk");
    }
  };

  return (
    <Wrapper isPaddingH isTop>
      <AppHeader
        title={languagePicker(language, "Clerk Server Maintenance")}
        showLeftIcon
        source={cross}
        backAction={() => navigate("Admin_Settings", { type: "" })}
      />
      <View style={{ marginTop: RF(30) }} />
      <Pressable_Box
        title={languagePicker(language, "Add Clerk/Server")}
        onPress={() => onClick("addClerk")}
      />
      <Pressable_Box
        title={languagePicker(language, "Clerk Server List")}
        onPress={() => onClick("clerkList")}
      />
      {/* <Pressable_Box
        title={languagePicker(language, "Delete Clerk/Server")}
        onPress={() => onClick("delteClerk")}
      /> */}
      <Pressable_Box
        title={languagePicker(language, "Clerk Server Maintenance")}
        onPress={() => onClick("clerkServerMaintenance")}
      />
    </Wrapper>
  );
};

export default ClerkServerMaintenance;
