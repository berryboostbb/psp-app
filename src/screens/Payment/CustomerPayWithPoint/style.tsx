import { GST, RF ,verticalScale} from "@theme";
import { StyleSheet } from "react-native";

const useStyles = (colors: any) =>
  StyleSheet.create({
    main: { paddingTop: 0, paddingHorizontal: 0 },
    textContainer:{
      ...GST.mid_row,
     
    },
    amountView:{
      alignItems: "flex-end"
    },
    btn: { width: RF(142), height: RF(50) },
    container: {  marginHorizontal:RF(30),
      marginTop:RF(30) },
    wrapButton: {
      ...GST.mid_row,
      paddingTop: verticalScale(90),
      paddingHorizontal: RF(20),
    },
  });

export default useStyles;
