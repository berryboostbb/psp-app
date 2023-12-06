import { useDispatch, useSelector } from "react-redux";
import useCreateTransaction from "../../db/hooks/useCreateTransaction";
import useAutoInvoiceTransactionList from "../../db/hooks/useAutoInvoiceTransactionList";
import { makeStringCenter } from "./helper";
import { setManualCardEntry, setOrderData, store, toggleLoader } from "@redux";
var currencyFormatter = require("currency-formatter");
import Pax from "react-native-pax-library";
import { encode } from "base-64";

const printCancelReceipt = () => {
  const { tms_settings } = useSelector((state: any) => state.tms);
  const printerConfiguration = tms_settings?.printer;
  const orderData = useSelector((state: any) => state.common.orderData);
  const invoiceConfig = tms_settings?.transaction_settings?.invoice_number;
  const isRefund = useSelector((state: any) => state.common.isRefund);
  const surchargeConfig = tms_settings?.transaction_settings?.surcharge;
  const tipConfig = tms_settings?.transaction_settings?.tip_configuration;
  const { loggedInUser } = useSelector((state: any) => state.tms);
  const dispatch = useDispatch();
  const { createTransaction } = useCreateTransaction();
  let { autoInvoiceTransactions, getNewInvoiceNumber } =
    useAutoInvoiceTransactionList();

  const padFunction = (number: any) => {
    let string = String(number);
    let sliced = string.slice(-4);
    let mask = String(sliced).padStart(string.length, "*");
    return mask;
  };

  const cancelReceipt = () => {
    var todayDate = new Date();
    let date = todayDate.toLocaleDateString("en-US");
    let surcharge = 0;

    if (
      surchargeConfig?.debit_surcharge?.value ||
      surchargeConfig?.credit_surcharge?.value
    ) {
      if (
        orderData.orderAmount > surchargeConfig?.debit_surcharge?.limit &&
        orderData.cardType === "debit"
      )
        surcharge = 0;
      else if (
        orderData?.cardType === "debit" &&
        surchargeConfig?.debit_surcharge?.value
      ) {
        surcharge = surchargeConfig?.debit_surcharge?.fee;
      } else if (surchargeConfig?.credit_surcharge?.value)
        surcharge = surchargeConfig?.credit_surcharge?.fee;
      else surcharge = 0;
    } else {
      surcharge = 0;
    }

    let invoiceNumber = "";
    if (invoiceConfig?.auto_increment?.value) {
      invoiceNumber = getNewInvoiceNumber();
    } else {
      invoiceNumber = orderData.invoiceNumber;
    }

    let todayTime = new Date();
    let time =
      todayTime.getHours() +
      ":" +
      todayTime.getMinutes() +
      ":" +
      todayTime.getSeconds();

    let transactionObject = {};
    transactionObject = {
      terminal_id: "10015843",
      merchant_id: "136200499100000",
      invoice_no: invoiceNumber ?? "",
      sale_amount: parseFloat(orderData?.orderAmount) ?? "",
      tip_amount: isRefund ? 0 : parseFloat(orderData.tip) ?? "",
      surcharge_amount: isRefund
        ? 0
        : surchargeConfig?.debit_surcharge?.value ||
          surchargeConfig?.credit_surcharge?.value
          ? orderData?.cardType === "debit" &&
            surchargeConfig?.debit_surcharge?.value
            ? parseFloat(surcharge)
            : orderData?.cardType === "credit" &&
              surchargeConfig?.credit_surcharge?.value
              ? (parseFloat(orderData.orderAmount) / 100) * parseFloat(surcharge)
              : 0
          : 0,
      clerk_id: orderData?.clerkId ?? "",
      user_id: loggedInUser?._id ?? "XXXX",
      pos_id: loggedInUser?._id ?? "XXXX",
      service_code: "" ?? "XXXX",
      time: time ?? "XXXX",
      date: date ?? "XXXX",
      transaction_no: invoiceNumber ?? "XXXX",
      auth_no: "XXXXXX",
      reference_id: "XXXXX",
      batch_no: "001",
      is_auto_invoice: invoiceConfig?.auto_increment?.value,
      status: isRefund ? "Refunded" : "Sale",
      created_at: new Date(),
      aid: "xxxx",
      tid: "xxxx",
      tvr: "xxxx",
      tsi: "xxxx",
      responseCode: "xxxx",
      trace_id: "xxxx",
      transactionStatus: "Cancel",
    };
    console.log(transactionObject, "transactionObject");

    transactionObject.card_type = orderData?.cType ?? "";
    transactionObject.card_number = orderData?.cardNumber ?? "";
    transactionObject.type =
      orderData.cardType === "debit" ? "DEBIT" : "CREDIT";
    transactionObject.account_type = orderData?.accountType
      ? orderData.accountType
      : "";
    transactionObject.entry_mode = orderData?.entry_mode ?? "XXXX";

    console.log(
      transactionObject,
      "transactionObjecttransactionObjecttransactionObjecttransactionObject"
    );

    let res = createTransaction(transactionObject);

    // console.log("resceipt.....", receiptDetail);

    // }

    cancelReceiptGlobal(transactionObject);

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
  };

  const cancelReceiptGlobal = (transactionObject) => {
    let receipt = "";
    if (!orderData?.cardNumber?.length > 0) {
      Object.keys(printerConfiguration?.receipt_header_lines).map((key) => {
        if (
          key !== "value" &&
          printerConfiguration?.receipt_header_lines[key] &&
          key !== "line_1"
        ) {
          receipt +=
            makeStringCenter(
              `${printerConfiguration?.receipt_header_lines[key]}`,
              31,
              "center"
            ) + "\n";
        }
      });
    }
    receipt +=
      makeStringCenter("                              ", 31, "center") + "\n";

    receipt +=
      makeStringCenter("Clerk ID:", 13, "left") +
      makeStringCenter(
        transactionObject?.clerk_id?.toString() ?? "",
        19,
        "right"
      ) +
      "\n";
    // const orderTime = moment(receiptDetail?.sdate?.d).format("dd/mm/yy");
    // console.log(orderTime, "orderTimeorderTime");

    receipt +=
      makeStringCenter(`Date:${transactionObject?.date}`, 16, "left") +
      makeStringCenter(`Time:${transactionObject?.time}`, 16, "right") +
      "\n";

    receipt +=
      makeStringCenter("Invoice #", 16, "left") +
      makeStringCenter(
        transactionObject?.invoice_no?.toUpperCase()
          ? transactionObject?.invoice_no?.toUpperCase()
          : "",
        16,
        "right"
      ) +
      "\n";

    if (orderData?.cardNumber?.length > 0) {
      receipt +=
        makeStringCenter(transactionObject?.card_type, 16, "left") +
        makeStringCenter(
          padFunction(transactionObject?.card_number.substring(8)),
          16,
          "right"
        ) +
        "\n";

      receipt +=
        makeStringCenter(
          "Entry Method",
          // padFunction(receiptDetail?.split?.card_number),
          19,
          "left"
        ) +
        makeStringCenter(
          transactionObject?.entry_mode == "S"
            ? "SWIPE"
            : transactionObject?.entry_mode == "T"
              ? "TAP"
              : "CHIP",
          13,
          "right"
        ) +
        "\n";
      if (transactionObject?.type === "DEBIT") {
        receipt +=
          makeStringCenter("Account Type:", 16, "left") +
          makeStringCenter(
            transactionObject?.entry_mode == "T"
              ? "DEFAULT"
              : transactionObject?.account_type,
            16,
            "right"
          ) +
          "\n";
      }
    }

    receipt +=
      makeStringCenter("Amount:", 19, "left") +
      makeStringCenter(
        currencyFormatter.format(
          transactionObject?.sale_amount ? transactionObject?.sale_amount : "",
          {
            code: "CAD",
          }
        ),
        13,
        "right"
      ) +
      "\n";

    if (transactionObject?.status !== "Refunded") {
      if (tipConfig?.tip_screen?.value) {
        receipt +=
          makeStringCenter("TIP:", 19, "left") +
          makeStringCenter(
            currencyFormatter.format(
              transactionObject?.tip_amount
                ? transactionObject?.tip_amount
                : "",

              {
                code: "CAD",
              }
            ),

            13,

            "right"
          ) +
          "\n";
      }
    }
    if (transactionObject?.status !== "Refunded") {
      if (
        surchargeConfig?.debit_surcharge?.value ||
        surchargeConfig?.credit_surcharge?.value
      ) {
        receipt +=
          makeStringCenter("Surcharge:", 19, "left") +
          makeStringCenter(
            currencyFormatter.format(
              transactionObject?.surcharge_amount
                ? transactionObject?.surcharge_amount
                : "",

              {
                code: "CAD",
              }
            ),

            13,

            "right"
          ) +
          "\n";
      }
    }

    receipt +=
      makeStringCenter("_________________________________", 31, "center") +
      "\n";
    receipt +=
      makeStringCenter("Total:", 16, "left") +
      makeStringCenter(
        currencyFormatter.format(
          parseFloat(transactionObject?.surcharge_amount) +
          parseFloat(transactionObject?.tip_amount) +
          parseFloat(transactionObject?.sale_amount),
          {
            code: "CAD",
          }
        ),
        16,
        "right"
      ) +
      "\n";
    receipt +=
      makeStringCenter("Merchant Copy".toUpperCase(), 31, "center") + "\n";
    receipt +=
      makeStringCenter("--Cancelled--".toUpperCase(), 31, "center") + "\n";

    // if (printerConfiguration?.customer_receipt?.value) {
    Pax.printStr(
      "",
      "",
      receipt,
      Pax.FULL_CUT,
      "",
      printerConfiguration?.receipt_header_lines?.line_1
    );
  };

  const customerReceipt = (receiptDetail) => {
    let receipt = "";
    console.log('rmgoptrkgjotrikgoitrj');


    Object.keys(printerConfiguration?.receipt_header_lines).map((key) => {
      if (
        key !== "value" &&
        printerConfiguration?.receipt_header_lines[key] &&
        key !== "line_1"
      ) {
        receipt +=
          makeStringCenter(
            `${printerConfiguration?.receipt_header_lines[key]}`,
            31,
            "center"
          ) + "\n";
      }
    });
    receipt +=
      makeStringCenter("                              ", 31, "center") + "\n";

    receipt +=
      makeStringCenter("Clerk ID:", 13, "left") +
      makeStringCenter(receiptDetail?.clerk_id?.toString() ?? "", 19, "right") +
      "\n";
    receipt +=
      makeStringCenter(`Date:${receiptDetail?.date}`, 16, "left") +
      makeStringCenter(`Time:${receiptDetail?.time}`, 16, "right") +
      "\n";

    receipt +=
      makeStringCenter("Invoice #", 16, "left") +
      makeStringCenter(
        receiptDetail?.invoice_no?.toUpperCase()
          ? receiptDetail?.invoice_no?.toUpperCase()
          : "",
        16,
        "right"
      ) +
      "\n";
    console.log("resceipt.....", "receiptDetail");


    receipt +=
      makeStringCenter(
        receiptDetail?.status == "Refunded" ? "Refund" : "Sale",
        31,
        "center"
      ) + "\n\n";

    receipt +=
      makeStringCenter(
        receiptDetail?.entry_mode == "M" ? "CREDIT" : receiptDetail?.card_type,
        16,
        "left"
      ) +
      makeStringCenter(
        padFunction(receiptDetail?.card_number.substring(8)),
        16,
        "right"
      ) +
      "\n";

    receipt +=
      makeStringCenter("Entry Method", 19, "left") +
      makeStringCenter(
        receiptDetail?.entry_mode == "S"
          ? "SWIPE"
          : receiptDetail?.entry_mode == "T"
            ? "TAP"
            : receiptDetail?.entry_mode == "M"
              ? "MANUAL"
              : "CHIP",
        13,
        "right"
      ) +
      "\n";

    if (receiptDetail?.type === "DEBIT") {
      receipt +=
        makeStringCenter("Account Type:", 16, "left") +
        makeStringCenter(
          receiptDetail?.entry_mode == "T"
            ? "DEFAULT"
            : receiptDetail?.account_type,
          16,
          "right"
        ) +
        "\n";
    }
    receipt +=
      makeStringCenter("Ref.#", 16, "left") +
      makeStringCenter(
        receiptDetail?.reference_id ? receiptDetail?.reference_id : "",
        16,
        "right"
      ) +
      "\n";
    if (receiptDetail?.auth_no != "0")
      receipt +=
        makeStringCenter("Auth.#:", 16, "left") +
        makeStringCenter(
          receiptDetail?.auth_no ? String(receiptDetail?.auth_no) : "",
          16,
          "right"
        ) +
        "\n";

    receipt +=
      makeStringCenter("Amount:", 19, "left") +
      makeStringCenter(
        currencyFormatter.format(
          receiptDetail?.sale_amount ? receiptDetail?.sale_amount : "",
          {
            code: "CAD",
          }
        ),
        13,
        "right"
      ) +
      "\n";

    if (receiptDetail?.status !== "Refunded") {
      if (tipConfig?.tip_screen?.value) {
        receipt +=
          makeStringCenter("TIP:", 19, "left") +
          makeStringCenter(
            currencyFormatter.format(
              receiptDetail?.tip_amount ? receiptDetail?.tip_amount : "",

              {
                code: "CAD",
              }
            ),

            13,

            "right"
          ) +
          "\n";
      }
    }
    if (
      receiptDetail?.status !== "Refunded" &&
      parseFloat(receiptDetail?.surcharge_amount) > 0
    ) {
      if (
        surchargeConfig?.debit_surcharge?.value ||
        surchargeConfig?.credit_surcharge?.value
      ) {
        receipt +=
          makeStringCenter("Surcharge:", 19, "left") +
          makeStringCenter(
            currencyFormatter.format(
              receiptDetail?.surcharge_amount
                ? receiptDetail?.surcharge_amount
                : "",
              {
                code: "CAD",
              }
            ),
            13,
            "right"
          ) +
          "\n";
      }
    }
    receipt +=
      makeStringCenter("_________________________________", 31, "center") +
      "\n";
    receipt +=
      makeStringCenter("Total:", 16, "left") +
      makeStringCenter(
        currencyFormatter.format(
          parseFloat(receiptDetail?.surcharge_amount) +
          parseFloat(receiptDetail?.tip_amount) +
          parseFloat(receiptDetail?.sale_amount),
          {
            code: "CAD",
          }
        ),
        16,
        "right"
      ) +
      "\n";

    receipt +=
      makeStringCenter("Application Label:", 19, "left") +
      makeStringCenter(
        receiptDetail?.entry_mode == "M" ? "CREDIT" : receiptDetail?.card_type,
        13,
        "right"
      ) +
      "\n";

    receipt +=
      makeStringCenter("Application Pref.Name:", 22, "left") +
      makeStringCenter(receiptDetail?.type, 10, "right") +
      "\n";
    if (receiptDetail?.aid != "0")
      receipt +=
        makeStringCenter("AID:", 16, "left") +
        makeStringCenter(receiptDetail?.aid, 16, "right") +
        "\n";

    if (receiptDetail?.tvr != "0")
      receipt +=
        makeStringCenter("TVR:", 16, "left") +
        makeStringCenter(receiptDetail?.tvr, 16, "right") +
        "\n";

    if (receiptDetail?.tsi != "0")
      receipt +=
        makeStringCenter("TSI:", 16, "left") +
        makeStringCenter(receiptDetail?.tsi, 16, "right") +
        "\n";
    if (
      receiptDetail?.entry_mode !== "T" &&
      receiptDetail?.entry_mode !== "S" &&
      receiptDetail?.entry_mode !== "M"
    ) {
      receipt += makeStringCenter("PIN VERIFIED", 31, "center") + "\n";
    }
    receipt +=
      makeStringCenter(
        "00_" +
        receiptDetail?.transactionStatus +
        "_" +
        receiptDetail.responseCode,
        31,
        "center"
      ) + "\n";

    receipt +=
      makeStringCenter("Customer Copy".toUpperCase(), 31, "center") + "\n";

    if (printerConfiguration?.receipt_footer_lines?.value) {
      Object.keys(printerConfiguration?.receipt_footer_lines).map((key) => {
        if (
          key !== "value" &&
          printerConfiguration?.receipt_footer_lines[key]
        ) {
          receipt +=
            makeStringCenter(
              `${printerConfiguration?.receipt_footer_lines[key]}`,
              31,
              "center"
            ) + "\n";
        }
      });
    }
    let url = "";
    console.log("resceipt.....", "receiptDetail");
    console.log("resceipt.....", "receiptDetail");
    
    if (!printerConfiguration?.customer_receipt?.value) {
      Pax.printStr(
        "",
        url,
        receipt,
        Pax.FULL_CUT,
        "",
        printerConfiguration?.receipt_header_lines?.line_1
      );
      
    }

  }

  const declinedReceipt = async (finalTransaction,manualCardEntry,signature) => {
    let receipt = '';

    if (!printerConfiguration?.pre_print?.value) {
        Object.keys(printerConfiguration?.receipt_header_lines).map(key => {
            if (key !== 'value' && printerConfiguration?.receipt_header_lines[key] && key !== 'line_1') {
                receipt += makeStringCenter(`${printerConfiguration?.receipt_header_lines[key]}`, 31, 'center') + '\n';
            }
        });
    }
    receipt += makeStringCenter('                              ', 31, 'center') + '\n';
    receipt += makeStringCenter('Merchant ID:', 13, 'left') + makeStringCenter(storeId ? storeId : '', 19, 'right') + '\n';

    receipt += makeStringCenter('Terminal ID:', 13, 'left') + makeStringCenter('10015843'.toUpperCase(), 19, 'right') + '\n';

    receipt += makeStringCenter('Clerk ID:', 13, 'left') + makeStringCenter(finalTransaction?.clerk_id ?? '', 19, 'right') + '\n';
    // }

    receipt += makeStringCenter(`Date:${finalTransaction?.date}`, 16, 'left') + makeStringCenter(`Time:${finalTransaction?.time}`, 16, 'right') + '\n';

    receipt += makeStringCenter(`Batch# ${finalTransaction?.batch_no}`, 16, 'left') + makeStringCenter(`Transaction# ${finalTransaction.transaction_no}`, 16, 'right') + '\n';

    receipt += makeStringCenter('Invoice#', 16, 'left') + makeStringCenter(finalTransaction?.invoice_no?.toUpperCase() ? finalTransaction?.invoice_no?.toUpperCase() : '', 16, 'right') + '\n';
    // }

    receipt += makeStringCenter(finalTransaction?.status === 'Refunded' ? 'Refund' : 'Sale', 31, 'center') + '\n\n';

    receipt +=
        makeStringCenter(manualCardEntry ? 'CREDIT' : finalTransaction?.card_type, 16, 'left') + makeStringCenter(padFunction(finalTransaction?.card_number.substring(8)), 16, 'right') + '\n';

    receipt +=
        makeStringCenter('Entry Method', 19, 'left') +
        makeStringCenter(manualCardEntry ? 'MANUAL' : orderData.entry_mode == 'S' ? 'SWIPE' : orderData.entry_mode == 'T' ? 'TAP' : 'CHIP', 13, 'right') +
        '\n';

    if (finalTransaction?.type === 'DEBIT') {
        receipt += makeStringCenter('Account Type:', 16, 'left') + makeStringCenter(orderData.entry_mode == 'T' ? 'DEFAULT' : finalTransaction?.account_type, 16, 'right') + '\n';
    }

    receipt += makeStringCenter('Ref.#', 16, 'left') + makeStringCenter(finalTransaction?.reference_id ? finalTransaction?.reference_id : '', 16, 'right') + '\n';

    receipt += makeStringCenter('Trace ID:', 16, 'left') + makeStringCenter(String(finalTransaction?.trace_id), 16, 'right') + '\n';
    if (!manualCardEntry && finalTransaction?.aid != '0') {
        receipt += makeStringCenter('Auth.#:', 16, 'left') + makeStringCenter(finalTransaction?.auth_no, 16, 'right') + '\n';
    }

    receipt +=
        makeStringCenter('Amount:', 19, 'left') +
        makeStringCenter(
            currencyFormatter.format(finalTransaction?.sale_amount ? finalTransaction?.sale_amount : '', {
                code: 'CAD',
            }),
            13,
            'right'
        ) +
        '\n';

    if (tipConfig?.tip_screen?.value && finalTransaction.status !== 'Refunded') {
        receipt +=
            makeStringCenter('TIP:', 19, 'left') +
            makeStringCenter(
                currencyFormatter.format(finalTransaction?.tip_amount ? finalTransaction?.tip_amount : '', {
                    code: 'CAD',
                }),
                13,
                'right'
            ) +
            '\n';
    }

    if (surchargeConfig?.debit_surcharge?.value || surchargeConfig?.credit_surcharge?.value) {
        if ((surchargeConfig?.debit_surcharge?.value && finalTransaction?.type === 'DEBIT') || (surchargeConfig?.credit_surcharge?.value && finalTransaction?.type === 'CREDIT')) {
            if (finalTransaction?.status != 'Refunded')
                receipt +=
                    makeStringCenter('Surcharge:', 19, 'left') +
                    makeStringCenter(
                        currencyFormatter.format(finalTransaction?.surcharge_amount ? finalTransaction?.surcharge_amount : '', {
                            code: 'CAD',
                        }),
                        13,
                        'right'
                    ) +
                    '\n';
        }
    }

    receipt += makeStringCenter('_________________________________', 31, 'center') + '\n';
    if (finalTransaction?.status != 'Refunded') {
        receipt +=
            makeStringCenter('Total:', 16, 'left') +
            makeStringCenter(
                currencyFormatter.format(parseFloat(finalTransaction?.sale_amount) + parseFloat(finalTransaction?.tip_amount) + parseFloat(finalTransaction?.surcharge_amount), {
                    code: 'CAD',
                }),
                16,
                'right'
            ) +
            '\n';
    } else {
        receipt +=
            makeStringCenter('Total:', 16, 'left') +
            makeStringCenter(
                currencyFormatter.format(parseFloat(finalTransaction?.sale_amount), {
                    code: 'CAD',
                }),
                16,
                'right'
            ) +
            '\n';
    }
    if (manualCardEntry && finalTransaction?.transactionStatus == 'Approved') {
        receipt += '\n\n' + makeStringCenter('I AGREE TO PAY ABOVE TOTAL', 31, 'center') + '\n';
        receipt += makeStringCenter('AMOUNT ACCORDING TO CARD ISSUER', 31, 'center') + '\n';
        receipt += makeStringCenter('AGREEMENT (MERCHANT AGREEMENT', 31, 'center') + '\n';
        receipt += makeStringCenter('IF CREDIT VOUCHER)', 31, 'center') + '\n';
    } else {
        receipt += makeStringCenter('Application Label:', 19, 'left') + makeStringCenter(manualCardEntry ? 'CREDIT' : finalTransaction?.card_type, 13, 'right') + '\n';

        receipt += makeStringCenter('Application Pref.Name:', 22, 'left') + makeStringCenter(finalTransaction?.type, 10, 'right') + '\n';
        if (finalTransaction?.aid != '0') receipt += makeStringCenter('AID:', 16, 'left') + makeStringCenter(finalTransaction?.aid, 16, 'right') + '\n';
        if (finalTransaction?.tvr != '0') receipt += makeStringCenter('TVR:', 16, 'left') + makeStringCenter(finalTransaction?.tvr, 16, 'right') + '\n';
    }

    let receipt2 = '';

    if (manualCardEntry && finalTransaction?.transactionStatus == 'Approved') {
        if (signature) {
            receipt2 += makeStringCenter('X_______________________', 31, 'center') + '\n';
            receipt2 += makeStringCenter('SIGNATURE', 31, 'center') + '\n\n';
            receipt2 += makeStringCenter('00_' + finalTransaction?.transactionStatus + '_' + finalTransaction.responseCode, 31, 'center') + '\n';

            receipt2 += makeStringCenter('MERCHANT COPY', 31, 'center') + '\n';

            if (printerConfiguration?.receipt_footer_lines?.value) {
                Object.keys(printerConfiguration?.receipt_footer_lines).map(key => {
                    if (key !== 'value' && printerConfiguration?.receipt_footer_lines[key]) {
                        receipt2 += makeStringCenter(`${printerConfiguration?.receipt_footer_lines[key]}`, 31, 'center') + '\n';
                    }
                });
            }
        } else {
            receipt += '\n\n\n\n' + makeStringCenter('X_______________________', 31, 'center') + '\n';
            receipt += makeStringCenter('SIGNATURE', 31, 'center') + '\n\n';
            receipt += makeStringCenter('00_' + finalTransaction?.transactionStatus + '_' + finalTransaction.responseCode, 31, 'center') + '\n';

            receipt += makeStringCenter('MERCHANT COPY', 31, 'center') + '\n';
            if (printerConfiguration?.receipt_footer_lines?.value) {
                Object.keys(printerConfiguration?.receipt_footer_lines).map(key => {
                    if (key !== 'value' && printerConfiguration?.receipt_footer_lines[key]) {
                        receipt += makeStringCenter(`${printerConfiguration?.receipt_footer_lines[key]}`, 31, 'center') + '\n';
                    }
                });
            }
        }
    } else {
        if (finalTransaction?.tsi != '0') receipt += makeStringCenter('TSI:', 16, 'left') + makeStringCenter(finalTransaction?.tsi, 16, 'right');
        if (orderData.entry_mode !== 'T' && orderData.entry_mode != 'S' && !manualCardEntry) {
            receipt += makeStringCenter('PIN VERIFIED', 31, 'center') + '\n';
        }
        receipt += makeStringCenter('00_' + finalTransaction?.transactionStatus + '_' + finalTransaction.responseCode, 31, 'center') + '\n';

        receipt += makeStringCenter('MERCHANT COPY', 31, 'center') + '\n';

        if (printerConfiguration?.receipt_footer_lines?.value) {
            Object.keys(printerConfiguration?.receipt_footer_lines).map(key => {
                if (key !== 'value' && printerConfiguration?.receipt_footer_lines[key]) {
                    receipt += makeStringCenter(`${printerConfiguration?.receipt_footer_lines[key]}`, 31, 'center') + '\n';
                }
            });
        }
    }

    console.log('receipttt.....', receipt);

    let url = '';

    Pax.printStr('', '', receipt, Pax.FULL_CUT, '', printerConfiguration?.receipt_header_lines?.line_1);

    dispatch(
        setOrderData({
            tip: 0.0,
            clerkId: '',
            invoiceNumber: '',
            merchantPasscode: '',
            tipType: '',
            surcharge: 0,
            orderAmount: 0.0,
            cardType: '',
        })
    );
    dispatch(setManualCardEntry(false));
};


  const sendSmsReceipt = async (receiptDetail, phoneNo) => {
    store.dispatch(toggleLoader({ isLoading: true }));
    let receipt = "";
    Object.keys(printerConfiguration?.receipt_header_lines).map((key) => {
      if (
        key !== "value" &&
        printerConfiguration?.receipt_header_lines[key] &&
        key !== "line_1"
      ) {
        receipt +=
          makeStringCenter(
            `${printerConfiguration?.receipt_header_lines[key]}`,
            31,
            "center"
          ) + "\n";
      }
    });

    receipt +=
      makeStringCenter("                              ", 31, "center") + "\n";

    receipt +=
      makeStringCenter("Clerk ID:", 13, "left") +
      makeStringCenter(receiptDetail?.clerk_id?.toString() ?? "", 19, "right") +
      "\n";
    // const orderTime = moment(receiptDetail?.sdate?.d).format("dd/mm/yy");
    // console.log(orderTime, "orderTimeorderTime");

    receipt +=
      makeStringCenter(`Date:${receiptDetail?.date}`, 16, "left") +
      makeStringCenter(`Time:${receiptDetail?.time}`, 16, "right") +
      "\n";

    receipt +=
      makeStringCenter("Invoice #", 16, "left") +
      makeStringCenter(
        receiptDetail?.invoice_no?.toUpperCase()
          ? receiptDetail?.invoice_no?.toUpperCase()
          : "",
        16,
        "right"
      ) +
      "\n";

    receipt +=
      makeStringCenter(
        receiptDetail?.status == "Refunded" ? "Refund" : "Sale",
        31,
        "center"
      ) + "\n\n";

    receipt +=
      makeStringCenter(receiptDetail?.card_type, 16, "left") +
      makeStringCenter(
        padFunction(receiptDetail?.card_number.substring(8)),
        16,
        "right"
      ) +
      "\n";

    receipt +=
      makeStringCenter(
        "Entry Method",
        // padFunction(receiptDetail?.split?.card_number),
        19,
        "left"
      ) +
      makeStringCenter(
        receiptDetail?.entry_mode == "S"
          ? "SWIPE"
          : receiptDetail?.entry_mode == "T"
            ? "TAP"
            : "CHIP",
        13,
        "right"
      ) +
      "\n";
    if (receiptDetail?.type === "DEBIT") {
      receipt +=
        makeStringCenter("Account Type:", 16, "left") +
        makeStringCenter(
          receiptDetail?.entry_mode == "T"
            ? "DEFAULT"
            : receiptDetail?.account_type,
          16,
          "right"
        ) +
        "\n";
    }

    receipt +=
      makeStringCenter("Ref.#", 16, "left") +
      makeStringCenter(
        receiptDetail?.reference_id ? receiptDetail?.reference_id : "",
        16,
        "right"
      ) +
      "\n";

    receipt +=
      makeStringCenter("Auth.#:", 16, "left") +
      makeStringCenter(
        receiptDetail?.auth_no ? String(receiptDetail?.auth_no) : "",
        16,
        "right"
      ) +
      "\n";

    receipt +=
      makeStringCenter("Amount:", 19, "left") +
      makeStringCenter(
        currencyFormatter.format(
          receiptDetail?.sale_amount ? receiptDetail?.sale_amount : "",
          {
            code: "CAD",
          }
        ),
        13,
        "right"
      ) +
      "\n";

    if (receiptDetail?.status !== "Refunded") {
      if (tipConfig?.tip_screen?.value) {
        receipt +=
          makeStringCenter("TIP:", 19, "left") +
          makeStringCenter(
            currencyFormatter.format(
              receiptDetail?.tip_amount ? receiptDetail?.tip_amount : "",

              {
                code: "CAD",
              }
            ),

            13,

            "right"
          ) +
          "\n";
      }
    }
    if (receiptDetail?.status !== "Refunded") {
      if (
        surchargeConfig?.debit_surcharge?.value ||
        surchargeConfig?.credit_surcharge?.value
      ) {
        receipt +=
          makeStringCenter("Surcharge:", 19, "left") +
          makeStringCenter(
            currencyFormatter.format(
              receiptDetail?.surcharge_amount
                ? receiptDetail?.surcharge_amount
                : "",

              {
                code: "CAD",
              }
            ),

            13,

            "right"
          ) +
          "\n";
      }
    }

    receipt +=
      makeStringCenter("_________________________________", 31, "center") +
      "\n";
    receipt +=
      makeStringCenter("Total:", 16, "left") +
      makeStringCenter(
        currencyFormatter.format(
          parseFloat(receiptDetail?.surcharge_amount) +
          parseFloat(receiptDetail?.tip_amount) +
          parseFloat(receiptDetail?.sale_amount),
          {
            code: "CAD",
          }
        ),
        16,
        "right"
      ) +
      "\n";

    receipt +=
      makeStringCenter("Application Label:", 19, "left") +
      makeStringCenter(receiptDetail?.card_type, 13, "right") +
      "\n";

    receipt +=
      makeStringCenter("Application Pref.Name:", 22, "left") +
      makeStringCenter(receiptDetail?.type, 10, "right") +
      "\n";

    receipt +=
      makeStringCenter("AID:", 16, "left") +
      makeStringCenter(receiptDetail?.aid, 16, "right") +
      "\n";

    receipt +=
      makeStringCenter("TVR:", 16, "left") +
      makeStringCenter(receiptDetail?.tvr, 16, "right") +
      "\n";
    receipt +=
      makeStringCenter("TSI:", 16, "left") +
      makeStringCenter(receiptDetail?.tsi, 16, "right") +
      "\n";
    if (receiptDetail?.entry_mode !== "T") {
      receipt += makeStringCenter("PIN VERIFIED", 31, "center") + "\n";
    }
    receipt +=
      makeStringCenter(
        "00_" +
        receiptDetail?.transactionStatus +
        "_" +
        receiptDetail?.responseCode,
        31,
        "center"
      ) + "\n";

    receipt +=
      makeStringCenter("Customer Copy".toUpperCase(), 31, "center") + "\n";

    console.log(receipt, "receipt");

    console.log(phoneNo, "receipt");

    const ACCOUNT_SID = "AC7c4629725ec5f78a1a14f94873a911c6";
    const AUTH_TOKEN = "2568f23fe4f4a67d955cd43c55ac5b4e";
    const TWILIO_PHONE_NUMBER = "+16473705563";
    const recipientPhoneNumber = phoneNo; // Replace with the recipient's phone number

    const messageData = {
      body: receipt,
      from: TWILIO_PHONE_NUMBER,
      to: recipientPhoneNumber,
    };

    try {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/AC7c4629725ec5f78a1a14f94873a911c6/Messages.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${encode(`${ACCOUNT_SID}:${AUTH_TOKEN}`)}`,
          },
          body: `From=${encodeURIComponent(
            messageData.from
          )}&To=${encodeURIComponent(messageData.to)}&Body=${encodeURIComponent(
            messageData.body
          )}`,
        }
      );

      console.log(response, "rrrrrrrreeetrtff");
      store.dispatch(toggleLoader({ isLoading: false }));
      return response;
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  return {
    cancelReceipt,
    cancelReceiptGlobal,
    sendSmsReceipt,
    customerReceipt,declinedReceipt
  };
};

export default printCancelReceipt;
