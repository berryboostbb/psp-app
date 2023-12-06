import { GST, horizontalScale, RF, verticalScale } from "@theme";
import { StyleSheet } from "react-native";

const useStyles = (colors: any) =>
  StyleSheet.create({
    heading: {
      alignSelf: "center",
      marginVertical: 40,
      fontFamily: "Plus Jakarta Sans",
    },
    container: {
      height: 225,
      alignItems: "center",
      padding: 10,
    },
    row: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
      width: "100%",
      // alignItems: "center",
    },

    btn: {
      width: 180,
      height: 50,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 25,
      borderColor: colors.line,
    },
  });

export default useStyles;
