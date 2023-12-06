import React from "react";
import {
  CustomerPayWithPoint,
  Login,
  ManagerPassword,
  PaymentMethod,
  QRCode,
  SaleWelcome,
  Admin_Settings,
  SummaryReport,
  PrinterConfiguration,
  EditFooterLines,
  ReportsSection,
  BatchClose,
  TransactionDetailReport,
  OpenBatchTerminal
} from "@screens";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Stack = createStackNavigator();
const Drawer2 = createDrawerNavigator();

const MainStack = ({ isLoggedIn }: any) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Drawer"
        component={Login}
        options={{ header: (props) => null }}
      />

      <Stack.Screen
        name="ManagerPassword"
        component={ManagerPassword}
        options={{ header: (props) => null }}
      />

      <Stack.Screen
        name="SaleWelcome"
        component={SaleWelcome}
        options={{ header: (props) => null }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
const styles = StyleSheet.create({
  drawer: {
    borderTopWidth: 1,
    width: "85%",
  },
});
