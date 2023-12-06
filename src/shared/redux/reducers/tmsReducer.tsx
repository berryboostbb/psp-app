import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
    txn: {},
    configuration: {},
    users: [],
    loggedInUser: {},
    syncDate: null,
    temrinalInfo: {},
    terminal_status: '',
    updatedConfigs: {},
    notifyConfigUpdate: false,
    currentClerkId: '',
    tmsTime: {
        credit_debit_sale: {
            sale_welcome: '10',
            lock_screen: '10',
            transaction_menu: '10',
            clerk_id: '10',
            invoice_number: '10',
            enter_amout: '10',
            tip_doller: '10',
            merchant_cart: '10',
            tap_process: '20',
            tap_merchant_cart: '10',
            select_account: '20',
            pin_entry_prompt: '10',
            receipt: '20',
        },
        credit_refund: {
            sale_welcome: '10',
            lock_screen: '10',
            transaction_menu: '10',
            clerk_id: '10',
            invoice_number: '10',
            enter_amout: '10',
            tip_doller: '10',
            merchant_cart: '10',
            tap_process: '20',
            tap_merchant_cart: '10',
            select_account: '20',
            pin_entry_prompt: '10',
            receipt: '20',
        },
    },
    // ..........All Settings .......
    // tms_settings: {
    //   communication: {
    //     _v: true,
    //     _l: false,
    //     host_setting: {
    //       _v: true,
    //       mid: {
    //         value: "",
    //       },
    //       tid: {
    //         value: "",
    //       },
    //       _host: {
    //         url_1: {
    //           value: "",
    //         },
    //         port_1: {
    //           value: "",
    //         },
    //         url_2: {
    //           value: "",
    //         },
    //         port_2: {
    //           value: "",
    //         },
    //       },
    //       _batch: {
    //         url_1: {
    //           value: "",
    //         },
    //         port_1: {
    //           value: "",
    //         },
    //         url_2: {
    //           value: "",
    //         },
    //         port_2: {
    //           value: "",
    //         },
    //       },
    //     },
    //     network_connection: {
    //       _v: true,
    //       mac_key: {
    //         value: "",
    //       },
    //       cutover: {
    //         value: "",
    //       },
    //       connection_timeout: {
    //         value: "",
    //       },
    //       receive_timeout: {
    //         value: "",
    //       },
    //       host_url: {
    //         value: "",
    //       },
    //       ping_timeout: {
    //         value: "",
    //       },
    //     },
    //   },
    //   batch_close_parameter: {
    //     _v: true,
    //     _l: false,
    //     merchant_batch_close: {
    //       value: false,
    //     },
    //     auto_batch_close: {
    //       value: false,
    //     },
    //   },
    //   terminal_configuration: {
    //     _v: true,
    //     _l: false,
    //     language_and_terminal_mode: {
    //       _v: true,
    //       _l: false,
    //       terminal_language: {
    //         english: {
    //           value: true,
    //         },
    //         french: {
    //           value: false,
    //         },
    //       },
    //       terminal_mode: {
    //         manual_entry: {
    //           value: false,
    //         },
    //         demo_mode: {
    //           value: false,
    //         },
    //       },
    //     },
    //     clerk_server_maintenance: {
    //       _v: true,
    //       _l: false,
    //       clerk_server_list: {
    //         name: {
    //           value: "",
    //         },
    //         id: {
    //           value: "",
    //         },
    //       },
    //     },
    //     merchant_passcode: {
    //       _v: true,
    //       _l: false,
    //       value: false,
    //     },
    //   },
    //   security: {
    //     _v: true,
    //     _l: false,
    //     manager_password: {
    //       value: "",
    //     },
    //     merchant_passcode: {
    //       value: true,
    //       code: "",
    //     },
    //   },
    //   printer: {
    //     _v: true,
    //     _l: false,
    //     pre_print: {
    //       value: true,
    //     },
    //     merchant_receipt: {
    //       value: true,
    //     },
    //     customer_receipt: {
    //       value: true,
    //     },
    //     both_receipt: {
    //       value: true,
    //     },
    //     receipt_footer_lines: {
    //       value: false,
    //       line_1: "",
    //       line_2: "",
    //       line_3: "",
    //       line_4: "",
    //       line_5: "",
    //       line_6: "",
    //     },
    //     receipt_header_lines: {
    //       line_1: "",
    //       line_2: "",
    //       line_3: "",
    //       line_4: "",
    //       line_5: "",
    //       line_6: "",
    //     },
    //   },
    //   transaction_settings: {
    //     _v: true,
    //     tip_configuration: {
    //       _v: true,
    //       _l: false,
    //       tip_screen: {
    //         value: true,
    //       },
    //       percentage_tip_amount: {
    //         value: true,
    //         amount_1: {
    //           value: "0",
    //         },
    //         amount_2: {
    //           value: "0",
    //         },
    //         amount_3: {
    //           value: "0",
    //         },
    //       },
    //       dollar_tip_amount: {
    //         value: true,
    //         amount_1: {
    //           value: "0",
    //         },
    //         amount_2: {
    //           value: "0",
    //         },
    //         amount_3: {
    //           value: "0",
    //         },
    //       },
    //     },
    //     surcharge: {
    //       _v: true,
    //       _l: false,
    //       debit_surcharge: {
    //         fee: "",
    //         value: true,
    //         limit: "",
    //       },
    //       credit_surcharge: {
    //         fee: "",
    //         value: true,
    //       },
    //     },
    //     invoice_number: {
    //       _v: true,
    //       _l: false,
    //       auto_increment: {
    //         value: true,
    //       },
    //       manual_entry: {
    //         value: false,
    //       },
    //     },
    //     tap_limit: {
    //       _v: true,
    //       _l: false,
    //       fee: 200,
    //     },
    //   },
    // },
    bin_ranges: [],
};

export const tmsReducer = createSlice({
    name: 'tms',
    initialState,

    reducers: {
        setUpdatedConfigs: (state, action) => {
            state.updatedConfigs = action.payload;
        },
        setNotifyConfigUpdate: (state, action) => {
            state.notifyConfigUpdate = action.payload;
        },
        setApiKey: (state, action) => {
            state.apiKey = action.payload;
        },
        setTxn: (state, action) => {
            state.txn = action.payload;
        },
        setConfiguration: (state, action) => {
            state.configuration = action.payload;
        },
        // setTms_settings: (state, action) => {
        //   state.tms_settings = action.payload;
        // },
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setLoggedInUser: (state, action) => {
            state.loggedInUser = action.payload;
        },
        setTerminalInfo: (state, action) => {
            state.terminalInfo = action.payload;
        },

        setTmsTime: (state, action) => {
            state.tmsTime = action.payload;
        },
        set_bin_ranges: (state, action) => {
            state.bin_ranges = action.payload;
        },
        setCurrentClerkId: (state, action) => {
            state.currentClerkId = action.payload;
        },
    },
});

export const {
    setConfiguration,
    // setTms_settings,
    setUsers,
    setUpdatedConfigs,
    setNotifyConfigUpdate,
    setLoggedInUser,
    setTmsTime,
    setTerminalInfo,
    set_bin_ranges,
    setTxn,
    setCurrentClerkId,
} = tmsReducer.actions;

export default tmsReducer.reducer;
