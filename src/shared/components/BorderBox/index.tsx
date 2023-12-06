import React, { useState, useEffect } from "react";
import AppText from "../AppText";
import { GST, RF, Typography } from "@theme";
import { useTheme } from "@react-navigation/native";
import { StyleSheet, Pressable, Image, View, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setHostText } from "@redux";

interface Props {
  val1?: any;
  val2?: any;
  style?: any;
  heading?: any;
  title?: string;
  titleColor?: any;
  subHeading?: any;
  headingColor?: any;
  val1Color?: any;
  subHeadingColor?: any;
  val2Editable?: any;
  onPress?: () => void;
}

const Border_Box = (props: Props) => {
  const {
    title,
    titleColor,
    onPress,
    style,
    heading,
    subHeading,
    val1,
    val2,
    val1Color,
    headingColor,
    val2Editable,
    subHeadingColor,
  } = props;
  const { hostText } = useSelector((state: any) => state.user);
  const [text, setText] = useState<any>(hostText);
  const myTheme: any = useTheme();
  const styles = useStyles(myTheme.colors);
  const dispatch = useDispatch();

  const onHandleChange = () => {
    if (text.trim().length === 0) {
      setText("www.google.com");
      dispatch(setHostText("www.google.com"));
    }
  };

  return (
    <View style={GST.mt30}>
      <AppText
        bold
        title={title}
        colorText={titleColor ? myTheme.colors.primary : myTheme.colors.text}
        size={Typography.FONTS.SIZE.LARGE}
        textStyle={[{ paddingLeft: RF(25) }, style]}
      />
      <Pressable
        style={styles.main}
        onPress={val2Editable ? onPress : () => {}}
      >
        <View style={styles.txtView}>
          <AppText
            medium
            colorText={
              headingColor ? myTheme.colors.primary : myTheme.colors.text
            }
            title={heading}
            size={Typography.FONTS.SIZE.LARGE}
          />
          {/* {val2Editable ? (
            <TextInput
              onChangeText={(txt: any) => {
                setText(txt);
                dispatch(setHostText(txt));
                if (text.trim().length === 0) {
                  dispatch(setHostText("www.google.com"));
                }
              }}
              onSubmitEditing={onHandleChange}
              value={text}
              style={{
                color: myTheme.colors.primary,
                fontSize: Typography.FONTS.SIZE.LARGE,
                paddingTop: -10,
              }}
              placeholderTextColor={myTheme.colors.primary}
            />
          ) : ( */}

          <AppText
            medium
            title={val1}
            size={Typography.FONTS.SIZE.LARGE}
            colorText={val1Color ? myTheme.colors.primary : myTheme.colors.text}
          />

          {/* )} */}
        </View>
        <View style={styles.view}>
          <AppText
            medium
            defaultTextColor
            title={subHeading}
            size={Typography.FONTS.SIZE.LARGE}
          />
          <AppText
            medium
            defaultTextColor
            title={val2}
            size={Typography.FONTS.SIZE.LARGE}
          />
        </View>
      </Pressable>
    </View>
  );
};

const useStyles = (colors: any) =>
  StyleSheet.create({
    view: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      // marginTop: RF(10),
    },
    txtView: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      height: 40,
    },
    main: {
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: RF(110),
      paddingHorizontal: RF(35),
      marginTop: RF(10),
      borderWidth: 1,
      borderColor: colors.light_grey,
      borderRadius: RF(16),
    },
    img: {
      width: RF(30),
      height: RF(30),
      tintColor: "#000",
      resizeMode: "contain",
    },
  });

export default Border_Box;
