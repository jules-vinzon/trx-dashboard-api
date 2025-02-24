import { getDB, ready } from "../configs/mongodb.js";
import { UsersModel }  from './users-model.js';

await ready; 
export class TransactionsModel {

    constructor() {
        this.collection = getDB().collection("transactions");
        this.usersModel = new UsersModel()
    }

    async addTransaction(data) {
        try {    

            console.log('[TRANSACTIONS MODEL]: CHECK DATA', data);

            const userWalletData = await this.usersModel.fetchWalletBalance(data.auth);
            console.log('[TRANSACTIONS MODEL]: CHECK USER WALLET DATA', userWalletData);

            const currentBalance = userWalletData.data.balance;
            console.log('[TRANSACTIONS MODEL]: CHECK CURRENT BALANCE', currentBalance);

            const transactionsData = {
                request_id: data.request_id,
                requestor: data.auth,
                balance_before: currentBalance,
                balance_after: Number.parseFloat(data.amount) + Number.parseFloat(currentBalance),
                status: 'SUCCESS',
                created_at: new Date(),
                updated_at: new Date()
            }

            this.collection.insertOne(transactionsData);
            console.error("[TRANSACTIONS MODEL]: SUCCESS");

            return {
                success: true,
                user_id: userWalletData.data._id,
                balance: transactionsData.balance_after,
                data: transactionsData
            };

        } catch (error) {
            console.error("TRANSACTIONS MODEL]: ERROR ADDING TRANSACTIONS:", error);
            throw error;
        }
    };

    async fetchByRequestId(requestId) {
        try {
            console.log('[TRANSACTIONS MODEL]: CHECK REQUEST ID', requestId)
            const result = await this.collection.findOne({ request_id: requestId });
            if (!result) {
                return { success: false, message: "Transaction not found" };
            }
            return { success: true, data: result };
        } catch (error) {
            console.error("Error fetching transaction:", error);
            return { success: false, message: "Failed to fetch transaction" };
        }
    }

    async fetchByRequestor(requestor) {
        try {
            console.log('[TRANSACTIONS MODEL]: CHECK REQUESTOR', requestor)
            const result = await this.collection
                .find({ requestor })
                .sort({ created_at: -1 })
                .toArray();
            if (!result) {
                return { success: false, message: "Transactions not found" };
            }
            return { success: true, data: result };
        } catch (error) {
            console.error("Error fetching transactions:", error);
            return { success: false, message: "Failed to fetch transaction" };
        }
    }
}


