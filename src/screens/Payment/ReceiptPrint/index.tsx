import React from "react";
import useStyles from "./style";
import { cuveLogo } from "@assets";
import { navigate } from "@services";
import { TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { ImageViewWrapper, ImageBackgroundWrapper, Wrapper } from "@components";

const ReceiptPrint = () => {
  const myTheme = useTheme();
  const style = useStyles(myTheme.colors);

  return (
    <Wrapper>
      <ImageBackgroundWrapper source={cuveLogo} imageStyle={style.img} />
      <TouchableOpacity onPress={() => navigate("QRCode")}>
        <ImageViewWrapper viewStyle={{ justifyContent: "center" }} />
      </TouchableOpacity>
    </Wrapper>
  );
};
export default ReceiptPrint;
