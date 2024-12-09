/**
 * @swagger
 *   components:
 *    securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *    schemas:
 *      User:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            username:
 *              type: string
 *              description: Username.
 *            email:
 *              type: string
 *              description: User's email.
 *            password:
 *              type: number
 *              description: User's password.
 */
import express, { Request, Response } from 'express';
import userService from '../service/user.service';

const userRouter = express.Router();

/**
 * @swagger
 * /user/signup:
 *  post:
 *      summary: Sign a user up.
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              example: john_doe
 *                          email:
 *                              type: string
 *                              example: john@example.com
 *                          password:
 *                              type: string
 *                              example: password123
 *      responses:
 *          200:
 *              description: A User object.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/AuthenticationResponse'
 */

userRouter.post('/signup', async (req: Request, res: Response) => {
    userService.createUser(req.body)
        .then(user => res.status(200).json({ username: user.username, email: user.email, token: user.token }))
        .catch((err) => {
            res.status(500).json(err)
        });
});

/**
 * @swagger
 * /user/login:
 *  post:
 *      summary: Log a user in.
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              example: john_doe
 *                          password:
 *                              type: string
 *                              example: password123
 *      responses:
 *          200:
 *              description: A User object.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/AuthenticationResponse'
 */

userRouter.post('/login', async (req: Request, res: Response) => {
    userService.authenticate(req.body)
        .then(user => res.status(200).json({ username: user.username, email: user.email, token: user.token }))
        .catch((err) => {
            res.status(500).json(err)
        });
});

export { userRouter };
