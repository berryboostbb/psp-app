const DEV_URL = 'https://psp.plastk.ca/';
// const BASE_URL_TRANSACTION = "https://psp.plastk.ca/api/t/v1";
const BASE_URL_TRANSACTION = 'https://psp.plastk.ca/transaction/v1';

const SOCKET_URL = 'wss://psp.plastk.ca/websockets?terminal=';

const BASE_URL = DEV_URL;

const Receipt_URL = 'https://api.sendgrid.com/v3/mail/send';

const Receipt_ApiKey = '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';

// const BASE_URL = "https://psp.plastk.ca/api/a/v1";

const ENDPOINTS = {
    LOGIN: '/login',
    LOGOUT: '/logout',
    REGISTER: '/sign-up',
    CREATE_ORDER: 'POS/orders/create',
    GET_ORDER: 'POS/orders',
    GET_QR: 'POS/orders/qr',
    // VERIFY_PASSCODE: "/verify-passcode",
    VERIFY_MANAGER_PASSWORD: '/verify-manager-password',
    PARSE_EMV: '/decrypt-emv',
    SALE_ORDER: '/sale',
    REFUND_ORDER: '/refund',
    SET_PASSCODE: '/set-passocde',
    UPDATE_PASSCODE: 'store/v1/update-passcode',
    GET_RECEIPT: '/receipt/',
    GET_REFUND_RECEIPT: '/refund-receipt/',
    SEND_TEXT_OR_EMAIL: 'transaction/v1/send-receipt-notification/',
    // After TMS integration
    ACTIVATE_TERMINAL: 'u-terminal/v1/activate-terminal',
    VERIFY_PASSCODE: 'users/v1/verify-passcode',
    CREATE_CLERK_SERVER: 'u-users/v1/create-clerk-server',
    DELTE_CLERK_SERVER: 'u-users/v1/delete-user-from-device/',
};

export { BASE_URL, Receipt_ApiKey, Receipt_URL, ENDPOINTS, BASE_URL_TRANSACTION, SOCKET_URL };
