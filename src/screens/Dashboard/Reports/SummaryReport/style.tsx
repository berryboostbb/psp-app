import { StyleSheet } from "react-native";
import { RF } from '@theme';
import {GST} from "@theme";

const useStyles = (colors: any) =>
  StyleSheet.create({   
    headingView:{ marginTop:RF(20),...GST.CENTER},
    searchView: { marginTop: RF(40)},
    topView:{ paddingTop:RF(35)},
  });

export default useStyles;
