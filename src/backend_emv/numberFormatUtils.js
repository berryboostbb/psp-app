const util = {
  bytesToHex(bytes) {
    var hex = "";
    for (var i = 0; i < bytes.length; i++) {
      var b = bytes[i];
      hex += ("00" + b.toString(16)).slice(-2);
    }
    return hex;
  },
  calculateLength(data) {
    let length = data.length / 2;
    length = length.toString().padStart(4, "0");

    return length;
  },
  /**
   * Formats a financial account type slug as "00x000" format.
   *
   * @param {string} slug - The slug representing the financial account type. Valid values include "savings", "checking", "credit", "loyalty", and "offline-wallet".
   * @returns {string} The formatted account type value in "00x000" format.
   *
   * @example
   * // Returns "001000" for a savings account
   * var formatted = formatAccountType("savings");
   *
   * @example
   * // Returns "002000" for a checking account
   * var formatted = formatAccountType("checking");
   *
   * @example
   * // Returns "003000" for a credit account
   * var formatted = formatAccountType("credit");
   */
  formatAccountType(slug) {
    // Define the mappings between slugs and account type values
    var mappings = {
      savings: 1,
      checking: 2,
      credit: 3,
      loyalty: 6,
      "offline-wallet": 7,
    };

    // Get the account type value from the mappings object
    var accountType = mappings[slug] || 0;

    // Format the account type value as "00x000"
    var formatted = accountType.toString().padStart(3, "0");
    formatted = "00" + formatted + "0";

    // Return the formatted value
    return formatted;
  },
  /**
   * Formats an amount as "n 12" format.
   *
   * @param {number} amount - The amount to format.
   * @returns {string} The formatted amount in "n 12" format.
   *
   * @example
   * // Returns "0000000012.34" for amount 12.34
   * var formattedAmount = formatAmount(12.34);
   *
   * @example
   * // Returns "0000000000.00" for amount 0
   * var formattedAmount = formatAmount(0);
   */
  formatAmount(amount) {
    // Round the amount to 2 decimal places, then multiply by 100 to convert it to an integer
    var integralAmount = Math.round(amount * 100);

    // Format the integral part as "000000000000" with leading zeros
    var formattedIntegral = integralAmount.toString().padStart(12, "0");

    // Insert a decimal point at position 10 to format as "n 12" format
    var formattedN12 =
      formattedIntegral.slice(0, 10) + "." + formattedIntegral.slice(10);

    // Return an object with both formatted amounts
    return formattedIntegral;
  },
  /**
    Returns the current date and time as a string in the specified format.
    @param {string} format - The desired format for the output string. Valid formats are:
    "MMDDhhmmss": returns a string in the format MMDDhhmmss (where MM is the month, DD is the day, hh is the hour, mm is the minute, and ss is the second)
    "YYMMDDhhmmss": returns a string in the format YYMMDDhhmmss (where YY is the last two digits of the year, MM is the month, DD is the day, hh is the hour, mm is the minute, and ss is the second)
    @returns {string} - A string representing the current date and time in the specified format.
  */
  getCurrentDateTime(format) {
    var now = new Date();
    var month = String(now.getMonth() + 1).padStart(2, "0");
    var day = String(now.getDate()).padStart(2, "0");
    var hour = String(now.getHours()).padStart(2, "0");
    var minute = String(now.getMinutes()).padStart(2, "0");
    var second = String(now.getSeconds()).padStart(2, "0");

    if (format === "MMDDhhmmss") {
      return month + day + hour + minute + second;
    } else if (format === "YYMMDDhhmmss") {
      var year = String(now.getFullYear()).slice(-2);
      return year + month + day + hour + minute + second;
    } else {
      throw new Error("Invalid format specified.");
    }
  },
  generateNumber() {
    return Math.floor(Math.random() * 9000) + 1000;
  },
  /**
   * Formats a number in `n 6` format.
   *
   * @param {number} number - The number to format.
   * @returns {string} The formatted number in `n 6` format.
   *
   * @example
   * // Returns "001234" for the number 1234
   * var formattedNumber = formatN6(1234);
   */
  formatN6() {
    const number = this.generateNumber();
    var max = Math.pow(10, 6) - 1;
    var min = 0;
    var truncatedNumber = Math.min(Math.max(number, min), max);
    var formattedNumber = truncatedNumber.toString().padStart(6, "0");
    return formattedNumber;
  },
  field22(cardDataInputMode, cardholderAuthMethod) {
    const codeMap = {
      manual: "01",
      magnetic: "02",
      icc: "05",
      iccFallback: "08",
      proximityICCRules: "07",
      credentialOnFile: "10",
      chipCardPanManualEntry: "79",
      panAutoEntryViaServer: "82",
      proximityMagneticStripeRules: "91",
    };

    const authMap = {
      notAuthenticated: "0",
      pin: "1",
      signatureBased: "2",
      terminalAcceptsOfflinePins: "9",
    };

    const code = codeMap[cardDataInputMode];
    const auth = authMap[cardholderAuthMethod];

    if (!code || !auth) {
      throw new Error("Invalid input parameters");
    }

    return code + auth;
  },
  parseField48(data) {
    let tags = {};
    let i = 0;

    while (i < data.length) {
      const tag = data.substring(i, i + 3);
      const length = parseInt(data.substring(i + 3, i + 6));
      const value = data.substring(i + 6, i + 6 + length);

      if (tag === "001") {
        tags.feePercent = value;
      } else if (tag === "002") {
        tags.newPINData = value;
      } else if (tag === "003") {
        tags.serviceId = value;
      } else if (tag === "004") {
        tags.customerExternalAccountNumber = value;
      } else if (tag === "005") {
        tags.customerMobilePhoneNumber = value;
      } else if (tag === "013") {
        const presenceIndicator = value.charAt(0);
        const responseType = value.charAt(1);
        const cvvValue = value.substring(2);

        tags.cardVerificationValue = {
          presenceIndicator: presenceIndicator,
          responseType: responseType,
          value: cvvValue,
        };
      } else if (tag === "014") {
        tags.cvvResultCode = value;
      } else if (tag === "016") {
        tags.cardPresenceIndicator = value;
      } else if (tag === "017") {
        tags.dccInfoRequestRefNum = value;
      } else if (tag === "019") {
        tags.installmentPaymentOption = value;
      } else if (tag === "020") {
        tags.numInstallments = value;
      } else if (tag === "021") {
        tags.maxNumInstallments = value;
      } else if (tag === "022") {
        tags.interestRate = value;
      } else if (tag === "023") {
        tags.installmentFee = value;
      } else if (tag === "024") {
        tags.apr = value;
      } else if (tag === "025") {
        tags.firstInstallmentAmount = value;
      }

      i += 6 + length;
    }

    return tags;
  },
  /**
Generates field 48 for a payment request based on the provided tags.
@param {object} tags - An object containing various payment request tags.
@param {string} [tags.feePercent] - The fee percentage as a string.
@param {string} [tags.newPINData] - The new PIN data as a string.
@param {string} [tags.serviceId] - The service ID as a string.
@param {string} [tags.customerExternalAccountNumber] - The customer's external account number as a string.
@param {string} [tags.customerMobilePhoneNumber] - The customer's mobile phone number as a string.
@param {object} [tags.cardVerificationValue] - An object containing the presence indicator, response type, and value for the card verification value.
@param {string} [tags.cardVerificationValue.presenceIndicator] - The presence indicator for the card verification value as a string.
@param {string} [tags.cardVerificationValue.responseType] - The response type for the card verification value as a string.
@param {string} [tags.cardVerificationValue.value] - The value for the card verification value as a string.
@param {string} [tags.cvvResultCode] - The CVV result code as a string.
@param {string} [tags.cardPresenceIndicator] - The card presence indicator as a string.
@param {string} [tags.dccInfoRequestRefNum] - The DCC information request reference number as a string.
@param {string} [tags.installmentPaymentOption] - The installment payment option as a string.
@param {string} [tags.numInstallments] - The number of installments as a string.
@param {string} [tags.maxNumInstallments] - The maximum number of installments as a string.
@param {string} [tags.interestRate] - The interest rate as a string.
@param {string} [tags.installmentFee] - The installment fee as a string.
@param {string} [tags.apr] - The APR as a string.
@param {string} [tags.firstInstallmentAmount] - The amount of the first installment as a string.
@returns {string} The field 48 value as a string.
*/
  field48(tags) {
    let field48 = "";

    if (tags.feePercent) {
      field48 +=
        "001" + ("000" + tags.feePercent.length).slice(-3) + tags.feePercent;
    }

    if (tags.newPINData) {
      field48 +=
        "002" + ("000" + tags.newPINData.length).slice(-3) + tags.newPINData;
    }

    if (tags.serviceId) {
      field48 +=
        "003" + ("000" + tags.serviceId.length).slice(-3) + tags.serviceId;
    }

    if (tags.customerExternalAccountNumber) {
      field48 +=
        "004" +
        ("000" + tags.customerExternalAccountNumber.length).slice(-3) +
        tags.customerExternalAccountNumber;
    }

    if (tags.customerMobilePhoneNumber) {
      field48 +=
        "005" +
        ("000" + tags.customerMobilePhoneNumber.length).slice(-3) +
        tags.customerMobilePhoneNumber;
    }

    if (tags.cardVerificationValue) {
      const { presenceIndicator, responseType, value } =
        tags.cardVerificationValue;
      const cvvValue = presenceIndicator + responseType + value;
      field48 += "013" + ("000" + cvvValue.length).slice(-3) + cvvValue;
    }

    if (tags.cvvResultCode) {
      field48 +=
        "014" +
        ("000" + tags.cvvResultCode.length).slice(-3) +
        tags.cvvResultCode;
    }

    if (tags.cardPresenceIndicator) {
      field48 +=
        "016" +
        ("000" + tags.cardPresenceIndicator.length).slice(-3) +
        tags.cardPresenceIndicator;
    }

    if (tags.dccInfoRequestRefNum) {
      field48 +=
        "017" +
        ("000" + tags.dccInfoRequestRefNum.length).slice(-3) +
        tags.dccInfoRequestRefNum;
    }

    if (tags.installmentPaymentOption) {
      field48 +=
        "019" +
        ("000" + tags.installmentPaymentOption.length).slice(-3) +
        tags.installmentPaymentOption;
    }

    if (tags.numInstallments) {
      field48 +=
        "020" +
        ("000" + tags.numInstallments.length).slice(-3) +
        tags.numInstallments;
    }

    if (tags.maxNumInstallments) {
      field48 +=
        "021" +
        ("000" + tags.maxNumInstallments.length).slice(-3) +
        tags.maxNumInstallments;
    }

    if (tags.interestRate) {
      field48 +=
        "022" +
        ("000" + tags.interestRate.length).slice(-3) +
        tags.interestRate;
    }

    if (tags.installmentFee) {
      field48 +=
        "023" +
        ("000" + tags.installmentFee.length).slice(-3) +
        tags.installmentFee;
    }

    if (tags.apr) {
      field48 += "024" + ("000" + tags.apr.length).slice(-3) + tags.apr;
    }

    if (tags.firstInstallmentAmount) {
      field48 +=
        "025" +
        ("000" + tags.firstInstallmentAmount.length).slice(-3) +
        tags.firstInstallmentAmount;
    }

    return field48;
  },
  /**
   * Generates a mock value for the Primary MAC Data field.
   *
   * @param {number} length - The length of the MAC data in bytes.
   * @returns {string} A hexadecimal string representing the MAC data.
   */
};

module.exports = util;
