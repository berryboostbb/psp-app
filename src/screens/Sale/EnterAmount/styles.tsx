import { StyleSheet } from "react-native";
import { GST, RF, verticalScale } from "@theme";

const useStyles = (colors: any) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
    },
    txt: { paddingTop: RF(21) },
    view: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    wrapContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    mannualEntryButton: {
      flex: 1,
      position: "absolute",
      top: 100,
      right: 25,
    },
  });

export default useStyles;
