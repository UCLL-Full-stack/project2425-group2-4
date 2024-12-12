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
import { ChatInput, Role } from '../types';

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
        const chat = await chatService.getChatById(Number(req.params.id));
        res.status(200).json(chat);
    } catch (error) {
        next(error);
    }
});


chatRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chat = <ChatInput>req.body;
        const result = await chatService.createChat(chat);
        res.status(200).json(result);
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ status: 'error', errorMessage: err.message });
    }
});

export { chatRouter };
