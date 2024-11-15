// based on: https://github.com/bradyjoslin/webcrypto-example/blob/master/script.js
// for large strings, use this from https://stackoverflow.com/a/49124600

const buff_to_base64 = (buff) => btoa(
  new Uint8Array(buff).reduce(
    (data, byte) => data + String.fromCharCode(byte), ''
  )
);

const base64_to_buf = (b64) =>
  Uint8Array.from(atob(b64), (c) => c.charCodeAt(null));

const enc = new TextEncoder();
const dec = new TextDecoder();

const getPasswordKey = (password) =>
  window.crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
    "deriveKey",
  ]);

const deriveKey = (passwordKey, salt, keyUsage) =>
  window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 250000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    keyUsage
  );

export async function encrypt({ input: secretData, password, infoOnly }) {
  try {
    const salt = window.crypto.getRandomValues(new Uint8Array(16)); // 128-bit salt
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const passwordKey = await getPasswordKey(password);
    const aesKey = await deriveKey(passwordKey, salt, ["encrypt"]);

    if (infoOnly) {
      return {
        salt,
        iv,
        passwordKey,
        aesKey,
      }
    }

    // encryptedContent is ArrayBuffer
    const encryptedContent = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
        tagLength: 128,
      },
      aesKey,
      secretData
      // enc.encode(secretData)
    );

    // todo: return obj w/ iv, authTag, salt and cipherText
    // todo: using ui selectors let the user control how they'd like their stuff packaged.
    // crypto.subtle.encrypt already appends cipherTag at the end of the ciphertext (last 16 bytes)
    // as seen in the code below.

    // extract the ciphertext and authentication tag
    // const ciphertext = encryptedContent.slice(0, encryptedContent.byteLength - 16);
    // const authTag = encryptedContent.slice(encryptedContent.byteLength - 16);
   
    // return {
    //   ciphertext: new Uint8Array(ciphertext),
    //   iv,
    //   authTag: new Uint8Array(authTag),
    //   salt,
    // };


    const encryptedContentArr = new Uint8Array(encryptedContent);
    let buff = new Uint8Array(
      salt.byteLength + iv.byteLength + encryptedContentArr.byteLength
    );
    buff.set(salt, 0);
    buff.set(iv, salt.byteLength);
    buff.set(encryptedContentArr, salt.byteLength + iv.byteLength);
    return buff.buffer;


    // return base64
    // const base64Buff = buff_to_base64(buff);
    // return base64Buff;
  } catch (e) {
    console.log(`Error - ${e}`);
    return "";
  }
}

export async function decrypt({ input: encryptedData, password }) {
  try {
    // const encryptedDataBuff = base64_to_buf(encryptedData);
    const encryptedDataBuff = new Uint8Array(encryptedData);
    const salt = encryptedDataBuff.slice(0, 16);
    const iv = encryptedDataBuff.slice(16, 16 + 12);
    const data = encryptedDataBuff.slice(16 + 12);
    const passwordKey = await getPasswordKey(password);
    const aesKey = await deriveKey(passwordKey, salt, ["decrypt"]);
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
        tagLength: 128,
      },
      aesKey,
      data
    );
    return decryptedContent;
    // return dec.decode(decryptedContent);
  } catch (e) {
    console.log(`Error - ${e}`);
    return "";
  }
}
