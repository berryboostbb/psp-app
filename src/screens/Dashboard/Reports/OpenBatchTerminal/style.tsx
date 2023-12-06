import { StyleSheet } from "react-native";
import { horizontalScale, moderateScale,verticalScale,RF,HP,WP } from '@theme';
import {DARK_GREY2,Typography,GST} from "@theme";

const useStyles = (colors: any) =>
  StyleSheet.create({   
      container:{
        paddingTop:RF(20),paddingHorizontal:RF(20)
      },
      introContainer:{
        ...GST.mid_row,paddingVertical:RF(5)
      },
      topView:{
        paddingTop:RF(35)
      },
      marginTopView:{
        paddingTop:RF(30)
      },
      headerView:{
        paddingHorizontal:RF(30),paddingTop:RF(20),backgroundColor:colors.white
      }
  });

export default useStyles;
