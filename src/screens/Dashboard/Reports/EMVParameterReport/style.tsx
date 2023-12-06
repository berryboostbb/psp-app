import { StyleSheet } from "react-native";
import { RF,} from "@theme";
import {  Typography, GST } from "@theme";

const useStyles = (colors: any) =>
  StyleSheet.create({
    boxInfoView:{paddingHorizontal:RF(10),paddingTop:RF(10),paddingBottom:RF(20)},
    topView:{paddingTop:RF(20)},
    mainView: {
      width: "100%",
      borderWidth: 1,
      borderRadius: RF(16),
      borderColor: colors.light_grey,
      padding: RF(10),
      marginTop:RF(10),
      paddingHorizontal: RF(15),
      paddingBottom:RF(10)
    },
    textView:{padding:RF(10)}

  });

export default useStyles;
