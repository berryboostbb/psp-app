import React from "react";
import { del } from "@assets";
import AppText from "../AppText";
import { GST, RF, Typography } from "@theme";
import { useTheme } from "@react-navigation/native";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Pressable,
} from "react-native";
import { useSelector } from "react-redux";
import { languagePicker } from "@utils";

interface Props {
  val1?: any;
  val2?: any;
  style?: any;
  heading?: any;
  title?: string;
  subHeading?: any;
  onPress?: () => void;
}
// const C = React.memo(props => {
//   return <var>{props.n}</var>
// })
const Delete_Box = React.memo((props: Props) => {
  const language = useSelector((state: any) => state.user.languageType);
  const myTheme: any = useTheme();
  const styles = useStyles(myTheme.colors);
  const { title, onPress, style, heading, subHeading, val1, val2 } = props;

  return (
    <View style={[styles.main, GST.mt30]}>
      <View>
        <AppText
          medium
          defaultTextColor
          title={languagePicker(language, "Name:") + " " + val1}
          size={Typography.FONTS.SIZE.LARGE}
        />

        <AppText
          medium
          defaultTextColor
          title={languagePicker(language, "ID Number:") + " " + val2}
          size={Typography.FONTS.SIZE.LARGE}
        />
      </View>

      <Pressable
        onPress={onPress}
        style={{
          flexDirection: "row",
        }}
      >
        <AppText
          medium
          defaultTextColor
          title={languagePicker(language, "Disable")}
          size={Typography.FONTS.SIZE.LARGE}
        />
        <Image source={del} style={styles.img} />
      </Pressable>
    </View>
  );
});

const useStyles = (colors: any) =>
  StyleSheet.create({
    view: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: RF(10),
    },

    main: {
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      paddingVertical: RF(28),
      paddingHorizontal: RF(35),
      marginTop: RF(10),
      borderWidth: 1,
      borderColor: colors.light_grey,
      borderRadius: RF(16),
      flexDirection: "row",
    },
    img: {
      width: RF(25),
      height: RF(25),
      tintColor: "#000",
      resizeMode: "contain",
      marginLeft: 5,
    },
  });

export default Delete_Box;
