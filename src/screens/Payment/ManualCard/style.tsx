import { GST, horizontalScale, RF, verticalScale } from "@theme";
import { StyleSheet } from "react-native";

const useStyles = (colors: any) =>
  StyleSheet.create({
    main: { paddingTop: 0, paddingHorizontal: 0 },
    wd: { width: RF(350) },
    view: { marginHorizontal: 25, marginTop: 30 },
    row: { flexDirection: "row", alignItems: "center" },
    rowView: {
      ...GST.mid_row,
      paddingTop: verticalScale(22),
    },
    lineView: {
      borderBottomWidth: horizontalScale(0.25),
      paddingTop: verticalScale(18),
      borderColor: "#4A55681A",
      opacity: 0.5,
    },
  });

export default useStyles;
