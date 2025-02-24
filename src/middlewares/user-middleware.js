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

        if (!req.body.username || req.body.username === undefined) {
            console.log('[ADD USER MIDDLEWARE]: USERNAME IS MISSING!');
            return this.errorResponse('Username is missing', res);
        } else {
            const userData = await this.usersModel.fetchUserByUsername(req.body.username);

            if (userData.success) {
                console.log('[ADD USER MIDDLEWARE]: USERNAME ALREADY EXISTS!')
                return this.errorResponse('Username already exists!', res);
            }
        }

        if (!req.body.password || req.body.password === undefined) {
            console.log('[ADD USER MIDDLEWARE]: PASSWORD IS MISSING!');
            return this.errorResponse('Password is missing', res);
        }

        if (!req.body.first_name || req.body.first_name === undefined) {
            console.log('[ADD USER MIDDLEWARE]: FIRST NAME IS MISSING!');
            return this.errorResponse('First Name is missing', res);
        }

        if (!req.body.last_name || req.body.last_name === undefined) {
            console.log('[ADD USER MIDDLEWARE]: LAST NAME IS MISSING!');
            return this.errorResponse('Last Name is missing', res);
        }

        next();
    }
}
