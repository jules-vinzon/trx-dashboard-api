import { UsersService } from '../services/users-services.js';

export class UsersController {
    constructor() {
        this.usersService = new UsersService();
    }

    async addUsers(req, res) {
        try {
            const requestBody = req.body;
            const response = await this.usersService.addUser(requestBody, req.body.auth);

            return res.status(201).json(response);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new UsersController();
