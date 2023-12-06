import { GST, RF, verticalScale } from "@theme";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  txtView: { marginTop: 100 },
  main: { paddingTop: 0, paddingHorizontal: 0 },
  mt: { alignItems: "center", justifyContent: "center" },
  wd: { width: RF(140), height: RF(50), fontFamily: "Plus Jakarta Sans" },
  btn: {
    flex: 1,
    paddingBottom: RF(30),
    alignItems: "center",
    justifyContent: "flex-end",
  },
  wrapContainer: {
    ...GST.CENTER,
  },
  secondaryBtnView: {
    paddingTop: verticalScale(85),
  },
});

export default styles;
