import { StyleSheet } from "react-native";
import {
  RF,
} from "@theme";
import { DARK_GREY2, Typography, GST } from "@theme";

const useStyles = (colors: any) =>
  StyleSheet.create({
    headingContainer: {
      marginTop: RF(20),
      ...GST.CENTER,
    },
    searchView: {
      marginTop: RF(40),
    },
    mainView: {
      width: "95%",
      height: RF(100),
      borderWidth: 1,
      borderRadius: RF(16),
      borderColor: colors.light_grey,
      marginHorizontal: RF(10),
      paddingHorizontal: RF(15),
      padding: RF(10),
    },
    selectedView: {
      width: "95%",
      paddingBottom: RF(20),
      marginHorizontal: RF(10),
      paddingHorizontal: RF(15),
      borderWidth: 1,
      borderRadius: RF(16),
      borderColor: colors.light_grey,
    },
    pageView: {
      marginBottom: RF(10),
    },
    flatView: {
      marginTop: RF(20),
    },
    pressableView: {
      marginVertical: RF(7),
    },
  });

export default useStyles;
