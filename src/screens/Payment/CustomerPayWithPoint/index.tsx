import React from "react";
import { GST } from "@theme";
import useStyles from "./style";
import { curveImg, plastkCard } from "@assets";
import { useTheme } from "@react-navigation/native";
import { ImageBackground, View } from "react-native";
import { AppText, Wrapper, PrimaryButton } from "@components";

const CustomerPayWithPoint = () => {
  const myTheme: any = useTheme();
  const style = useStyles(myTheme.colors);
  return (
    <Wrapper style={style.main}>
      <ImageBackground source={curveImg} style={{ ...GST.MAIN }}>
        <View style={style.container}>
          <View style={style.textContainer}>
            <View style={{ ...GST.ROW }}>
              <AppText
                title={"Hey,"}
                colorText={myTheme.colors.white}
                size={18}
                regular
              />
              <AppText
                title={"Jakob!"}
                colorText={myTheme.colors.white}
                size={22}
                semiBold
              />
            </View>

            <View style={style.amountView}>
              <AppText
                title={`$${"105" + ".00"}`}
                colorText={myTheme?.colors?.white}
                size={24}
                regular
              />
              <AppText title={"Sale Total"} colorText={"#D4D6D7"} size={12} />
            </View>
          </View>

          <ImageBackground
            source={plastkCard}
            style={{ flex: 1, backgroundColor: "red" }}
            imageStyle={{ flex: 1, backgroundColor: "orange", ...GST.CENTER }}
          ></ImageBackground>

          <View style={[style.wrapButton]}>
            <PrimaryButton
              clr={"red"}
              title={"Decline"}
              // onPress={onPressLeftBtn}
              disableBackgroundColor={true}
              bgColor={myTheme.colors.background}
              buttonStyle={style.btn}
            />
            <PrimaryButton
              title={"Accept"}
              // onPress={onPressRightBtn}
              bgColor={myTheme.colors.primary}
              disableBackgroundColor={false}
              buttonStyle={style.btn}
            />
          </View>
        </View>
      </ImageBackground>
    </Wrapper>
  );
};

export default CustomerPayWithPoint;
