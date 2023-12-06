const emv = require("node-emv");
const mappings = require("./iso8583mappings.json");
const dict = require("./dict.json");
const formats = require("./iso_formats.json");

class ISO8583 {
  constructor() {
    this._dict = dict;
    this._field_formats = formats;
    this._iso_8583 = require("iso_8583");
  }
  getFunctionsForMTI(mti) {
    return this._dict.filter((f) => f.mti === mti).map(({ name }) => name);
  }
  getBitMap(elementNumbers) {
    //generate bitmap from element numbers
    let bitmap = "1";
    for (let i = 1; i < 128; i++) {
      if (elementNumbers.includes(i)) bitmap += "1";
      else bitmap += "0";
    }
    return bitmap;
  }
  getDataSampleForFunction(name) {
    let data = this._dict.find((f) => f.name === name);
    if (!data) throw new Error("Function not found");
    const x = data.dataElements
      .filter((x) => !isNaN(x.tag))
      .map(({ tag }) => parseInt(tag));
    x.push(0);
    return {
      mti: data.mti,
      bitmap: this.getBitMap(x),
      dataElements: this._iso_8583.getFieldDescription(x),
    };
  }
  convertToISO8583(raw) {
    let iso = new this._iso_8583(raw);
    return { message: iso.getBufferMessage(), is_valid: iso.validateMessage() };
  }
  convertToRawData(incoming) {
    let isox = new this._iso_8583();
    return isox.getIsoJSON(incoming);
  }
  parseEMVData(encrypted) {
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
    return mapped_data;
  }
  format(data, tag) {
    let { ContentType, MaxLen } = this._field_formats[tag];
    let formatted = "";
    let regex = {
      a: /[A-Z]/i,
      n: /[0-9]/i,
      b: /[0-9ABCDEF]/i,
      p: /[*#]/i,
      an: /[0-9a-z]/i,
      ans: /[0-9a-z-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/ ]/i,
      ns: /[0-9-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/ ]/i,
      s: /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/ ]/i,
      anp: /[0-9a-z*#\x20]/i,
      x: /[0-9]/i,
    };
    //To be Continued...
    return data;
  }
  convertToReadable(raw) {
    let data = Object.entries(raw);
    let mapped_data = {};
    for (let i = 0; i < data.length; i++) {
      mapped_data[
        Object.values(this._iso_8583.getFieldDescription(data[i][0]))[0]
      ] = data[i][1];
    }
    return mapped_data;
  }
  getFieldInfo(tag) {
    return this._field_formats[tag];
  }
}

module.exports = ISO8583;
