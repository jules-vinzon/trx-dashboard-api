import { UsersModel }  from '../models/users-model.js';
import { RequestResponseLogsModel } from '../models/request-response-logs-model.js';
import { UserWalletsModel  } from '../models/user-wallets-model.js';
import { UserKeysModel } from '../models/user-keys-model.js';
import { UserTokensModel } from '../models/user-tokens-model.js';
import { encrypt } from '../utils/encryption.js';
import { decryptRSA, generateKeyPair, generateToken, validateJwtToken } from '../utils/cryptoUtils.js';

export class UsersService {

    constructor() {
        this.userTokensModel = new UserTokensModel();
        this.userKeysModel = new UserKeysModel();
        this.usersModel = new UsersModel();
        this.logsModel = new RequestResponseLogsModel();
        this.userWalletsModel = new UserWalletsModel()
    }
    
    async addUser(requestBody, auth) {
        try {

            requestBody.password = encrypt(requestBody.password);
        
            const response = await this.usersModel.addUser(requestBody);

            if (response.success && response.userId) {
                await this.userWalletsModel.addUserWallet(response.userId)
            } 

            this.logsModel.addLogs(response, 'response', auth, 'ADD USER');

            return response;
            
        } catch (error) {
            console.error('[ADD USER]: ERROR OCCURRED', error);
            throw error;
        }
    }   

    async getKey(requestBody) {
        try {

            const keyData = await this.userKeysModel.fetchByRequestId(requestBody.request_id);

            if (!keyData.success) {
                const { publicKey, privateKey } = await generateKeyPair();
            
                await this.userKeysModel.addKeys(requestBody.request_id, publicKey, privateKey);
    
                return {
                    success: true,
                    request_id: requestBody.request_id,
                    public_key: publicKey
                };
            } else {
                return {
                    success: true,
                    request_id: requestBody.request_id,
                    public_key: keyData.data.public_key
                };
            }
        } catch (error) {
            console.error('[GET KEY]: ERROR OCCURRED', error);
            throw error;
        }
    }  


    async login(requestBody) {
        try {

            console.log('CHECK REQUEST BODY', requestBody);
            const keyData = await this.userKeysModel.fetchByRequestId(requestBody.request_id);
            console.log('CHECK KEY DATA', keyData);

            if (!keyData.success) {
                return  {
                    success: false,
                    message: "Invalid token",
                }
            }

            const privKey = keyData.data.private_key;
            console.log('CHECK PRIV KEY', privKey);
            const encryptedData = requestBody.encdata;

            const decryptedData = decryptRSA(privKey, encryptedData);
            console.log('[LOGIN]: CHECK DECRYPTED DATA', decryptedData);

            if (!decryptedData.valid) {
                return  {
                    success: false,
                    message: "Unable to decrypt request body",
                }
            } 

            const decryptedString = JSON.parse(decryptedData.decrypted);

            const password = encrypt(decryptedString.password);
            const userData = await this.usersModel.checkAuth(decryptedString.username, password);
            console.log('CHECK USERDATA', userData);

            if (!userData.success) {
                return  {
                    success: false,
                    message: "Invalid username or password!",
                }
            }

            const token = generateToken(decryptedString.username);

            await this.userTokensModel.addToken(token, requestBody.request_id, userData.user);
            delete userData.user.password

            return  {
                success: true,
                message: "Login Success!",
                data: {
                    ...userData, 
                    token
                }
            }

        } catch (error) {
            console.error('[LOGIN]: ERROR OCCURRED', error);
            throw error;
        }
    }  

    async logout(requestBody) {
        try {

            const isDeleted = await this.userTokensModel.deleteToken(requestBody.token);
            console.log('[LOGOUT]: IS TOKEN DELETES -', isDeleted);

            if (isDeleted) {    
                return {
                    success: true,
                    message: 'Logout Success!',
                };
            } else {
                return {
                    success: false,
                    message: 'Logout Error!',
                };
            }
        } catch (error) {
            console.error('[LOGOUT]: ERROR OCCURRED', error);
            throw error;
        }
    }

    async refetch(token) {
        try {

            const tokenData = await this.userTokensModel.findToken(token);
            console.log('[REFETCH]: CHECK TOKEN DATA -', tokenData);

            if (tokenData) {    

                const userData = await this.usersModel.fetchUserById(tokenData.data.user_id);
                console.log('[REFETCH]: CHECK USERS DATA -', userData);
                return {
                    success: true,
                    data: userData,
                    token
                };
            } else {
                return {
                    success: false,
                    message: 'No session found!',
                };
            }
        } catch (error) {
            console.error('[REFETCH]: ERROR OCCURRED', error);
            throw error;
        }
    }

    async validateToken(token) {
        try {

            const validateToken = validateJwtToken(token)
            console.log('[VALIDATE TOKEN]: CHECK IF TOKEN F VALID -', validateToken);

            if (validateToken) {    
                return {
                    success: true,
                    message: 'Valid Token!'
                };
            } else {
                return {
                    success: false,
                    message: 'Invalid Token!',
                };
            }
        } catch (error) {
            console.error('[VALIDATE TOKEN]: ERROR OCCURRED', error);
            throw error;
        }
    }
}
