import { Transaction } from "../models/Transaction";
import { useQuery } from "../models";

const useAutoInvoiceTransactionList = () => {
  const transactions = useQuery(Transaction);
  let autoInvoiceTransactions: any = transactions.filtered(
    "is_auto_invoice == true"
  );

  const getNewInvoiceNumber = () => {
    const sorted = autoInvoiceTransactions.sorted("created_at", true);
    const data = sorted.toJSON();
    if (data === undefined || data === null || data?.length === 0) {
      return "1";
    } else {
      return (parseInt(data[0]?.invoice_no, 10) + 1).toString();
    }
  };

  return {
    autoInvoiceTransactions: autoInvoiceTransactions.toJSON(),
    getNewInvoiceNumber,
  };
};

export default useAutoInvoiceTransactionList;
