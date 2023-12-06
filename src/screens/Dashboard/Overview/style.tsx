import { StyleSheet } from "react-native";

const useStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors?.white,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
  });

export default useStyles;
