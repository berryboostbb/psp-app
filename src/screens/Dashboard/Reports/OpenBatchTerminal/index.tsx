import React, { useState, useEffect } from "react";
import { GST, RF } from "@theme";
import { backArrow, printer, curvePoint, good, cross } from "@assets";
import { navigate } from "@services";
import { View, ScrollView } from "react-native";
import {
  AppHeader,
  AppText,
  SecondaryButton,
  ReportBox,
  Wrapper,
  ErrorHeader,
  OpenBatchTerminalContentIntro,
} from "@components";
import { useTheme, RouteProp } from "@react-navigation/native";
import useStyles from "./style";
import { interac_Totals, languagePicker, terminal_Totals } from "@utils";
import { useSelector } from "react-redux";

interface Props {
  navigation: any;
  route: RouteProp<{
    params: {
      confirmation?: any;
      type?: any;
    };
  }>;
}

const OpenBatchTerminal = ({ route, navigation }: Props) => {
  const language = useSelector((state: any) => state.user.languageType);
  const theme: any = useTheme();
  const style = useStyles(theme.colors);
  const [confirm, setConfirm] = useState<any>();
  const { type, confirmation } = route?.params;

  useEffect(() => {
    setConfirm(confirmation);
  }, [confirmation]);

  useEffect(() => {
    if (confirm) {
      const timer = setTimeout(() => {
        setConfirm(false);
      }, 3000);
    }
  }, [confirm]);

  const onCloseBatch = () => {
    if (type === "obttr") {
      navigate("BatchClose", { type: "obttr" });
    } else {
      navigate("ReportsSection", { type: "obttr", confirmation: true });
    }
  };

  return (
    <>
      {confirm ? (
        <ErrorHeader
          source={curvePoint}
          tintColor={"#000"}
          colorText={theme?.colors?.black}
          title={languagePicker(language, "Batch Successfully Printed")}
          titleImage={good}
          imageStyle={{ marginTop: -30 }}
        />
      ) : (
        <View style={style.headerView}>
          <AppHeader
            title={languagePicker(language, "Open Batch Terminal Totals")}
            showLeftIcon
            showRightIcon
            source={cross}
            rightIcon={printer}
            backAction={() => navigate("Admin_Settings", { type: "" })}
          />
        </View>
      )}
      <Wrapper>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={style.container}>
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Merchant ID:")}
              terminalContent="XXXXXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Terminal ID:")}
              terminalContent="XXXXXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Batch Number:")}
              terminalContent="2001"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Start Date:")}
              terminalContent="DD/MM/YYYY"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "End Date:")}
              terminalContent="DD/MM/YYYY"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Time:")}
              terminalContent="HH/MM/SS"
            />
            <View style={style.topView}>
              <ReportBox
                terminalArray={interac_Totals}
                title={languagePicker(language, "Interac Totals")}
                titleTotal={languagePicker(language, "Sub Total")}
                amountTitle={languagePicker(language, "Amount")}
                titleCount={languagePicker(language, "Count")}
                totalAmount={"0.00"}
                totalCount={"2325"}
                totalDoller={"$"}
              />

              <ReportBox
                terminalArray={interac_Totals}
                title={languagePicker(language, "Visa Totals")}
                titleTotal={languagePicker(language, "Sub Total")}
                amountTitle={languagePicker(language, "Amount")}
                titleCount={languagePicker(language, "Count")}
                totalAmount={"0.00"}
                totalCount={"2325"}
                totalDoller={"$"}
              />
              <ReportBox
                terminalArray={interac_Totals}
                title={languagePicker(language, "MasterCard Totals")}
                titleTotal={languagePicker(language, "Sub Total")}
                amountTitle={"Amount"}
                totalAmount={"0.00"}
                totalCount={"2325"}
                titleCount={"Count"}
                totalDoller={"$"}
              />

              <ReportBox
                terminalArray={terminal_Totals}
                amountTitle={languagePicker(language, "Amount")}
                titleCount={languagePicker(language, "Count")}
                typeTotal={languagePicker(language, "Card Type")}
                title={languagePicker(language, "Terminal Totals")}
                titleTotal={languagePicker(language, "Total")}
                totalAmount={"0.00"}
                totalCount={"2325"}
                totalDoller={"$"}
              />
              <SecondaryButton
                small
                title={languagePicker(language, "Close Batch")}
                onPress={onCloseBatch}
              />
            </View>
          </View>
        </ScrollView>
      </Wrapper>
    </>
  );
};

export default OpenBatchTerminal;
