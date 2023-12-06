import { StyleSheet } from "react-native";
import { RF, SCREEN_HEIGHT } from "@theme";

const useStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    mt: { marginTop: RF(50) },
    bottom: {
      marginTop: SCREEN_HEIGHT / 1.4,
    },
    lottie: { height: SCREEN_HEIGHT * 1.04, alignSelf: "center" },
  });

export default useStyles;
