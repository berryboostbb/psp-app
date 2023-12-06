import { StyleSheet } from "react-native";
import { horizontalScale,verticalScale } from '@theme';

const useStyles = (colors: any) =>
  StyleSheet.create({
    container:{
      justifyContent: "center",
      flex: 1,
      marginTop: -60,
    },
    inputContainer: {
      fontSize: horizontalScale(32),
      letterSpacing: 5,
      textAlign: "center",
    },
    img: {
      height: verticalScale(16),
      width: horizontalScale(135),
      alignSelf: "center",
    },
  });

export default useStyles;
