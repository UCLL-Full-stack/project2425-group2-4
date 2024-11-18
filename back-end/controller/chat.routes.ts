/**
 * @swagger
 *   components:
 *    securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *    schemas:
 *      Lecturer:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            name:
 *              type: string
 *              description: Chat name.
 *            expertise:
 *              type: string
 *              description: Lecturer expertise.
 */
import express, { NextFunction, Request, Response } from 'express';
import chatService from '../service/chat.service';

const chatRouter = express.Router();

/**
 * @swagger
 * /chatrooms:
 *   get:
 *     summary: Get a list of all chatrooms.
 *     responses:
 *       200:
 *         description: A list of chatrooms.
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
 * /lecturers/{id}:
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
