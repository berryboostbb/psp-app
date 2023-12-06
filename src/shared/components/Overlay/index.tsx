import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
var { width, height } = Dimensions.get("window");
const Overlay = (props: any) => {
  const { bgColor, opacity } = props;
  return (
    <View
      style={[styles.overlay, { backgroundColor: bgColor, opacity: opacity }]}
    >
      {props.children}
    </View>
  );
};

export default Overlay;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: "absolute",
    left: 0,
    top: 0,
    width: width,
    // height: height,
  },
});
