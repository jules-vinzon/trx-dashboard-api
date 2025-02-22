import { UsersModel }  from '../models/users-model.js';
import { RequestResponseLogsModel } from '../models/request-response-logs-model.js';
import { UserWalletsModel  } from '../models/user-wallets-model.js';
import { encrypt } from '../utils/encryption.js';

export class UsersService {

    constructor() {
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
}
