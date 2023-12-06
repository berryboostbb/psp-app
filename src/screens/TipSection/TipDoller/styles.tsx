import { GST, RF } from "@theme";
import { StyleSheet } from "react-native";

const useStyles = (colors: any) =>
  StyleSheet.create({
    tipDollerContiner: {
      ...GST.mid_row,
      paddingTop: RF(20),
      paddingHorizontal: RF(30),
    },
    row: {
      flexDirection: "row",
    },
    tippPercentageContiner: {
      ...GST.mid_row,
      paddingTop: RF(16),
      paddingHorizontal: RF(30),
    },
    primaryBtnContainer: {
      // paddingTop: RF(50),
      width: "100%",
      paddingHorizontal: RF(50),
      flexDirection: "row",
      justifyContent: "space-around",
      position: "absolute",
      bottom: 50,
    },
    textTopMargin: {
      paddingTop: RF(60),
    },
    primartBtn: {
      width: RF(130),
      height: RF(50),
    },
  });

export default useStyles;
