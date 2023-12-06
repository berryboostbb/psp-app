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
      paddingTop: RF(35),
    },
    bottomView: {
      marginBottom: RF(20),
    },
    headerView: {
      paddingHorizontal: RF(30),
      paddingTop: RF(20),
      backgroundColor: colors.white,
    },
    tileStyle: {
      paddingHorizontal: RF(55),
    },
  });

export default useStyles;
