import { TransactionService } from '../services/transaction-services.js';

export class TransactionsController {
    constructor() {
        this.transactionService = new TransactionService();
    }

    async topupBalance(req, res) {
        try {
            const requestBody = req.body;
            const response = await this.transactionService.topupBalance(requestBody, req.body.auth);

            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async fetchTransactions(req, res) {
        try {
            const requestor = req.params.id;
            console.log('[FETCH TRANSACTION]: CHECK REQUESTOR', requestor);

            const response = await this.transactionService.fetchTransactions(requestor);

            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new TransactionsController();
