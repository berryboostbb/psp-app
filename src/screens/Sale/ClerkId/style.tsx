import { StyleSheet } from "react-native";
import { horizontalScale, RF, verticalScale } from "@theme";

const useStyles = (colors: any) =>
  StyleSheet.create({
    btn: { marginBottom: RF(30), alignItems: "center" },
    view: { marginTop: 10 },
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
  });

export default useStyles;
