import { StyleSheet } from "react-native";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
  RF,
  HP,
  WP,
} from "@theme";
import { DARK_GREY2, Typography, GST } from "@theme";

const useStyles = (colors: any) =>
  StyleSheet.create({
    topMarginView: {
      paddingTop: RF(20),
    },
    btn: {
      width: RF(160),
      alignSelf: "center",
      height: RF(45),
      alignItems: "center",
      borderRadius: RF(100),
      justifyContent: "center",
      marginTop: RF(20),
    },
  });

export default useStyles;
