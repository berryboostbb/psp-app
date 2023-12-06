import { ScrollView, Text, View } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import useStyles from "./style";
import {
  Wrapper,
  AppHeader,
  AppText,
  SearchBarInput,
  ReportBox,
} from "@components";
import { backArrow, cross } from "@assets";
import { interac_Totals, grand_Totals } from "@utils";
import { navigate } from "@services";
import { useSelector } from "react-redux";
import { languagePicker, terminal_setting } from "@utils";

const SummaryReport = () => {
  const language = useSelector((state: any) => state.user.languageType);
  const theme: any = useTheme();
  const style = useStyles(theme.colors);
  return (
    <Wrapper isTop isPaddingH>
      <AppHeader
        title={languagePicker(language, "Summary Report")}
        showLeftIcon
        source={cross}
        backAction={() => navigate("Admin_Settings", { type: "" })}
      />

      <View style={style.searchView}>
        <SearchBarInput
          placeholder={languagePicker(language, "Search")}
          placeholderTextColor={theme?.colors?.border}
          pressFilter={() => navigate("SearchFilter")}
          filterImage
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.topView}>
          <ReportBox
            terminalArray={interac_Totals}
            title={languagePicker(language, "Debit Totals")}
            titleTotal={languagePicker(language, "Total")}
            amountTitle={languagePicker(language, "Sub-Totals")}
            totalAmount={"0.00"}
            totalCount={"C"}
            totalDoller={"$"}
            titleCount={languagePicker(language, "Count")}
          />
          <ReportBox
            terminalArray={interac_Totals}
            title={languagePicker(language, "Credit Totals")}
            titleTotal={languagePicker(language, "Total")}
            amountTitle={languagePicker(language, "Sub-Totals")}
            totalAmount={"0.00"}
            totalCount={"C"}
            totalDoller={"$"}
            titleCount={languagePicker(language, "Count")}
          />
          <ReportBox
            terminalArray={grand_Totals}
            title={languagePicker(language, "Grand Total")}
            titleTotal={languagePicker(language, "Grand Total")}
            amountTitle={languagePicker(language, "Sub-Totals")}
            totalAmount={"0.00"}
            totalCount={"C"}
            totalDoller={"$"}
            titleCount={languagePicker(language, "Count")}
          />
        </View>
      </ScrollView>
    </Wrapper>
  );
};

export default SummaryReport;
