import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (username) => {
    const secretKey = process.env.SECRET_KEY;
    const now = Math.floor(Date.now() / 1000);
    const expiry = now + 86400;

    const token = jwt.sign(
        {
            sub: username,
            iat: now,
            exp: expiry
        },
        secretKey,
        { algorithm: 'HS512' }
    );
    
    return token;
}


export const generateKeyPair = () => {
    return new Promise((resolve, reject) => {
        crypto.generateKeyPair('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        }, (err, publicKey, privateKey) => {
            if (err) {
                reject(err);
            } else {
                resolve({ publicKey, privateKey });
            }
        });
    });
};


export const decryptRSA = (privateKey, encryptedString) => {
    console.log("START TO DECRYPT", privateKey);
    console.log("ENCRYPTED REQUEST BODY " + encryptedString);

    let response = {};
   try {
        const buffer = Buffer.from(encryptedString, 'hex');
        const decrypted = crypto.privateDecrypt(privateKey, buffer);
    
        response.decrypted = decrypted.toString('utf8');;
        response.valid = true;
    } catch (e) {
        response.valid = false;
        console.error("Decryption error:", e);
    }

    console.log("DONE TO DECRYPT");
    return response;
}

export const validateJwtToken = (token) => {
    const secretKey = process.env.SECRET_KEY;
    
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded.exp * 1000 > Date.now();
    } catch (error) {
        console.error("JWT Token Validation Error:", error);
        return false;
    }
}