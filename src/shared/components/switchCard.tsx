import React from "react";
import { AppText } from "@components";
import { RF, Typography } from "@theme";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import ToggleSwitch from "toggle-switch-react-native";

const SwitchCard = ({
  theme,
  title,
  width,
  onToggle,
  isEnabled,
  storeTheme,
}: {
  width: any;
  theme?: any;
  title?: any;
  onToggle?: any;
  isEnabled?: any;
  storeTheme?: any;
}) => {
  const myTheme: any = useTheme();
  const styles = useStyles(myTheme.colors);

  return (
    <View style={[styles.mainView, { width: width, alignSelf: "center" }]}>
      <AppText
        style={{ color: "#000" }}
        size={Typography.FONTS.SIZE.SMALL}
        semiBold
        title={title}
      ></AppText>

      <View style={[styles.profileContainer]}>
        <ToggleSwitch
          isOn={isEnabled}
          offColor="#dcdcdc"
          onColor={"green"}
          onToggle={
            theme ? () => storeTheme("THEME_KEY", !isEnabled) : () => onToggle()
          }
        />
      </View>
    </View>
  );
};

const useStyles = (colors: any) =>
  StyleSheet.create({
    mainView: {
      height: RF(60),
      borderWidth: 1,
      borderColor: "#000",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: 16,
      paddingHorizontal: RF(30),
      marginTop: RF(10),
    },
    switchContainer: {
      flex: 1,
    },
    profileContainer: {},
    linearStyle: {
      flexDirection: "row",
      width: "100%",
      height: RF(50),
      alignItems: "center",
      justifyContent: "flex-start",
      paddingLeft: RF(30),
      borderRadius: RF(15),
      elevation: 3,
    },
  });

export default SwitchCard;
