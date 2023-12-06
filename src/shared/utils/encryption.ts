/* eslint-disable no-undef */
"use strict";
import crypto from "../../libs/crypto";
// const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

export const generate = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const chunkSubstr = (str: string, size: number) => {
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size);
  }

  return chunks;
};

export const encrypt = (text: any, ENCRYPTION_KEY: string) => {
  try {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY, "hex"),
      iv
    );
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return chunkSubstr(
      iv.toString("hex") + ":" + encrypted.toString("hex"),
      600
    ).reverse();
  } catch (err) {
    return false;
  }
};

export const decrypt = (text: any, ENCRYPTION_KEY: string) => {
  const textParts = text?.reverse().join("")?.split(":");

  // let Text = text[0];
  // let textParts = Text.split(':');
  let iv = Buffer.from(textParts.shift(), "hex");

  let encryptedText = Buffer.from(textParts.join(":"), "hex");

  let decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv
  );

  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

// module.exports = {decrypt, encrypt, generate};
