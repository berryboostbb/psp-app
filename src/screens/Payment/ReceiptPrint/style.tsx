import { StyleSheet } from "react-native";
import { verticalScale } from '@theme';

const useStyles = (colors: any) =>
  StyleSheet.create({
     img:{
      height:verticalScale(169)
     }
  });

export default useStyles;
