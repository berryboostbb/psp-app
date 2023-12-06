import { StyleSheet } from "react-native";
import { RF } from '@theme';
import {Typography,GST} from "@theme";

const useStyles = (colors: any) =>
  StyleSheet.create({   
    containerIntro:{paddingTop:RF(20),paddingHorizontal:RF(15) },
    topView:{paddingTop:RF(20)},
    containerBox: {
      width: "100%",
      borderWidth: 1,
      borderColor: colors.light_grey,
      borderRadius: RF(16),
      marginTop: RF(10),
      paddingBottom: RF(10),
    },
    containerView: {
      paddingHorizontal: RF(10),
      paddingTop: RF(10),
    },
    flexView: {
      flex: 2,
    },
    flexViewCenter: {
      flex: 2,
      ...GST.CENTER,
    },
    TrxTitleView: {
      ...GST.ROW,
    },
    TrxTypeView: {
      ...GST.ROW,
    },
    TrxTotalView: {
      ...GST.ROW,
    },
    boxContainer: {
      // paddingBottom: RF(35),
    },
   
     
  });

export default useStyles;
