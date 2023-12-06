const iso8583 = require("./iso8583");
const emv = require("node-emv");
const mappings = require("./iso8583mappings.json");
// const crypto = require("crypto");
const moment = require("moment");

const parseCardType = (card_type) => {
  card_type = card_type?.toLowerCase();
  if (card_type?.includes("interac")) {
    return "debit";
  } else if (card_type?.includes("visa") || card_type?.includes("mastercard")) {
    if (card_type?.includes("debit")) {
      return "debit";
    } else {
      return "credit";
    }
  } else {
    return card_type; //unknown card type
  }
};
module.exports = {
  isEmpty: (payload) => {
    return (
      payload &&
      Object.keys(payload).length === 0 &&
      Object.getPrototypeOf(payload) === Object.prototype
    );
  },
  clean: (obj) => {
    Object.entries(obj).forEach(([k, v]) => {
      if (v && typeof v === "object") {
        module.exports.clean(v);
      }
      if (
        (v && typeof v === "object" && !Object.keys(v).length) ||
        v === null ||
        v === undefined
      ) {
        if (Array.isArray(obj)) {
          obj.splice(k, 1);
        } else {
          delete obj[k];
        }
      }
    });
    return obj;
  },
  generateInvoiceNo: async (batch_number) => {
    // let prev = await SALE.findOne({
    //   created_at: -1,
    //   is_auto_invoice: true,
    //   batch_number,
    // }).select("invoice_number");

    //create your own logic to find the most recent sale and then set the invoice number accordingly
    let prev = null;
    if (prev) {
      return Number(prev.invoice_number) + 1;
    } else {
      return 1;
    }
  },
  decryptEMV: (encrypted) => {
    const getConvertedValue = (value, type, length) => {
      const hex2ascii = (hex) => {
        let str = "";
        for (let i = 0; i < hex.length; i += 2) {
          str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str.trim();
      };
      const hex2bin = (hex) => {
        return (parseInt(hex, 16).toString(2) + "00000000").slice(0, 8);
      };
      const hex2dec = (hex) => {
        return hex.length === 6 ? hex : parseInt(hex.substr(0, length), 16);
      };
      switch (type) {
        case "ans":
          return hex2ascii(value);
        case "n":
          return hex2dec(value);
        case "an":
          return hex2ascii(value);
        case "b":
          return hex2bin(value);
        default:
          return value;
      }
    };
    let mapped_data = {};
    emv.parse(encrypted, (data) => {
      for (let i = 0; i < data.length; i++) {
        mapped_data[
          mappings
            .find(({ tag: _tag }) => data[i].tag === _tag)
            .name.replace(/ /g, "_")
            .toLocaleLowerCase()
        ] = getConvertedValue(
          data[i].value,
          mappings.find(({ tag: _tag }) => data[i].tag === _tag).type,
          mappings.find(({ tag: _tag }) => data[i].tag === _tag).length
        );
      }
    });
    mapped_data["application_label"] = parseCardType(
      mapped_data["application_label"]
    );
    return mapped_data;
  },
  getIsoMessageFromJson: (data) => {
    const { device_data } = data;
    let iso = new iso8583();
    let { message, is_valid } = iso.convertToISO8583(device_data);
    return { is_message_valid: is_valid, converted: message };
  },
  getJsonFromIsoMessage: (data) => {
    let iso = new iso8583();
    let buf = Buffer.from(data);
    let json = iso.convertToRawData(buf);
    return iso.convertToReadable(json);
  },
  getFunctionsForMTI: (mti) => {
    if (!mti) return [];
    let iso = new iso8583();
    return iso.getFunctionsForMTI(mti);
  },
  getDataSampleForFunction: (function_name) => {
    if (!function_name)
      return {
        mti: "",
        bitmap: "",
        dataElements: [],
      };
    let iso = new iso8583();
    return iso.getDataSampleForFunction(function_name);
  },
  formatIsoError: (error) => {
    //extract the number after the "field"
    if (!error.includes("field")) {
      return { message: error, field: {} };
    }
    let iso = new iso8583();
    let field = error.split(" field ")[1].split(":")[0];
    field = iso.getFieldInfo(field);
    return { message: error, field: field };
  },
  objToArray: (data, arr = []) => {
    Object.entries(data).forEach(([title, state]) => {
      if (Array.isArray(state)) {
        arr.push({
          title,
          data: state,
        });
      } else {
        let hasObject = false;
        Object.entries(state).forEach(([subTitle, subState]) => {
          hasObject = true;
          if (!Array.isArray(subState) && typeof subState === "object") {
            module.exports.objToArray({ [subTitle]: subState }, arr);
            delete state[subTitle];
          }
        });
        arr.push({
          title,
          ...state,
        });
      }
    });

    return arr;
  },
  maskCardNumber: (length, maskCharacter) => {
    let mask = "";
    for (let i = 0; i <= length; i++) {
      mask += maskCharacter;
    }
    return mask;
  },
  genRandom: (length) => {
    let zero = "";
    for (let index = 0; index < length; index++) {
      zero += "0";
    }

    let firstVal = 1 + zero;
    let secondVal = 9 + zero;

    return Math.floor(Number(firstVal) + Math.random() * Number(secondVal));
  },
  identifyCardNumber: (cardNumber) => {
    let cardType = "";
    if (cardNumber.match(/^4[0-9]{12}(?:[0-9]{3})?$/)) {
      cardType = "visa";
    } else if (cardNumber.match(/^5[1-5][0-9]{14}$/)) {
      cardType = "mastercard";
    } else if (cardNumber.match(/^3[47][0-9]{13}$/)) {
      cardType = "amex";
    } else if (cardNumber.match(/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/)) {
      cardType = "dinersclub";
    } else if (cardNumber.match(/^6(?:011|5[0-9]{2})[0-9]{12}$/)) {
      cardType = "discover";
    } else if (cardNumber.match(/^(?:2131|1800|35\d{3})\d{11}$/)) {
      cardType = "jcb";
    } else if (cardNumber.match(/^62[0-9]{14,17}$/)) {
      cardType = "unionpay";
    } else if (cardType === "") {
      cardType = "unknown";
    }
    return cardType.toUpperCase();
  },
  commonReceipt: (id) => {
    let order;
    // order = await SALE.findById(id).lean();
    //TODO: write a function to get order from frontend transactions
    if (!order) {
      throw {
        code: 404,
        message: "order not found",
      };
    }

    const user = require("./user.json");

    if (user) {
      if (!user?.user_type) {
        user.user_type = "PLASTK";
      }
      user.user_type = String(user?.user_type).toUpperCase();
    }

    let compress_id = (id) => {
      let hash = "sha256";
      // let hash = crypto.createHash("sha256");
      hash.update(id);
      return hash.digest("hex").substring(0, 10);
    };

    let _id = compress_id(order?._id.toString());
    order = { ...order, _id };

    let data = { order, user };

    let createUniqueTraceNumber = (_id) => {
      let hash = "sha256";
      // let hash = crypto.createHash("sha256");
      hash.update(_id);
      let hashDigest = hash.digest("hex");
      let number = parseInt(hashDigest, 16);
      let traceNumber = number % 1000000;
      return traceNumber;
    };

    let date = moment(data?.created_at)
      .utcOffset("-0500")
      .format("DD/MM/YYYY HH:MM:SS");

    let split = {
      created_at: date,
      date: {
        t: date.split(" ")[1],
        d: date.split(" ")[0],
      },
      type: "SPLIT",
      account: String(user.user_type ?? "PLASTK").toUpperCase(),
      store_address1: "35 CROSSING NW",
      store_address2: "CALGARY, AB, T3R 0S4",
      store_type: "INSTORE",
      store_phone_no: "44858557894",
      store_category: "Restaurants",
      cash: 0,
      points: 0,
      plastk_auth_code: order?.auth_codes?.plastk_auth_code ?? genRandom(6),
      transaction_auth: order?.auth_codes?.transaction_auth ?? genRandom(6),
      user_type: String(user?.user_type ?? "PLASTK").toUpperCase(),
      card_type: order?.card_type,
      card_number: order?.card_number,
      store_name: "Personal Store",
      merchant: "Plastk",
      trace_id: createUniqueTraceNumber(id),
      total_amount:
        +order?.sale_amount +
        +(order?.tip_amount ? order?.tip_amount : 0) +
        +(order?.surcharge_amount ? order?.surcharge_amount : 0) +
        +(order?.cashback_amount ? order?.surcharge_amount : 0),
    };
    if (order.type === "DEBIT") {
      split.account_type = order.account_type === "chequing" ? "CHQ" : "SAV";
    }
    split.cash = 456;
    const batch = "0001";
    const transaction = data.transaction_no;
    const orderDate = moment(data?.order?.created_at).format("DD/MM/YYYY");
    const orderTime = moment(data?.order?.created_at).format("HH:MM:SS");
    delete user.password;
    return {
      split,
      data,
      compress_id,
      batch,
      transaction,
      user,
      order,
      orderDate,
      orderTime,
    };
  },
};
