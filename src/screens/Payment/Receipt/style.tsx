import { RF } from "@theme";
import { StyleSheet } from "react-native";

const useStyles = (colors: any) =>
  StyleSheet.create({
    wrapContainer: {
      backgroundColor: colors.background,
    },
    secondaryBtnView: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: RF(50),
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
    
    contentView: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      marginTop: -50,
    },
    textMarginTop: {
      marginTop: RF(5),
    },
  });

export default useStyles;
