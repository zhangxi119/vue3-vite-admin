import CryptoJS from 'crypto-js';

export default {
  methods: {
    // sha256
    decryptBySHA256(message) {
      const decrypted = CryptoJS.SHA256(message);
      return decrypted.toString();
    },
    // sha512
    decryptBySHA512(message) {
      const decrypted = CryptoJS.SHA512(message);
      return decrypted.toString();
    },
  },
};
