import Base64 from 'crypto-js/enc-base64.js';
import HmacSHA512 from 'crypto-js/hmac-sha512.js';

export const encrypt = (password) => {
    const hashed = Base64.stringify(HmacSHA512(password, process.env.enki));
    return hashed;
};