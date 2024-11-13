


const _arrayBufferFromHexString = (hexString) => {
  const bytes = Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
  return bytes.buffer;
}


const _stringToArrayBuffer = (str)=>{
  const encoder = new TextEncoder();
  return encoder.encode(str).buffer;
}

const _digestMessage = async (message) => {
  const data = _stringToArrayBuffer(message);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return hash;
}

const _arrayBufferToHexString = (buffer) => {
  const byteArray = new Uint8Array(buffer);
  const hexCodes = [...byteArray].map(value => {
      const hexCode = value.toString(16);
      const paddedHexCode = hexCode.padStart(2, '0');
      return paddedHexCode;
  });

  return hexCodes.join('');
}

export const getKeyFromPassphrase = async (passphrase) => {
  const key = await _digestMessage(passphrase);
  const keyHex = _arrayBufferToHexString(key);
  return keyHex
}

export const getIvFromPassphrase = async (passphrase) => {
  const keyHex = await getKeyFromPassphrase(passphrase); 
  const ivHex = keyHex.substring(0, 32)
  return ivHex
}


export const encryptAes = async (fileArrayBuffer, keyHex, ivHex) => {

  // decode the Hex-encoded key and IV
  const ivArrayBuffer = _arrayBufferFromHexString(ivHex);
  const keyArrayBuffer = _arrayBufferFromHexString(keyHex);

  // prepare the secret key for encryption
  const secretKey = await crypto.subtle.importKey('raw', keyArrayBuffer, {
      name: 'AES-CBC',
      length: 256
  }, true, ['encrypt', 'decrypt']);

  // encrypt the text with the secret key
  const ciphertextArrayBuffer = await crypto.subtle.encrypt({
      name: 'AES-CBC',
      iv: ivArrayBuffer
  }, secretKey, fileArrayBuffer);

  return ciphertextArrayBuffer
}


// openssl enc -aes-256-cbc -nosalt -d -in in.jpg -out out.jpg -K <key in Hex> -iv <iv in Hex>
export const decryptAes = async (fileArrayBuffer, keyHex, ivHex) => {
  // decode the Hex-encoded key and IV
  const ivArrayBuffer = _arrayBufferFromHexString(ivHex);
  const keyArrayBuffer = _arrayBufferFromHexString(keyHex);

  // prepare the secret key for encryption
  const secretKey = await crypto.subtle.importKey('raw', keyArrayBuffer, {
    name: 'AES-CBC',
    length: 256
}, true, ['encrypt', 'decrypt']);

  // decrypt the ciphertext with the secret key
  const decryptedBuffer = await crypto.subtle.decrypt({
      name: 'AES-CBC',
      iv: ivArrayBuffer
  }, secretKey, fileArrayBuffer);

  // return the decrypted data as an ArrayBuffer
  return decryptedBuffer;
}







