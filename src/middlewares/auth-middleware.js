import { UsersModel }  from '../models/users-model.js';
import { encrypt } from '../utils/encryption.js';

export class AuthMiddleware {

    constructor() {
            this.usersModel = new UsersModel();
    }

    async errorResponse(errMessage, res) {
        const finalResp = {
            success: false,
            data: errMessage,
        };
        res.status(401).send(finalResp);
    }

    async authenticateMiddelware(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(" ")[1]; 
        
            if (!token) {
                console.log('[AUTHENTICATION MIDDLEWARE]: NO TOKEN PROVIDED!')
                return this.errorResponse('No Token Provided!', res);
            }

            const parts = authHeader.split(' ');
            const credentials = Buffer.from(parts[1], 'base64').toString();
            const index = credentials.indexOf(':');

            const username = credentials.slice(0, index);
            const password = credentials.slice(index + 1);
            const userData = await this.usersModel.checkAuth(username, encrypt(password));

            if (!userData.success) {
                console.log('[AUTHENTICATION MIDDLEWARE]: INVALID USERNAME OR PASSWORD!')
                return this.errorResponse(userData.message, res);
            } 

            req.body.auth = username;
            next();
        } catch (error) {
            console.error("[AUTHENTICATION MIDDLEWARE]: END - ERROR", error)
            return res.status(403).json({ success: false, message: "Forbidden: Invalid token" });
        }
    }


    syncSaveAuditlog(body, level, auth, message, responseAdvise) {
        console.log("Audit Log:", { body, level, auth, message, responseAdvise });
    }
}
