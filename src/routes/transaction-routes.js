import express from "express";
import { TransactionsController } from "../controllers/transactions-controller.js";
import { TransactionsMiddleware } from '../middlewares/transactions-middleware.js';
import { AuthMiddleware } from '../middlewares/auth-middleware.js';


const router = express.Router();
const transactionsController = new TransactionsController()
const transactionsMiddleware = new TransactionsMiddleware();
const authMiddleware = new AuthMiddleware();

router.post('/topup', 
    authMiddleware.authenticateMiddleware.bind(authMiddleware),
    transactionsMiddleware.topupMiddleware.bind(transactionsMiddleware), 
    transactionsController.topupBalance.bind(transactionsController)
);

router.get('/fetch/:id',  transactionsController.fetchTransactions.bind(transactionsController));

export default router;
