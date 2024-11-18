import express, { NextFunction, Request, Response } from 'express';
import messagesService from '../service/messages.service';
import { MessageInput, ChatInput } from '../types';

/**
 * @swagger
 *   components:
 *    schemas:
 *      ChatInput:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            createdAt:
 *              type: string
 *              format: date-time
 *            messages:
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/Message'
 *            users:
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/User'
 *      MessageInput:
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
 * /schedules:
 *   post:
 *      summary: Send a message within an existing chatroom.
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
 *                  $ref: '#/components/schemas/Message'
 */
messageRouter.post('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const message = <MessageInput>req.body;
        const result = await messagesService.sendMessage(message);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

export { messageRouter };
