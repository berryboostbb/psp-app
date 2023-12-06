const {
    DE2,
    DE3,
    DE4,
    DE5,
    DE7,
    DE11,
    DE12,
    DE14,
    DE15,
    DE46,
    DE22,
    DE24,
    DE25,
    DE34,
    DE35,
    DE37,
    DE38,
    DE41,
    DE42,
    DE48,
    DE49,
    DE52,
    DE54,
    DE55,
    DE63,
    DE64,

    DE102,
    DE103,
    DE128,
} = require('./dataElements.js');
const dict = require('./dict.json');

const temp = {
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
    9: null,
    10: null,
    11: null,
    12: null,
    13: null,
    14: null,
    15: null,
    16: null,
    17: null,
    18: null,
    19: null,
    20: null,
    21: null,
    22: null,
    23: null,
    24: null,
    25: null,
    26: null,
    27: null,
    28: null,
    29: null,
    30: null,
    31: null,
    32: null,
    33: null,
    34: null,
    35: null,
    36: null,
    37: null,
    38: null,
    39: null,
    40: null,
    41: null,
    42: null,
    43: null,
    44: null,
    45: null,
    46: null,
    47: null,
    48: null,
    49: null,
    50: null,
    51: null,
    52: null,
    53: null,
    54: null,
    55: null,
    56: null,
    57: null,
    58: null,
    59: null,
    60: null,
    61: null,
    62: null,
    63: null,
    64: null,
};
const data = [
    { name: 'balance_inquiry_request', code: 'balance_inquiry' },
    { name: 'check_card_request', code: 'check_card' },
    { name: 'pin_verification_request', code: 'pin_verification' },
    { name: 'mini_statement_request', code: 'mini_statement' },
    {
        name: 'account_list_inquiry_request',
        code: 'account_list_inquiry',
    },
    { name: 'pin_change_request', code: 'pin_change' },
    { name: 'pin_change_confirm_request', code: 'pin_change' },
    { name: 'purchase_request', code: 'purchase' },
    { name: 'purchase_with_tips_request', code: 'purchase' },
    { name: 'batch_upload', code: 'purchase' },
    { name: 'utility_payment_request', code: 'utility_payment' },
    {
        name: 'p2p_transfer_merchant_initiated_p2p_transfer_request',
        code: 'p2p_transfer',
    },
    { name: 'p2p_credit_request', code: 'p2p_credit' },
    { name: 'cash_advance_request', code: 'cash_advance' },
    { name: 'pre_authorization_request', code: 'pre_authorization' },
    {
        name: 'pre_authorization_completion_request',
        code: 'pre_authorization_completion',
    },
    {
        name: 'purchase_with_cashback_request',
        code: 'purchase_with_cash_disbursement',
    },
    { name: 'return_refund_request', code: 'return_or_refund' },
    { name: 'pos_cash_deposit_request', code: 'cash_deposit' },
    { name: 'loyalty_purchase_request', code: 'loyalty_purchase' },
    { name: 'funds_transfer_request', code: 'funds_transfer' },
    { name: 'merchant_initiated_purchase_request', code: 'purchase' },
    { name: 'tips_adjustment_request', code: 'tips_adjustment' },
    { name: 'manual_purchase_request', code: 'purchase' },
    { name: 'manual_fallback_purchase_request', code: 'purchase' },
    { name: 'manual_fallback_purchase_request', code: 'purchase' },
    { name: 'return_cancellation_request', code: 'purchase' },

    {
        name: 'issuer_driven_installment_confirmation_request',
        code: 'purchase',
    },
    { name: 'stop_list_inquiry_request', code: 'stop_list_inquiry' },

    { name: 'purchase_reversal_request', code: 'purchase' },
    { name: 'cash_advance_reversal_request', code: 'cash_advance' },
    { name: 'return_reversal_request', code: 'return_or_refund' },
    { name: 'pos_cash_deposit_reversal_request', code: 'cash_deposit' },
    {
        name: 'pre_authorization_reversal_request',
        code: 'pre_authorization',
    },
    {
        name: 'pre_authorization_completion_reversal_request',
        code: 'pre_authorization_completion',
    },
    { name: 'pin_change_reversal_request', code: 'pin_change' },

    { name: '_merchant_log_on_request', code: 'merchant_log_on' },
    { name: '_merchant_log_off_request', code: 'merchant_log_off' },
    { name: 'network_key_change_request', code: 'network_management' },
    {
        name: 'network_mac_key_change_request',
        code: 'network_management',
    },
    { name: 'network_cutover_request', code: 'network_management' },
    { name: '_echo_test', code: 'network_management' },
    {
        name: 'purchase_cash_advance_purchase_with_cashback_return_pos_cash_deposit_trickle_feed_request',
        code: undefined,
    },
    { name: 'automatic_reversal_request', code: undefined },
    { name: 'reversal_trickle_feed_request', code: undefined },
    { name: 'dcc_availability_request', code: undefined },
];
function getMti(_) {
    return dict.find(({ name }) => {
        if (name.includes(':')) {
            name = name.split(':')[1];
        }
        return name === _;
    }).mti;
}
function getTranDesc(_) {
    return data.find(({ name }) => name === _)?.code;
}

exports.pin_verification_request = async function pin_verification_request(_) {
    let data = { ..._, trans_desc: getTranDesc('pin_verification_request') };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        14: await DE14(data),
        22: await DE22(data),
        24: await DE24('Original Authorization Request / Advice'),
        25: await DE25(data),
        35: await DE35(data),
        41: await DE41(data),
        42: await DE42(data),
        52: await DE52(data),
        55: await DE55(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('pin_verification_request'), DE };
};
exports.mini_statement_request = async function mini_statement_request(_) {
    let data = { ..._, trans_desc: getTranDesc('mini_statement_request') };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        14: await DE14(data),
        22: await DE22(data),
        24: await DE24('Original Authorization Request / Advice'),
        25: await DE25(data),
        35: await DE35(data),
        41: await DE41(data),
        42: await DE42(data),
        52: await DE52(data),
        55: await DE55(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('mini_statement_request'), DE };
};
exports.account_list_inquiry_request = async function account_list_inquiry_request(_) {
    let data = {
        ..._,
        trans_desc: getTranDesc('account_list_inquiry_request'),
    };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        14: await DE14(data),
        22: await DE22(data),
        24: await DE24('Original Authorization Request / Advice'),
        25: await DE25(data),
        35: await DE35(data),
        41: await DE41(data),
        42: await DE42(data),
        48: await DE48(data),
        52: await DE52(data),
        55: await DE55(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('account_list_inquiry_request'), DE };
};

exports.merchant_initiated_purchase_request = async function merchant_initiated_purchase_request(_) {
    let data = {
        ..._,
        trans_desc: getTranDesc('merchant_initiated_purchase_request'),
    };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Original Financial Request / Advice'),
        41: await DE41(data),
        42: await DE42(data),
        48: await DE48(data),
        49: await DE49(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('merchant_initiated_purchase_request'), DE };
};
exports.tips_adjustment_request = async function tips_adjustment_request(_) {
    let data = { ..._, trans_desc: getTranDesc('tips_adjustment_request') };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Original Financial Request'),
        25: await DE25(data),
        35: await DE35(data),
        37: await DE37(data),
        38: await DE38(data),
        41: await DE41(data),
        42: await DE42(data),
        49: await DE49(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('tips_adjustment_request'), DE };
};

exports.manual_fallback_purchase_request = async function manual_fallback_purchase_request(_) {
    let data = {
        ..._,
        trans_desc: getTranDesc('manual_fallback_purchase_request'),
    };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        14: await DE14(data),
        22: await DE22(data),
        24: await DE24('Original Financial Request / Advice'),
        25: await DE25(data),
        41: await DE41(data),
        42: await DE42(data),
        49: await DE49(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('manual_fallback_purchase_request'), DE };
};

/* 
  Network Management - 0800
*/
exports._merchant_log_on_request = async function _merchant_log_on_request(_) {
    let data = { ..._, trans_desc: getTranDesc('_merchant_log_on_request') };
    let DE = {
        3: await DE3(data),
        7: await DE7(data),
        11: await DE11(data),
        24: await DE24('Sign-On'),
        41: await DE41(data),
        42: await DE42(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('_merchant_log_on_request'), DE };
};
exports._merchant_log_off_request = async function _merchant_log_off_request(_) {
    let data = { ..._, trans_desc: getTranDesc('_merchant_log_off_request') };
    let DE = {
        3: await DE3(data),
        7: await DE7(data),
        11: await DE11(data),
        24: await DE24('Sign-Off'),
        41: await DE41(data),
        42: await DE42(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('_merchant_log_off_request'), DE };
};
exports._echo_test = async function _echo_test(_) {
    let data = { ..._, trans_desc: getTranDesc('_echo_test') };
    let DE = {
        3: await DE3(data),
        7: await DE7(data),
        11: await DE11(data),
        24: await DE24('Echo Test'),
        41: await DE41(data),
        42: await DE42(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('_echo_test'), DE };
};
exports.network_key_change_request = async function network_key_change_request(_) {
    let data = { ..._, trans_desc: getTranDesc('network_key_change_request') };
    let DE = {
        3: await DE3(data),
        7: await DE7(data),
        11: await DE11(data),
        24: await DE24('Key Change'),
        41: await DE41(data),
        42: await DE42(data),
        63: await DE63(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('network_key_change_request'), DE };
};
exports.network_mac_key_change_request = async function network_mac_key_change_request(_) {
    let data = {
        ..._,
        trans_desc: getTranDesc('network_mac_key_change_request'),
    };
    let DE = {
        3: await DE3(data),
        7: await DE7(data),
        11: await DE11(data),
        24: await DE24('MAC Key Change'),
        41: await DE41(data),
        42: await DE42(data),
        63: await DE63(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('network_mac_key_change_request'), DE };
};
exports.network_cutover_request = async function network_cutover_request(_) {
    let data = { ..._, trans_desc: getTranDesc('network_cutover_request') };
    let DE = {
        3: await DE3(data),
        7: await DE7(data),
        11: await DE11(data),
        24: await DE24('Cutover'),
        41: await DE41(data),
        42: await DE42(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('network_cutover_request'), DE };
};

/* 
  Authorization Messages - 0100
*/
exports.balance_inquiry_request = async function balance_inquiry_request(_) {
    let data = { ..._, trans_desc: getTranDesc('balance_inquiry_request') };
    let emvData = null;
    if (data?.['Entry Mode'] == 1) {
        emvData = null;
    } else {
        emvData = data?.EMVData;
    }

    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        14: '271111',
        // TODO: Needs to be changed from BPC End
        // 14: await DE14(data),
        22: await DE22(data),
        24: await DE24('Original Authorization Request'),
        25: await DE25(data),
        35: await DE35(data),
        41: await DE41(data),
        42: await DE42(data),
        49: await DE49(data),
        52: await DE52(data),
        55: emvData,
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('balance_inquiry_request'), DE };
};
exports.check_card_request = async function check_card_request(_) {
    let data = { ..._, trans_desc: getTranDesc('check_card_request') };
    let emvData = null;
    if (data?.['Entry Mode'] == 1) {
        emvData = null;
    } else {
        emvData = data?.EMVData;
    }

    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        14: '2711',
        // TODO: Needs to be changed from BPC End
        // 14: await DE14(data),
        22: await DE22(data),
        24: await DE24('Original Authorization Request'),
        25: await DE25(data),
        35: await DE35(data),
        41: await DE41(data),
        42: await DE42(data),
        52: await DE52(data),
        55: emvData,
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('check_card_request'), DE };
};
exports.pin_change_request = async function pin_change_request(_) {
    let data = { ..._, trans_desc: getTranDesc('pin_change_request') };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        14: '261111',
        // TODO: FIX THIS from bpc it is of length 6 need to change it to length 4
        // 14: await DE14(data),
        22: await DE22(data),
        24: await DE24('Original Authorization Request'),
        25: await DE25(data),
        35: await DE35(data),
        37: await DE37(data),
        41: await DE41(data),
        42: await DE42(data),
        48: await DE48(data),
        52: await DE52(data),
        55: await DE55(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('pin_change_request'), DE };
};
exports.pin_change_confirm_request = async function pin_change_confirm_request(_) {
    let data = { ..._, trans_desc: getTranDesc('pin_change_confirm_request') };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        14: '261111',
        // 14: await DE14(data),
        22: await DE22(data),
        24: await DE24('Original Authorization Request'),
        25: await DE25(data),
        35: await DE35(data),
        37: await DE37(data),
        41: await DE41(data),
        42: await DE42(data),
        55: await DE55(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('pin_change_confirm_request'), DE };
};

/* 
  Financial Messages - 0200
*/
exports.purchase_request = async function purchase_request(_) {
    let data = { ..._, trans_desc: getTranDesc('purchase_request') };
    let emvData = null;
    if (data?.['Entry Mode'] == 1 || data.EMVData == '') {
        emvData = null;
    } else {
        emvData = data?.EMVData;
    }

    // const de55 = await DE55(data);

    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        14: await DE14(data),
        22: await DE22(data),
        24: await DE24('Original Financial Request'),
        25: await DE25(data),
        35: await DE35(data),
        41: await DE41(data),
        42: await DE42(data),
        48: await DE48(data),
        49: await DE49(data),
        52: await DE52(data),
        55: emvData,
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    console.log('DATAELEMENTS:::', JSON.stringify(DE, null, 2));

    return { mti: getMti('purchase_request'), DE };
};
exports.purchase_with_tips_request = async function purchase_with_tips_request(_) {
    let data = { ..._, trans_desc: getTranDesc('purchase_with_tips_request') };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Original Financial Request'),
        25: await DE25(data),
        35: await DE35(data),
        41: await DE41(data),
        42: await DE42(data),
        48: await DE48(data),
        49: await DE49(data),
        52: await DE52(data),
        54: await DE54(data),
        55: await DE55(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('purchase_with_tips_request'), DE };
};
exports.manual_purchase_request = async function manual_purchase_request(_) {
    let data = { ..._, trans_desc: getTranDesc('manual_purchase_request') };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        14: await DE14(data),
        22: await DE22(data),
        24: await DE24('Original Financial Request'),
        25: await DE25(data),
        41: await DE41(data),
        42: await DE42(data),
        49: await DE49(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    console.log({ DE });

    return { mti: getMti('manual_purchase_request'), DE };
};
exports.utility_payment_request = async function utility_payment_request(_) {
    let data = { ..._, trans_desc: getTranDesc('utility_payment_request') };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Original Financial Request'),
        25: await DE25(data),
        35: await DE35(data),
        41: await DE41(data),
        42: await DE42(data),
        48: await DE48(data),
        49: await DE49(data),
        52: await DE52(data),
        55: await DE55(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('utility_payment_request'), DE };
};
exports.p2p_transfer_merchant_initiated_p2p_transfer_request = async function p2p_transfer_merchant_initiated_p2p_transfer_request(_) {
    let data = {
        ..._,
        trans_desc: getTranDesc('p2p_transfer_merchant_initiated_p2p_transfer_request'),
    };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Original Financial Request'),
        25: await DE25(data),
        34: await DE34(data),
        35: await DE35(data),
        41: await DE41(data),
        42: await DE42(data),
        48: await DE48(data),
        49: await DE49(data),
        52: await DE52(data),
        55: await DE55(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return {
        mti: getMti('p2p_transfer_merchant_initiated_p2p_transfer_request'),
        DE,
    };
};
exports.p2p_credit_request = async function p2p_credit_request(_) {
    let data = { ..._, trans_desc: getTranDesc('p2p_credit_request') };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Original Financial Request'),
        25: await DE25(data),
        34: await DE34(data),
        35: await DE35(data),
        41: await DE41(data),
        42: await DE42(data),
        48: await DE48(data),
        49: await DE49(data),
        52: await DE52(data),
        55: await DE55(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('p2p_credit_request'), DE };
};
exports.cash_advance_request = async function cash_advance_request(_) {
    let data = { ..._, trans_desc: getTranDesc('cash_advance_request') };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Original Financial Request'),
        25: await DE25(data),
        35: await DE35(data),
        41: await DE41(data),
        42: await DE42(data),
        46: await DE46(data),
        49: await DE49(data),
        52: await DE52(data),
        55: await DE55(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('cash_advance_request'), DE };
};
exports.pre_authorization_request = async function pre_authorization_request(_) {
    let data = { ..._, trans_desc: getTranDesc('pre_authorization_request') };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Original Financial Request'),
        25: await DE25(data),
        35: await DE35(data),
        41: await DE41(data),
        42: await DE42(data),
        48: await DE48(data),
        49: await DE49(data),
        52: await DE52(data),
        55: await DE55(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('pre_authorization_request'), DE };
};
exports.pre_authorization_completion_request = async function pre_authorization_completion_request(_) {
    let data = {
        ..._,
        trans_desc: getTranDesc('pre_authorization_completion_request'),
    };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Original Financial Request'),
        25: await DE25(data),
        35: await DE35(data),
        37: await DE37(data),
        41: await DE41(data),
        42: await DE42(data),
        49: await DE49(data),
        52: await DE52(data),
        55: await DE55(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('pre_authorization_completion_request'), DE };
};
exports.purchase_with_cashback_request = async function purchase_with_cashback_request(_) {
    let data = {
        ..._,
        trans_desc: getTranDesc('purchase_with_cashback_request'),
    };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Original Financial Request'),
        25: await DE25(data),
        35: await DE35(data),
        41: await DE41(data),
        42: await DE42(data),
        49: await DE49(data),
        52: await DE52(data),
        54: await DE54(data),
        55: await DE55(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('purchase_with_cashback_request'), DE };
};
exports.return_refund_request = async function return_refund_request(_) {
    let data = { ..._, trans_desc: getTranDesc('return_refund_request') };

    let emvData = null;
    if (data?.['Entry Mode'] == 1) {
        emvData = null;
    } else {
        emvData = data?.EMVData;
    }

    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Original Financial Request'),
        25: await DE25(data),
        35: await DE35(data),
        37: await DE37(data),
        41: await DE41(data),
        42: await DE42(data),
        49: await DE49(data),
        52: await DE52(data),
        55: emvData,
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('return_refund_request'), DE };
};
exports.return_cancellation_request = async function return_cancellation_request(_) {
    let data = { ..._, trans_desc: getTranDesc('return_cancellation_request') };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Original Financial Request'),
        25: await DE25(data),
        35: await DE35(data),
        37: await DE37(data),
        41: await DE41(data),
        42: await DE42(data),
        48: await DE48(data),
        49: await DE49(data),
        52: await DE52(data),
        55: await DE55(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('return_cancellation_request'), DE };
};
exports.pos_cash_deposit_request = async function pos_cash_deposit_request(_) {
    let data = { ..._, trans_desc: getTranDesc('pos_cash_deposit_request') };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Original Financial Request'),
        25: await DE25(data),
        35: await DE35(data),
        41: await DE41(data),
        42: await DE42(data),
        49: await DE49(data),
        52: await DE52(data),
        55: await DE55(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('pos_cash_deposit_request'), DE };
};
exports.purchase_cash_advance_purchase_with_cashback_return_pos_cash_deposit_trickle_feed_request =
    async function purchase_cash_advance_purchase_with_cashback_return_pos_cash_deposit_trickle_feed_request(_) {
        let data = {
            ..._,
            trans_desc: getTranDesc('purchase_cash_advance_purchase_with_cashback_return_pos_cash_deposit_trickle_feed_request'),
        };
        let DE = {
            2: await DE2(data),
            3: await DE3(data),
            4: await DE4(data),
            7: await DE7(data),
            11: await DE11(data),
            12: await DE12(data),
            14: await DE14(data),
            22: await DE22(data),
            24: await DE24('Original Financial Request'),
            25: await DE25(data),
            35: await DE35(data),
            38: '000000',
            // 38: await DE38(data),
            41: await DE41(data),
            42: await DE42(data),
            48: await DE48(data),
            49: await DE49(data),
            52: await DE52(data),
            54: await DE54(data),
            55: await DE55(data),
            64: await DE64(data),
        };

        DE = { ...temp, ...DE };

        return {
            mti: getMti('purchase_cash_advance_purchase_with_cashback_return_pos_cash_deposit_trickle_feed_request'),
            DE,
        };
    };
exports.issuer_driven_installment_confirmation_request = async function issuer_driven_installment_confirmation_request(_) {
    let data = {
        ..._,
        trans_desc: getTranDesc('issuer_driven_installment_confirmation_request'),
    };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        14: await DE14(data),
        22: await DE22(data),
        24: await DE24('Original Financial Request'),
        25: await DE25(data),
        35: await DE35(data),
        37: await DE37(data),
        41: await DE41(data),
        42: await DE42(data),
        48: await DE48(data),
        49: await DE49(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return {
        mti: getMti('issuer_driven_installment_confirmation_request'),
        DE,
    };
};
exports.loyalty_purchase_request = async function loyalty_purchase_request(_) {
    let data = { ..._, trans_desc: getTranDesc('loyalty_purchase_request') };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Original Financial Request'),
        25: await DE25(data),
        35: await DE35(data),
        41: await DE41(data),
        42: await DE42(data),
        49: await DE49(data),
        52: await DE52(data),
        55: await DE55(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('loyalty_purchase_request'), DE };
};
exports.funds_transfer_request = async function funds_transfer_request(_) {
    let data = { ..._, trans_desc: getTranDesc('funds_transfer_request') };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Original Financial Request'),
        25: await DE25(data),
        35: await DE35(data),
        41: await DE41(data),
        42: await DE42(data),
        48: await DE48(data),
        49: await DE49(data),
        52: await DE52(data),
        55: await DE55(data),
        64: await DE64(data),
        102: await DE102(data),
        103: await DE103(data),
        128: await DE128(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('funds_transfer_request'), DE };
};

/* 
  File Action Messages - 0300
*/
exports.batch_upload = async function purchase_reversal_request(_) {
    let data = { ..._, trans_desc: getTranDesc('purchase_reversal_request') };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        14: '261111',
        // 14: await DE14(data),
        22: await DE22(data),
        24: await DE24('Original Financial Request'),
        25: await DE25(data),
        35: await DE35(data),
        37: await DE37(data),
        41: await DE41(data),
        42: await DE42(data),
        49: await DE49(data),
        52: await DE52(data),
        54: await DE54(data),
        55: await DE55(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('purchase_reversal_request'), DE };
};
exports.stop_list_inquiry_request = async function stop_list_inquiry_request(_) {
    let data = { ..._, trans_desc: getTranDesc('stop_list_inquiry_request') };
    let DE = {
        3: await DE3(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        41: await DE41(data),
        42: await DE42(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('stop_list_inquiry_request'), DE };
};
exports.dcc_availability_request = async function dcc_availability_request(_) {
    let data = { ..._, trans_desc: getTranDesc('dcc_availability_request') };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('DCC Information Request'),
        25: await DE25(data),
        41: await DE41(data),
        42: await DE42(data),
        49: await DE49(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('dcc_availability_request'), DE };
};

/* 
  Reversal and Chargeback Messages- 0400
*/
exports.purchase_reversal_request = async function purchase_reversal_request(_) {
    let data = { ..._, trans_desc: getTranDesc('purchase_reversal_request') };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Reversal, Transaction Did Not Complete as Approved'),
        25: await DE25(data),
        35: await DE35(data),
        37: await DE37(data),
        41: await DE41(data),
        42: await DE42(data),
        48: await DE48(data),
        49: await DE49(data),
        55: await DE55(data),
        64: await DE64(data),
        // TODO: Need to fix these fields for reversals
        // 95: await DE95(data),
        // 128: await DE128(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('purchase_reversal_request'), DE };
};
exports.cash_advance_reversal_request = async function cash_advance_reversal_request(_) {
    let data = {
        ..._,
        trans_desc: getTranDesc('cash_advance_reversal_request'),
    };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Reversal, Transaction Did Not Complete as Approved'),
        25: await DE25(data),
        35: await DE35(data),
        37: await DE37(data),
        41: await DE41(data),
        42: await DE42(data),
        48: await DE48(data),
        49: await DE49(data),
        55: await DE55(data),
        64: await DE64(data),

        // TODO: Need to fix these fields for reversals
        // 95: await DE95(data),
        // 128: await DE128(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('cash_advance_reversal_request'), DE };
};
exports.return_reversal_request = async function return_reversal_request(_) {
    let data = { ..._, trans_desc: getTranDesc('return_reversal_request') };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Reversal, Transaction Did Not Complete as Approved'),
        25: await DE25(data),
        35: await DE35(data),
        37: await DE37(data),
        41: await DE41(data),
        42: await DE42(data),
        48: await DE48(data),
        49: await DE49(data),
        55: await DE55(data),
        64: await DE64(data),

        // TODO: Need to fix these fields for reversals
        // 95: await DE95(data),
        // 128: await DE128(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('return_reversal_request'), DE };
};
exports.pos_cash_deposit_reversal_request = async function pos_cash_deposit_reversal_request(_) {
    let data = {
        ..._,
        trans_desc: getTranDesc('pos_cash_deposit_reversal_request'),
    };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Reversal, Transaction Did Not Complete as Approved'),
        25: await DE25(data),
        35: await DE35(data),
        37: await DE37(data),
        41: await DE41(data),
        42: await DE42(data),
        48: await DE48(data),
        49: await DE49(data),
        55: await DE55(data),
        64: await DE64(data),
        // TODO: Need to fix these fields for reversals
        // 95: await DE95(data),
        // 128: await DE128(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('pos_cash_deposit_reversal_request'), DE };
};
exports.pre_authorization_reversal_request = async function pre_authorization_reversal_request(_) {
    let data = {
        ..._,
        trans_desc: getTranDesc('pre_authorization_reversal_request'),
    };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Reversal, Transaction Did Not Complete as Approved'),
        25: await DE25(data),
        35: await DE35(data),
        37: await DE37(data),
        41: await DE41(data),
        42: await DE42(data),
        48: await DE48(data),
        49: await DE49(data),
        55: await DE55(data),
        64: await DE64(data),

        // TODO: Need to fix these fields for reversals
        // 95: await DE95(data),
        // 128: await DE128(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('pre_authorization_reversal_request'), DE };
};
exports.pre_authorization_completion_reversal_request = async function pre_authorization_completion_reversal_request(_) {
    let data = {
        ..._,
        trans_desc: getTranDesc('pre_authorization_completion_reversal_request'),
    };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Reversal, Transaction Did Not Complete as Approved'),
        25: await DE25(data),
        35: await DE35(data),
        37: await DE37(data),
        41: await DE41(data),
        42: await DE42(data),
        48: await DE48(data),
        49: await DE49(data),
        55: await DE55(data),
        64: await DE64(data),
        // TODO: Need to fix these fields for reversals
        // 95: await DE95(data),
        // 128: await DE128(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('pre_authorization_completion_reversal_request'), DE };
};
exports.pin_change_reversal_request = async function pin_change_reversal_request(_) {
    let data = { ..._, trans_desc: getTranDesc('pin_change_reversal_request') };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        14: '261111',
        // TODO: Need to change the field to length 4 instead of 6 from bpc
        // 14: await DE14(data),
        22: await DE22(data),
        24: await DE24('Reversal, Transaction Did Not Complete as Approved'),
        25: await DE25(data),
        35: await DE35(data),
        37: await DE37(data),
        41: await DE41(data),
        42: await DE42(data),
        48: await DE48(data),
        55: await DE55(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('pin_change_reversal_request'), DE };
};
exports.reversal_trickle_feed_request = async function reversal_trickle_feed_request(_) {
    let data = {
        ..._,
        trans_desc: getTranDesc('reversal_trickle_feed_request'),
    };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Reversal, Transaction Did Not Complete as Approved'),
        25: await DE25(data),
        35: await DE35(data),
        37: await DE37(data),
        41: await DE41(data),
        42: await DE42(data),
        48: await DE48(data),
        49: await DE49(data),
        54: await DE54(data),
        64: await DE64(data),
        // TODO: Need to fix the following for reversal
        // 95: await DE95(data),
        // 128: await DE128(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('reversal_trickle_feed_request'), DE };
};
exports.automatic_reversal_request = async function automatic_reversal_request(_) {
    let data = { ..._, trans_desc: getTranDesc('automatic_reversal_request') };
    let DE = {
        2: await DE2(data),
        3: await DE3(data),
        4: await DE4(data),
        7: await DE7(data),
        11: await DE11(data),
        12: await DE12(data),
        22: await DE22(data),
        24: await DE24('Reversal, Transaction Did Not Complete as Approved'),
        25: await DE25(data),
        35: await DE35(data),
        41: await DE41(data),
        42: await DE42(data),
        48: await DE48(data),
        49: await DE49(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('automatic_reversal_request'), DE };
};

/* 
  Reconciliation Messages - 0500
*/
exports.acquirer_reconciliation_advice = async function acquirer_reconciliation_advice(_) {
    let data = {
        ..._,
        trans_desc: getTranDesc('acquirer_reconciliation_advice'),
    };
    const transactions = [
        {
            operationType: 'debit',
            amount: 100,
            isReversal: false,
            isDcc: false,
            posAcquirerFee: 2,
        },
        {
            operationType: 'credit',
            amount: 50,
            isReversal: false,
            isDcc: false,
        },
    ];
    let DE = {
        5: await DE5(transactions),
        11: await DE11(data),
        15: await DE15(),
        24: await DE24('Request for Reconciliation Totals'),
        41: await DE41(data),
        42: await DE42(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('acquirer_reconciliation_advice'), DE };
};
exports.acquirer_reconciliation_trailer = async function acquirer_reconciliation_trailer(_) {
    let data = {
        ..._,
        trans_desc: getTranDesc('acquirer_reconciliation_trailer'),
    };

    let DE = {
        3: await DE3(data),
        11: await DE11(data),
        15: await DE15(),
        24: await DE24('Request for Reconciliation Totals'),
        41: await DE41(data),
        42: await DE42(data),
        64: await DE64(data),
    };

    DE = { ...temp, ...DE };

    return { mti: getMti('acquirer_reconciliation_trailer'), DE };
};
