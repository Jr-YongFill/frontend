import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const toString = (data) => {
  return typeof data === 'string' ? data : JSON.stringify(data);
};

export const encrypt = (data) => {
  try {
    const text = toString(data);
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
};

export const decrypt = (ciphertext) => {
  try {
    if (typeof ciphertext !== 'string') {
      throw new Error('복호화할 데이터는 문자열이어야 합니다.');
    }
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};
