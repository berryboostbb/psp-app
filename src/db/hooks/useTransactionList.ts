import { Transaction } from "../models/Transaction";
import { useQuery } from "../models";

const useTransactionList = () => {
  const transactions = useQuery(Transaction);

  const getLatestTransaction = () => {
    const sorted = transactions.sorted("created_at", true);
    const data = sorted.toJSON();
    if (data === undefined || data === null || data?.length === 0) {
      return undefined;
    } else {
      return data?.[0];
    }
  };

  const getFirstTransaction = () => {
    const sorted = transactions.sorted("created_at", false);
    const data = sorted.toJSON();
    if (data === undefined || data === null || data?.length === 0) {
      return undefined;
    } else {
      return data?.[0];
    }
  };

  const getTransactionsByDate = (startDate: Date, endDate: Date) => {
    const data = transactions.filtered(
      "created_at >= $0 && created_at < $1",
      startDate,
      endDate
    );
    return data.toJSON();
  };

  return {
    transactionList: transactions.toJSON(),
    getLatestTransaction,
    getFirstTransaction,
    getTransactionsByDate,
  };
};

export default useTransactionList;
