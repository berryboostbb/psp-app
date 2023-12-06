import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import useStyles from "./style";
import {
  AppHeader,
  Wrapper,
  OpenBatchTerminalContentIntro,
  AppText,
} from "@components";
import { backArrow, cross, printer } from "@assets";
import { RF } from "@theme";
import { languagePicker } from "@utils";
import { useSelector } from "react-redux";
import { navigate } from "@services";

const DeclineTransactionReport = () => {
  const language = useSelector((state: any) => state.user.languageType);
  const theme: any = useTheme();
  const style = useStyles(theme.colors);
  return (
    <Wrapper isTop isPaddingH>
      <AppHeader
        title="Decline Transaction Report"
        showLeftIcon
        showRightIcon
        source={cross}
        rightIcon={printer}
        backAction={() => navigate("Admin_Settings", { type: "" })}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[style.boxInfoView, style.topView]}>
          <OpenBatchTerminalContentIntro
            terminalTitle={languagePicker(language, "Merchant ID:")}
            terminalContent="XXXXXXXXXXX"
          />
          <OpenBatchTerminalContentIntro
            terminalTitle={languagePicker(language, "Terminal ID:")}
            terminalContent="XXXXXXXXXXX"
          />

          <OpenBatchTerminalContentIntro
            wrapRowShow
            titleLeft={languagePicker(language, "Clerk Id:")}
            titleLeftContent={"XXXX"}
            titleRight={languagePicker(language, "ID Number:")}
            titleRightContent={"XXXX"}
          />

          <OpenBatchTerminalContentIntro
            wrapRowShow
            titleLeft={languagePicker(language, "Current Date:")}
            titleLeftContent={"DD/MM/YYYY"}
            titleRight={languagePicker(language, "Time:")}
            titleRightContent={"HH/MM/SS"}
          />
          <OpenBatchTerminalContentIntro
            wrapRowShow
            titleLeft={languagePicker(language, "Batch Number:")}
            titleLeftContent={"XXXX"}
            titleRight={languagePicker(language, "Invoice Number") + ":"}
            titleRightContent={"XXXX"}
          />
        </View>
        <View style={style.boxInfoView}>
          <AppText
            title={languagePicker(language, "Sale")}
            center
            size={18}
            colorText={theme.colors.border}
            medium
          />
          <View style={style.mainView}>
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Interac")}
              terminalContent={languagePicker(language, "Entry Method")}
            />
            <OpenBatchTerminalContentIntro
              terminalTitle="XXXXXXXXXXXX1234:"
              terminalContent="C"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Account Type:")}
              terminalContent="CHQ"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Reference Number") + ":"}
              terminalContent="XXXXXXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Trace ID:")}
              terminalContent="XXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Authentication Number:")}
              terminalContent="XXXXXX"
            />
            <View style={style.outerView}>
              <AppText
                title={languagePicker(language, "Amount") + ":"}
                size={17}
                bold
                colorText={theme?.colors?.border}
                textStyle={style.textView}
              />
              <AppText
                title={"$"}
                size={17}
                semiBold
                colorText={theme?.colors?.border}
              />
              <AppText
                title={"0.00"}
                size={17}
                semiBold
                colorText={theme?.colors?.border}
              />
            </View>
            <View style={style.outerView}>
              <AppText
                title={languagePicker(language, "Tip") + ":"}
                size={17}
                bold
                colorText={theme?.colors?.border}
                textStyle={style.textView}
              />
              <AppText
                title={"$"}
                size={17}
                semiBold
                colorText={theme?.colors?.border}
              />
              <AppText
                title={"0.00"}
                size={17}
                semiBold
                colorText={theme?.colors?.border}
              />
            </View>
            <View style={style.outerView}>
              <AppText
                title={languagePicker(language, "Cashback") + ":"}
                size={17}
                bold
                colorText={theme?.colors?.border}
                textStyle={style.textView}
              />
              <AppText
                title={"$"}
                size={17}
                semiBold
                colorText={theme?.colors?.border}
              />
              <AppText
                title={"0.00"}
                size={17}
                semiBold
                colorText={theme?.colors?.border}
              />
            </View>
            <View style={style.outerView}>
              <AppText
                title={languagePicker(language, "Surcharge") + ":"}
                size={17}
                bold
                colorText={theme?.colors?.border}
                textStyle={style.textView}
              />
              <AppText
                title={"$"}
                size={17}
                semiBold
                colorText={theme?.colors?.border}
              />
              <AppText
                title={"0.00"}
                size={17}
                semiBold
                colorText={theme?.colors?.border}
              />
            </View>
            <AppText
              title={
                ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
              }
              colorText={theme.colors.toggleColor}
              center
            />
            <View style={style.outerView}>
              <AppText
                title={languagePicker(language, "Total") + ":"}
                size={17}
                bold
                colorText={theme?.colors?.border}
                textStyle={style.textView}
              />
              <AppText
                title={"$"}
                size={17}
                semiBold
                colorText={theme?.colors?.border}
              />
              <AppText
                title={"0.00"}
                size={17}
                semiBold
                colorText={theme?.colors?.border}
              />
            </View>
            <View style={style.topView} />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Application Label:")}
              terminalContent="Interac"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(
                language,
                "Application Pref. Name:"
              )}
              terminalContent={languagePicker(language, "Visa Debit")}
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "AID:")}
              terminalContent="XXXXXXXXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "TVR:")}
              terminalContent="XXXXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "TSI:")}
              terminalContent="XXXX"
            />
          </View>
        </View>
      </ScrollView>
    </Wrapper>
  );
};

export default DeclineTransactionReport;
