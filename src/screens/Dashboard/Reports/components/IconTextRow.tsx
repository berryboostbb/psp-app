import { AppText, AppView, HorizontalSpacer } from "@components";
import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

interface Props {
  selected?: boolean;
  icon: any;
  title: string;
  onPress?(): void;
}

const IconTextRow = ({ selected = false, icon, title, onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.container, selected && styles.active]}
    >
      <Image source={icon} style={styles.image} />
      <HorizontalSpacer spaceFactor={2} />
      <AppText title={title} size={20} colorText="#4A5568" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
  },
  image: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  active: {
    backgroundColor: "#F2F2F2",
  },
});

export default IconTextRow;
