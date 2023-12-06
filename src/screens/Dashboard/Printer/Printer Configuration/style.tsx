import { StyleSheet } from "react-native";
import { horizontalScale, moderateScale,verticalScale,RF,HP,WP } from '@theme';
import {DARK_GREY2,Typography,GST} from "@theme";

const useStyles = (colors: any) =>
  StyleSheet.create({   
    topMarginView: {
        paddingTop:RF(35)
      },
      toggleBoxView:{
        paddingTop:RF(10),
        paddingBottom:RF(20)
      }
     
  });

export default useStyles;
