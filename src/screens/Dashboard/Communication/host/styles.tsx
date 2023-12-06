import { GST, RF } from "@theme";
import { StyleSheet } from "react-native";

const useStyles = (colors: any) =>
  StyleSheet.create({
    input: { marginLeft: RF(20), color: colors.border },
    btn: {
      alignItems: "center",
      width: "40%",
      height: RF(50),
      marginTop: RF(30),
    },
  });

export default useStyles;
