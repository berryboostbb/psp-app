import { GST, RF } from "@theme";
import { StyleSheet } from "react-native";

const useStyles = (colors: any) =>
  StyleSheet.create({
    headerView: {
      paddingHorizontal: RF(30),
      paddingTop: RF(20),
      backgroundColor: colors.white,
    },
  });

export default useStyles;
