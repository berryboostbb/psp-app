import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import { GST, RF, SCREEN_HEIGHT, SCREEN_WIDTH } from "@theme";
import { AppText, ErrorImageWrapper } from "@components";
import {
  wifi,
  declined,
  curvePoint,
  warnIcon,
  yellow,
  orange,
  declinedWhite,
} from "@assets";
// import ErrorHeader from "./../ErrorHeader/index";
import { navigate } from "@services";
import { useNavigation } from "@react-navigation/native";
import ErrorHeader from "./../../shared/components/ErrorHeader/index";
import { setNetworkLayout, store } from "@redux";
import { useDispatch, useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
interface Props {
  imageName?: any;
  titleError?: any;
  content?: any;
  error?: any;
  errorImage?: any;
}
const Offline = (props: Props) => {
  const { imageName, titleError, content, error, errorImage } = props;
  const theme: any = useTheme();
  const styles = useStyles(theme.colors);
  const navigation: any = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      navigate("TransactionMenu");
    }, 3000);
  }, []);

  return (
    <ErrorImageWrapper
      titleError={"No Internet Connection"}
      content={"Connect to the internet to continue"}
      imageName={wifi}
    />
  );
};

export default Offline;

const useStyles = (colors: any) => StyleSheet.create({});
