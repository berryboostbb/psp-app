import { BASE_URL, BASE_URL_TRANSACTION, ENDPOINTS, Receipt_ApiKey, Receipt_URL } from '@utils';

import { fetchWrapper } from '@services';
import axios from 'axios';
export const signin = async (params: any) => {
    let url = BASE_URL + ENDPOINTS.LOGIN;
    params.isMobile = true;
    let res = await fetchWrapper(url, 'POST', false, params, true);
    return res;
};

export const signup = async (params: any) => {
    let url = BASE_URL + ENDPOINTS.REGISTER;
    let res = await fetchWrapper(url, 'POST', false, params);
    return res;
};

export const LogOut = async () => {
    let url = BASE_URL + ENDPOINTS.LOGOUT;
    let res = await fetchWrapper(url, 'GET', true);
    return res;
};

export const verifyManagerPassword = async (params: any) => {
    let url = BASE_URL + ENDPOINTS.VERIFY_MANAGER_PASSWORD;
    let res = await fetchWrapper(url, 'POST', true, params, true);
    return res;
};

export const ParseEMV = async (params: any) => {
    let url = BASE_URL_TRANSACTION + ENDPOINTS.PARSE_EMV;
    let res = await fetchWrapper(url, 'POST', true, params, true);
    return res;
};

export const saleOrder = async (params: any) => {
    let url = BASE_URL_TRANSACTION + ENDPOINTS.SALE_ORDER;
    let res = await fetchWrapper(url, 'POST', true, params, false);
    return res;
};

export const refundOrder = async (params: any) => {
    let url = BASE_URL_TRANSACTION + ENDPOINTS.REFUND_ORDER;
    let res = await fetchWrapper(url, 'POST', true, params, false);
    return res;
};

export const setPasscode = async (params: any) => {
    let url = BASE_URL + ENDPOINTS.SET_PASSCODE;
    let res = await fetchWrapper(url, 'POST', true, params, true);
    return res;
};

export const verifyClerkId = async (params: any) => {
    let url = BASE_URL + ENDPOINTS.VERIFY_PASSCODE;

    let res = await fetchWrapper(url, 'POST', true, params, true);
    return res;
};

export const verifyPosAdmin = async (params: any) => {
    let url = BASE_URL + 'POS/auth/verify-pos-admin/' + params._id;

    delete params._id;
    let res = await fetchWrapper(url, 'PUT', true, params);
    return res;
};

export const getPerms = async (params: any) => {
    let url = BASE_URL + 'POS/auth/perms';
    let res = await fetchWrapper(url, 'GET', true);
    return res;
};

export const resendOtpApi = async (params: any) => {
    let url = BASE_URL + 'POS/auth/resend-email/' + params;
    let res = await fetchWrapper(url, 'POST', true);
    return res;
};

export const getReceiptData = async (id: any, isRefund: Boolean) => {
    let url = '';

    if (isRefund) url = BASE_URL_TRANSACTION + ENDPOINTS.GET_REFUND_RECEIPT + id;
    else url = BASE_URL_TRANSACTION + ENDPOINTS.GET_RECEIPT + id;
    let res = await fetchWrapper(url, 'GET', true);
    return res;
};

export const getConfigurations = async () => {
    let url = 'https://psp.plastk.ca/c/v1/u-config';
    let res = await fetchWrapper(url, 'GET', true);
    return res;
};

export const getTransactions = async () => {
    let url = 'https://psp.plastk.ca/t/v1/get-transactions?page=1&perPage=100';
    let res = await fetchWrapper(url, 'GET', true, false, true);
    return res;
};

export const verifyInvoice = async (invoice: any) => {
    let url = 'https://psp.plastk.ca/t/v1/sale-detail/' + invoice;
    let res = await fetchWrapper(url, 'GET', true, false, true);
    return res;
};

export const getSummaryReport = async () => {
    let url = 'https://psp.plastk.ca/t/v1/get-transactions-summary';
    let res = await fetchWrapper(url, 'GET', true, false, true);
    return res;
};

export const updateConfigurations = async (params: any, isLoader = true) => {
    let url = 'https://psp.plastk.ca/u-config/v1/update-device-configuration';
    let res = await fetchWrapper(url, 'POST', true, params, isLoader);
    return res;
};

export const getTerminalReceipt = async () => {
    let url = 'https://psp.plastk.ca/transaction/v1/terminal-receipt';
    let res = await fetchWrapper(url, 'GET', true, false, true);
    return res;
};

export const updatePasscode = async (params: any, isLoader = true) => {
    let url = BASE_URL + ENDPOINTS.UPDATE_PASSCODE;
    let res = await fetchWrapper(url, 'PUT', true, params, isLoader);
    return res;
};

//.................................. After TMS integration ..........................................

export const activateTerminal = async (params: any) => {
    let url = BASE_URL + ENDPOINTS.ACTIVATE_TERMINAL;
    let res = await fetchWrapper(url, 'POST', true, params, true);
    return res;
};

export const verifyPasscode = async (params: any) => {
    let url = BASE_URL + ENDPOINTS.VERIFY_PASSCODE;
    let res = await fetchWrapper(url, 'POST', true, params, true);
    return res;
};

export const sendTextorEmail = async (params: any, id: any) => {
    let url = BASE_URL + ENDPOINTS.SEND_TEXT_OR_EMAIL + id;
    let res = await fetchWrapper(url, 'POST', true, params, true);

    return res;
};
export const sendToReceiptEmail = async (params: any) => {
    let url = Receipt_URL;
    let res = await fetchWrapper(url, 'POST', true, params, true);
    return res;
};

export const create_Clerk_Server = async (params: any) => {
    let url = BASE_URL + ENDPOINTS.CREATE_CLERK_SERVER;
    let res = await fetchWrapper(url, 'POST', true, params, true);
    return res;
};
export const delete_Clerk_Server = async (params: any) => {
    let url = BASE_URL + ENDPOINTS.DELTE_CLERK_SERVER + params;
    let res = await fetchWrapper(url, 'POST', true, false, true);
    return res;
};
