import { GST, RF } from "@theme";
import { StyleSheet } from "react-native";

const useStyles = (colors: any) =>
  StyleSheet.create({
    main: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: RF(30),
    },
  });

export default useStyles;
