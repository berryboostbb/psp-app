import { GST, RF } from "@theme";
import { StyleSheet } from "react-native";

const useStyles = (colors: any) =>
  StyleSheet.create({
    header: { paddingLeft: RF(20), fontFamily: "Plus Jakarta Sans" },
    view: {
      flex: 1,
      // marginTop: RF(100),
      ...GST.CENTER,
    },
    input: { marginLeft: RF(20), fontFamily: "Plus Jakarta Sans" },
    txt: {
      alignItems: "center",
      marginRight: RF(20),
      marginTop: RF(40),
    },
  });

export default useStyles;
