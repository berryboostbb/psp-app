import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import useStyles from "./style";
import {
  Wrapper,
  AppHeader,
  OpenBatchTerminalContentIntro,
  AppText,
} from "@components";
import { backArrow, cross, printer } from "@assets";
import { RF } from "@theme";
import { useSelector } from "react-redux";
import { languagePicker } from "@utils";
import { navigate } from "@services";

const EMVParameterReport = () => {
  const language = useSelector((state: any) => state.user.languageType);
  const theme: any = useTheme();
  const style = useStyles(theme.colors);
  return (
    <Wrapper isTop isPaddingH>
      <AppHeader
        title={languagePicker(language, "EMV Parameter Report")}
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
            titleLeft={languagePicker(language, "Date:")}
            titleLeftContent={"DD/MM/YYYY"}
            titleRight={languagePicker(language, "Time:")}
            titleRightContent={"HH/MM/SS"}
          />
        </View>
        <View style={style.boxInfoView}>
          <AppText
            title={languagePicker(language, "Interac")}
            center
            size={18}
            medium
            colorText={theme.colors.border}
          />
          <View style={style.mainView}>
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "AID:")}
              terminalContent="XXXXXXXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Terminal Type:")}
              terminalContent="XX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Terminal Capabilities:")}
              terminalContent="XXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(
                language,
                "Additional Capabilities:"
              )}
              terminalContent="XXXXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "TAC Denial:")}
              terminalContent="XXXXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "TAC Online:")}
              terminalContent="XXXXXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "TAC Default:")}
              terminalContent="XXXXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "App. Version:")}
              terminalContent="XXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Threshold Random:")}
              terminalContent="X"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Target Percent Random:")}
              terminalContent="XX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Maximum Target Random:")}
              terminalContent="XX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Default DDOL:")}
              terminalContent="XXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Default TDOL:")}
              terminalContent="XXXXXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Allow Fallback:")}
              terminalContent="X"
            />
            <AppText
              title={languagePicker(language, "Contactless")}
              colorText={theme.colors.border}
              size={18}
              bold
              center
              textStyle={style.textView}
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "TTQ:")}
              terminalContent="XXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "CTLS Floor Limit:")}
              terminalContent="XXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(
                language,
                "CTLS Transaction Limit:"
              )}
              terminalContent="XXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "CTLS CVM Limit:")}
              terminalContent="XXXXX"
            />
          </View>
        </View>
        <View style={style.boxInfoView}>
          <AppText
            title={languagePicker(language, "Visa")}
            center
            size={18}
            medium
            colorText={theme.colors.border}
          />
          <View style={style.mainView}>
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "AID:")}
              terminalContent="XXXXXXXXXXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Terminal Type:")}
              terminalContent="XX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Terminal Capabilities:")}
              terminalContent="XXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(
                language,
                "Additional Capabilities:"
              )}
              terminalContent="XXXXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "TAC Denial:")}
              terminalContent="XXXXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "TAC Online:")}
              terminalContent="XXXXXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "TAC Default:")}
              terminalContent="XXXXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "App. Version:")}
              terminalContent="XXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Threshold Random:")}
              terminalContent="X"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Target Percent Random:")}
              terminalContent="XX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Maximum Target Random:")}
              terminalContent="XX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Default DDOL:")}
              terminalContent="XXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Default TDOL:")}
              terminalContent="XXXXXXXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Allow Fallback:")}
              terminalContent="X"
            />
            <AppText
              title={languagePicker(language, "Contactless")}
              colorText={theme.colors.border}
              size={18}
              bold
              center
              textStyle={style.textView}
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "TTQ:")}
              terminalContent="XXXXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "CTLS Floor Limit:")}
              terminalContent="XXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(
                language,
                "CTLS Transaction Limit:"
              )}
              terminalContent="XXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "CTLS CVM Limit:")}
              terminalContent="XXXXX"
            />
          </View>
        </View>
        <View style={style.boxInfoView}>
          <AppText
            title={languagePicker(language, "MasterCard")}
            center
            size={18}
            medium
            colorText={theme.colors.border}
          />
          <View style={style.mainView}>
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "AID:")}
              terminalContent="XXXXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Terminal Type:")}
              terminalContent="XX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Terminal Capabilities:")}
              terminalContent="XXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(
                language,
                "Additional Capabilities:"
              )}
              terminalContent="XXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "TAC Denial:")}
              terminalContent="XXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "TAC Online:")}
              terminalContent="XXXXXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "TAC Default:")}
              terminalContent="XXXXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "App. Version:")}
              terminalContent="XXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Threshold Random:")}
              terminalContent="X"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Target Percent Random:")}
              terminalContent="XX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Maximum Target Random:")}
              terminalContent="XX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Default DDOL:")}
              terminalContent="XXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Default TDOL:")}
              terminalContent="XXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "Allow Fallback:")}
              terminalContent="X"
            />
            <AppText
              title={languagePicker(language, "Contactless")}
              colorText={theme.colors.border}
              size={18}
              bold
              center
              textStyle={style.textView}
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "TTQ:")}
              terminalContent="XXXXXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "CTLS Floor Limit:")}
              terminalContent="XXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(
                language,
                "CTLS Transaction Limit:"
              )}
              terminalContent="XXXXX"
            />
            <OpenBatchTerminalContentIntro
              terminalTitle={languagePicker(language, "CTLS CVM Limit:")}
              terminalContent="XXXXX"
            />
          </View>
        </View>
      </ScrollView>
    </Wrapper>
  );
};

export default EMVParameterReport;
