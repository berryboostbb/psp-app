import React from "react";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { View, Text, StyleSheet } from "react-native";

export const HEIGHT = 80;
export const WIDTH = 340;
export const BORDER_RADIUS = 6;

export const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#81c784" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  tomatoToast: ({ text1, text2, props }: any) => (
    <View style={[styles.base, styles.leadingBorder]}>
      <View style={styles.contentContainer}>
        <Text style={styles.text1}>{text1}</Text>
        <Text style={styles.text2}>{text2}</Text>
      </View>
    </View>
  ),
};

export const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    height: HEIGHT,
    width: WIDTH,
    borderRadius: BORDER_RADIUS,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: BORDER_RADIUS,
    shadowColor: "#000",
    elevation: 2,
    backgroundColor: "#faf8f7",
  },
  leadingBorder: {
    borderLeftWidth: 5,
    borderLeftColor: "tomato",
  },
  contentContainer: {
    paddingHorizontal: 25,
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start", // In case of RTL, the text will start from the right
  },
  text1: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#000",
    width: "100%", // Fixes: https://github.com/calintamas/react-native-toast-message/issues/130
  },
  text2: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 14,
    color: "#979797",
    width: "100%", // Fixes: https://github.com/calintamas/react-native-toast-message/issues/130
  },
});
