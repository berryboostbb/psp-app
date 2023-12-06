import { StyleSheet } from "react-native";
import { RFValue as RF } from "react-native-responsive-fontsize";

export const GST = StyleSheet.create({
  CENTER: {
    justifyContent: "center",
    alignItems: "center",
  },
  MAIN: {
    flex: 1,
  },
  ROW: {
    flexDirection: "row",
  },
  mid_row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
  },
  flex: { flex: 1 },
  pt: { paddingTop: RF(35) },
  AIC: { alignItems: "center" },
  mt30: { marginTop: RF(30) },
  mt40: { marginTop: RF(40) },
});
