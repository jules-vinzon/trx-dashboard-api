import { getDB, ready } from "../configs/mongodb.js";
import { generateRandomString } from '../utils/stringUtils.js';

await ready; 
export class UserWalletsModel {

    constructor() {
        this.collection = getDB().collection("user_wallets");
    }

    async addUserWallet(userId) {
        try {    
            const walletId = `WLLT${generateRandomString(6)}`;     
            console.log('[ADD WALLET]: CHECK GENERATED WALLET ID', walletId);

            const walletData = {
                user_id: userId,
                balance: '0.00',
                wallet_id: walletId,
                created_at: new Date(),
                updated_at: new Date()
            }

            this.collection.insertOne(walletData);
            console.error("[ADD WALLET]: SUCCESS");

        } catch (error) {
            console.error("[ADD WALLET]: ERROR ADDING USER WALLETS:", error);
            throw error;
        }
    };

    async updateWalletBalance(data) {
        try {    
            console.log('[UPDATE WALLET]: CHECK DATA', data);

            this.collection.updateOne({ user_id: data.user_id }, { $set: { balance: data.balance.toString(), updated_at: new Date()}}, (err, result) => {
                console.log('[UPDATE WALLET] CHECK UPDATE RECORD ERROR', err);
                console.log('[UPDATE WALLET] CHECK UPDATE RECORD RESULT', result);
            });
            console.error("[UPDATE WALLET]: SUCCESS");

        } catch (error) {
            console.error("[UPDATE WALLET]: ERROR ADDING USER WALLETS:", error);
            throw error;
        }
    };
}


