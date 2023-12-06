import { StyleSheet } from "react-native";
import { horizontalScale, RF, SCREEN_WIDTH, verticalScale } from "@theme";

const useStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: "50%",
    },
    inputContainer: {
      fontSize: horizontalScale(32),
      letterSpacing: 5,
      textAlign: "center",
    },
    img: {
      height: verticalScale(16),
      width: horizontalScale(135),
      alignSelf: "center",
    },
    secondText: {
      marginTop: "3%",
      fontFamily: "Plus Jakarta Sans",
    },

    image: {
      width: "100%",
      height: SCREEN_WIDTH / 3.9,
      resizeMode: "contain",
      marginTop: RF(70),
    },
    bottomText: {
      marginBottom: "10%",
      textDecorationLine: "underline",
      fontFamily: "Plus Jakarta Sans",
    },
  });

export default useStyles;
