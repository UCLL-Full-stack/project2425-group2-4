import express, { NextFunction, Request, Response } from 'express';
import messageService from '../service/message.service';
import { MessageInput, ChatInput } from '../types';

/**
 * @swagger
 *   components:
 *    schemas:
 *      Message:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            text:
 *              type: string
 *            messenger:
 *              $ref: '#/components/schemas/User'
 *            timestamp:
 *              type: string
 *              format: date-time

 */

const messageRouter = express.Router();

/**
 * @swagger
 * /chats/{id}:
 *   post:
 *      summary: Send a message within an existing chatroom.
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *              required: true
 *              description: The chat id.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Message'
 *      responses:
 *         200:
 *            description: The created message.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Message'
 */
messageRouter.post('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chatId = parseInt(req.params.id, 10);
        const message = <MessageInput>req.body;
        const result = await messageService.postMessage(chatId, message);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

export { messageRouter };
