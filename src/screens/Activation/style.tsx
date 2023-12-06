import { StyleSheet } from "react-native";
import { Typography, GST, RF, SCREEN_HEIGHT } from "@theme";
import { horizontalScale, moderateScale, verticalScale } from "@theme";

const useStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    logo: {
      width: 133,
      height: 75,
      alignSelf: "center",
      marginTop: 43,
    },
    inputContainer: { position: "absolute", bottom: 45, alignSelf: "center" },
    input: {
      backgroundColor: "rgba(255, 255, 255,0.7)",
      width: 270,
    },
    btnStyle: { alignSelf: "center", width: 150, height: 40 },
    activationView: {
      paddingVertical: 10,
      paddingHorizontal: 25,
      backgroundColor: "#7FC346BF",
      marginBottom: 32,
      borderRadius: 25,
    },
  });

export default useStyles;
