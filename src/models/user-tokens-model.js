import { getDB, ready } from "../configs/mongodb.js";

await ready; 
export class UserTokensModel {

    constructor() {
        this.collection = getDB().collection("user_tokens");
    }

    async addToken(token, requestId, userData) {
        try {            
            const tokenData = {
                token, 
                request_id: requestId,
                user_id: userData._id,
                created_at: new Date(),
            }

            this.collection.insertOne(tokenData);
            console.error("[ADD TOKEN]: SUCCESS");

        } catch (error) {
            console.error("[ADD TOKEN]: ERROR ADDING TOKEN:", error);
            throw error;
        }
    };

    async deleteToken(token) {
        try {            
            const result = await this.collection.deleteOne({token});
            
            if (result.deletedCount > 0 ) {
                return true
            } else return false

        } catch (error) {
            console.error("[ADD TOKEN]: ERROR ADDING TOKEN:", error);
            throw error;
        }
    };

    async findToken(token) {
        try {            
            const result = await this.collection.findOne({token});
            return {
                success: true,
                data: result
            }

        } catch (error) {
            console.error("[ADD TOKEN]: ERROR ADDING TOKEN:", error);
            throw error;
        }
    };
}


