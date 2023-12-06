import React from "react";
import styles from "./style";
import { View } from "react-native";
import { navigate } from "@services";
import { GST, Typography } from "@theme";
import { AppText, Wrapper, CurveHeader, LinearButton } from "@components";
import { useSelector } from "react-redux";
import { languagePicker } from "@utils";

const PaymentMethod = ({ navigation }: any) => {
  const language = useSelector((state: any) => state.user.languageType);
  return (
    <Wrapper viewStyle={styles.main}>
      <CurveHeader
        adminVisible
        title={"105.00"}
        total={languagePicker(language, "Sale Total")}
      />
      <AppText
        medium
        center
        defaultTextColor
        textStyle={GST.pt}
        title={languagePicker(language, "Select Payment Method")}
        size={Typography.FONTS.SIZE.XXLARGE}
      />
      <View style={styles.secondaryBtnView}>
        <LinearButton
          title={languagePicker(language, "Reward Points")}
          onPress={() => navigate("QRCode")}
        />
        <LinearButton
          title={languagePicker(language, "Debit/Credit")}
          onPress={() => navigate("TapProcess")}
        />
      </View>
    </Wrapper>
  );
};

export default PaymentMethod;
