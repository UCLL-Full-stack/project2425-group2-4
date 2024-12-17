import express, { NextFunction, Request, Response } from 'express';
import messageService from '../service/message.service';
import { MessageInput } from '../types';

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
 *            chatId:
 *              type: number
 *              format: int64
 *      MessageInput:
 *          type: object
 *          properties:
 *            text:
 *              type: string
 *            messenger:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *            timestamp:
 *              type: string
 *              format: date-time
 *      User:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            username:
 *              type: string
 *            email:
 *              type: string
 *            role:
 *              type: string
 */

const messageRouter = express.Router();

/**
 * @swagger
 * /chats/{id}:
 *   post:
 *      security:
 *         - bearerAuth: []
 *      summary: Send a message within an existing chatroom.
 *      tags: [Message]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *            description: The chat id.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/MessageInput'
 *      responses:
 *         200:
 *            description: The created message.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/MessageInput'
 */
messageRouter.post('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chatId = parseInt(req.params.id, 10);
        const message = <MessageInput>req.body;
        const result = await messageService.postMessage(chatId, message);
        res.status(200).json(result);
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ status: 'error', errorMessage: err.message });
    }
});



/**
 * @swagger
 * /chats/{id}:
 *   delete:
 *      security:
 *         - bearerAuth: []
 *      summary: Delete a message within an existing chatroom.
 *      tags: [Message]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *            description: The chat id.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *                  description: The message id.
 *      responses:
 *         200:
 *            description: The deleted message.
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    status:
 *                      type: string
 *                    message:
 *                      $ref: '#/components/schemas/Message'
 */
messageRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chatId = parseInt(req.params.id, 10);
        const { id: messageId } = req.body;
        const result = await messageService.deleteMessage(chatId , messageId);
        res.status(200).json(result);
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ status: 'error', errorMessage: err.message });
    }
});





export { messageRouter };
