import React, { useState, useEffect } from "react";
import { backArrowDark, cross, curvePoint, good } from "@assets";
import { navigate } from "@services";
import { View, ScrollView } from "react-native";
import {
  AppHeader,
  Pressable_Box,
  Wrapper,
  ErrorHeader,
  VerticalSpacer,
} from "@components";
import { RouteProp, useTheme } from "@react-navigation/native";
import useStyles from "./style";
import { useSelector } from "react-redux";
import { languagePicker } from "@utils";
import { Typography } from "@theme";

interface Props {
  navigation: any;
  route: RouteProp<{
    params: {
      type?: any;
      confirmation?: any;
    };
  }>;
}

const ReportsSection = ({ route, navigation }: Props) => {
  const language = useSelector((state: any) => state.user.languageType);
  const { type, confirmation } = route?.params;
  const [confirm, setConfirm] = useState<any>();
  const [confirmCloseYes, setConfirmCloseYes] = useState<any>();
  const theme: any = useTheme();
  const style = useStyles(theme.colors);

  const onClick = (type: any) => {
    if (type === "TipTotals") {
      navigate("TipTotals");
    } else if (type === "trxDetails") {
      navigate("TransactionDetailReport");
    } else if (type === "btachClose") {
      navigate("BatchClose", { type: "batchClose" });
    } else if (type === "Clerk/Server") {
      navigate("ClerkServerPrintReport");
    } else if (type === "configuration") {
      navigate("TerminalConfigurationReport");
    } else if (type === "declineTrx") {
      navigate("DeclineTransactionReport");
    } else if (type === "DailyCloseReport") {
      navigate("DailyReport", { reportType: "Close" });
    } else if (type === "DailySalesReport") {
      navigate("DailyReport", { reportType: "Sales" });
    }
    // else if (type === "TerminalTotals") {
    //   navigate("TerminalTotals");
    // }
    // else if (type === "EmvParametersReport") {
    //   navigate("EmvParametersReport");
    // }
  };

  useEffect(() => {
    setConfirm(confirmation);
    setConfirmCloseYes(type);
  }, [confirmation, type]);

  useEffect(() => {
    if (confirm || confirmCloseYes) {
      const timer = setTimeout(() => {
        setConfirm(false);
        setConfirmCloseYes(false);
      }, 3000);
    }
  }, [confirm, confirmCloseYes]);

  return (
    <>
      {confirm || confirmCloseYes ? (
        <ErrorHeader
          source={curvePoint}
          tintColor={"#000"}
          colorText={theme?.colors?.black}
          title={languagePicker(language, "Batch Successfully Closed")}
          titleImage={good}
          imageStyle={{ marginTop: -20 }}
        />
      ) : (
        <View style={style.headerView}>
          <AppHeader
            title={languagePicker(language, "Reports")}
            showLeftIcon
            backAction={() => navigate("Dashboard")}
            source={backArrowDark}
            size={Typography.FONTS.SIZE.HEADER}
            textColor={theme.colors.grey}
          />
        </View>
      )}
      <Wrapper viewStyle={{}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <VerticalSpacer spaceFactor={2.5} />
          <Pressable_Box
            title={languagePicker(language, "Daily Close Report")}
            onPress={() => onClick("DailyCloseReport")}
            containerStyle={style.tileStyle}
          />
          <Pressable_Box
            title={languagePicker(language, "Daily Sales Report")}
            onPress={() => onClick("DailySalesReport")}
            containerStyle={style.tileStyle}
          />
          {/* <Pressable_Box
            title={languagePicker(language, "Terminal Totals")}
            onPress={() => onClick("TerminalTotals")}
            containerStyle={style.tileStyle}
          /> */}
          <Pressable_Box
            title={languagePicker(language, "Tip Totals")}
            onPress={() => onClick("TipTotals")}
            containerStyle={style.tileStyle}
          />
          <Pressable_Box
            title={languagePicker(language, "Transaction Details")}
            onPress={() => onClick("trxDetails")}
            containerStyle={style.tileStyle}
          />
          <Pressable_Box
            title={languagePicker(language, "Clerk/Server")}
            onPress={() => onClick("Clerk/Server")}
            containerStyle={style.tileStyle}
          />
          <Pressable_Box
            title={languagePicker(language, "Configuration")}
            onPress={() => onClick("configuration")}
            containerStyle={style.tileStyle}
          />
          {/* <Pressable_Box
            title={languagePicker(language, "EMV Parameters")}
            onPress={() => onClick("EmvParametersReport")}
            containerStyle={style.tileStyle}
          />
          <Pressable_Box
            disable={true}
            title={languagePicker(language, "Open Pre-Auths-Future")}
            containerStyle={style.tileStyle}
            // onPress={() => onClick("OPAF")}
          /> */}
          <VerticalSpacer spaceFactor={4} />
        </ScrollView>
      </Wrapper>
    </>
  );
};

export default ReportsSection;
