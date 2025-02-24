import { getDB, ready } from "../configs/mongodb.js";

await ready; 
export class UserKeysModel {

    constructor() {
        this.collection = getDB().collection("user_keys");
    }

    async addKeys(requestId, pubKey, privKey) {
        try {            
            const userKeyData = {
                request_id: requestId,
                public_key: pubKey,
                private_key: privKey,
                created_at: new Date(),
                updated_at: new Date()
            }

            this.collection.insertOne(userKeyData);
            console.error("[ADD KEY]: SUCCESS");

        } catch (error) {
            console.error("[ADD KEY]: ERROR ADDING KEY:", error);
            throw error;
        }
    };

    async fetchByRequestId(requestId) {
        try {
            console.log('[FETCH KEY]: CHECK REQUEST ID', requestId)
            const result = await this.collection.findOne({ request_id: requestId });
            if (!result) {
                return { success: false, message: "Key not found" };
            }
            return { success: true, data: result };
        } catch (error) {
            console.error("[FETCH KEY]: ERROR FETCHING KEY - ", error);
            return { success: false, message: "Failed to fetch key" };
        }
    }
}


