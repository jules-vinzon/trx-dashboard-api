import { getDB, ready } from "../configs/mongodb.js";

await ready; 
export class UsersModel {
    constructor() {
        this.collection = getDB().collection("users");
    }

    async addUser(userData) {
        try {

            /* eslint-disable no-unused-vars */
            const { auth, ...sanitizedBody } = userData; 
            /* eslint-enable no-unused-vars */
            
            sanitizedBody.created_at = new Date();
            const result = await this.collection.insertOne(sanitizedBody);
            return {
                success: true,
                message: `Successfully added user: ${sanitizedBody.username}`,
                userId: result.insertedId,
            };
        } catch (error) {
            console.error("Error adding user:", error);
            return { success: false, message: "Failed to add user" };
        }
    }

    async fetchUserByUsername(username) {
        try {
            console.log('[USERS MODEL]: CHECK USERNAME', username)
            const user = await this.collection.findOne({ username });
            if (!user) {
                return { success: false, message: "User not found" };
            }
            return { success: true, user };
        } catch (error) {
            console.error("Error fetching user:", error);
            return { success: false, message: "Failed to fetch user" };
        }
    }

    async checkAuth(username, password) {
        try {
            const user = await this.collection.findOne({ username, password });
            if (!user) {
                return { success: false, message: "Invalid Authentication!" };
            }
            return { success: true, user };
        } catch (error) {
            console.error("Error fetching user:", error);
            return { success: false, message: "Failed to authenticate" };
        }
    }

    async fetchWalletBalance(username) {
        try {
            console.log('[USERS MODEL]: CHECK USERNAME', username)
            const result = await this.collection.aggregate([
                {
                  $match: {username}
                },
                {
                  $lookup: {
                    from: 'user_wallets',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'user_wallets'
                  }
                },
                {
                  $unwind: {
                    path: '$user_wallets',
                    preserveNullAndEmptyArrays: true
                  }
                },
                {
                  $project: {
                    _id: 1,
                    balance: '$user_wallets.balance'
                  }
                }
              ]).toArray();
              
            if (!result) {
                return { success: false, message: "User not found" };
            }

            return { success: true, data: result[0]};
        } catch (error) {
            console.error("Error fetching user:", error);
            return { success: false, message: "Failed to fetch user" };
        }
    }

    async fetchUserById(authId) {
        try {
            console.log('[USERS MODEL]: CHECK AUTH ID', authId)
            const user = await this.collection.findOne({ _id: authId });
            if (!user) {
                return { success: false, message: "User not found" };
            }
            return { success: true, data: user };
        } catch (error) {
            console.error("Error fetching user:", error);
            return { success: false, message: "Failed to fetch user" };
        }
    }

    async fetchUserToken(username) {
        try {
            console.log('[USERS MODEL]: CHECK USERNAME', username)
            const result = await this.collection.aggregate([
                {
                  $match: {username}
                },
                {
                  $lookup: {
                    from: 'user_tokens',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'user_tokens'
                  }
                },
                {
                  $unwind: {
                    path: '$user_tokens',
                    preserveNullAndEmptyArrays: true
                  }
                },
                {
                  $project: {
                    _id: 0,
                    token: '$user_tokens.token'
                  }
                }
              ]).toArray();
              
            if (!result) {
                return { success: false, message: "User not found" };
            }

            return { success: true, data: result[0]};
        } catch (error) {
            console.error("Error fetching user:", error);
            return { success: false, message: "Failed to fetch user" };
        }
    }
}

