import React from "react";
import { StyleSheet, View } from "react-native";
import SectionButton from "./SectionButton";
import { SectionType } from "../types";

interface Props {
  selectedSection: SectionType;
  onPressToday(): void;
  onPressYesterday(): void;
  title1: SectionType;
  title2: SectionType;
}

const SectionBar = ({
  selectedSection,
  onPressToday,
  onPressYesterday,
  title1,
  title2,
}: Props) => {
  return (
    <View style={styles.sectionCotnainer}>
      <SectionButton
        title={title1}
        isActive={selectedSection === title1}
        onPress={onPressToday}
      />
      <SectionButton
        title={title2}
        isSecond
        isActive={selectedSection === title2}
        onPress={onPressYesterday}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCotnainer: {
    flexDirection: "row",
    width: "100%",
  },
});

export default SectionBar;
