const {
  decryptEMV: _decrypt,
  generateInvoiceNo,
  genRandom,
  identifyCardNumber,
  commonReceipt,
} = require("./utils/common.js");
const moment = require("moment");
// const crypto = require("crypto");

module.exports = {
  decryptEMV: function (_p) {
    let emvDataDecrypted = {};
    if (!_p.manual) {
      if (_p?.EMVData) {
        emvDataDecrypted = _decrypt(_p.EMVData);
      } else {
        let cardholderName = _p["Track1 Data"].split("^")[1].replace("/", " ");
        let pan = _p["Track1 Data"].split("^")[0].replace("%B", "");
        let expirationDate = _p["Track1 Data"].split("^")[2].slice(0, 4);
        let serviceCode = _p["Track1 Data"]
          .split("^")[2]
          .slice(4, 7)
          .split("")[0];
        let discretionaryData = _p["Track1 Data"]
          .split("^")[2]
          .slice(7)
          .replace("?", "");
        let application_expiration_date = expirationDate + "31";
        let year = parseInt(application_expiration_date.slice(0, 2)) - 5;
        let month = application_expiration_date.split("").slice(2, 4).join("");
        let application_effective_date = `${year}${month}01`;
        emvDataDecrypted = {
          "application_primary_account_number_(pan)": pan,
          cardholder_name: cardholderName,
          application_label: "debit",
          transaction_type: _p["Pinpad Type"],
          terminal_type: _p["Entry Mode"],
          "point-of-service_(pos)_entry_mode": _p["Entry Mode"],
          language_preference: "en",
          application_expiration_date: application_expiration_date,
          application_effective_date: application_effective_date,
          service_code: serviceCode,
          "application_identifier_(adf_name)": discretionaryData,
        };
      }
    } else {
      let application_expiration_date = _p.exp_date + "31";
      let year = parseInt(application_expiration_date.slice(0, 2)) - 5;
      let month = application_expiration_date.split("").slice(2, 4).join("");
      let application_effective_date = `${year}${month}01`;
      emvDataDecrypted = {
        "application_primary_account_number_(pan)": _p.pan,
        cardholder_name: "",
        application_label: "credit",
        transaction_type: "",
        terminal_type: "01",
        "point-of-service_(pos)_entry_mode": "01",
        language_preference: "en",
        application_expiration_date: application_expiration_date,
        application_effective_date: application_effective_date,
        service_code: "",
        "application_identifier_(adf_name)": identifyCardNumber(_p.pan),
      };
    }

    return { data: { emvDataDecrypted } };
  },
  sale: function (_p) {
    const is_auto_invoice =
      _p?.invoice_number && _p?.invoice_number !== "" ? false : true;
    let batch_number = null;
    if (is_auto_invoice) {
      // let last_sale = await SALE.findOne({}).sort({ created_at: -1 });
      //TODO: Create a new scenario to get the transaction on the frontend.
      let last_sale = null;
      if (last_sale) {
        if (!last_sale.is_auto_invoice) {
          // last_sale = await SALE.findOne({ is_auto_invoice: true }).sort({ created_at: -1 });
          //TODO: Create a new scenario to get the transaction on the frontend.
          last_sale = null;
          const { batch_number: last_batch_number } = last_sale;
          if (last_batch_number) {
            const last_batch_number_number = parseInt(last_batch_number);
            const next_batch_number_number = last_batch_number_number + 1;
            const next_batch_number = next_batch_number_number
              .toString()
              .padStart(3, "0");
            batch_number = `${next_batch_number}`;
          } else {
            batch_number = "001";
          }
        } else {
          batch_number = last_sale.batch_number;
        }
      } else {
        batch_number = "001";
      }
    }

    const invoice_number =
      _p?.invoice_number && _p?.invoice_number !== ""
        ? _p?.invoice_number
        : generateInvoiceNo(batch_number);

    let data = { ..._p, invoice_number, is_auto_invoice, batch_number };

    data.reference_no = genRandom(6);
    data.transaction_no = genRandom(2);
    data.auth_codes = {
      plastk_auth_code: genRandom(6),
      transaction_auth: genRandom(6),
    };

    return { transaction: data };
  },
  refund: function (_p) {
    const is_auto_invoice =
      _p?.invoice_number && _p?.invoice_number !== "" ? false : true;
    let batch_number = null;
    if (is_auto_invoice) {
      // let last_sale = await SALE.findOne({}).sort({ created_at: -1 });
      //TODO: Create a new scenario to get the transaction on the frontend.
      if (last_sale) {
        if (!last_sale.is_auto_invoice) {
          // last_sale = await SALE.findOne({ is_auto_invoice: true }).sort({ created_at: -1 });
          //TODO: Create a new scenario to get the transaction on the frontend.
          const { batch_number: last_batch_number } = last_sale;
          if (last_batch_number) {
            const last_batch_number_number = parseInt(last_batch_number);
            const next_batch_number_number = last_batch_number_number + 1;
            const next_batch_number = next_batch_number_number
              .toString()
              .padStart(3, "0");
            batch_number = `${next_batch_number}`;
          } else {
            batch_number = "001";
          }
        } else {
          batch_number = last_sale.batch_number;
        }
      } else {
        batch_number = "001";
      }
    }

    const invoice_number =
      _p?.invoice_number && _p?.invoice_number !== ""
        ? _p?.invoice_number
        : generateInvoiceNo(batch_number);
    let data = {
      ..._p,
      invoice_number,
      is_auto_invoice,
      status: "Refunded",
      batch_number,
    };

    data.reference_no = genRandom(6);
    data.transaction_no = genRandom(2);
    data.auth_codes = {
      plastk_auth_code: genRandom(6),
      transaction_auth: genRandom(6),
    };

    return {
      transaction: data,
    };
  },
  receipt: function (_p) {
    let { split, data, batch, transaction } = commonReceipt(_p);
    let details = {
      ReferenceNumber: data.reference_no,
      batch,
      transaction,
      split,
      user: data.user,
      order: data.order,
    };
    return details;
  },
  refundReceipt: function (_p) {
    const { invoice } = req.params;

    // let sale = await SALE.findOne({ invoice_number: invoice, status: 'Refunded' });
    //TODO: Create a new scenario to get the transaction on the frontend.
    let sale = null;

    if (!sale) {
      return {
        code: 404,
        message: `Sale not found against ${invoice}`,
        success: false,
      };
    }
    let createUniqueTraceNumber = (_id) => {
      // let hash = crypto.createHash("sha256");
      let hash = "sha256";
      hash.update(String(_id));
      let hashDigest = hash.digest("hex");
      let number = parseInt(hashDigest, 16);
      let traceNumber = number % 1000000;
      return traceNumber;
    };
    const user = require("./utils/user.json");
    // let card = await CARD.findOne({ 'card_data.PAN': sale.card_number });
    //TODO: Create a new scenario to get the CARD on the frontend.
    let card = null;

    card = {
      card_number: sale?.card_number,
      application_label:
        String(card?.card_data?.application_preferred_name)
          ?.toUpperCase()
          ?.replace("DEBIT", "")
          ?.replace("CREDIT", "") || "",
      application_pref_name:
        String(card?.card_data?.application_label)?.toUpperCase() || "",
      aid: card?.card_data?.["application_identifier_(adf_name)"] || "",
      tvr: card?.card_data?.["Result Code"] || "000000",
      tsi: "000000",
    };

    if (user) {
      if (!user?.user_type) {
        user.user_type = "PLASTK";
      }
      user.user_type = String(user?.user_type).toUpperCase();
    }
    const data = {
      //status should be refunded
      status: sale.status,
      //from sale transaction
      terminal_id: sale.pos_id,
      server_id: sale.server_id,
      clerk_id: sale.clerk_id,
      date: moment(sale.created_at).format("DD/MM/YYYY HH:MM:SS"),
      entry_method: sale.entry_mode,
      account_type: sale.account_type === "chequing" ? "CHQ" : "SAV",
      ref_no: sale.reference_no,
      plastk_auth_code: sale?.auth_codes?.plastk_auth_code ?? genRandom(6),
      transaction_auth: sale?.auth_codes?.transaction_auth ?? genRandom(6),
      total_amount: sale.sale_amount,
      refund_amount: sale.sale_amount,
      invoice_no: sale.invoice_number,
      merchant_id: "Plastk",
      batch_no: sale.batch_number ?? "0001",
      trace_id: createUniqueTraceNumber(sale._id),
      store_name: "Personal Store",
      user_type: String(user?.user_type ?? "PLASTK").toUpperCase(),
      store_address1: "35 CROSSING NW",
      store_address2: "CALGARY, AB, T3R 0S4",
      store_type: "INSTORE",
      store_phone_no: "44858557894",
      store_category: "Restaurants",
      ...card,
    };
    return {
      message: "data retrived",
      invoice: data,
    };
  },
  generateInvoiceNumber: generateInvoiceNo,
};
