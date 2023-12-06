import { StyleSheet } from "react-native";
import { RF } from "@theme";

const styles = StyleSheet.create({
  header: {
    height: RF(85),
    alignItems: "center",
    marginTop: RF(25),
  },
  input: {
    height: 40,
    width: "80%",
    fontFamily: "Plus Jakarta Sans",
  },
  inputView: {
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    width: "40%",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    justifyContent: "space-between",
  },
});

export default styles;
