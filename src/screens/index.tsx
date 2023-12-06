import Login from "./Auth/Login";
import LockScreen from "./Auth/lockScreen";

import Settings from "./Admin/Settings";
import TransactionMenu from "./Admin/TransactionMenu";
import ManagerPassword from "./Admin/ManagerPassword";

import Dashboard from "./Dashboard/Overview";
import Admin_Settings from "./Dashboard/AdminSettings";
import Communication from "./Dashboard/Communication/overview";
import Host from "./Dashboard/Communication/host";
import Network from "./Dashboard/Communication/network";
import Batch from "./Dashboard/Communication/batch";
import Transaction_Settings from "./Dashboard/TrasactionSettings/overview";
import Tip_Configuration from "./Dashboard/TrasactionSettings/tipConfiguration";
import Edit_Tip_Amount from "./Dashboard/TrasactionSettings/editTipAmount";
import Cashback_Config from "./Dashboard/TrasactionSettings/cashback";
import Surcharge_Config from "./Dashboard/TrasactionSettings/surcharge";
import Terminal_Configuration from "./Dashboard/TerminalConfiguration/overview";
import Clerk from "./Dashboard/TerminalConfiguration/clerk";
import Language from "./Dashboard/TerminalConfiguration/language";
import Add_Clerk from "./Dashboard/TerminalConfiguration/addClerk";
import Clerk_List from "./Dashboard/TerminalConfiguration/clerkList";
import Delete_Clerk from "./Dashboard/TerminalConfiguration/deleteClerk";

import ClerkId from "./Sale/ClerkId";
import InvoiceNumber from "./Sale/InvoiceNumber";
import DeclinedTransaction from "./Sale/DeclinedTransaction";

import Merchant_Cart from "./Sale/MerchantCart";
import EnterAmount from "./Sale/EnterAmount";
import Tap_Merchant_Cart from "./Sale/TapMerchantCart";
import SelectAccount from "./Sale/SelectAccount";
import SaleWelcome from "./Sale/SaleWelcome";

import TipDoller from "./TipSection/TipDoller";

import QRCode from "./Payment/QRCode";
import Receipt from "./Payment/Receipt";
import TapProcess from "./Payment/TapProcess";
import ReceiptPrint from "./Payment/ReceiptPrint";
import PaymentMethod from "./Payment/PaymentMethod";
import LoadingProcess from "./Payment/LoadingProcess";
import CustomerPayWithPoint from "./Payment/CustomerPayWithPoint";

import Merchant_Login from "./Refund/merchantLogin";

// huz-dev
import PrinterConfiguration from "./Dashboard/Printer/Printer Configuration";
import EditFooterLines from "./Dashboard/Printer/EditFooterLines";
import ReportsSection from "./Dashboard/Reports/ReportsSection";
import BatchClose from "./Dashboard/Reports/BatchClose";
import OpenBatchTerminal from "./Dashboard/Reports/OpenBatchTerminal";
import SummaryReport from "./Dashboard/Reports/SummaryReport";
import TransactionDetailReport from "./Dashboard/Reports/TransactionDetailReport";
import TipTotals from "./Dashboard/Reports/TipTotals";
import SearchFilter from "./Dashboard/Reports/SearchFilter/index";
import ClerkServerReport from "./Dashboard/Reports/ClerkServerReport/index";
import TerminalConfigurationReport from "./Dashboard/Reports/TerminalConfigurationReport";
import EmvParametersReport from "./Dashboard/Reports/EmvParametersReport";
import ClerkServerPrintReport from "./Dashboard/Reports/ClerkServerPrintReport";
import DeclineTransactionReport from "./Dashboard/Reports/DeclineTransactionReport";
import EMVParameterReport from "./Dashboard/Reports/EMVParameterReport";
import Offline from "./Offline/index";
import ClerkServerMaintenance from "./Dashboard/TerminalConfiguration/ClerkServerMaintenance/index";
import InvoiceNumberConfig from "./Dashboard/TrasactionSettings/InvoiceNumberConfig/index";
import MerchantPasscodeSettings from "./Dashboard/MerchantPasscodeSettings";
import ManualCard from "./Payment/ManualCard";
import Signature from "./Payment/Signature";
import ActivationScreen from "./Activation";
import RecieptMail from "./Payment/RecieptMail/index";
import ListingData from "./RealmScreens/ListingData";
import ReferenceInputScreen from "./Refund/referenceInput/ReferenceInputScreen";
import DailyReport from "./Dashboard/Reports/DailyReport";
import TerminalTotals from "./Dashboard/Reports/TerminalTotals";

export {
  Delete_Clerk,
  Clerk_List,
  Add_Clerk,
  Clerk,
  Language,
  Terminal_Configuration,
  Surcharge_Config,
  Cashback_Config,
  Edit_Tip_Amount,
  Tip_Configuration,
  Transaction_Settings,
  Batch,
  Network,
  Host,
  Communication,
  Admin_Settings,
  SelectAccount,
  Tap_Merchant_Cart,
  Merchant_Login,
  Login,
  TransactionMenu,
  ManagerPassword,
  Dashboard,
  ClerkId,
  InvoiceNumber,
  EnterAmount,
  TipDoller,
  Merchant_Cart,
  TapProcess,
  LoadingProcess,
  Receipt,
  ReceiptPrint,
  QRCode,
  LockScreen,
  SaleWelcome,
  Settings,
  PaymentMethod,
  CustomerPayWithPoint,
  PrinterConfiguration,
  EditFooterLines,
  ReportsSection,
  BatchClose,
  OpenBatchTerminal,
  TransactionDetailReport,
  SummaryReport,
  TipTotals,
  SearchFilter,
  ClerkServerReport,
  TerminalConfigurationReport,
  ClerkServerPrintReport,
  DeclineTransactionReport,
  EMVParameterReport,
  Offline,
  ClerkServerMaintenance,
  InvoiceNumberConfig,
  DeclinedTransaction,
  MerchantPasscodeSettings,
  ManualCard,
  Signature,
  ActivationScreen,
  RecieptMail,
  ReferenceInputScreen,
  ListingData,
  DailyReport,
  TerminalTotals,
  EmvParametersReport,
};
