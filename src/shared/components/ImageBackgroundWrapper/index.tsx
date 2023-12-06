import React from "react";
import AppText from "../AppText";
import { useTheme } from "@react-navigation/native";
import { RF, horizontalScale, GST, Typography } from "@theme";
import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  ImageBackgroundProps,
} from "react-native";
import { admin_logo } from "@assets";

interface Props extends ImageBackgroundProps {
  source?: any;
  imageName?: any;
  imageStyle?: any;
  adminVisible?: any;
  drawerVisible?: any;
  notifyVisible?: any;
  text?: any;
}

const ImageBackgroundWrapper = (props: Partial<Props>) => {
  const theme: any = useTheme();
  const {
    source,
    imageName,
    imageStyle,
    adminVisible,
    drawerVisible,
    notifyVisible,
    text,
  } = props;
  return (
    <ImageBackground
      source={source}
      imageStyle={styles.img}
      style={[styles.bgImageContainer, imageStyle]}
    >
      {/* <View style={styles.view}>
        <View style={{ ...GST.mid_row }}>
          {drawerVisible && (
            <AppText colorText={"green"} size={16}>
              Drawer
            </AppText>
          )}
          {adminVisible && (
            <AppText colorText={"green"} size={18}>
              Admin
            </AppText>
          )}
          {notifyVisible && <AppText colorText={"green"}>notification</AppText>}
        </View>
      </View> */}
      {/* <View style={styles.imgView}> */}
      {/* <Image style={styles.image} source={admin_logo} /> */}
      <AppText
        colorText="#fff"
        title={text}
        size={Typography.FONTS.SIZE.XXXLARGE}
      />
      {/* <AppText
        title={"Business Name"}
        colorText="#fff"
        size={Typography.FONTS.SIZE.LARGE}
      /> */}
      {/* </View> */}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imgView: {
    backgroundColor: "#fff",
    borderRadius: 100,
    width: RF(120),
    height: RF(120),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 15,
  },
  view: { paddingTop: RF(30), paddingHorizontal: RF(25) },
  img: {
    height: RF(280),
  },
  bgImageContainer: {
    height: RF(284),
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    resizeMode: "contain",
    height: RF(120),
  },
});

export default ImageBackgroundWrapper;
