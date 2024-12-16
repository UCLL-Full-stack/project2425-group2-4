/**
 * @swagger
 *   components:
 *    securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *    schemas:
 *      Chat:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            name:
 *              type: string
 *            createdAt:
 *              type: string
 *              format: date-time
 *            messages:
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/Message'
 *            users:
 *              description: An array of users.
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/User'
 */
import express, { NextFunction, Request, Response } from 'express';
import chatService from '../service/chat.service';
import { ChatInput, Role, UserInput } from '../types';

const chatRouter = express.Router();

/**
 * @swagger
 * /chats:
 *   get:
 *     security:
 *         - bearerAuth: []
 *     summary: Get a list of all chats.
 *     responses:
 *       200:
 *         description: A list of chats.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Chat'
 */
chatRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username, role } = request.auth;
        const chats = await chatService.getChat({ username, role });
        res.status(200).json(chats);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /chats/{id}:
 *  get:
 *      security:
 *         - bearerAuth: []
 * 
 *      summary: Get a Chat by id.
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *              required: true
 *              description: The chat id.
 *      responses:
 *          200:
 *              description: A chat object.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Chat'
 */
chatRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        console.log(request.auth);
        const { username, role } = request.auth;
        const chatId = Number(req.params.id);
        //const chatId = Number(req.params.id);
        const chat = await chatService.getChatById({ username, role, chatId });
        res.status(200).json(chat);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /chats:
 *  post:
 *      security:
 *         - bearerAuth: []
 *      summary: Create a chatroom.
 *      tags: [Chat]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: Untitled_Chatroom
 *                          Users:
 *                              type: array
 *                              example: [{"id": 1, "username": "user1", "email": "test@test.be", "role": "user" },{"id": 2, "username": "user2", "email": "test@test.be", "role": "user" },{"id": 3, "username": "user3", "email": "test@test.be", "role": "user" }]
 *
 *      responses:
 *          200:
 *              description: A User object.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Chat'
 */

chatRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { id: number, username: string, email: string, role: Role } };
        console.log(request.auth);
        const chatname = request.body.name;
        const users: Array<UserInput> = request.body.users;
        users.push({ id: request.auth.id, username: request.auth.username, email: request.auth.email, role: request.auth.role });
        const result = await chatService.createChat({ name: chatname, users: users });
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ status: 'error', errorMessage: err.message });
    }
});

/**
 * @swagger
 * /chats:
 *  patch:
 *      security:
 *         - bearerAuth: []
 *      summary: update a chatroom.
 *      tags: [Chat]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: Untitled_Chatroom
 *      responses:
 *          200:
 *              description: A User object.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Chat'
 */

chatRouter.patch('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { id: number, username: string, email: string, role: Role } };
        const chatname = request.body.name;
        const chatId = Number(request.body.id)
        const result = await chatService.updateChat({ name: chatname, id: chatId })
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ status: 'error', errorMessage: err.message });
    }
});

export { chatRouter };
