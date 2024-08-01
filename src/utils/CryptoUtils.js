import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const toString = (data) => {
  return typeof data === 'string' ? data : JSON.stringify(data);
};

export const localStorageGetValue = (key) => {

  const cryptValue = localStorage.getItem(key);

  return decrypt(cryptValue);
}

export const localStorageSetValue = (key, value) => {
  const cryptValue = encrypt(value);

  localStorage.setItem(key, cryptValue);
}

const encrypt = (data) => {
  try {
    const text = toString(data);
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
};

const decrypt = (ciphertext) => {
  if (!ciphertext) {
    return null;
  }
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};