import { cross, drawer } from "@assets";
import { RF, Typography } from "@theme";
import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  ImageBackground,
  Image,
} from "react-native";

import AppText from "../AppText";
import styles from "./styles";

const NumKeyboard = ({
  value,
  onChangeText,
  height = RF(450),
  maxLength,
  showOkay,
  buttonText,
  onPressOkay,
}: {
  showOkay?: boolean;
  value: string;
  buttonText?: string;
  onChangeText?: (val: string) => any;
  height?: number;
  maxLength?: number;
  onPressOkay?: () => void;
}) => {
  const handlePress = (val: string) => {
    if (maxLength) {
      if (value.length === maxLength) {
        return;
      }
    }

    onChangeText && onChangeText(value + val);
  };

  const handleDelete = () => {
    if (value.length > 0) {
      value = value.substring(0, value.length - 1);
      onChangeText && onChangeText(value);
    }
  };

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.rowContainer}>
        <NumberComp value={"1"} onPress={() => handlePress("1")} />
        <NumberComp value={"2"} onPress={() => handlePress("2")} />
        <NumberComp value={"3"} onPress={() => handlePress("3")} />
      </View>

      <View style={styles.rowContainer}>
        <NumberComp value={"4"} onPress={() => handlePress("4")} />
        <NumberComp value={"5"} onPress={() => handlePress("5")} />
        <NumberComp value={"6"} onPress={() => handlePress("6")} />
      </View>

      <View style={styles.rowContainer}>
        <NumberComp value={"7"} onPress={() => handlePress("7")} />
        <NumberComp value={"8"} onPress={() => handlePress("8")} />
        <NumberComp value={"9"} onPress={() => handlePress("9")} />
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.numberContainer}>
          {showOkay && (
            <TouchableOpacity
              onPress={onPressOkay}
              style={{
                // backgroundColor: "gray",
                // paddingHorizontal: Typography.PADDING.NORMAL,
                paddingVertical: Typography.PADDING.LOW,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  fontFamily: Typography.FONTS.TYPE.BOLD,
                  color: "black",
                  fontSize: Typography.FONTS.SIZE.XSMALL,
                }}
              >
                {buttonText}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <NumberComp value={"0"} onPress={() => handlePress("0")} />

        <TouchableOpacity style={styles.numberContainer} onPress={handleDelete}>
          <Image source={cross} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const NumberComp = ({
  value,
  onPress,
}: {
  value: string;
  onPress: () => void;
}) => {
  const [isBackgroundVisible, setIsBackgroundVisibles] = useState(false);

  // console.log(isBackgroundVisible);

  return (
    <TouchableOpacity
      style={styles.numberContainer}
      onPress={onPress}
      onPressIn={() => setIsBackgroundVisibles(true)}
      onPressOut={() => setIsBackgroundVisibles(false)}
    >
      {isBackgroundVisible && (
        <Image source={drawer} style={{ position: "absolute" }} />
      )}
      {/* <AppText
        style={[
          styles.numberText,
          // {
          //   color:"black",
          // },
        ]}
      > */}
      <Text
        style={{
          fontSize: RF(15),
          color: "black",
          fontFamily: "Plus Jakarta Sans",
        }}
      >
        {value}{" "}
      </Text>
      {/* </AppText> */}
    </TouchableOpacity>
  );
};

export default NumKeyboard;
