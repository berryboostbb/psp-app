const { getParsedEMV } = require('./main');
const { parse, unparse } = require('./main');

/**
 * Primary Account Number
 * llvar n.. 19
 * @param {*} data
 * @description This field contains the cardholder’s card number.
 */
exports.DE2 = data =>
    new Promise((resolve, reject) => {
        if (!data.PAN) reject('PAN is required : D2');
        resolve(data.PAN);
    });

/**
 * Processing Code
 * n 6
 * @param {*} data
 * @description The processing code is a series of three two-byte codes. The first two bytes (bytes 1 and 2) indicate the
 * type of transaction.
 * The second and third two bytes (bytes 3 and 4, and bytes 5 and 6) indicate the account 1 and account 2
 * type, respectively .
 */
exports.DE3 = data =>
    new Promise((resolve, reject) => {
        const { account_desc = 'default', trans_desc = 'purchase' } = data;
        const twoByteAcc = {
            default: '00',
            savings: '10',
            checking: '20',
            checking1: '21',
            credit: '30',
            loyalty: '60',
            loyalty1: '91',
            loyalty2: '92',
        };
        const twoByteFunc = {
            purchase: '00',
            cash_advance: '01',
            debit_adjustment: '02',
            purchase_with_cash_disbursement: '09',
            pos_quasi_cash: '11',
            pos_purchase_with_electronic_certificate: '13',
            installment_purchase: '16',
            loyalty_purchase: '17',
            p2p_debit: '18',
            tips_adjustment: '19',
            return_or_refund: '20',
            credit_adjustment: '22',
            cash_deposit: '21',
            pos_return_refund_with_electronic_certificate: '23',
            p2p_credit: '29',
            balance_inquiry: '31',
            check_card: '37',
            mini_statement: '38',
            funds_transfer: '40',
            p2p_transfer: '49',
            utility_payment: '50',
            merchant_initiated_p2p_transfer: '59',
            pin_change: '79',
            pin_verification: '80',
            account_list_inquiry: '81',
            merchant_log_on: '90',
            settlement_trailer: '91',
            merchant_log_off: '92',
            pre_authorization: '93',
            pre_authorization_completion: '94',
            stop_list_inquiry: '98',
            network_management: '99',
        };
        if (!twoByteFunc[trans_desc]) {
            reject('Invalid transaction description:D3');
        }
        if (!twoByteAcc[account_desc.toLowerCase()]) {
            reject('Invalid account description:D3');
        }
        let code = `${twoByteFunc[trans_desc]}${twoByteAcc[account_desc.toLowerCase()]}00`;
        resolve(code);
    });

/**
 *Amount, Transaction
 *n 12
 * @param {*} data
 * @description This field contains the amount of the transaction. The amount is expressed in the currency of the account
 */
exports.DE4 = data =>
    new Promise((resolve, reject) => {
        let { amount } = data;
        if (!amount) reject('Amount is required : D4');
        // let d4 = Math.round(amount * 100)
        let d4 = Math.round(amount).toString().padStart(12, '0');
        resolve(d4);
    });

exports.DE5 = transactions =>
    new Promise(resolve => {
        let settlementAmount = 10;

        transactions.forEach(transaction => {
            const { operationType, amount, isReversal, isDcc, originalAmount, posAcquirerFee } = transaction;

            let transactionAmount = isDcc ? originalAmount : amount;

            if (posAcquirerFee) {
                transactionAmount += posAcquirerFee;
            }

            switch (operationType) {
                case 'debit':
                    if (isReversal) {
                        settlementAmount -= transactionAmount;
                    } else {
                        settlementAmount += transactionAmount;
                    }
                    break;
                case 'credit':
                    if (isReversal) {
                        settlementAmount += transactionAmount;
                    } else {
                        settlementAmount -= transactionAmount;
                    }
                    break;
            }
        });

        const sign = settlementAmount >= 0 ? 'D' : 'C';
        const absSettlementAmount = Math.abs(settlementAmount).toFixed(2).padStart(12, '0');

        resolve(`${sign}${absSettlementAmount}`);
        // if (!amount) reject('Amount is required : D4');
    });

/**
 * Date and Time, Transmission
 * n 10 (MMDDhhmmss)
 * @description Date and time this message was sent by the message initiator. To be expressed in Coordinated Universal
 * Time (UTC); formerly known as Greenwich Mean Time (GMT)
 */
exports.DE7 = () =>
    new Promise(resolve => {
        let date = new Date();
        let d7 = date.toISOString().slice(5, 19).replace(/-/g, '').replace(/:/g, '').replace('T', '');
        resolve(d7);
    });

/**
 * Systems Trace Audit Number
 * n 6 (000001-999999)
 * @description A number assigned by a transaction originator to assist in identifying a transaction uniquely. The trace
 * number remains unchanged for all messages within the transaction.
 */
exports.DE11 = data =>
    new Promise((resolve, reject) => {
        let { san = 0 } = data;
        san = parseInt(san);
        if (san > 999999) reject('san is invalid : D11');
        let d11 = san.toString().padStart(6, '0');
        resolve(d11);
    });

/**
 * Time, Local Transaction
 * n 12 (YYMMDDhhmmss)
 * @description Time when the transaction was initiated by the card acceptor.
 */
exports.DE12 = () =>
    new Promise(resolve => {
        let date = new Date();
        let d12 = date.toISOString().slice(2, 19).replace(/-/g, '').replace(/:/g, '').replace('T', '');
        resolve(d12);
    });

/**
 * Date, Expiration
 * n 4 (YYMM) or n 6 (YYMMDD)
 * @description The year, month and day that the card will become expired.
 */

exports.DE14 = data =>
    new Promise((resolve, reject) => {
        const { 'Expiry Date': expiryDate, 'Entry Mode': entry_mode } = data;
        if (!expiryDate) reject('Expiry Date is required : D14');
        let d14 = expiryDate.split('/').join('');
        // let d14 = expiryDate.slice(2, 4) + expiryDate.slice(0, 2);
        // INFO: to accomodate the default date
        // d14 = d14 + '01';
        if (entry_mode === '1') {
            resolve(null);
        } else if (entry_mode == '2') {
            d14 = d14[2] + d14[3] + d14[0] + d14[1] + '00';
            resolve(d14);
        } else if (entry_mode === 'manual') {
            let d = expiryDate.split('/');
            d14 = d[1] + d[0] + '00';
            resolve(d14);
        } else if (entry_mode === '4') {
            let d = expiryDate.split('/').join('');
            d14 = d + '00';
            resolve(d14);
        } else {
            resolve(d14);
        }
    });

exports.DE15 = () =>
    new Promise(resolve => {
        const today = new Date();
        const year = today.getFullYear().toString().slice(-2);
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');

        resolve(`${year}${month}${day}`);
    });

/**
 * Point of Service Data Code
 * n 3
 * @description The point of service data code identifies the environment of the terminal, the card reader, and the
 * cardholder.
 */
exports.DE22 = data =>
    new Promise((resolve, reject) => {
        const { cardDataInputMode = 'magnetic', cardholderAuthMethod = 'notAuthenticated' } = data;
        const codeMap = {
            manual: '01',
            magnetic: '02',
            icc: '05',
            iccFallback: '08',
            proximityICCRules: '07',
            credentialOnFile: '10',
            chipCardPanManualEntry: '79',
            panAutoEntryViaServer: '82',
            proximityMagneticStripeRules: '91',
        };
        const authMap = {
            notAuthenticated: '0',
            pin: '1',
            signatureBased: '2',
            terminalAcceptsOfflinePins: '9',
        };
        const code = codeMap[cardDataInputMode];
        const auth = authMap[cardholderAuthMethod];
        if (!code) reject('Invalid cardDataInputMode : D22');
        if (!auth) reject('Invalid cardholderAuthMethod : D22');
        const d22 = code + auth;
        resolve(d22);
    });

/**
 * Function Code
 * n 3
 * @description Code indicating the specific purpose of the message within its message class.
 */
/**
 * Returns the Function Code based on the input description.
 * @param {string} description - The description of the message type.
 * @returns {string} The Function Code corresponding to the input description, or null if the description is not recognized.
 *
 * @example
 * getFunctionCode('Original Authorization Request / Advice');
 * // Returns: '100'
 *
 * @example
 * getFunctionCode('Original Financial Request / Advice');
 * // Returns: '200'
 *
 * @example
 * getFunctionCode('Original Financial Request / Advice(Repeat)');
 * // Returns: '220'
 *
 * @example
 * getFunctionCode('DCC Information Request');
 * // Returns: '301'
 *
 * @example
 * getFunctionCode('Reversal, Transaction Did Not Complete as Approved');
 * // Returns: '400'
 *
 * @example
 * getFunctionCode('Reversal, Transaction Did Not Complete as Approved(Repeat)');
 * // Returns: '420'
 *
 * @example
 * getFunctionCode('Request for Reconciliation Totals');
 * // Returns: '504'
 *
 * @example
 * getFunctionCode('Sign-On');
 * // Returns: '801'
 *
 * @example
 * getFunctionCode('Sign-Off');
 * // Returns: '802'
 *
 * @example
 * getFunctionCode('Key Change');
 * // Returns: '811'
 *
 * @example
 * getFunctionCode('MAC Key Change');
 * // Returns: '815'
 *
 * @example
 * getFunctionCode('Cutover');
 * // Returns: '821'
 *
 * @example
 * getFunctionCode('Echo Test');
 * // Returns: '831'
 */
exports.DE24 = data =>
    new Promise((resolve, reject) => {
        const description = data;

        const de24 = description => {
            const formattedDescription = description.toLowerCase().replace(/ /g, '_').replace(/,/g, '');
            switch (formattedDescription) {
                case 'original_authorization_request':
                    return '100';
                case 'original_financial_request':
                    return '200';
                case 'dcc_information_request':
                    return '301';
                case 'reversal_transaction_did_not_complete_as_approved':
                    return '400';
                case 'request_for_reconciliation_totals':
                    return '504';
                case 'sign-on':
                    return '801';
                case 'sign-off':
                    return '802';
                case 'key_change':
                    return '811';
                case 'mac_key_change':
                    return '815';
                case 'cutover':
                    return '821';
                case 'echo_test':
                    return '831';
                default:
                    return null;
            }
        };

        if (de24(description) === null) reject('Wrong description for : D24');

        resolve(de24(description).toString());
    });

/**
 * Point of Service Condition Code
 * n 2
 * @description A code that describes the condition under which the transaction takes place at the point of service.
 */
exports.DE25 = () =>
    new Promise(resolve => {
        // const codes = {
        //     '00': 'attendant_terminal',
        //     '02': 'unattendant_terminal',
        //     '08': 'online_order',
        // };
        //by default it is attendant terminal
        resolve('00');
    });

/**
 * Primary Account Number Extended
 * llvar n.. 19
 * @description The primary account number extended field contains the primary account number (PAN) of the cardholder.
 */

exports.DE34 = data =>
    new Promise((resolve, reject) => {
        if (!data.PAN) reject('PAN is required : D34');
        resolve(data.PAN);
    });

/**
 * Track 2 Data
 * llvar n.. 37
 */
exports.DE35 = data =>
    new Promise((resolve, reject) => {
        if (data?.['Entry Mode'] == '2') {
            const { 'Track2 Data': track2Data } = data;
            if (!track2Data) reject('Track2 Data is required : D35');
            resolve(track2Data);
        } else if (data?.['Entry Mode'] != '1') {
            resolve(null);
        } else {
            const { 'Track2 Data': track2Data } = data;
            if (!track2Data) reject('Track2 Data is required : D35');
            resolve(track2Data);
        }
    });

/**
 * Retrieval Reference Number
 * anp 12
 * @description A reference supplied by the recipient of a message to the originator of the message to assist the
 * originator in identifying the transaction uniquely.
 */
exports.DE37 = data =>
    new Promise((resolve, reject) => {
        const { RRN } = data;
        if (RRN !== undefined) resolve(RRN);

        // if (!RRN) reject('RRN is required : D37');
        resolve(null);
    });

/**
 * Approval Code
 * anp 6
 * @description A code assigned by the authorizing institution indicating approval for a transaction.
 */
exports.DE38 = data =>
    new Promise((resolve, reject) => {
        const { approvalCode } = data;
        if (!approvalCode) reject('Approval Code is required : D38');
        resolve(approvalCode);
    });

/**
 * Card Acceptor Terminal Identification
 * n 8
 * @description Unique code identifying a terminal at the card acceptor location.
 * @example 12345678
 */

exports.DE41 = data =>
    new Promise((resolve, reject) => {
        const { terminal_id } = data;
        if (!terminal_id) reject('Terminal ID is required : D41');
        let d41 = terminal_id.padStart(8, '0');
        if (d41.length !== 8) reject('Invalid Terminal ID Length : D41');
        resolve(d41);
    });

/**
 * Card Acceptor Identification Code
 * n 15
 * @description Unique code assigned by the acquirer to identify the card acceptor.
 * @example 123456789012345
 */
exports.DE42 = data =>
    new Promise((resolve, reject) => {
        const { merchant_id } = data;
        if (!merchant_id) reject('Merchant ID is required : D42');
        let d42 = merchant_id.padStart(15, '0');
        if (d42.length !== 15) reject('Invalid Merchant ID Length : D42');
        resolve(d42);
    });

/**
 * Amount, fees.
 * lllvar ans 999
 * Field can contain up to six sets, each set has the following format : n2+n3+x+n8+n8+x+n8+n3
 */
exports.DE46 = () =>
    new Promise(resolve => {
        //TODO: implement this function
        resolve(null);
    });
/**
 * Additional Data – Private
 * lllvar ans 999
 * lllvar ans 999, tag data format: 3 bytes for each tag name + 3 bytes for each tag length + tag data
 */
exports.DE48 = data =>
    new Promise(resolve => {
        const { tags = {} } = data;
        if (!Object.keys(tags).length) resolve(null);
        let field48 = '';
        if (tags.feePercent) {
            field48 += '001' + ('000' + tags.feePercent.length).slice(-3) + tags.feePercent;
        }
        if (tags.newPINData) {
            field48 += '002' + ('000' + tags.newPINData.length).slice(-3) + tags.newPINData;
        }
        if (tags.serviceId) {
            field48 += '003' + ('000' + tags.serviceId.length).slice(-3) + tags.serviceId;
        }
        if (tags.customerExternalAccountNumber) {
            field48 += '004' + ('000' + tags.customerExternalAccountNumber.length).slice(-3) + tags.customerExternalAccountNumber;
        }
        if (tags.customerMobilePhoneNumber) {
            field48 += '005' + ('000' + tags.customerMobilePhoneNumber.length).slice(-3) + tags.customerMobilePhoneNumber;
        }
        if (tags.cardVerificationValue) {
            const { presenceIndicator, responseType, value } = tags.cardVerificationValue;
            const cvvValue = presenceIndicator + responseType + value;
            field48 += '013' + ('000' + cvvValue.length).slice(-3) + cvvValue;
        }
        if (tags.cvvResultCode) {
            field48 += '014' + ('000' + tags.cvvResultCode.length).slice(-3) + tags.cvvResultCode;
        }
        if (tags.cardPresenceIndicator) {
            field48 += '016' + ('000' + tags.cardPresenceIndicator.length).slice(-3) + tags.cardPresenceIndicator;
        }
        if (tags.dccInfoRequestRefNum) {
            field48 += '017' + ('000' + tags.dccInfoRequestRefNum.length).slice(-3) + tags.dccInfoRequestRefNum;
        }
        if (tags.installmentPaymentOption) {
            field48 += '019' + ('000' + tags.installmentPaymentOption.length).slice(-3) + tags.installmentPaymentOption;
        }
        if (tags.numInstallments) {
            field48 += '020' + ('000' + tags.numInstallments.length).slice(-3) + tags.numInstallments;
        }
        if (tags.maxNumInstallments) {
            field48 += '021' + ('000' + tags.maxNumInstallments.length).slice(-3) + tags.maxNumInstallments;
        }
        if (tags.interestRate) {
            field48 += '022' + ('000' + tags.interestRate.length).slice(-3) + tags.interestRate;
        }
        if (tags.installmentFee) {
            field48 += '023' + ('000' + tags.installmentFee.length).slice(-3) + tags.installmentFee;
        }
        if (tags.apr) {
            field48 += '024' + ('000' + tags.apr.length).slice(-3) + tags.apr;
        }
        if (tags.firstInstallmentAmount) {
            field48 += '025' + ('000' + tags.firstInstallmentAmount.length).slice(-3) + tags.firstInstallmentAmount;
        }
        resolve(field48);
    });

/**
 * Currency Code, Transaction
 * n 3
 * @description Indicates the currency code of the transaction according to ISO 4217.
 * default 124
 */
exports.DE49 = () =>
    new Promise(resolve => {
        resolve('124');
    });

/**
 * Personal Identification Data
 * Three fromats are supported. Format could be set in SVFE by the pid attribute 28 set for the POS format pid.
 * b 8 (Default or attribute value = ‘0’)
 * llvar an .. 16 (attribute value = ‘1’)
 * llvar b .. 8 (attribute value = ‘2’)
 */

exports.DE52 = data => {
    let result = null;
    if (data?.['Entry Mode'] == 4) result = data.PINBLOCK && data.PINBLOCK !== '' ? data.PINBLOCK : null;

    return result;
};

/**
 * Amounts, Additional
 * lllvar an ..120
 * @description This field contains additional amounts associated with the transaction.
 */
exports.DE54 = data =>
    new Promise(resolve => {
        // TODO: Need to check what is wrong with this with bpc
        resolve(null);
        let { amount = 0, account_desc = 'default' } = data;
        const twoByteAcc = {
            default: '00',
            savings: '10',
            checking: '20',
            checking1: '21',
            credit: '30',
            loyalty: '60',
            loyalty1: '91',
            loyalty2: '92',
        };
        account_desc = twoByteAcc[account_desc] || '00';
        amount = Math.round(amount * 100)
            .toString()
            .padStart(12, '0');
        let currency = '124';
        let credit_debit = amount >= 0 ? 'C' : 'D';
        // const field54 = account_desc + '00' + currency + credit_debit + amount;
        const field54 = account_desc + '58' + currency + credit_debit + amount;
        resolve(field54);
    });

/**
 * EMV Data
 * lllvar b .. 255
 * @description This field contains the EMV data.
 */
exports.DE55 = data =>
    new Promise(async (resolve, reject) => {
        // return resolve(null);
        const convertAmount = _amount =>
            Math.round(+_amount * 100)
                .toString()
                .padStart(12, '0');

        let { EMVData, amount } = data;
        let results = await new Promise(r => parse(EMVData, r));
        resolve(results);

        // let _r_tags = [
        //   "5F2A",
        //   "82",
        //   "9A",
        //   "9F02",
        //   "84",
        //   "9F03",
        //   "9F1E",
        //   "9F34",
        //   "9F41",
        // ];
        // results = results.filter(({ tag }) => !_r_tags.includes(tag));
        // let _5F2A = results.find(({ tag }) => tag === "5F2A")?.value || "0124";
        // let _82 = results.find(({ tag }) => tag === "82")?.value || "3800"; //not Sure
        // let _9A =
        //   results.find(({ tag }) => tag === "9A")?.value ||
        //   new Date().toISOString().slice(2, 10).replace(/-/g, "");
        // let _9F02 =
        //   results.find(({ tag }) => tag === "9F02")?.value || convertAmount(amount);
        // let _84 = results.find(({ tag }) => tag === "4F")?.value;
        // let _9F03 = convertAmount(0);
        // let _9F1E = data?.serial_number?.padStart(16, "0");
        // let _9F41 = data?.transaction_number?.padStart(8, "0");
        // // let _9F34 = data?.CVM?.padStart(6, '0'); //by default we get this in decimal
        // let _9F34 = Number(data?.CVM).toString(2)?.padStart(6, "0"); // using binary

        // results.push({
        //   tag: "5F2A",
        //   value: _5F2A,
        //   length: (_5F2A.length / 2).toString(16).toUpperCase().padStart(2, "0"),
        // });
        // results.push({
        //   tag: "82",
        //   value: _82,
        //   length: (_82.length / 2).toString(16).toUpperCase().padStart(2, "0"),
        // });
        // results.push({
        //   tag: "9A",
        //   value: _9A,
        //   length: (_9A.length / 2).toString(16).toUpperCase().padStart(2, "0"),
        // });
        // results.push({
        //   tag: "9F02",
        //   value: _9F02,
        //   length: (_9F02.length / 2).toString(16).toUpperCase().padStart(2, "0"),
        // });
        // results.push({
        //   tag: "84",
        //   value: _84,
        //   length: (_84.length / 2).toString(16).toUpperCase().padStart(2, "0"),
        // });
        // results.push({
        //   tag: "9F03",
        //   value: _9F03,
        //   length: (_9F03.length / 2).toString(16).toUpperCase().padStart(2, "0"),
        // });
        // results.push({
        //   tag: "9F1E",
        //   value: _9F1E,
        //   length: (_9F1E.length / 2).toString(16).toUpperCase().padStart(2, "0"),
        // });
        // results.push({
        //   tag: "9F34",
        //   value: _9F34,
        //   length: (_9F34.length / 2).toString(16).toUpperCase().padStart(2, "0"),
        // });
        // results.push({
        //   tag: "9F41",
        //   value: _9F41,
        //   length: (_9F41.length / 2).toString(16).toUpperCase().padStart(2, "0"),
        // });
        // /**
        //  * These are all the mandatory tags for EMV, if needed we can add more tags
        //  */
        // const allowed_tags = [
        //   "5F2A",
        //   "5F34",
        //   "82",
        //   "84",
        //   "95",
        //   "9A",
        //   "9C",
        //   "9F02",
        //   "9F03",
        //   "9F09",
        //   "9F10",
        //   "9F1A",
        //   "9F1E",
        //   "9F26",
        //   "9F27",
        //   "9F33",
        //   "9F34",
        //   "9F35",
        //   "9F36",
        //   "9F37",
        //   "9F41",
        // ];
        // results = results.filter(({ tag }) => allowed_tags.includes(tag));
        // results = results.filter(
        //   (v, i, a) => a.findIndex((t) => t.tag === v.tag) === i
        // );
        // //add the tags that are missing with value of null
        // allowed_tags.forEach((tag) => {
        //   if (!results.find(({ tag: _tag }) => _tag === tag)?.value) {
        //     throw new Error(`Tag ${tag} is missing, While creating DE55`);
        //   }
        // });
        // results.sort(
        //   (a, b) => allowed_tags.indexOf(a.tag) - allowed_tags.indexOf(b.tag)
        // );
        // EMVData = await new Promise((res) => unparse(results, res, true));
        // // resolve(EMVData);
        // resolve(null);
    });

/**
 * PrivateData (Project Specific)
 * lllvar an .. 999
 * @description This field contains the private data.
 */
exports.DE63 = () =>
    new Promise(resolve => {
        resolve(null);
    });

/**
 * Primary MAC Data
 * b 8
 * @description This field contains the MAC data.
 */
exports.DE64 = data =>
    new Promise((resolve, reject) => {
        let { mac } = data;
        if (!mac) reject('MAC is required : D64');
        mac = mac.toUpperCase();
        mac = mac.replace(/[^0-9A-F]/g, '');
        resolve(mac);
    });

/**
 * Replacement Amounts
 * n 12
 * @description the corrected amount of a transaction in the transaction currency. It is necessary only for partial reversals.
 */
exports.DE95 = data =>
    new Promise(resolve => {
        let { reversal_amount = 0 } = data;
        reversal_amount = Math.round(reversal_amount * 100)
            .toString()
            .padStart(12, '0');
        resolve(reversal_amount);
    });
/**
 *
 * Account Identification 1
 * llvar ans.. 32
 * @description This field is used to identification customer account if specific account should be affected by the transaction.
 *  The field is used to specify “from” account in the transfer transaction.
 */
exports.DE102 = () =>
    new Promise(resolve => {
        //TODO: check if this is required
        resolve(null);
    });
/**
 *
 * Account Identification 2
 * llvar ans.. 32
 * @description This field is used to identification customer “to” account of the transfer if specific account should be affected by the transaction.
 */
exports.DE103 = () =>
    new Promise(resolve => {
        //TODO: check if this is required
        resolve(null);
    });
/**
 *
 *Secondary MAC Data
 */
exports.DE128 = data =>
    new Promise((resolve, reject) => {
        let { mac } = data;
        if (!mac) reject('MAC is required : D64');
        mac = mac.toUpperCase();
        mac = mac.replace(/[^0-9A-F]/g, '');
        resolve(mac);
    });
