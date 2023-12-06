import { createRealmContext } from "@realm/react";
import { Transaction } from "./Transaction";

export const { RealmProvider, useQuery, useRealm, useObject } =
  createRealmContext({
    schema: [Transaction],
    schemaVersion: 15,
  });
