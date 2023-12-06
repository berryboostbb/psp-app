import React, { useCallback, useState } from "react";
import {
  AppHeader,
  AppText,
  AppView,
  VerticalSpacer,
  Wrapper,
} from "@components";
import { languagePicker } from "@utils";
import { FlatList, SectionList, StyleSheet, View } from "react-native";
import { backArrowDark, printer } from "@assets";
import { RF, Typography } from "@theme";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";
import SectionBar from "../components/SectionBar";
import { SectionType } from "../types";
import Card from "../components/Card";
import KeyValueRow from "../components/KeyValueRow";
import ReportRowItem from "../components/ReportRowItem";
import useTransactionList from "../../../../db/hooks/useTransactionList";
import {
  getFormattedDate,
  getTerminalTotalData,
  printTerminalTotalsReport,
} from "../helpers/functions";
import SuccessModal from "../components/SuccessModal";

const dataKeys: any = {
  "Terminal Totals": ["Card Type", "Count", "Currency", "Totals"],
  "Interac Totals": ["Interac Key", "Count", "Currency", "Totals"],
  "Visa Totals": ["Visa Key", "Count", "Currency", "Totals"],
  "MasterCard Totals": ["MasterCard Key", "Count", "Currency", "Totals"],
};
const skippedKeysFromHead = [
  "Currency",
  "Interac Key",
  "Visa Key",
  "MasterCard Key",
];

const TerminalTotals = () => {
  const language = useSelector((state: any) => state.user.languageType);
  const theme: any = useTheme();
  const navigation = useNavigation();
  const [selectedSection, setSelectedSection] = useState<SectionType>("Today");
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const { getFirstTransaction, getLatestTransaction, getTransactionsByDate } =
    useTransactionList();
  const startDate = getFormattedDate(getFirstTransaction()?.created_at);
  const endDate = getFormattedDate(getLatestTransaction()?.created_at);

  const _printReport = () => {
    printTerminalTotalsReport(
      startDate,
      endDate,
      "05:15 AM (temp)",
      _getPreparedTerminalTotalData()
    );
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 4000);
  };

  const _handleUpdateSection = (section: SectionType) => {
    setSelectedSection(section);
  };

  const _getPreparedTerminalTotalData = useCallback(() => {
    return [];
    // return getTerminalTotalData(getTransactionsByDate(selectedSection));
  }, [selectedSection]);

  const _renderHeader = useCallback(() => {
    return (
      <AppView>
        <KeyValueRow keyStr="Merchant ID:" value="136200499100000" />
        <VerticalSpacer spaceFactor={0.4} />
        <KeyValueRow keyStr="Terminal ID:" value="10015843" />
        <VerticalSpacer spaceFactor={0.4} />
        <KeyValueRow keyStr="Start Date:" value={startDate} />
        <VerticalSpacer spaceFactor={0.4} />
        <KeyValueRow keyStr="End Date:" value={endDate} />
        <VerticalSpacer spaceFactor={0.4} />
        {/* <KeyValueRow
          keyStr="LastTransaction:"
          value={getFormattedDate(getLatestTransaction()?.created_at)}
        /> */}
        <VerticalSpacer />
      </AppView>
    );
  }, []);

  const _renderItem = useCallback(({ item }) => {
    const itemTitle = item.title;
    const data = item.terminals;
    return (
      <View>
        <View style={styles.sectionHeaderContainer}>
          <AppText title={item.title} colorText="#4A5568" center size={20} />
        </View>
        <Card style={styles.itemContainer}>
          <View style={styles.reportItemContainer}>
            {dataKeys[itemTitle].map((d: any, index: number) => {
              return (
                <ReportRowItem
                  title={skippedKeysFromHead.includes(d) ? " " : d}
                  alignLeft={index === 0}
                  flex2={index === 0}
                  bold
                />
              );
            })}
          </View>
          {data.map((d: any) => {
            const k = dataKeys[itemTitle];
            return (
              <View style={styles.reportItemContainer}>
                <ReportRowItem title={d[k[0]]} alignLeft bold flex2 />
                <ReportRowItem title={d[k[1]]} />
                <ReportRowItem title={d[k[2]]} />
                <ReportRowItem title={d[k[3]]} />
              </View>
            );
          })}
        </Card>
      </View>
    );
  }, []);

  return (
    <>
      <View style={styles.headerView}>
        <AppHeader
          title={languagePicker(language, "Terminal Totals Report")}
          showLeftIcon
          backAction={() => navigation.goBack()}
          source={backArrowDark}
          size={Typography.FONTS.SIZE.HEADER}
          textColor={theme.colors.grey}
          showRightIcon
          rightIcon={printer}
          rightIconStyle={{ width: 20, height: 20 }}
          onPressRightIcon={_printReport}
        />
      </View>
      <Wrapper>
        <VerticalSpacer spaceFactor={1.5} />
        <SectionBar
          title1="Today"
          title2="Yesterday"
          selectedSection={selectedSection}
          onPressToday={() => _handleUpdateSection("Today")}
          onPressYesterday={() => _handleUpdateSection("Yesterday")}
        />
        <VerticalSpacer />
        <FlatList
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={_renderHeader}
          renderItem={_renderItem}
          data={_getPreparedTerminalTotalData()}
        />
        {showSuccessModal && <SuccessModal />}
      </Wrapper>
    </>
  );
};

const styles = StyleSheet.create({
  headerView: {
    paddingHorizontal: RF(30),
    paddingTop: RF(20),
    backgroundColor: "#FFF",
  },
  listContainer: {
    padding: 16,
  },
  sectionHeaderContainer: {
    marginTop: 20,
    marginBottom: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    marginVertical: 8,
  },
  item: {
    marginVertical: 3,
  },
  reportItemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default TerminalTotals;
