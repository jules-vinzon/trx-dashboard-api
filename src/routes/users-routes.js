import express from "express";
import { UsersController } from "../controllers/users-controller.js";
import { UsersMiddleware } from '../middlewares/user-middleware.js';
import { AuthMiddleware } from '../middlewares/auth-middleware.js';


const router = express.Router();
const usersController = new UsersController()
const usersMiddleware = new UsersMiddleware();
const authMiddleware = new AuthMiddleware();

router.post('/add', 
    authMiddleware.authenticateMiddleware.bind(authMiddleware),
    usersMiddleware.addUserMiddleware.bind(usersMiddleware), 
    usersController.addUsers.bind(usersController)
);
router.post('/get/key', usersController.getKey.bind(usersController));
router.post('/login', usersController.login.bind(usersController));
router.post('/logout', usersController.logout.bind(usersController));
router.get('/refetch', usersController.refetch.bind(usersController));
router.get('/validate/token', usersController.validateToken.bind(usersController));

export default router;
