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

const chatRouter = express.Router();

/**
 * @swagger
 * /chats:
 *   get:
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
        const chats = await chatService.getAllChats();
        res.status(200).json(chats);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /chats/{id}:
 *  get:
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

export { chatRouter };
