import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  user: null,
  authToken: null,
  isLoggedIn: false,
  flowType: "debIncl",
  saleAmount: 0,
  selectedMenu: "Sale",

  internet_Connected: null,
  showPasscodeUpdate: false,
  manualCardEntry: false,

  settings: [
    { id_number: 2222, isEnabled: true, name: "server", title: "Server Id" },
    {
      id_number: "125sdfgyd5",
      isEnabled: true,
      title: "Invoice Number",
      subSettings: [
        {
          title: "Auto Increment",
          isEnabled: true,
        },
        {
          title: "Manual Entry",
          isEnabled: false,
        },
      ],
    },

    {
      title: "Cashback",
      isEnabled: false,
      cashback_amount_limit: "0",
      subSettings: [
        {
          title: "Other Amount",
          isEnabled: true,
        },
        {
          isEnabled: false,
          title: "Pre-set Cashback Amount",
          values: [
            { title: "Pre-set Amount 1", value: "5" },
            { title: "Pre-ser Amount 2", value: "10" },
            { title: "Pre-ser Amount 3", value: "15" },
          ],
        },
      ],
    },
    {
      isEnabled: true,
      title: "Surcharge",
      subSettings: [
        {
          title: "Surcharge Trasnaction Limit",
          isEnabled: true,
          value: 0,
        },
        {
          title: "Debit Surcharge",
          isEnabled: true,
          value: 0.5,
        },
        {
          title: "Credit Surcharge",
          isEnabled: true,
          value: 2.4,
        },
      ],
    },
    {
      // 4
      title: "Tip Screen",
      isEnabled: true,
      subSettings: [
        {
          title: "Percentage Tip Amounts",
          values: [
            { title: "First", value: "5" },
            { title: "Second", value: "10" },
            { title: "Third", value: "15" },
          ],
          isEnabled: true,
        },
        {
          title: "Dollar Tip Amounts",
          values: [
            { title: "First", value: "5" },
            { title: "Second", value: "10" },
            { title: "Third", value: "15" },
          ],
          isEnabled: true,
        },
      ],
    },

    {
      // 5
      isEnabled: true,
      title: "Receipt",

      subSettings: [
        { isEnabled: false, title: "Receipt Pre Print" },
        {
          title: "Merchant Receipt",
          isEnabled: true,
        },
        {
          title: "Customer Receipt",
          isEnabled: true,
        },
        { data: [], title: "Receipt Footer Lines", isEnabled: true },
      ],
    },
    { isEnabled: true, title: "Merchant Passcode" },
  ],
  languageType: "eng",
  networkLayout: "",
  hostText: "www.google.com",
  timeLayout: "",
  deviceMacAddress: "",
  prePrinted: false,
  appVersion: null,
};

export const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAppVersion: (state, action) => {
      state.appVersion = action.payload;
    },
    setPrePrinted: (state, action) => {
      state.prePrinted = action.payload;
    },
    setDeviceMacAddress: (state, action) => {
      state.deviceMacAddress = action.payload;
    },
    setAuthToken: (state, action) => {
      state.authToken = action.payload;
    },

    setManualCardEntry: (state, action) => {
      state.manualCardEntry = action.payload;
    },
    setInternetConnected: (state, action) => {
      state.internet_Connected = action.payload;
    },
    setNetworkLayout: (state, action) => {
      state.networkLayout = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setselectedMenu: (state, action) => {
      state.selectedMenu = action.payload;
    },
    setSettings: (state, action) => {
      state.settings = action.payload;
    },
    setflowtype: (state, action) => {
      state.flowType = action.payload;
    },
    setSurcharge: (state, action) => {
      state.surcharge = action.payload;
    },
    setHostText: (state, action) => {
      state.hostText = action.payload;
    },
    setTimeLayout: (state, action) => {
      state.timeLayout = action.payload;
    },

    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setShowPasscodeUpdate: (state, action) => {
      state.showPasscodeUpdate = action.payload;
    },


    signOut: (state) => {
      state.user = null;
      state.colorCode = "#19383A";
      state.authToken = null;
      state.isLoggedIn = false;
    },
    lan_convert: (state, action) => {
      state.languageType = action.payload;
      // console.log(action.payload);
    },
  },
});

export const {
  setUser,
  signOut,
  setAuthToken,

  setIsLoggedIn,
  setflowtype,
  setSurcharge,
  setSettings,
  lan_convert,

  setselectedMenu,
  setInternetConnected,
  setNetworkLayout,
  setHostText,
  setTimeLayout,
  setShowPasscodeUpdate,
  setManualCardEntry,
  setDeviceMacAddress,
  setPrePrinted,
  setAppVersion,
} = userReducer.actions;

export default userReducer.reducer;
