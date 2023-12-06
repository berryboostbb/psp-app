import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Lottie from "lottie-react-native";

interface Props {
  source?: any;
  height?: any;
}
const LottieAnimation = ({ source, height }: Props) => {
  const animationRef = useRef<Lottie>(null);
  const animationProgress = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View>
      <Lottie
        // ref={animationRef}
        source={source}
        autoPlay
        loop
        style={{
          height: height,
        }}
        // progress={animationProgress.current}
      />
    </View>
  );
};
export default LottieAnimation;

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    elevation: 20,
  },
});
