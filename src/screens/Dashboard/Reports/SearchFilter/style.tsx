import { StyleSheet } from "react-native";
import { RF } from "@theme";
import { Typography, GST } from "@theme";

const useStyles = (colors: any) =>
  StyleSheet.create({
    headerFilter: { ...GST.mid_row },
    headerText: { paddingTop: RF(10), fontFamily: "Plus Jakarta Sans" },
    closeImage: { width: RF(60), height: RF(60) },
    containerList: { marginTop: RF(60), paddingHorizontal: RF(30) },
    btnView: { paddingTop: RF(40) },
  });

export default useStyles;
