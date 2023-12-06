import { StyleSheet } from "react-native";
import { horizontalScale,verticalScale,GST, RF } from '@theme';

const useStyles = (colors: any) =>
  StyleSheet.create({
    wrapContainer:{
      ...GST.CENTER 
    },
    imagPay:{
      width: horizontalScale(150), height: verticalScale(50) 
    },
    text:{
      paddingBottom: RF(20) 
    }
  });

export default useStyles;
