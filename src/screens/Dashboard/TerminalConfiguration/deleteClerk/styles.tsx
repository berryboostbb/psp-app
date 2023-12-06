import { GST, RF } from "@theme";
import { StyleSheet } from "react-native";

const useStyles = (colors: any) =>
  StyleSheet.create({
    header: { paddingLeft: RF(20) },
    view: {
      flex: 1,
      marginTop: RF(100),
    },
    input: { marginLeft: RF(20) },
    txt: {
      alignItems: "flex-end",
      marginRight: RF(20),
      marginTop: RF(40),
    },
  });

export default useStyles;
