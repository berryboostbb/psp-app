import Pax from 'react-native-pax-library';
import { store } from '@redux';

const moment = require('moment');

const { tms_settings } = store.getState().pr;

const printerConfiguration = tms_settings?.printer;

export const getMarkedCardNumber = (cardNumber: string) => {
    let markedStr = '************';
    const last4Digits = cardNumber.substring(cardNumber?.length - 4);
    return `${markedStr}${last4Digits}`;
};

export const getTransactionSummaryReport = (transactionList: any) => {
    const allSales = transactionList?.filter((d: any) => d?.sale_amount > 0 && d?.status === 'Sale' && d?.transactionStatus === 'Approved');
    const allTips = allSales?.filter((d: any) => d?.tip_amount > 0);
    const allSurcharges = allSales?.filter((d: any) => d?.surcharge_amount > 0);
    const allRefunds = transactionList?.filter((d: any) => d?.sale_amount > 0 && d?.status === 'Refunded' && d?.transactionStatus === 'Approved');
    const allVoids = [];
    const allSalesSubTotal = allSales?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.sale_amount), 0);
    const allRefundsSubTotal = allRefunds?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.sale_amount), 0);
    const allTipsSubTotal = allTips?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.tip_amount), 0);
    const allSurchargesSubTotal = allSurcharges?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.surcharge_amount), 0);

    const creditSales = allSales?.filter((d: any) => d?.type === 'CREDIT');
    const creditTips = allTips?.filter((d: any) => d?.type === 'CREDIT');
    const creditSurcharges = allSurcharges?.filter((d: any) => d?.type === 'CREDIT');
    const creditRefunds = allRefunds?.filter((d: any) => d?.type === 'CREDIT');
    const creditVoids = [];
    const creditSalesSubTotal = creditSales?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.sale_amount), 0);
    const creditRefundsSubTotal = creditRefunds?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.sale_amount), 0);
    const creditTipsSubTotal = creditTips?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.tip_amount), 0);
    const creditSurchargesSubTotal = creditSurcharges?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.surcharge_amount), 0);

    const debitSales = allSales?.filter((d: any) => d?.type === 'DEBIT');
    const debitTips = allTips?.filter((d: any) => d?.type === 'DEBIT');
    const debitSurcharges = allSurcharges?.filter((d: any) => d?.type === 'DEBIT');
    const debitRefunds = allRefunds?.filter((d: any) => d?.type === 'DEBIT');
    const debitVoids = [];
    const debitSalesSubTotal = debitSales?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.sale_amount), 0);
    const debitRefundsSubTotal = debitRefunds?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.sale_amount), 0);
    const debitTipsSubTotal = debitTips?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.tip_amount), 0);
    const debitSurchargesSubTotal = debitSurcharges?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.surcharge_amount), 0);

    const data = [
        {
            title: 'Grand Total',
            data: [
                {
                    'Transaction Type': 'Sales',
                    Count: allSales?.length,
                    Currency: '$',
                    'Sub-Totals': allSalesSubTotal?.toFixed(2),
                },
                {
                    'Transaction Type': 'Tips',
                    Count: allTips?.length,
                    Currency: '$',
                    'Sub-Totals': allTipsSubTotal?.toFixed(2),
                },
                {
                    'Transaction Type': 'Surcharge',
                    Count: allSurcharges?.length,
                    Currency: '$',
                    'Sub-Totals': allSurchargesSubTotal?.toFixed(2),
                },
                {
                    'Transaction Type': 'Refunds',
                    Count: allRefunds?.length,
                    Currency: '$',
                    'Sub-Totals': allRefundsSubTotal?.toFixed(2),
                },
                // {
                //   "Transaction Type": "Voids (Temp)",
                //   Count: 0,
                //   Currency: "$",
                //   "Sub-Totals": 0,
                // },
                {
                    'Transaction Type': 'Grand Total',
                    Count: allSales?.length + allSurcharges?.length + allTips?.length,
                    Currency: '$',
                    'Sub-Totals': (allSalesSubTotal + allTipsSubTotal + allSurchargesSubTotal - allRefundsSubTotal).toFixed(2),
                },
            ],
        },
        {
            title: 'Credit Totals',
            data: [
                {
                    'Transaction Type': 'Sales',
                    Count: creditSales?.length,
                    Currency: '$',
                    'Sub-Totals': creditSalesSubTotal?.toFixed(2),
                },
                {
                    'Transaction Type': 'Tips',
                    Count: creditTips?.length,
                    Currency: '$',
                    'Sub-Totals': creditTipsSubTotal?.toFixed(2),
                },
                {
                    'Transaction Type': 'Surcharge',
                    Count: creditSurcharges?.length,
                    Currency: '$',
                    'Sub-Totals': creditSurchargesSubTotal?.toFixed(2),
                },
                {
                    'Transaction Type': 'Refunds',
                    Count: creditRefunds?.length,
                    Currency: '$',
                    'Sub-Totals': creditRefundsSubTotal?.toFixed(2),
                },
                // {
                //   "Transaction Type": "Voids (Temp)",
                //   Count: 0,
                //   Currency: "$",
                //   "Sub-Totals": 0,
                // },
                {
                    'Transaction Type': 'Total',
                    Count: creditSales?.length + creditSurcharges?.length + creditTips?.length,
                    Currency: '$',
                    'Sub-Totals': (creditSalesSubTotal + creditTipsSubTotal + creditSurchargesSubTotal - allRefundsSubTotal).toFixed(2),
                },
            ],
        },
        {
            title: 'Debit Totals',
            data: [
                {
                    'Transaction Type': 'Sales',
                    Count: debitSales?.length,
                    Currency: '$',
                    'Sub-Totals': debitSalesSubTotal?.toFixed(2),
                },
                {
                    'Transaction Type': 'Tips',
                    Count: debitTips?.length,
                    Currency: '$',
                    'Sub-Totals': debitTipsSubTotal?.toFixed(2),
                },
                {
                    'Transaction Type': 'Surcharge',
                    Count: debitSurcharges?.length,
                    Currency: '$',
                    'Sub-Totals': debitSurchargesSubTotal?.toFixed(2),
                },
                {
                    'Transaction Type': 'Refunds',
                    Count: debitRefunds?.length,
                    Currency: '$',
                    'Sub-Totals': debitRefundsSubTotal?.toFixed(2),
                },
                // {
                //   "Transaction Type": "Voids (Temp)",
                //   Count: 0,
                //   Currency: "$",
                //   "Sub-Totals": 0,
                // },
                {
                    'Transaction Type': 'Total',
                    Count: debitSales?.length + debitSurcharges?.length + debitTips?.length,
                    Currency: '$',
                    'Sub-Totals': (debitSalesSubTotal + debitTipsSubTotal + debitSurchargesSubTotal - debitRefundsSubTotal).toFixed(2),
                },
            ],
        },
    ];

    return data;
};

export const getTipReportData = (transactionList: any) => {
    const allSales = transactionList?.filter((d: any) => d?.sale_amount > 0 && d?.status === 'Sale' && d?.transactionStatus === 'Approved');
    const allTips = allSales?.filter((d: any) => d?.tip_amount > 0);
    const allTipsTotal = allTips?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.tip_amount), 0);
    // const debitTips = allTips?.filter((d: any) => d?.type === "DEBIT");
    // const creditTips = allTips?.filter((d: any) => d?.type === "CREDIT");

    const interacDebitTips = allTips?.filter((d: any) => d?.card_type === 'INTERAC' && d?.type === 'DEBIT');
    const interacDebitTipsTotal = interacDebitTips?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.tip_amount), 0);
    const visaDebitTips = allTips?.filter((d: any) => d?.card_type === 'VISA' && d?.type === 'DEBIT');
    const visaDebitTipsTotal = visaDebitTips?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.tip_amount), 0);
    const masterDebitTips = allTips?.filter((d: any) => d?.card_type === 'MASTERCARD' && d?.type === 'DEBIT');
    const masterDebitTipsTotal = masterDebitTips?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.tip_amount), 0);

    const interacCreditTips = allTips?.filter((d: any) => d?.card_type === 'INTERAC' && d?.type === 'CREDIT');
    const interacCreditTipsTotal = interacCreditTips?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.tip_amount), 0);

    const visaCreditTips = allTips?.filter((d: any) => d?.card_type === 'VISA' && d?.type === 'CREDIT');
    const visaCreditTipsTotal = visaCreditTips?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.tip_amount), 0);
    const masterCreditTips = allTips?.filter((d: any) => d?.card_type === 'MASTERCARD' && d?.type === 'CREDIT');
    const masterCreditTipsTotal = masterCreditTips?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.tip_amount), 0);

    const data = [
        {
            title: 'Grand Tip Total',
            tips: [
                {
                    'Card Type': '',
                    Transaction: 'Sale',
                    'Tip Count': allTips?.length,
                    Currency: '$',
                    Total: allTipsTotal?.toFixed(2),
                },
            ],
        },
        {
            title: 'Debit Tip Total',
            tips: [
                {
                    'Card Type': 'Interac',
                    Transaction: 'Sale',
                    'Tip Count': interacDebitTips?.length,
                    Currency: '$',
                    Total: interacDebitTipsTotal?.toFixed(2),
                },
                {
                    'Card Type': 'Visa',
                    Transaction: 'Sale',
                    'Tip Count': visaDebitTips?.length,
                    Currency: '$',
                    Total: visaDebitTipsTotal?.toFixed(2),
                },
                {
                    'Card Type': 'MasterCard',
                    Transaction: 'Sale',
                    'Tip Count': masterDebitTips?.length,
                    Currency: '$',
                    Total: masterDebitTipsTotal?.toFixed(2),
                },
            ],
        },
        {
            title: 'Credit Tip Total',
            tips: [
                {
                    'Card Type': 'Interac',
                    Transaction: 'Sale',
                    'Tip Count': interacCreditTips?.length,
                    Currency: '$',
                    Total: interacCreditTipsTotal?.toFixed(2),
                },
                {
                    'Card Type': 'Visa',
                    Transaction: 'Sale',
                    'Tip Count': visaCreditTips?.length,
                    Currency: '$',
                    Total: visaCreditTipsTotal?.toFixed(2),
                },
                {
                    'Card Type': 'MasterCard',
                    Transaction: 'Sale',
                    'Tip Count': masterCreditTips?.length,
                    Currency: '$',
                    Total: masterCreditTipsTotal?.toFixed(2),
                },
            ],
        },
    ];
    return data;
};

export const getTerminalConfigurationData = () => {
    const { tms_settings } = store.getState().pr;
    // console.log("tms_settings: ", tms_settings?.screen_times);
    const terminalLanguage = tms_settings?.terminal_configuration?.language_and_terminal_mode?.terminal_language?.english?.value ? 'English' : 'French';
    const surcharge = tms_settings?.transaction_settings?.surcharge;
    const printer = tms_settings?.printer;
    const clerkServer = tms_settings?.terminal_configuration?.clerk_server_maintenance;
    const invoice = tms_settings?.transaction_settings?.invoice_number;
    const managerPassword = tms_settings?.security?.manager_password;
    const tips = tms_settings?.transaction_settings?.tip_configuration;
    const dollarTips = tips?.dollar_tip_amount;
    const percentageTips = tips?.percentage_tip_amount;
    const terminalMode = tms_settings?.terminal_configuration?.language_and_terminal_mode?.terminal_mode;
    const screenTimes = tms_settings?.screen_times;
    const saleScreenTimes = screenTimes?.credit_debit_sale;
    const refundScreenTimes = screenTimes?.refund;

    let screenTimesObj = {};
    if (saleScreenTimes != undefined) {
        Object.keys(saleScreenTimes).forEach(d => {
            screenTimesObj = {
                ...screenTimesObj,
                [`Sale - ${d}`]: `${saleScreenTimes[d]}s`,
            };
        });
    }
    if (refundScreenTimes != undefined) {
        Object.keys(refundScreenTimes).forEach(d => {
            screenTimesObj = {
                ...screenTimesObj,
                [`Refund - ${d}`]: `${refundScreenTimes[d]}s`,
            };
        });
    }

    console.log({ screenTimesObj });

    return [
        {
            title: 'General Information',
            data: {
                'Default Language': terminalLanguage,
                'Currency Symbol': '$',
                'Idle Logo': 'PSP',
            },
        },
        {
            title: 'Terminal Time-Outs',
            data: {
                'Master Timeouts': '60s',
                'Idle Timeout': '30s',
                'Input Timout': '20s',
            },
        },
        {
            title: 'Screen Time-Outs',
            data: screenTimesObj,
        },
        {
            title: 'Terminal Settings',
            data: {
                'Credit Surcharge': surcharge?.credit_surcharge?.value ? 'Enabled' : 'Disabled',
                'Credit Surcharge Fee': `${surcharge?.credit_surcharge?.fee}%`,
                'Debit Surcharge': surcharge?.debit_surcharge?.value ? 'Enabled' : 'Disabled',
                'Debit Surcharge Fee': `$${surcharge?.debit_surcharge?.fee}`,
                'Terminal Language': terminalLanguage,
                Printer: 'Enabled',
                'Pre-Print': printer?.pre_print ? 'Enabled' : 'Disabled',
                'Merchant Copy': printer?.merchant_receipt?.value ? 'Yes' : 'No',
                'Customer Copy': printer?.customer_receipt?.value ? 'Yes' : 'No',
                Both: printer?.both_receipt?.value ? 'Enabled' : 'Disabled',
                // "Clerk/Server ID": "Enabled",
                'Invoice Number': invoice?.auto_increment ? 'Auto Increment' : 'Manual Entry',
                'Manager Password': managerPassword?.value ? 'Enabled' : 'Disabled',
                'Manual Entry': terminalMode?.manual_entry?.value ? 'Enabled' : 'Disabled',
                Tip: tips?.tip_screen?.value ? 'Enabled' : 'Disabled',
                // "No Tip": "Enabled",
                // "Amount Other": "Enabled",
                'Pre-Set $ Amount': `${dollarTips?.amount_1?.value}, ${dollarTips?.amount_2?.value}, ${dollarTips?.amount_3?.value}`,
                'Pre-Set % Amount': `${percentageTips?.amount_1?.value}, ${percentageTips?.amount_2?.value}, ${percentageTips?.amount_3?.value}`,
                'Demo Mode': terminalMode?.demo_mode?.value ? 'Enabled' : 'Disabled',
                // "Communication Type": "Enabled",
            },
        },
    ];
};

export const getEmvParameterReportData = () => {
    return [
        {
            title: 'Interac',
            data: {
                Default: {
                    AID: 'XXXXXXX',
                    'Terminal Type': 'XXX',
                    'Terminal Capabilities': 'XXXXX',
                    'Additional Capabilities': 'XXXXXX',
                    'TAC Denial': 'XXX',
                    'TAC Default': 'XXXXX',
                    'App. Version': 'XX',
                    'Threshold Random': 'X',
                    'Target Percent Random': 'X',
                    'Maximum Target Random': 'XXX',
                    'Default DDOL': 'XX',
                    'Default TDOL': 'XXXX',
                    'Allow Fallback': 'X',
                },
                Contactless: {
                    TTQ: 'XXXXX',
                    'CTLS Floor Limit': 'XX',
                    'CTLS Transaction Limit': 'XXXX',
                    'CTLS CVM Limit': 'XXXX',
                },
            },
        },
        {
            title: 'Visa',
            data: {
                Default: {
                    AID: 'XXXXXXX',
                    'Terminal Type': 'XXX',
                    'Terminal Capabilities': 'XXXXX',
                    'Additional Capabilities': 'XXXXXX',
                    'TAC Denial': 'XXX',
                    'TAC Default': 'XXXXX',
                    'App. Version': 'XX',
                    'Threshold Random': 'X',
                    'Target Percent Random': 'X',
                    'Maximum Target Random': 'XXX',
                    'Default DDOL': 'XX',
                    'Default TDOL': 'XXXX',
                    'Allow Fallback': 'X',
                },
                Contactless: {
                    TTQ: 'XXXXX',
                    'CTLS Floor Limit': 'XX',
                    'CTLS Transaction Limit': 'XXXX',
                    'CTLS CVM Limit': 'XXXX',
                },
            },
        },
        {
            title: 'MasterCard',
            data: {
                Default: {
                    AID: 'XXXXXXX',
                    'Terminal Type': 'XXX',
                    'Terminal Capabilities': 'XXXXX',
                    'Additional Capabilities': 'XXXXXX',
                    'TAC Denial': 'XXX',
                    'TAC Default': 'XXXXX',
                    'App. Version': 'XX',
                    'Threshold Random': 'X',
                    'Target Percent Random': 'X',
                    'Maximum Target Random': 'XXX',
                    'Default DDOL': 'XX',
                    'Default TDOL': 'XXXX',
                    'Allow Fallback': 'X',
                },
                Contactless: {
                    TTQ: 'XXXXX',
                    'CTLS Floor Limit': 'XX',
                    'CTLS Transaction Limit': 'XXXX',
                    'CTLS CVM Limit': 'XXXX',
                },
            },
        },
    ];
};

export const getTerminalTotalData = (transactionList: any) => {
    const allSales = transactionList?.filter((d: any) => d?.sale_amount > 0 && d?.status === 'Sale');
    const allSurcharges = transactionList?.filter((d: any) => d?.surcharge_amount > 0);

    const allRefunds = transactionList?.filter((d: any) => d?.sale_amount > 0 && d?.status === 'Refunded');

    const interacSales = allSales?.filter((d: any) => d?.card_type === 'INTERAC');
    const interacRefunds = allRefunds?.filter((d: any) => d?.card_type === 'INTERAC');
    const visaSales = allSales?.filter((d: any) => d?.card_type === 'VISA');
    const visaRefunds = allRefunds?.filter((d: any) => d?.card_type === 'VISA');
    const masterCardSales = allSales?.filter((d: any) => d?.card_type === 'MASTERCARD');
    const masterCardRefunds = allRefunds?.filter((d: any) => d?.card_type === 'MASTERCARD');

    const interacRefundTotal = interacRefunds?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.sale_amount), 0);
    const visaRefundTotal = visaRefunds?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.sale_amount), 0);
    const masterCardRefundTotal = masterCardRefunds?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.sale_amount), 0);

    const terminalInteracTotals = interacSales?.reduce((partialSum: number, a: any) => partialSum + (parseFloat(a?.sale_amount) + parseFloat(a?.surcharge_amount) + parseFloat(a?.tip_amount)), 0);
    const terminalVisaTotals = visaSales?.reduce((partialSum: number, a: any) => partialSum + (parseFloat(a?.sale_amount) + parseFloat(a?.surcharge_amount) + parseFloat(a?.tip_amount)), 0);
    const terminalMasterCardTotals = masterCardSales?.reduce(
        (partialSum: number, a: any) => partialSum + (parseFloat(a?.sale_amount) + parseFloat(a?.surcharge_amount) + parseFloat(a?.tip_amount)),
        0
    );

    const interacSurcharges = allSurcharges?.filter((d: any) => d?.card_type === 'INTERAC');
    const visaSurcharges = allSurcharges?.filter((d: any) => d?.card_type === 'VISA');
    const masterCardSurcharges = allSurcharges?.filter((d: any) => d?.card_type === 'MASTERCARD');

    const interacSalesTotal = interacSales.reduce((partialSum: number, a: any) => partialSum + (parseFloat(a?.sale_amount) + parseFloat(a?.tip_amount)), 0);
    const visaSalesTotal = visaSales.reduce((partialSum: number, a: any) => partialSum + (parseFloat(a?.sale_amount) + parseFloat(a?.tip_amount)), 0);
    const masterCardSalesTotal = masterCardSales.reduce((partialSum: number, a: any) => partialSum + (parseFloat(a?.sale_amount) + parseFloat(a?.tip_amount)), 0);

    const interacSurchargeTotal = interacSurcharges.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.surcharge_amount), 0);
    const visaSurchargeTotal = visaSurcharges.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.surcharge_amount), 0);
    const masterCardSurchargeTotal = masterCardSurcharges.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.surcharge_amount), 0);

    const data: any = [
        {
            title: 'Terminal Totals',
            terminals: [
                {
                    'Card Type': 'Interac',
                    Count: interacSales?.length,
                    Currency: '$',
                    Totals: terminalInteracTotals?.toFixed(2),
                },
                {
                    'Card Type': 'Visa',
                    Count: visaSales?.length,
                    Currency: '$',
                    Totals: terminalVisaTotals?.toFixed(2),
                },
                {
                    'Card Type': 'MasterCard',
                    Count: masterCardSales?.length,
                    Currency: '$',
                    Totals: terminalMasterCardTotals?.toFixed(2),
                },
            ],
        },
        {
            title: 'Interac Totals',
            terminals: [
                {
                    'Interac Key': 'Sales/Compl',
                    Count: interacSales?.length,
                    Currency: '$',
                    Totals: interacSalesTotal?.toFixed(2),
                },
                {
                    'Interac Key': 'Refund',
                    Count: interacRefunds?.length,
                    Currency: '$',
                    Totals: interacRefundTotal?.toFixed(2),
                },
                {
                    'Interac Key': 'Voids (temp)',
                    Count: 0,
                    Currency: '$',
                    Totals: 0,
                },
                {
                    'Interac Key': 'Surcharge',
                    Count: interacSurcharges?.length,
                    Currency: '$',
                    Totals: interacSurchargeTotal?.toFixed(2),
                },
            ],
        },
        {
            title: 'Visa Totals',
            terminals: [
                {
                    'Visa Key': 'Sales/Compl',
                    Count: visaSales?.length,
                    Currency: '$',
                    Totals: visaSalesTotal?.toFixed(2),
                },
                {
                    'Visa Key': 'Refund',
                    Count: visaRefunds?.length,
                    Currency: '$',
                    Totals: visaRefundTotal?.toFixed(2),
                },
                {
                    'Visa Key': 'Voids (temp)',
                    Count: 0,
                    Currency: '$',
                    Totals: 0,
                },
                {
                    'Visa Key': 'Surcharge',
                    Count: visaSurcharges?.length,
                    Currency: '$',
                    Totals: visaSurchargeTotal?.toFixed(2),
                },
            ],
        },
        {
            title: 'MasterCard Totals',
            terminals: [
                {
                    'MasterCard Key': 'Sales/Compl',
                    Count: masterCardSales?.length,
                    Currency: '$',
                    Totals: masterCardSalesTotal?.toFixed(2),
                },
                {
                    'MasterCard Key': 'Refund',
                    Count: masterCardRefunds?.length,
                    Currency: '$',
                    Totals: masterCardRefundTotal?.toFixed(2),
                },
                {
                    'MasterCard Key': 'Voids (temp)',
                    Count: 0,
                    Currency: '$',
                    Totals: 0,
                },
                {
                    'MasterCard Key': 'Surcharge',
                    Count: masterCardSurcharges?.length,
                    Currency: '$',
                    Totals: masterCardSurchargeTotal?.toFixed(2),
                },
            ],
        },
    ];
    return data;
};

export const getFormattedDate = (date: string) => {
    return moment(date).format('DD/MM/YYYY');
};

export const getFormattedTime = (date: string) => {
    return moment(date).format('hh:mm:ss A');
};

export const getTimezoneStr = () => {
    const date = new Date().toString();
    const timezone = date.substring(date.indexOf('(') + 1, date.indexOf(')'));
    return timezone;
};

export const getTransactionTotalsData = (transactionList: any) => {
    const allSales = transactionList?.filter((d: any) => d?.sale_amount > 0 && d?.status === 'Sale' && d?.transactionStatus === 'Approved');
    const allSalesTotal = allSales?.reduce((partialSum: number, a: any) => partialSum + (parseFloat(a?.sale_amount) + parseFloat(a?.surcharge_amount)), 0);
    const allTips = allSales?.filter((d: any) => d?.tip_amount > 0);
    const allTipsTotal = allTips?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.tip_amount), 0);

    const allRefunds = transactionList?.filter((d: any) => d?.sale_amount > 0 && d?.status === 'Refunded');
    const allRefundsTotal = allRefunds?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.sale_amount), 0);
    const transactionTotalData = {
        'Total Sales': `$${allSalesTotal?.toFixed(2)}`,
        'Total Tips': `$${allTipsTotal?.toFixed(2)}`,
        'No. of Transactions': allSales?.length,
        'Total Refunds': `$${allRefundsTotal?.toFixed(2)}`,
        'No. of Refunds': allRefunds?.length,
    };

    const individualTotals = transactionList?.map((d: any) => {
        const totalAmount = (d?.sale_amount + d?.tip_amount + d?.surcharge_amount)?.toFixed(2);
        return {
            [`Reference # ${d?.reference_id}`]: d?.status,
            ...(d?.card_type && {
                [d?.card_type]: getMarkedCardNumber(d?.card_number),
            }),
            Date: getFormattedDate(d?.created_at),
            Time: getFormattedTime(d?.created_at),
            'Total Amount': `$${totalAmount} - ${d?.transactionStatus}`,
        };
    });
    return [
        {
            title: 'Transaction Totals',
            data: [transactionTotalData],
        },
        {
            title: 'Individual Transaction Totals',
            data: individualTotals,
        },
    ];
};

export const getClerkSettlementReport = (transactionList: any) => {
    const clerkData: any = {};
    transactionList.forEach((d: any) => {
        if (d?.clerk_id in clerkData) {
            clerkData[d.clerk_id].push(d);
        } else {
            clerkData[d.clerk_id] = [d];
        }
    });

    const clerkIds = Object.keys(clerkData);
    const allSales = transactionList?.filter((d: any) => d?.sale_amount > 0 && d?.status === 'Sale' && d?.transactionStatus === 'Approved');
    const allSalesTotal = allSales?.reduce((partialSum: number, a: any) => partialSum + (parseFloat(a?.sale_amount) + parseFloat(a?.surcharge_amount)), 0);
    const allTips = allSales?.filter((d: any) => d?.tip_amount > 0);
    const allTipsTotal = allTips?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.tip_amount), 0);

    const allRefunds = transactionList?.filter((d: any) => d?.sale_amount > 0 && d?.status === 'Refunded' && d?.transactionStatus === 'Approved');
    const allRefundsTotal = allRefunds?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.sale_amount), 0);

    const clerkSummaryData = {
        'No. of Clerk Servers': clerkIds.length,
        'Total Sales': `$${allSalesTotal?.toFixed(2)}`,
        'Total Tips': `$${allTipsTotal?.toFixed(2)}`,
        'No. of Transactions': allSales?.length,
        'Total Refunds': `$${allRefundsTotal?.toFixed(2)}`,
        'No. of Refunds': allRefunds?.length,
    };
    const individualClerkTotals = clerkIds?.map(clerk => {
        const allSales = clerkData[clerk]?.filter((d: any) => d?.sale_amount > 0 && d?.status === 'Sale' && d?.transactionStatus === 'Approved');
        const saleTotal = allSales?.reduce((partialSum: number, a: any) => partialSum + (parseFloat(a?.sale_amount) + parseFloat(a?.surcharge_amount)), 0);
        const tipTotal = allSales?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.tip_amount), 0);

        const allRefunds = clerkData[clerk]?.filter((d: any) => d?.sale_amount > 0 && d?.status === 'Refunded');
        const refundTotal = allRefunds?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.sale_amount), 0);
        return {
            'Clerk/Server ID': clerk,
            'Total Tips': `$${tipTotal?.toFixed(2)}`,
            'Total Sales': `$${saleTotal?.toFixed(2)}`,
            'Total Refunds': `$${refundTotal?.toFixed(0)}`,
        };
    });
    const clerkServerData = [
        {
            title: 'Clerk/Server Totals',
            data: [clerkSummaryData],
        },
        {
            title: 'Individual Clerk/Server Totals',
            data: individualClerkTotals,
        },
    ];
    return clerkServerData;
};

export const getCardBrandsTotalsSettlementData = (transactionList: any) => {
    const allSales = transactionList?.filter((d: any) => d?.sale_amount > 0 && d?.status === 'Sale' && d?.transactionStatus === 'Approved');
    const allSaleTips = transactionList?.filter((d: any) => d?.tip_amount > 0);
    const interacTransactions = transactionList?.filter((d: any) => d?.card_type === 'INTERAC');
    const visaTransactions = transactionList?.filter((d: any) => d?.card_type === 'VISA');
    const masterTransactions = transactionList?.filter((d: any) => d?.card_type === 'MASTERCARD');

    const allRefunds = transactionList?.filter((d: any) => d?.sale_amount > 0 && d?.status === 'Refunded');

    const interacSales = allSales?.filter((d: any) => d?.card_type === 'INTERAC');
    const interacRefunds = allRefunds?.filter((d: any) => d?.card_type === 'INTERAC');
    const totalInteracRefund = interacRefunds?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.sale_amount), 0);
    const visaSales = allSales?.filter((d: any) => d?.card_type === 'VISA');
    const visaRefunds = allRefunds?.filter((d: any) => d?.card_type === 'VISA');
    const totalVisaRefund = visaRefunds?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.sale_amount), 0);
    const masterCardSales = allSales?.filter((d: any) => d?.card_type === 'MASTERCARD');
    const masterCardRefunds = allRefunds?.filter((d: any) => d?.card_type === 'MASTERCARD');
    const totalMasterCardRefund = masterCardRefunds?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.sale_amount), 0);

    const terminalInteracTotals = interacSales?.reduce((partialSum: number, a: any) => partialSum + (parseFloat(a?.sale_amount) + parseFloat(a?.tip_amount) + parseFloat(a?.surcharge_amount)), 0);
    const terminalVisaTotals = visaSales?.reduce((partialSum: number, a: any) => partialSum + (parseFloat(a?.sale_amount) + parseFloat(a?.tip_amount) + parseFloat(a?.surcharge_amount)), 0);
    const terminalMasterCardTotals = masterCardSales?.reduce(
        (partialSum: number, a: any) => partialSum + (parseFloat(a?.sale_amount) + parseFloat(a?.tip_amount) + parseFloat(a?.surcharge_amount)),
        0
    );

    const interacTips = allSaleTips?.filter((d: any) => d?.card_type === 'INTERAC');
    const visaTips = allSaleTips?.filter((d: any) => d?.card_type === 'VISA');
    const masterCardTips = allSaleTips?.filter((d: any) => d?.card_type === 'MASTERCARD');
    const interacTipsTotal = interacTips?.reduce((partialSum: number, a: any) => partialSum + a?.tip_amount, 0);
    const visaTipsTotal = visaTips?.reduce((partialSum: number, a: any) => partialSum + a?.tip_amount, 0);
    const masterCardTipsTotal = masterCardTips?.reduce((partialSum: number, a: any) => partialSum + a?.tip_amount, 0);
    const interacSalesAndSurcharge = interacSales.reduce((partialSum: number, a: any) => partialSum + (parseFloat(a?.sale_amount) + parseFloat(a?.surcharge_amount)), 0);
    const visaSalesAndSurcharge = visaSales.reduce((partialSum: number, a: any) => partialSum + (parseFloat(a?.sale_amount) + parseFloat(a?.surcharge_amount)), 0);
    const masterCardSalesAndSurcharge = masterCardSales.reduce((partialSum: number, a: any) => partialSum + (parseFloat(a?.sale_amount) + parseFloat(a?.surcharge_amount)), 0);

    const data: any = [
        {
            title: 'Card Brand Totals',
            data: [
                {
                    'Card Type': 'Interac',
                    Count: interacTransactions?.length,
                    Currency: '$',
                    Totals: terminalInteracTotals?.toFixed(2),
                },
                {
                    'Card Type': 'MasterCard',
                    Count: masterTransactions?.length,
                    Currency: '$',
                    Totals: terminalMasterCardTotals?.toFixed(2),
                },
                {
                    'Card Type': 'Visa',
                    Count: visaTransactions?.length,
                    Currency: '$',
                    Totals: terminalVisaTotals?.toFixed(2),
                },
                {
                    'Card Type': 'Grand Total',
                    Count: interacTransactions?.length + visaTransactions?.length + masterTransactions?.length,
                    Currency: '$',
                    Totals: (terminalInteracTotals + terminalVisaTotals + terminalMasterCardTotals).toFixed(2),
                },
            ],
        },
        {
            title: 'Interac Totals',
            data: [
                {
                    Interac: 'Total Sales',
                    Count: interacSales?.length,
                    Currency: '$',
                    Totals: interacSalesAndSurcharge?.toFixed(2),
                },
                {
                    Interac: 'Total Returns',
                    Count: interacRefunds?.length,
                    Currency: '$',
                    Totals: totalInteracRefund?.toFixed(2),
                },
                {
                    Interac: 'Total Tips',
                    Count: interacTips?.length,
                    Currency: '$',
                    Totals: interacTipsTotal?.toFixed(2),
                },
                {
                    Interac: 'Sub Total',
                    Count: interacSales?.length + interacTips?.length,
                    Currency: '$',
                    Totals: (terminalInteracTotals - totalInteracRefund).toFixed(2),
                },
            ],
        },
        {
            title: 'MasterCard Totals',
            data: [
                {
                    MasterCard: 'Total Sales',
                    Count: masterCardSales?.length,
                    Currency: '$',
                    Totals: masterCardSalesAndSurcharge?.toFixed(2),
                },
                {
                    MasterCard: 'Total Returns',
                    Count: masterCardRefunds?.length,
                    Currency: '$',
                    Totals: totalMasterCardRefund?.toFixed(2),
                },
                {
                    MasterCard: 'Total Tips',
                    Count: masterCardTips?.length,
                    Currency: '$',
                    Totals: masterCardTipsTotal?.toFixed(2),
                },
                {
                    MasterCard: 'Sub Total',
                    Count: masterCardSales?.length + masterCardTips?.length,
                    Currency: '$',
                    Totals: (terminalMasterCardTotals - totalMasterCardRefund)?.toFixed(2),
                },
            ],
        },
        {
            title: 'Visa Totals',
            data: [
                {
                    Visa: 'Total Sales',
                    Count: visaSales?.length,
                    Currency: '$',
                    Totals: visaSalesAndSurcharge?.toFixed(0),
                },
                {
                    Visa: 'Total Returns',
                    Count: visaRefunds?.length,
                    Currency: '$',
                    Totals: totalVisaRefund?.toFixed(2),
                },
                {
                    Visa: 'Total Tips',
                    Count: visaTips?.length,
                    Currency: '$',
                    Totals: visaTipsTotal?.toFixed(2),
                },
                {
                    Visa: 'Sub Total',
                    Count: visaSales?.length + visaTips?.length,
                    Currency: '$',
                    Totals: (terminalVisaTotals - totalVisaRefund).toFixed(2),
                },
            ],
        },
    ];
    return data;
};

function makeStringCenter(str: any, counter: any, orientation: any) {
    let stl = str?.length;
    let half = parseInt(((counter - stl) / 2) as any);
    let margin = 0;
    let newStr = Array(counter).fill('');
    let count = 0;
    if (orientation === 'center') {
        newStr = newStr.map((v, i) => {
            if (i < half) {
                return ' ';
            } else if (i > half + stl) {
                return ' ';
            } else {
                return str?.length ? str[count++] : '';
            }
        });
    } else if (orientation === 'right') {
        const remain = counter - stl - margin;
        newStr = newStr.map((v, i) => {
            if (i < remain) {
                return ' ';
            } else {
                return str?.length ? str[count++] : '';
            }
        });
        // newStr = newStr.reverse();
    } else if (orientation === 'left') {
        newStr = newStr.map((v, i) => {
            if (i < stl) {
                return str?.length ? str[count++] : '';
            } else {
                return ' ';
            }
        });
    }
    return newStr?.join('');
}

export const printTipsReport = (currentDate: string, time: string, tipObject: any) => {
    let receipt = '\n';
    receipt += getReceiptHeader();
    receipt += '\n';
    receipt += makeStringCenter('Merchant ID:', 13, 'left') + makeStringCenter('136200499100000', 19, 'right') + '\n';
    receipt += makeStringCenter('Terminal ID:', 13, 'left') + makeStringCenter('10015843', 19, 'right') + '\n';
    receipt += makeStringCenter('Start Date:', 13, 'left') + makeStringCenter(currentDate, 19, 'right') + '\n';
    receipt += makeStringCenter('Time:', 13, 'left') + makeStringCenter(time, 19, 'right') + '\n\n\n';

    tipObject?.forEach((tip: any, index: number) => {
        receipt += makeStringCenter(tip?.title, 31, 'center') + '\n';

        tip?.tips?.forEach((obj: any) => {
            if (obj?.['Card Type']?.length > 0) {
                receipt += obj['Card Type'] + '\n';
            }
            receipt += makeStringCenter('Transaction', 14, 'left') + makeStringCenter('Tip Count', 10, 'center') + makeStringCenter('Total', 8, 'right') + '\n';
            const singleTip = tip?.title === 'Grand Tip Total' ? tip?.tips?.[0] : tip?.tips?.find((d: any) => d?.['Card Type'] === obj?.['Card Type']);
            receipt +=
                makeStringCenter(singleTip?.['Transaction'], 12, 'left') +
                makeStringCenter(singleTip?.['Tip Count']?.toString() ?? '0.00', 10, 'center') +
                makeStringCenter(singleTip?.['Total'] ? `$${singleTip?.['Total']}` : '$0.00', 10, 'right') +
                '\n\n';
        });
    });
    Pax.printStr('', '', receipt, Pax.FULL_CUT, '', printerConfiguration?.receipt_header_lines?.line_1);
};

export const printTransactionDetailsReport = (transaction: any) => {
    // console.log(transactions);
    const totalAmount = (transaction?.sale_amount + transaction?.tip_amount + transaction?.surcharge_amount)?.toFixed(2);
    let receipt = '\n';
    receipt += getReceiptHeader();
    receipt += '\n';
    receipt += makeStringCenter('Merchant ID:', 16, 'left') + makeStringCenter('136200499100000', 16, 'right') + '\n';
    receipt += makeStringCenter('Terminal ID:', 16, 'left') + makeStringCenter('10015843', 16, 'right') + '\n';
    receipt += makeStringCenter('Clerk/Server ID:', 16, 'left') + makeStringCenter(transaction?.clerk_id, 16, 'right') + '\n';
    receipt += makeStringCenter(transaction?.card_type, 16, 'left') + makeStringCenter(transaction?.status, 16, 'right') + '\n';
    receipt += makeStringCenter('Account Type:', 16, 'left') + makeStringCenter(transaction?.account_type, 16, 'right') + '\n';
    receipt += makeStringCenter('Ref #:', 16, 'left') + makeStringCenter(transaction?.reference_id, 16, 'right') + '\n';
    receipt += makeStringCenter('Date:', 16, 'left') + makeStringCenter(getFormattedDate(transaction?.created_at), 16, 'right') + '\n';
    receipt += makeStringCenter('Time:', 16, 'left') + makeStringCenter(`${getFormattedTime(transaction?.created_at)} ${getTimezoneStr()}`, 16, 'right') + '\n\n';

    receipt += makeStringCenter('Amount:', 16, 'left') + makeStringCenter(`$${transaction?.sale_amount?.toFixed(2)}`, 16, 'right') + '\n';
    receipt += makeStringCenter('Tip:', 16, 'left') + makeStringCenter(`$${transaction?.tip_amount?.toFixed(2)}`, 16, 'right') + '\n';
    receipt += makeStringCenter('Surcharge:', 16, 'left') + makeStringCenter(`$${transaction?.surcharge_amount?.toFixed(2)}`, 16, 'right') + '\n\n';
    receipt += makeStringCenter('--------------------------------', 32, 'left') + '\n';
    receipt += makeStringCenter('Total Amount:', 16, 'left') + makeStringCenter(`$${totalAmount}`, 16, 'right') + '\n';
    ('\n');
    // transactions?.forEach((obj: any) => {
    //   receipt +=
    //     makeStringCenter(`Reference #${obj?.reference_id}`, 25, "left") +
    //     makeStringCenter(obj?.status, 10, "right") +
    //     "\n";
    //   receipt +=
    //     makeStringCenter(`${obj?.card_type}: ${obj?.card_number}`, 50, "left") +
    //     "\n";
    //   receipt +=
    //     makeStringCenter(
    //       `$${
    //         obj?.surcharge_amount > 0
    //           ? (obj?.sale_amount + obj?.surcharge_amount).toFixed(2)
    //           : obj?.sale_amount?.toFixed(2)
    //       }`,
    //       25,
    //       "left"
    //     ) +
    //     makeStringCenter(`Tip: $${obj?.tip_amount?.toFixed(2)}`, 10, "right") +
    //     "\n\n";
    // });
    Pax.printStr('', '', receipt, Pax.FULL_CUT, '', printerConfiguration?.receipt_header_lines?.line_1);
    console.log(receipt);
};

export const printTransactionList = (data: any) => {
    console.log('d: ', data);
    let receipt = '\n';
    receipt += getReceiptHeader();
    receipt += '\n';
    data?.forEach((item: any) => {
        receipt += makeStringCenter(`Reference #${item?.reference_id}`, 24, 'left') + makeStringCenter(item?.status, 8, 'right') + '\n';
        receipt += makeStringCenter(item?.card_type, 10, 'left') + makeStringCenter(getMarkedCardNumber(item?.card_number), 22, 'right') + '\n';
        receipt +=
            makeStringCenter(`$${item?.surcharge_amount > 0 ? (item?.sale_amount + item?.surcharge_amount).toFixed(2) : item?.sale_amount?.toFixed(2)}`, 16, 'left') +
            makeStringCenter(`Tip: $${item?.tip_amount?.toFixed(2)}`, 16, 'right') +
            '\n\n';
    });
    Pax.printStr('', '', receipt, Pax.FULL_CUT, '', printerConfiguration?.receipt_header_lines?.line_1);
};

export const printTransactionSummaryReport = (data: any) => {
    let receipt = '\n';
    receipt += getReceiptHeader();
    receipt += '\n';
    data?.forEach((obj: any) => {
        receipt += makeStringCenter(obj?.title, 31, 'center') + '\n';
        receipt += makeStringCenter('', 12, 'left') + makeStringCenter('Count', 5, 'center') + makeStringCenter('Sub-Totals', 15, 'right') + '\n';
        obj?.data?.forEach((d: any) => {
            receipt += makeStringCenter(d?.['Transaction Type'], 12, 'left') + makeStringCenter(d?.['Count']?.toString(), 5, 'center') + makeStringCenter(`$${d?.['Sub-Totals']}`, 15, 'right') + '\n';
        });
        receipt += '\n';
    });
    console.log(receipt);
    Pax.printStr('', '', receipt, Pax.FULL_CUT, '', printerConfiguration?.receipt_header_lines?.line_1);
};

export const printCardsDataSettlementReport = (startDate: string, endDate: string, startTime: string, endTime: string, lastTransactionTime: string, data: any) => {
    let receipt = '\n';
    receipt += getReceiptHeader();
    receipt += '\n';
    receipt += makeStringCenter('Merchant ID:', 13, 'left') + makeStringCenter('136200499100000', 19, 'right') + '\n';
    receipt += makeStringCenter('Terminal ID:', 13, 'left') + makeStringCenter('10015843', 19, 'right') + '\n';
    receipt += makeStringCenter('Start Date:', 13, 'left') + makeStringCenter(startDate, 19, 'right') + '\n';

    receipt += makeStringCenter('Start Time:', 13, 'left') + makeStringCenter(startTime, 19, 'right') + '\n';
    receipt += makeStringCenter('End Date:', 13, 'left') + makeStringCenter(endDate, 19, 'right') + '\n';
    receipt += makeStringCenter('End Time:', 13, 'left') + makeStringCenter(endTime, 19, 'right') + '\n';
    receipt += makeStringCenter('Last Transaction:', 17, 'left') + makeStringCenter(lastTransactionTime, 15, 'right') + '\n\n\n';

    const cardTypeKeys = ['Card Type', 'Interac', 'Visa', 'MasterCard'];
    data?.forEach((d: any, index: number) => {
        receipt += makeStringCenter(d?.title, 32, 'center') + '\n';
        receipt += makeStringCenter(cardTypeKeys?.[index], 14, 'left') + makeStringCenter('Count', 5, 'center') + makeStringCenter('Totals', 13, 'right') + '\n';
        d?.data?.forEach((cardData: any) => {
            receipt +=
                makeStringCenter(cardData?.[cardTypeKeys[index]], 14, 'left') +
                makeStringCenter(cardData?.['Count']?.toString(), 5, 'center') +
                makeStringCenter(`$${cardData?.['Totals']}`, 13, 'right') +
                '\n';
        });
        receipt += '\n';
    });
    console.log(receipt);
    Pax.printStr('', '', receipt, Pax.FULL_CUT, '', printerConfiguration?.receipt_header_lines?.line_1);
};

export const getReceiptHeader = () => {
    let header = '';
    Object.keys(printerConfiguration?.receipt_header_lines).map(key => {
        if (key !== 'value' && printerConfiguration?.receipt_header_lines[key] && key !== 'line_1') {
            header += makeStringCenter(`${printerConfiguration?.receipt_header_lines[key]}`, 31, 'center') + '\n';
        }
    });
    return header;
};

export const printTransactionSettlementReport = (startDate: string, endDate: string, startTime: string, endTime: string, lastTransactionTime: string, data: any) => {
    let receipt = '\n';
    receipt += getReceiptHeader();
    receipt += '\n';
    receipt += makeStringCenter('Merchant ID:', 13, 'left') + makeStringCenter('136200499100000', 19, 'right') + '\n';
    receipt += makeStringCenter('Terminal ID:', 13, 'left') + makeStringCenter('10015843', 19, 'right') + '\n';
    receipt += makeStringCenter('Start Date:', 13, 'left') + makeStringCenter(startDate, 19, 'right') + '\n';
    receipt += makeStringCenter('Start Time:', 13, 'left') + makeStringCenter(startTime, 19, 'right') + '\n';
    receipt += makeStringCenter('End Date:', 13, 'left') + makeStringCenter(endDate, 19, 'right') + '\n';
    receipt += makeStringCenter('End Time:', 13, 'left') + makeStringCenter(endTime, 19, 'right') + '\n';
    receipt += makeStringCenter('Last Transaction:', 17, 'left') + makeStringCenter(lastTransactionTime, 15, 'right') + '\n\n\n';
    receipt += makeStringCenter('Transaction Totals', 32, 'center') + '\n';

    const totalsData = data?.[0]?.data?.[0];
    receipt += makeStringCenter('Total Sales', 16, 'left') + makeStringCenter(totalsData?.['Total Sales'], 16, 'right') + '\n';
    receipt += makeStringCenter('Total Tips', 16, 'left') + makeStringCenter(totalsData?.['Total Tips'], 16, 'right') + '\n';
    receipt += makeStringCenter('No. of Transactions', 25, 'left') + makeStringCenter(totalsData?.['No. of Transactions']?.toString(), 7, 'right') + '\n\n';
    receipt += makeStringCenter('Total Refunds', 25, 'left') + makeStringCenter(totalsData?.['Total Refunds']?.toString(), 7, 'right') + '\n';
    receipt += makeStringCenter('No. of Transactions', 26, 'left') + makeStringCenter(totalsData?.['No. of Refunds']?.toString(), 6, 'right') + '\n\n';

    receipt += makeStringCenter('Individual Transaction Totals', 32, 'center') + '\n';
    const individualData = data?.[1]?.data;
    individualData?.forEach((d: any) => {
        Object.keys(d)?.forEach((k, index: number) => {
            const keyLength = index === 0 ? 24 : index === 1 ? 16 : 12;
            const valueLength = index === 0 ? 8 : index === 1 ? 16 : 20;
            receipt += makeStringCenter(k, keyLength, 'left') + makeStringCenter(d?.[k]?.toString(), valueLength, 'right') + '\n';
        });
        receipt += '\n';
    });
    // Pax.printStr("", "", receipt, Pax.FULL_CUT, "");
    // console.log(receipt);
    Pax.printStr('', '', receipt, Pax.FULL_CUT, '', printerConfiguration?.receipt_header_lines?.line_1);
};

export const printClerkServerSettlementReport = (startDate: string, endDate: string, startTime: string, endTime: string, lastTransactionTime: string, data: any) => {
    let receipt = '\n';
    receipt += getReceiptHeader();
    receipt += '\n';
    receipt += makeStringCenter('Merchant ID:', 13, 'left') + makeStringCenter('136200499100000', 19, 'right') + '\n';
    receipt += makeStringCenter('Terminal ID:', 13, 'left') + makeStringCenter('10015843', 19, 'right') + '\n';
    receipt += makeStringCenter('Start Date:', 13, 'left') + makeStringCenter(startDate, 19, 'right') + '\n';
    receipt += makeStringCenter('End Date:', 13, 'left') + makeStringCenter(endDate, 19, 'right') + '\n';
    receipt += makeStringCenter('Last Transaction:', 13, 'left') + makeStringCenter(lastTransactionTime, 19, 'right') + '\n\n\n';
    receipt += makeStringCenter('Clerk/Server Totals', 32, 'center') + '\n';

    const totalsData = data?.[0]?.data?.[0];
    receipt += makeStringCenter('No. of Clerk Servers', 16, 'left') + makeStringCenter(totalsData?.['No. of Clerk Servers']?.toString(), 16, 'right') + '\n';
    receipt += makeStringCenter('Total Sales', 16, 'left') + makeStringCenter(totalsData?.['Total Sales'], 16, 'right') + '\n';
    receipt += makeStringCenter('Total Tips', 16, 'left') + makeStringCenter(totalsData?.['Total Tips']?.toString(), 16, 'right') + '\n';
    receipt += makeStringCenter('Total Refunds', 24, 'left') + makeStringCenter(totalsData?.['Total Refunds']?.toString(), 8, 'right') + '\n';
    receipt += makeStringCenter('No. of Refunds', 24, 'left') + makeStringCenter(totalsData?.['No. of Refunds']?.toString(), 8, 'right') + '\n\n';

    receipt += makeStringCenter('Individual Clerk/Server Totals', 32, 'center') + '\n';
    const individualData = data?.[1]?.data;
    individualData?.forEach((d: any) => {
        Object.keys(d)?.forEach(k => {
            receipt += makeStringCenter(k, 24, 'left') + makeStringCenter(d?.[k]?.toString(), 8, 'right') + '\n';
        });
        receipt += '\n';
    });
    Pax.printStr('', '', receipt, Pax.FULL_CUT, '', printerConfiguration?.receipt_header_lines?.line_1);
};

export const printTerminalTotalsReport = (startDate: string, endDate: string, time: string, data: any) => {
    let receipt = '\n';
    receipt += getReceiptHeader();
    receipt += '\n';
    receipt += makeStringCenter('Merchant ID:', 13, 'left') + makeStringCenter('136200499100000', 19, 'right') + '\n';
    receipt += makeStringCenter('Terminal ID:', 13, 'left') + makeStringCenter('10015843', 19, 'right') + '\n';
    receipt += makeStringCenter('Start Date:', 13, 'left') + makeStringCenter(startDate, 19, 'right') + '\n';
    receipt += makeStringCenter('End Date:', 13, 'left') + makeStringCenter(endDate, 19, 'right') + '\n';
    receipt += makeStringCenter('Time:', 13, 'left') + makeStringCenter(time, 19, 'right') + '\n\n\n';

    const dataKeys = ['Card Type', 'Interac Key', 'Visa Key', 'MasterCard Key'];

    data?.forEach((d: any, index: number) => {
        receipt += makeStringCenter(d?.title, 32, 'center') + '\n';
        if (index === 0) {
            receipt += makeStringCenter('Card Type', 14, 'left') + makeStringCenter('Count', 5, 'center') + makeStringCenter('Totals', 13, 'right') + '\n';
        } else {
            receipt += makeStringCenter(' ', 14, 'left') + makeStringCenter('Count', 5, 'center') + makeStringCenter('Totals', 13, 'right') + '\n';
        }
        const terminalData = d?.terminals;
        terminalData?.forEach((tData: any) => {
            receipt +=
                makeStringCenter(tData?.[dataKeys?.[index]], 14, 'left') + makeStringCenter(tData?.['Count']?.toString(), 5, 'center') + makeStringCenter(`$${tData?.['Totals']}`, 13, 'right') + '\n';
        });
        receipt += '\n';
    });
    Pax.printStr('', '', receipt, Pax.FULL_CUT, '', printerConfiguration?.receipt_header_lines?.line_1);
};

export const printTerminalConfigurationReport = () => {
    const data = getTerminalConfigurationData();
    let receipt = '\n';
    receipt += getReceiptHeader();
    receipt += '\n';

    data.forEach((d: any) => {
        receipt += makeStringCenter(d?.title, 32, 'center') + '\n';
        const itemData = d?.data;
        Object.keys(itemData)?.map(d => {
            receipt += makeStringCenter(d, 20, 'left') + makeStringCenter(itemData?.[d], 12, 'right') + '\n';
        });
        receipt += '\n';
    });

    Pax.printStr('', '', receipt, Pax.FULL_CUT, '', printerConfiguration?.receipt_header_lines?.line_1);
};

export const printSingleClerkServerReport = (data: any) => {
    let receipt = '\n';
    receipt += getReceiptHeader();
    receipt += '\n';

    data?.forEach((d: any, index: number) => {
        receipt += makeStringCenter(d?.card_type, 16, 'left') + makeStringCenter(d?.status, 16, 'right') + '\n';
        receipt += makeStringCenter('Clerk/Server ID#', 16, 'left') + makeStringCenter(d?.clerk_id, 16, 'right') + '\n';
        receipt += makeStringCenter(`Invoice #: ${d?.invoice_no}`, 12, 'left') + makeStringCenter(`Reference #: ${d?.reference_id}`, 20, 'right') + '\n';
        receipt += makeStringCenter('Amount', 12, 'left') + makeStringCenter(`$ ${d?.sale_amount?.toFixed(2)}`, 20, 'right') + '\n';
        receipt += makeStringCenter('Tip', 12, 'left') + makeStringCenter(`$ ${d?.tip_amount?.toFixed(2)}`, 20, 'right') + '\n';
        receipt += makeStringCenter('Surcharge', 12, 'left') + makeStringCenter(`$ ${d?.surcharge_amount?.toFixed(2)}`, 20, 'right') + '\n';
        receipt += makeStringCenter('--------------------------------', 32, 'left') + '\n';
        receipt += makeStringCenter('Total', 12, 'left') + makeStringCenter(`$ ${(d?.sale_amount + d?.surcharge_amount + d?.tip_amount).toFixed(2)} - ${d?.transactionStatus}`, 20, 'right') + '\n';
        if (index !== data?.length - 1) {
            receipt += makeStringCenter('________________________________', 32, 'left') + '\n';
        }
        receipt += '\n';
    });
    Pax.printStr('', '', receipt, Pax.FULL_CUT, '', printerConfiguration?.receipt_header_lines?.line_1);
};

export const printClerkServerListReport = (data: any) => {
    let receipt = '\n';
    receipt += getReceiptHeader();
    receipt += '\n';

    Object.keys(data).forEach(item => {
        const clerkData = data[item];
        const sales = clerkData?.filter((d: any) => d?.sale_amount > 0 && d?.status === 'Sale' && d?.transactionStatus === 'Approved');
        const salesTotal = sales?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.sale_amount), 0);
        const refunds = clerkData?.filter((d: any) => d?.sale_amount > 0 && d?.status === 'Refunded');
        const refundsTotal = refunds?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.sale_amount), 0);
        const tipTotal = sales?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.tip_amount), 0);
        const grandTotal = sales?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.tip_amount) + parseFloat(a?.sale_amount) + parseFloat(a?.surcharge_amount), 0);
        receipt += makeStringCenter('Clerk/Server ID:', 16, 'left') + makeStringCenter(item, 16, 'right') + '\n';
        receipt += makeStringCenter('Sales Total:', 16, 'left') + makeStringCenter(`$${salesTotal?.toFixed(2)}`, 16, 'right') + '\n';
        receipt += makeStringCenter('Tip Total:', 16, 'left') + makeStringCenter(`$${tipTotal?.toFixed(2)}`, 16, 'right') + '\n';
        receipt += makeStringCenter('Refunds Total:', 16, 'left') + makeStringCenter(`$${refundsTotal?.toFixed(2)}`, 16, 'right') + '\n';
        receipt += makeStringCenter('Grand Total:', 16, 'left') + makeStringCenter(`$${grandTotal?.toFixed(2)}`, 16, 'right') + '\n\n';
    });
    // data?.forEach((d: any) => {
    //   receipt +=
    //     makeStringCenter(d?.account_type, 16, "left") +
    //     makeStringCenter(d?.abc, 16, "right") +
    //     "\n";
    // });
    Pax.printStr('', '', receipt, Pax.FULL_CUT, '', printerConfiguration?.receipt_header_lines?.line_1);
};
