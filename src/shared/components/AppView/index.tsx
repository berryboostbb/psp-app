import React, { ReactNode } from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

interface Props {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  onPress?(): void;
}

const AppView = ({ style, children, onPress }: Props) => {
  return (
    <TouchableOpacity activeOpacity={1} style={style} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

export default AppView;
