import { StyleSheet } from "react-native";

const useStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    addDataButton: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      backgroundColor: colors.primary,
      borderRadius: 8,
      alignSelf: "center",
      marginBottom: 40,
    },
    buttonText: {
      color: colors.white,
    },
    separator: {
      width: "100%",
      height: 2,
      backgroundColor: "red",
    },
  });

export default useStyles;
