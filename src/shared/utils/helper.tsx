import Toast from "react-native-toast-message";
import { decrypt } from "@utils";
import { useSelector } from "react-redux";
import useCreateTransaction from "../../db/hooks/useCreateTransaction";
import useAutoInvoiceTransactionList from "../../db/hooks/useAutoInvoiceTransactionList";

export const showToast = (text1: string, text2: string, type: boolean) => {
  Toast.show({
    text1,
    text2,
    type: type ? "success" : "error",
    visibilityTime: 4000,
  });
};

export const decryptData = (Data: any, label: any) => {
  let decryptResponse = JSON.parse(decrypt(Data?.__, label));
  return decryptResponse;
};





export const GetCardType = (cardNumber: any) => {
  let cardType = '';

  if (cardNumber.match(/^4[0-9]{12}(?:[0-9]{3})?$/)) {

    cardType = 'visa';

  } else if (cardNumber.match(/^5[1-5][0-9]{14}$/)) {

    cardType = 'mastercard';

  } else if (cardNumber.match(/^3[47][0-9]{13}$/)) {

    cardType = 'amex';

  } else if (cardNumber.match(/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/)) {

    cardType = 'dinersclub';

  } else if (cardNumber.match(/^6(?:011|5[0-9]{2})[0-9]{12}$/)) {

    cardType = 'discover';

  } else if (cardNumber.match(/^(?:2131|1800|35\d{3})\d{11}$/)) {

    cardType = 'jcb';

  } else if (cardNumber.match(/^62[0-9]{14,17}$/)) {

    cardType = 'unionpay';

  } else if (cardType === '') {

    cardType = 'unknown';

  }

  return cardType.toUpperCase();
};

export const makeStringCenter = (str: any, counter: any, orientation: any) => {
  let stl = str?.length;
  let half = parseInt(((counter - stl) / 2) as any);
  let margin = 0;
  let newStr = Array(counter).fill("");
  let count = 0;
  if (orientation === "center") {
    newStr = newStr.map((v, i) => {
      if (i < half) {
        return " ";
      } else if (i > half + stl) {
        return " ";
      } else {
        return str?.length ? str[count++] : "";
      }
    });
  } else if (orientation === "right") {
    const remain = counter - stl - margin;
    newStr = newStr.map((v, i) => {
      if (i < remain) {
        return " ";
      } else {
        return str?.length ? str[count++] : "";
      }
    });
    // newStr = newStr.reverse();
  } else if (orientation === "left") {
    newStr = newStr.map((v, i) => {
      if (i < stl) {
        return str?.length ? str[count++] : "";
      } else {
        return " ";
      }
    });
  }
  return newStr?.join("");
};
