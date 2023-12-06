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

const getStyle = (colors: any) =>
  StyleSheet.create({
    headerView: {
      paddingHorizontal: RF(30),
      paddingTop: RF(20),
      backgroundColor: colors.white,
    },
  });

export default getStyle;
