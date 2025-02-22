import express from "express";
import { UsersController } from "../controllers/users-controller.js";
import { UsersMiddleware } from '../middlewares/user-middleware.js';
import { AuthMiddleware } from '../middlewares/auth-middleware.js';


const router = express.Router();
const usersController = new UsersController()
const usersMiddleware = new UsersMiddleware();
const authMiddleware = new AuthMiddleware();

router.post('/add', 
    authMiddleware.authenticateMiddelware.bind(authMiddleware),
    usersMiddleware.addUserMiddleware.bind(usersMiddleware), 
    usersController.addUsers.bind(usersController)
);

export default router;
