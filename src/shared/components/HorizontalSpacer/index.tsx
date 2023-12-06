import React from "react";
import { View } from "react-native";

interface Props {
  spaceFactor?: number;
}

const HorizontalSpacer = ({ spaceFactor = 1 }: Props) => {
  return <View style={{ width: 16 * spaceFactor }} />;
};

export default HorizontalSpacer;
