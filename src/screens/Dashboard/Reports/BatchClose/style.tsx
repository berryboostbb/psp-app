import { StyleSheet } from "react-native";
import { horizontalScale, moderateScale,verticalScale,RF,HP,WP } from '@theme';
import {DARK_GREY2,Typography,GST} from "@theme";

const useStyles = (colors: any) =>
  StyleSheet.create({   
    topMarginView:{
        paddingTop:RF(20),
        ...GST.CENTER
    },
    conatiner:{
      marginTop: RF(95)
    }
  });

export default useStyles;
