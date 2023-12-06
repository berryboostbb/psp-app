import { AppText } from "@components";
import React from "react";
import { StyleSheet, View } from "react-native";

interface ReportRowProps {
  title: string;
  alignLeft?: boolean;
  bold?: boolean;
  flex2?: boolean;
  textColor?: string;
  fontSize?: number;
}
const ReportRowItem = ({
  title,
  alignLeft = false,
  bold = false,
  flex2 = false,
  textColor = "#4A5568",
  fontSize = 17,
}: ReportRowProps) => {
  return (
    <View
      style={[
        styles.reportItem,
        flex2 && { flex: 2 },
        !alignLeft && styles.alignItemsEnd,
      ]}
    >
      <AppText
        title={title}
        colorText={textColor}
        size={fontSize}
        bold={bold}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  reportItem: {
    flex: 1,
    alignItems: "flex-start",
  },
  alignItemsEnd: {
    alignItems: "flex-end",
  },
});

export default ReportRowItem;
