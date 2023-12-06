import { Realm } from "@realm/react";

export class Transaction extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  card_type!: string;
  card_number!: string;
  type!: string;
  account_type!: string;
  sale_amount!: number;
  tip_amount!: number;
  surcharge_amount!: number;
  clerk_id!: string;
  user_id!: string;
  pos_id!: string;
  service_code!: string;
  time!: string;
  date!: string;
  entry_mode!: string;
  invoice_no!: string;
  is_auto_invoice!: boolean;
  created_at!: Date;
  transaction_no!: string;
  auth_no!: string;
  reference_id!: string;
  batch_no!: string;
  status!: string;
  aid!: string;
  tid!: string;
  tsi!: string;
  tvr!: string;
  trace_id!: string;
  transactionStatus!: string;
  responseCode!: string;
  terminal_id!: string;
  merchant_id!: string;

  static primaryKey = "_id";

  static schema: Realm.ObjectSchema = {
    name: "Transaction",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      card_type: "string",
      card_number: "string",
      type: "string",
      account_type: "string",
      sale_amount: "float",
      tip_amount: "float",
      surcharge_amount: "float",
      clerk_id: "string",
      user_id: "string",
      pos_id: "string",
      service_code: "string",
      time: "string",
      date: "string",
      entry_mode: "string",
      invoice_no: "string",
      is_auto_invoice: "bool",
      created_at: "date",
      transaction_no: "string",
      auth_no: "string",
      reference_id: "string",
      batch_no: "string",
      status: "string",
      aid: "string",
      tid: "string",
      tsi: "string",
      tvr: "string",
      trace_id: "string",
      transactionStatus: "string",
      responseCode: "string",
      terminal_id: "string",
      merchant_id: "string",
    },
  };
}

export const dummyTransactionObject = {
  card_type: "MasterCard",
  terminal_id: "10015843",
  merchant_id: "136200499100000",
  card_number: "000002343421434",
  type: "DEBIT",
  account_type: "Saving",
  invoice_no: "140",
  sale_amount: 150.41,
  tip_amount: 9,
  surcharge_amount: 0,
  clerk_id: "4095",
  user_id: "XXXX",
  pos_id: "XXXX",
  service_code: "XXXX",
  time: "XXXX",
  date: "XXXX",
  entry_mode: "XXXX",
  transaction_no: "XXXX",
  auth_no: "XXXXXX",
  reference_id: "XXXXX",
  batch_no: "001",
  is_auto_invoice: false,
  status: "Sale",
  created_at: new Date(),
  aid: "0",
  tid: "0",
  tvr: "0",
  tsi: "0",
  responseCode: "1",
  trace_id: "xxx",
  transactionStatus: "Approved",
};
