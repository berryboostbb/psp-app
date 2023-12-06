import { Alert, NativeModules, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import UserInactivity from "react-native-user-inactivity";
import { navigate } from "@services";
import { setOrderData } from "@redux";
import { useDispatch, useSelector } from "react-redux";

const UserAppInactivity = (props: any) => {
  const dispatch = useDispatch();
  const { PaxPaymentModule } = NativeModules;
  const { timeLayout } = useSelector((state: any) => state.user);
  // console.log("timeForInactivity---", timeForInactivity);
  const { screen } = props;
  const [active, setActive] = useState(true);
  const [timer, setTimer] = useState(null);
  var timeForInactivity =
    screen == "TapProcess" ? 20000 : 100000000000000000000000000;
  // screen == "ClerkId" ||
  // screen == "InvoiceNumber" ||
  // screen == "Merchant_Cart" ||
  // screen == "EnterAmount" ||
  // screen == "SelectAccount" ||
  // screen == "Tap_Merchant_Cart"
  //   ? (timeForInactivity = 10000)
  //   : (timeForInactivity = 300000);
  // screen == "TipDoller" && (timeForInactivity = 10000);
  // screen == "TapProcess" && (timeForInactivity = timeLayout); // 20,000

  const onUserActivityTimeOut = (isActive: any) => {
    if (!isActive) {
      // if (
      //   screen == "ClerkId" ||
      //   screen == "InvoiceNumber" ||ß
      //   screen == "Merchant_Cart" ||
      //   screen == "EnterAmount" ||
      //   screen == "TipDoller" ||
      //   screen == "TapProcess" ||
      //   screen == "SelectAccount" ||
      //   screen == "Tap_Merchant_Cart"
      // ) {
      if (screen == "TapProcess") {
        PaxPaymentModule.reset();
        dispatch(
          setOrderData({
            tip: 0.0,
            clerkId: "",
            invoiceNumber: "",
            merchantPasscode: "",
            tipType: "",
            surcharge: 0,
            orderAmount: 0.0,
            cardType: "",
          })
        );
        navigate("TransactionMenu");
      }

      // } else {
      //   navigate("SaleWelcome");
      // }
    }
    setActive(isActive);
  };

  return (
    <>
      <UserInactivity
        isActive={active}
        timeForInactivity={timeForInactivity}
        onAction={(isActive) => {
          onUserActivityTimeOut(isActive);
        }}
      >
        {props.children}
      </UserInactivity>
    </>
  );
};

export default UserAppInactivity;
