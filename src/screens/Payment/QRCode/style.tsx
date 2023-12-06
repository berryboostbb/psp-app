import { RF } from "@theme";
import { StyleSheet } from "react-native";

const useStyles = (colors: any) =>
  StyleSheet.create({
    main: { paddingTop: 0, paddingHorizontal: 0 },
    textTopMargin: {
      paddingTop: RF(60),
    },
    img:{
      height:RF(120),
      width:'100%',
      resizeMode:'contain',
      marginTop:RF(30)
    },
    primaryBtnContainer: {
      paddingTop: RF(50),
      paddingHorizontal: RF(50),
      flexDirection: "row",
      justifyContent: "space-around",
      flex:1,
      alignItems:'center'
    },
    primartBtn: {
      width: RF(130),
      height: RF(50),
    },
  });

export default useStyles;
