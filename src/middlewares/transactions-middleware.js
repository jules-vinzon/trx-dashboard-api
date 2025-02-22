import { RequestResponseLogsModel }  from '../models/request-response-logs-model.js';
import { TransactionsModel } from '../models/transactions-model.js';

export class TransactionsMiddleware {

    constructor() {
            this.logsModel = new RequestResponseLogsModel();
            this.transactionsModel = new TransactionsModel();
    }

    async errorResponse(errMessage, res) {
        const finalResp = {
            success: false,
            data: errMessage,
        };
        res.status(400).send(finalResp);
    }

    async topupMiddleware(req, res, next) {

        this.logsModel.addLogs(req.body, 'request', req.body.auth, 'TOUP BALANCE')
    
        if (!req.body.request_id || req.body.request_id === undefined) {
            console.log('[TOPUP MIDDLEWARE]: REQUEST ID IS MISSING!');
            return this.errorResponse('Request ID is missing', res);
        } else {
            const transactionData = await this.transactionsModel.fetchByRequestId(req.body.request_id);

            if (transactionData.success) {
                console.log('[TOPUP MIDDLEWARE]: USERNAME ALREADY EXISTS!')
                return this.errorResponse('Transaction already exists!', res);
            }
        }
        

        if (!req.body.amount || req.body.amount === undefined) {
            console.log('[TOPUP MIDDLEWARE]: AMOUNT IS MISSING!');
            return this.errorResponse('Amount is missing', res);
        } else {
            const amount = Number.parseFloat(req.body.amount);
        
            if (!Number.isFinite(amount) || req.body.amount.toString().match(/[a-zA-Z]/)) {
                console.log('[TOPUP MIDDLEWARE]: AMOUNT IS NOT A VALID NUMBER!');
                return this.errorResponse('Amount must be a valid number', res);
            }
            
            if (amount <= 0.00) {
                console.log('[TOPUP MIDDLEWARE]: AMOUNT MUST BE GREATER THAN ZERO!');
                return this.errorResponse('Amount must be greater than zero', res);
            }
        }
         

        next();
    }
}
