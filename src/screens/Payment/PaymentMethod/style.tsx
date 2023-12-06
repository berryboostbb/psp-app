import { GST, RF, verticalScale } from "@theme";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  txtView: { marginTop: 100 },
  main: { paddingTop: 0, paddingHorizontal: 0 },
  secondaryBtnView: {
    paddingTop: verticalScale(85),
    ...GST.CENTER
  },
});

export default styles;
