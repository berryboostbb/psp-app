import React from "react";
import { RF } from "@theme";
import { StyleSheet } from "react-native";
import DropdownAlert from "react-native-dropdownalert";

interface Props {
  imageSrc?: any;
  bgClr?: any;
  error?: any;
  style?: any;
  titleStyle?: any;
  title_mT?: any;
  img_mT?: any;
  yellow?: any;
  ml?: any;
  tintClr?: any;
  t_ml?: any;
  fontSize?: any;
  width?: any;
  closeInterval?: any;
}

const SuccessHeader = React.forwardRef((props: Partial<Props>, ref: any) => {
  const {
    imageSrc,
    bgClr,
    error,
    yellow,
    title_mT,
    img_mT,
    ml,
    tintClr,
    t_ml,
    fontSize,
    width,
    closeInterval,
  } = props;

  return (
    <DropdownAlert
      tapToCloseEnabled={error ? false : true}
      panResponderEnabled={error ? false : true}
      closeInterval={closeInterval ? closeInterval : 200000000000000}
      ref={ref}
      imageSrc={imageSrc}
      containerStyle={[
        yellow ? styles.y_container : styles.container,
        { backgroundColor: yellow ? "#FFEE95D9" : bgClr },
      ]}
      titleStyle={[
        yellow ? styles.yellow_T : styles.title,
        {
          marginTop: title_mT ? title_mT : 92,
          color: error ? "#fff" : "#000",
          marginLeft: t_ml ? t_ml : -68,
          fontSize: fontSize ? fontSize : RF(19),
        },
      ]}
      titleNumOfLines={yellow ? 2 : 1}
      imageStyle={[
        yellow ? styles.y_img : styles.img,
        {
          marginTop: img_mT ? img_mT : 97,
          tintColor: error ? "#fff" : tintClr ? tintClr : "#000",
          marginLeft: ml ? ml : 110,
          width: width ? width : RF(25),
        },
      ]}
    ></DropdownAlert>
  );
});

const styles = StyleSheet.create({
  img: {
    transform: [{ scaleX: 0.5 }, { rotate: "360deg" }],
    height: RF(26),
    width: RF(26),
    zIndex: 100,
    resizeMode: "contain",
  },
  y_img: {
    tintColor: "#000",
    transform: [{ scaleX: 0.5 }, { rotate: "360deg" }],
    height: 25,
    width: 25,
    zIndex: 100,
    marginLeft: 110,
  },
  container: {
    height: 175,
    borderBottomEndRadius: RF(300),
    borderBottomStartRadius: RF(300),
    transform: [{ scaleX: 2 }, { rotate: "360deg" }],
    marginTop: -70,
  },
  y_container: {
    height: 175,
    borderBottomEndRadius: RF(300),
    borderBottomStartRadius: RF(300),
    transform: [{ scaleX: 2 }, { rotate: "360deg" }],
    marginTop: -40,
  },
  title: {
    transform: [{ scaleX: 0.5 }, { rotate: "360deg" }],
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "500",
    fontSize: RF(19),
  },
  yellow_T: {
    color: "#000",
    // marginTop: title_mT ? title_mT : 92,
    marginLeft: -60,
    transform: [{ scaleX: 0.5 }, { rotate: "360deg" }],
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "500",
    fontSize: RF(18),
    width: RF(300),
  },
});

export default SuccessHeader;
