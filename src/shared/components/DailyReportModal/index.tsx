import React, { useCallback, useRef } from "react";
import { Modal, SectionList, StyleSheet, View } from "react-native";
import AppView from "../AppView";
import VerticalSpacer from "../VerticalSpacer";
import KeyValueRow from "../../../screens/Dashboard/Reports/components/KeyValueRow";
import {
  getFormattedDate,
  getFormattedTime,
  getTimezoneStr,
  getTransactionTotalsData,
} from "../../../screens/Dashboard/Reports/helpers/functions";
import moment from "moment";
import useTransactionList from "../../../db/hooks/useTransactionList";
import Card from "../../../screens/Dashboard/Reports/components/Card";
import AppText from "../AppText";
import TransactionsScreenshot from "../../../screens/Dashboard/Reports/DailyReport/TransactionsScreenshot";
import Pax from "react-native-pax-library";
var RNFS = require("react-native-fs");

const timezone = getTimezoneStr();

interface Props {
  visible: boolean;
  onHide(): void;
}

const DailyReportModal = ({ visible, onHide }: Props) => {
  const { getTransactionsByDate } = useTransactionList();
  const ref: any = useRef();

  const _getStartEndDate = () => {
    let startDate = new Date();
    let endDate = new Date();
    startDate = moment()
      .subtract(1, "days")
      .hours(21)
      .minutes(0)
      .seconds(0)
      .toDate();
    endDate = moment().hours(20).minutes(59).seconds(59).toDate();
    return { startDate, endDate };
  };

  const _getLatestTransactionDate = () => {
    const { startDate, endDate } = _getStartEndDate();
    const trs = getTransactionsByDate(startDate, endDate);
    if (trs?.length > 0) {
      return trs?.[trs?.length - 1]?.created_at;
    }
    return undefined;
  };

  const _getInDateTransactions = () => {
    const { startDate, endDate } = _getStartEndDate();
    const transactions = getTransactionsByDate(startDate, endDate);
    return transactions;
  };

  const _getTransactionData = useCallback(() => {
    const transactions = _getInDateTransactions();
    return getTransactionTotalsData(transactions);
  }, []);

  const _printReport = () => {
    ref?.current?.capture()?.then((uri: any) => {
      RNFS.readFile(uri, "base64")
        .then((res: any) => {
          let base64String = `data:image/jpeg;base64,${res}`;
          Pax.printStr("", "", "", Pax.FULL_CUT, "", base64String);
        })
        .catch((ex: any) => {
          console.log("Exception", ex);
        });
    });
    setTimeout(onHide, 3000);
  };

  const _renderItem = useCallback(({ item }) => {
    return (
      <Card style={styles.itemContainer}>
        {Object.keys(item).map((k) => {
          return (
            <View
              style={[
                styles.item,
                k.toString() === "Total Refunds" && styles.marginTop,
              ]}
            >
              <KeyValueRow
                keyStr={
                  k.toString() === "No. of Refunds"
                    ? "No. of Transactions"
                    : k.toString()
                }
                value={item[k].toString()}
              />
            </View>
          );
        })}
      </Card>
    );
  }, []);

  const _renderSectionHeader = useCallback(({ section }) => {
    return (
      <View style={styles.sectionHeaderContainer}>
        <AppText title={section.title} center colorText="#4A5568" size={18} />
      </View>
    );
  }, []);

  const _renderHeader = useCallback(() => {
    return (
      <AppView>
        <KeyValueRow keyStr="Merchant ID:" value="136200499100000" />
        <VerticalSpacer spaceFactor={0.4} />
        <KeyValueRow keyStr="Terminal ID:" value="10015843" />
        <VerticalSpacer spaceFactor={0.4} />
        <KeyValueRow
          keyStr="Start Date:"
          value={getFormattedDate(_getStartEndDate().startDate.toString())}
        />
        <VerticalSpacer spaceFactor={0.4} />
        <KeyValueRow
          keyStr="Start Time:"
          value={`${getFormattedTime(
            _getStartEndDate().startDate.toString()
          )} ${timezone}`}
        />
        <VerticalSpacer spaceFactor={0.4} />
        <KeyValueRow
          keyStr="End Date:"
          value={getFormattedDate(_getStartEndDate().endDate.toString())}
        />
        <VerticalSpacer spaceFactor={0.4} />
        <KeyValueRow
          keyStr="End Time:"
          value={`${getFormattedTime(
            _getStartEndDate().endDate.toString()
          )} ${timezone}`}
        />
        <VerticalSpacer spaceFactor={0.4} />
        <KeyValueRow
          keyStr="Last Transaction:"
          value={
            _getLatestTransactionDate()
              ? `${getFormattedTime(
                  _getLatestTransactionDate()?.toString()
                )} ${timezone}`
              : "N/A"
          }
        />
        <VerticalSpacer />
      </AppView>
    );
  }, []);

  return (
    <Modal
      visible={visible}
      transparent
      onShow={() => setTimeout(_printReport, 3000)}
    >
      <View style={styles.centered}>
        <View style={styles.container}>
          <SectionList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={_renderHeader}
            sections={_getTransactionData() ?? []}
            renderSectionHeader={_renderSectionHeader}
            renderItem={_renderItem}
          />
          <TransactionsScreenshot
            ref={ref}
            startDate={getFormattedDate(
              _getStartEndDate().startDate.toString()
            )}
            endDate={getFormattedDate(_getStartEndDate().endDate.toString())}
            startTime={`${getFormattedTime(
              _getStartEndDate().startDate.toString()
            )} ${timezone}`}
            endTime={`${getFormattedTime(
              _getStartEndDate().endDate.toString()
            )} ${timezone}`}
            lastTransactionDate={
              _getLatestTransactionDate()
                ? `${getFormattedTime(
                    _getLatestTransactionDate()?.toString()
                  )} ${timezone}`
                : "N/A"
            }
            transactionData={_getTransactionData()}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    width: "96%",
    height: "96%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignSelf: "center",
    padding: 12,
    elevation: 6,
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    marginVertical: 8,
  },
  item: {
    marginVertical: 3,
  },
  marginTop: {
    marginTop: 12,
  },
  sectionHeaderContainer: {
    marginTop: 20,
    marginBottom: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DailyReportModal;
