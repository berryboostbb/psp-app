import { Wrapper } from "@components";
import React from "react";
import {
  TouchableOpacity,
  FlatList,
  Text,
  View,
  NativeModules,
} from "react-native";
import useStyles from "./styles";
import { useTheme } from "@react-navigation/native";
import useTransactionList from "../../../db/hooks/useTransactionList";
import useTransactionObect from "../../../db/hooks/useTransactionObject";
import useCreateTransaction from "../../../db/hooks/useCreateTransaction";
import useAutoInvoiceTransactionList from "../../../db/hooks/useAutoInvoiceTransactionList";

const ListingData = () => {
  const { PaxPaymentModule } = NativeModules;
  const theme: any = useTheme();
  const styles = useStyles(theme.colors);
  const { transactionList } = useTransactionList();
  const { autoInvoiceTransactions, getNewInvoiceNumber } =
    useAutoInvoiceTransactionList();
  const { createTransaction } = useCreateTransaction();
  console.log(getNewInvoiceNumber());
  const obj = useTransactionObect("64633f5c5e1f9df159f427ad");

  const _handleAddData = () => {
    const isAutoInvoice = true;
    let invoiceNumber: string = "29311";
    if (isAutoInvoice) {
      invoiceNumber = getNewInvoiceNumber();
    }
    const transactionObject = {
      card_type: "Debit",
      card_number: "Auto 3",
      type: "deb",
      account_type: "Default",
      sale_amount: 92.9,
      tip_amount: 21.0,
      surcharge_amount: 3.9,
      clerk_id: "9109",
      user_id: "4",
      pos_id: "2003",
      service_code: "1234",
      time: "04:50 AM",
      date: "12-02-2021",
      entry_mode: "User",
      created_at: new Date(),
      invoice_no: invoiceNumber,
      is_auto_invoice: isAutoInvoice,
    };
    createTransaction(transactionObject);
  };

  const _renderTransactionItem = ({ item }: any) => {
    console.log("adbccc: ", item._id);
    return (
      <View key={item._id.toString()}>
        <Text>Transaction ID: {item._id.toString()}</Text>
        <Text>Card Number: {item.card_number}</Text>
        <Text>Card Type: {item.card_type}</Text>
        <Text>Account Type: {item.account_type}</Text>
        <Text>Sale Amount: {item.sale_amount}</Text>
        <Text>Time: {item.time}</Text>
        <Text>Date: {item.date}</Text>
        <Text>Created At: {item.created_at.toString()}</Text>
        <Text>Invoice Number: {item.invoice_no}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addDataButton} onPress={_handleAddData}>
        <Text style={styles.buttonText}>Add Data</Text>
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <FlatList
          data={transactionList}
          renderItem={_renderTransactionItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </View>
  );
};

export default ListingData;

// Transaction ID: "646337f561fd05ca912b260a"
