import { decrypt } from './cryptoUtils';

export const decoding = (setNickName, setMemberId, setRole) => {

  if (localStorage.getItem('nickName')) {
    try {
      const decryptedNickName = decrypt(localStorage.getItem('nickName'));
      const decryptedId = decrypt(localStorage.getItem('id'));
      const decryptedrole = decrypt(localStorage.getItem('role'));
      setNickName(decryptedNickName);
      setMemberId(decryptedId);
      setRole(decryptedrole)
    } catch (error) {
      console.error('Decryption error:', error);
    }
  }
};
