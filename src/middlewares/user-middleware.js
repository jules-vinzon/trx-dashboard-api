import { UsersModel }  from '../models/users-model.js';
import { RequestResponseLogsModel }  from '../models/request-response-logs-model.js';

export class UsersMiddleware {

    constructor() {
            this.usersModel = new UsersModel();
            this.logsModel = new RequestResponseLogsModel();
    }

    async errorResponse(errMessage, res) {
        const finalResp = {
            success: false,
            data: errMessage,
        };
        res.status(400).send(finalResp);
    }

    async addUserMiddleware(req, res, next) {

        /* eslint-disable no-unused-vars */
        const { password, auth, ...sanitizedBody } = req.body;
        /* eslint-enable no-unused-vars */

        this.logsModel.addLogs(sanitizedBody, 'request', req.body.auth, 'ADD USER')
        
        const userData = await this.usersModel.fetchUserByUsername(req.body.username);

        if (userData.success) {
            console.log('[ADD USER MIDDLEWARE]: USERNAME ALREADY EXISTS!')
            return this.errorResponse('Username already exists!', res);
        }

        next();
    }
}
