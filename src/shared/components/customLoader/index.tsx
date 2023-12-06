import { circularLoader, points } from "@assets";
import { RF } from "@theme";
import React from "react";

import { View, ActivityIndicator, StyleSheet, Image } from "react-native";
import { useSelector } from "react-redux";
import { LottieAnimation } from "@components";

interface LoaderProps {}
const CustomLoader = (props: Partial<LoaderProps>) => {
  const isLoading = useSelector((state: any) => state.common.isLoading);

  return isLoading ? (
    <View style={styles.loading}>
      {/* <ActivityIndicator size={55} color="#00ff00" />
       */}
      <LottieAnimation source={circularLoader} height={200} />
    </View>
  ) : null;
};
export default CustomLoader;

const styles = StyleSheet.create({
  loading: {
    alignItems: "center",
    backgroundColor: "rgba(29, 43, 72, 0.5)",
    justifyContent: "center",
    position: "absolute",
    zIndex: 11111,
    width: "100%",

    height: "100%",
  },
});
