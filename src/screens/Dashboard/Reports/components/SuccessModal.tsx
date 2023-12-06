import { good } from "@assets";
import { AppText, HorizontalSpacer } from "@components";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const SuccessModal = () => {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Image source={good} style={styles.image} />
        <HorizontalSpacer />
        <AppText
          title="Report Successfully Printed"
          center
          colorText="#19383A"
          size={17}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: -660,
    left: -180,
    width: 700,
    height: 700,
    backgroundColor: "#E3F8CFD9",
    zIndex: 1000,
    borderRadius: 500,
    alignItems: "center",
  },
  subContainer: {
    position: "absolute",
    bottom: 34,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 26,
    height: 26,
  },
});

export default SuccessModal;
