import { TransactionsModel }  from '../models/transactions-model.js';
import { UserWalletsModel } from '../models/user-wallets-model.js';
import { RequestResponseLogsModel } from '../models/request-response-logs-model.js';
import { UsersModel } from '../models/users-model.js';
import { publishMessage } from  '../configs/mqtt.js'

export class TransactionService {

    constructor() {
        this.transactionsModel = new TransactionsModel();
        this.logsModel = new RequestResponseLogsModel();
        this.userWalletsModel = new UserWalletsModel();
        this.usersModel = new UsersModel();
    }

    async topupBalance(requestBody, auth) {
        try {
        
            const response = await this.transactionsModel.addTransaction(requestBody);

            if (response.success) {
                await this.userWalletsModel.updateWalletBalance(response)

                publishMessage(`TRXDASHBOARD-${process.env.SECRET_KEY}-${requestBody.auth}`, JSON.stringify(response.data))
            } 
            this.logsModel.addLogs(response, 'response', auth, 'TOPUP BALANCE');

            return response;
            
        } catch (error) {
            console.error('[TOPUP]: ERROR OCCURRED', error);
            throw error;
        }
    }   

    async fetchTransactions(requestor) {
        try {
        
            const response = await this.transactionsModel.fetchByRequestor(requestor);
            this.logsModel.addLogs(response, 'response', requestor, 'FETCH ALL TRANSACTIONS');

            return response;
            
        } catch (error) {
            console.error('[ADD USER]: ERROR OCCURRED', error);
            throw error;
        }
    } 
}
