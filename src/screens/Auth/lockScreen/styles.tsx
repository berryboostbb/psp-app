import { RF, SCREEN_HEIGHT, SCREEN_WIDTH } from "@theme";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btn: { marginBottom: RF(30), alignItems: "center" },
  margin: { marginVertical: RF(5) },
  logoutView: {
    position: "absolute",
    right: 15,
    top: 24,
    zIndex: 20,
  },
});

export default styles;
