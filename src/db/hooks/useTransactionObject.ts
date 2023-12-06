import { useObject } from "../models";
import { Transaction } from "../models/Transaction";

const useTransactionObect = (id: string) => {
  const singleObject = useObject(
    Transaction,
    new Realm.BSON.ObjectID("64633f5c5e1f9df159f427ad")
  );
  return singleObject;
};

export default useTransactionObect;
