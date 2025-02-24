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

    async getKey(req, res) {
        try {
            const requestBody = req.body;
            const response = await this.usersService.getKey(requestBody);

            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const requestBody = req.body;
            const response = await this.usersService.login(requestBody);

            if (response.success) {
                return res.status(200).json(response);
            } else {
                return res.status(401).json(response);
            }
            
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async logout(req, res) {
        try {
            const requestBody = req.body;
            const response = await this.usersService.logout(requestBody);

            if (response.success) {
                return res.status(200).json(response);
            } else {
                return res.status(400).json(response);
            }
            
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async refetch(req, res) {
        try {
            const token = req.headers.token;
            const response = await this.usersService.refetch(token);

            if (response.success) {
                return res.status(200).json(response);
            } else {
                return res.status(400).json(response);
            }
            
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async validateToken(req, res) {
        try {
            const token = req.body.token;
            const response = await this.usersService.validateToken(token);

            if (response.success) {
                return res.status(200).json(response);
            } else {
                return res.status(400).json(response);
            }
            
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new UsersController();
