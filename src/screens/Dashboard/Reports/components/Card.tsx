import { AppView } from "@components";
import React, { ReactNode } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

interface Props {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  onPress?(): void;
}

const Card = ({ style = {}, children, onPress }: Props) => {
  return (
    <AppView style={[styles.container, style]} onPress={onPress}>
      {children}
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.6,
    borderColor: "rgba(74, 85, 104, 0.4)",
    borderRadius: 12,
    padding: 12,
  },
});

export default Card;
