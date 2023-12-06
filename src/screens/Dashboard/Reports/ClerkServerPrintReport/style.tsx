import { StyleSheet } from "react-native";
import {  RF,} from "@theme";
import {  Typography, GST } from "@theme";

const useStyles = (colors: any) =>
  StyleSheet.create({
    contentView:{paddingTop:RF(130)},
    btnView:{paddingTop:RF(30),alignItems:'center'},
    noteText:{}
  });

export default useStyles;
