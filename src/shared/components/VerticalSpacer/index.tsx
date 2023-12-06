import React from "react";
import { View } from "react-native";

interface Props {
  spaceFactor?: number;
}

const VerticalSpacer = ({ spaceFactor = 1 }: Props) => {
  return <View style={{ height: 16 * spaceFactor }} />;
};

export default VerticalSpacer;
