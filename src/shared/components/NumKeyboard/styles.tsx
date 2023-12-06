import { RF, Typography } from "@theme";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: RF(30),
    backgroundColor: "white",
  },
  rowContainer: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "red",
  },
  numberText: {
    textAlign: "center",
    fontFamily: "Plus Jakarta Sans",
    fontSize: Typography.FONTS.SIZE.MEDIUM,
    // fontFamily: THEME.FONTS.TYPE.SEMIBOLD,
    fontWeight: "500",
    color: "black",
    // position: "relative",
  },
  numberContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  backIcon: {
    height: RF(35),
    width: RF(35),
    color: "black",
  },
  confirmText: {
    backgroundColor: "black",
    color: "black",
    paddingVertical: RF(4),
    paddingHorizontal: RF(4),
  },
});

export default styles;
