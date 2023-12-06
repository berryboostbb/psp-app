import { StyleSheet } from "react-native";
import { GST, RF, verticalScale } from "@theme";

const useStyles = (colors: any) =>
  StyleSheet.create({
    wrapContainer: {
      backgroundColor: colors.white,
      // backgroundColor: colors.background,
    },
    imgBackgroundView: {
      width: "100%",
      height: RF(210),
      marginTop: -20,
      justifyContent: "center",
    },
    img: {
      width: "100%",
      height: RF(80),
      resizeMode: "contain",
      marginTop: -20,
    },
    wrapButton: {
      ...GST.mid_row,
      justifyContent: "center",
      flex: 1,
      paddingTop: RF(20),
    },
    btn: {
      width: RF(185),
      height: RF(60),
      alignItems: "center",
      borderRadius: RF(100),
      justifyContent: "center",
    },
  });

export default useStyles;
