import {
  StyleSheet,
  ImageStyle,
  StyleProp,
  ImageBackgroundProps,
  ImageBackground as DefaultImageBackground,
  View,
} from "react-native";
import React from "react";
import { processingAnim } from "@assets";
import { RF } from "@theme";
import LottieAnimation from "../LottieAnimation";
import Wrapper from "../Wrapper";
import ProcessingHeader from "../ProcessingHeader";
import Overlay from "../Overlay";

interface Props extends ImageBackgroundProps {
  imageStyle?: StyleProp<ImageStyle> | undefined;
  source?: any;
}

const Processing = (props: Props) => {
  const { source, imageStyle } = props;

  return (
    <Overlay>
      <ProcessingHeader />
      <View
        style={{
          position: "absolute",
          top: -20,
          left: -20,
        }}
      >
        <LottieAnimation source={processingAnim} height={700} />
        
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  imgBackgroundView: {
    width: "100%",
    height: RF(200),
    marginTop: -20,
    justifyContent: "center",
    zIndex: 100,
  },
  img: {
    width: "100%",
    height: RF(80),
    resizeMode: "contain",
    marginTop: -20,
  },
});

export default Processing;
