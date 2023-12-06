import { StyleSheet } from "react-native";
import { Typography, GST, RF, SCREEN_HEIGHT } from "@theme";
import { horizontalScale, moderateScale, verticalScale } from "@theme";

const useStyles = (colors: any) =>
  StyleSheet.create({
    wrapContainer: {
      paddingHorizontal: RF(40),
      marginTop: RF(80),
    },
    wrapView: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingHorizontal: 0,
    },
    topMarginView: {
      paddingTop: RF(32),
    },
    imgView: {
      height: RF(220),
      backgroundColor: "#fff",
    },
    img: {
      width: "100%",
      height: RF(300),
      marginTop: -20,
    },
    wrapRememberSection: {
      alignItems: "center",
      // backgroundColor: "red",
      flexDirection: "row",
      marginTop: RF(30),
    },
    wrapButton: {
      ...GST.mid_row,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: verticalScale(32),
    },
    btn: {
      width: RF(160),
      height: RF(45),
      alignItems: "center",
      borderRadius: RF(100),
      justifyContent: "center",
    },
  });

export default useStyles;
