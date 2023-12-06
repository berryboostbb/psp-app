import { useRealm } from "../models";
import { Realm } from "@realm/react";

const useCreateTransaction = () => {
  const realm = useRealm();

  const createTransaction = (data: any) => {
    realm.write(() => {
      realm.create("Transaction", {
        _id: new Realm.BSON.ObjectId(),
        ...data,
      });
    });
  };
  return { createTransaction };
};

export default useCreateTransaction;
