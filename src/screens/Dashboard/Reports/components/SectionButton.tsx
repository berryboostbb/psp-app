import { AppText } from "@components";
import { HP, Typography } from "@theme";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface Props {
  title: string;
  isActive?: boolean;
  onPress(): void;
  isSecond?: boolean;
}

const SectionButton = ({
  title,
  isActive = false,
  onPress,
  isSecond = false,
}: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive ? styles.activeButton : styles.inactiveButton,
        isSecond && styles.left,
      ]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <AppText
        center
        title={title}
        size={Typography.FONTS.SIZE.LARGE}
        semiBold
        colorText="#4A5568"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // paddingVertical: HP(1.5),
  },
  activeButton: {
    borderWidth: 2,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    border: 8,
    borderColor: "#EDEEF0",
    backgroundColor: "transparent",
    borderBottomWidth: 0,
  },
  inactiveButton: {
    backgroundColor: "#EDEEF0",
    borderRadius: 8,
    paddingVertical: HP(1.7),
    top: 8,
    left: -2,
  },
  left: {
    left: -2,
  },
});

export default SectionButton;
