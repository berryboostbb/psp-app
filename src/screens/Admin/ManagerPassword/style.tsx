import { StyleSheet } from "react-native";
import { horizontalScale, moderateScale,verticalScale,RF,HP,WP } from '@theme';
import {DARK_GREY2,Typography,GST} from "@theme";

const useStyles = (colors: any) =>
  StyleSheet.create({   
     wrapContainer:{
      flex: 1,
      paddingTop: RF(70),
      marginHorizontal: RF(20),
     }
     
    
  });

export default useStyles;
