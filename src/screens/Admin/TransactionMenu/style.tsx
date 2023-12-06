import { GST } from "@theme";
import { StyleSheet } from "react-native";

const useStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      ...GST.MAIN,
      backgroundColor: colors.background,
    },
    mainView: {
      flex: 1,
      alignItems: "center",
      paddingTop: 50,
    },
  });

export default useStyles;
