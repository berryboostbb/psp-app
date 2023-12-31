exports.checkBin = function (n) {
  return /^[01]{1,64}$/.test(n);
};

exports.checkDec = function (n) {
  return /^[0-9]{1,64}$/.test(n);
};

exports.checkHex = function (n) {
  return /^[0-9A-Fa-f]{1,64}$/.test(n);
};

exports.pad = function (s, z) {
  s = "" + s;
  return s.length < z ? this.pad("0" + s, z) : s;
};

exports.unpad = function (s) {
  s = "" + s;
  return s.replace(/^0+/, "");
};

exports.Dec2Bin = function (n) {
  if (!this.checkDec(n) || n < 0) return 0;
  return n.toString(2);
};
exports.Dec2Hex = function (n) {
  if (!this.checkDec(n) || n < 0) return 0;
  return n.toString(16);
};

exports.Bin2Dec = function (n) {
  if (!this.checkBin(n)) return 0;
  return parseInt(n, 2).toString(10);
};

exports.Bin2Hex = function (n) {
  if (!this.checkBin(n)) return 0;
  return parseInt(n, 2).toString(16);
};

exports.Hex2Bin = function (n) {
  if (!this.checkHex(n)) return 0;
  return parseInt(n, 16).toString(2);
};

exports.Hex2Dec = function (n) {
  if (!this.checkHex(n)) return 0;
  return parseInt(n, 16).toString(10);
};

exports.Hex2Ascii = function (hexx) {
  var hex = hexx.toString(); //force conversion
  var str = "";
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
};

exports.replaceAt = function (str, index, character) {
  var str = str.toString(); //force conversion
  return (
    str.substr(0, index) + character + str.substr(index + character.length)
  );
};
