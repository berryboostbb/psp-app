import React from "react";
import AuthStack from "./stacks/authStack";
import ActivationStack from "./stacks/activationStack";
import { useSelector } from "react-redux";

export default function Routes() {
  const { terminalActivated } = useSelector((state: any) => state.pr);

  return terminalActivated ? <AuthStack /> : <ActivationStack />;
}
