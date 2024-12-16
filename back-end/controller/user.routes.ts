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
import express, { Request, Response, NextFunction } from 'express';
import userService from '../service/user.service';
import { UserInput } from '../types';

const userRouter = express.Router();

/**
 * @swagger
 * /user:
 *   get:
 *   security:
 *   - bearerAuth: []
 *     summary: Get a list of all users
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/User'
 */
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: UserInput };
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /user/friends:
 *   get:
 *   security:
 *   - bearerAuth: []
 *     summary: Get a list of all friends
 *     responses:
 *       200:
 *         description: A list of friends.
 *         content:
 *           application/json:
 *             schema:
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/User'
 */
userRouter.get('/friends', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: UserInput };
        const { username } = request.auth;
        const users = await userService.getAllFriends(username);
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /user/friendrequests:
 *   get:
 *   security:
 *   - bearerAuth: []
 *     summary: Get a list of all friendrequests
 *     responses:
 *       200:
 *         description: A list of friendrequests.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Friendrequest'
 */
userRouter.get('/friendrequests', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: UserInput };
        const { username } = request.auth;
        const friendrequests = await userService.showFriendRequests(username);
        res.status(200).json(friendrequests);
    } catch (error) {
        next(error);
    }
});


/**
 * @swagger
 * /user/friendrequests:
 *   post:
 *   security:
 *   - bearerAuth: []
 *     summary: Accept or decline a friendrequest.
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: int
 *                              example: 1
 *                          accepted:
 *                              type: bool
 *                              example: true
 *     responses:
 *       200:
 *         description: Friendrequest.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
userRouter.post('/friendrequests', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: UserInput };
        const { username } = request.auth;
        const { id, accepted } = req.body;
        await userService.handleFriendRequest(username, id, accepted);
        res.status(200).json("Friend request handled")
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /user/friends:
 *   post:
 *   security:
 *   - bearerAuth: []
 *     summary: Send a new friendrequest
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          friendUsername:
 *                              type: string
 *                              example: john_doe
 *     responses:
 *       200:
 *         description: new friendrequest.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/User'
 */
userRouter.post('/friends', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: UserInput };
        const { username } = request.auth;
        const { friendUsername } = req.body;
        await userService.sendFriendRequest(username, friendUsername);
        res.status(200).json("Friend request sent");
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /user:
 *   get:
 *   security:
 *   - bearerAuth: []
 *     summary: Get a list of all users
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/User'
 */
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: UserInput };
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /user:
 *   get:
 *   security:
 *   - bearerAuth: []
 *     summary: Get a list of all users
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/User'
 */
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: UserInput };
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});
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

userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserInput>req.body;
        const user = await userService.createUser(userInput);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
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

userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserInput>req.body;
        const response = await userService.authenticate(userInput);
        res.status(200).json({ message: 'Authentication succesful', ...response });
    } catch (error) {
        next(error);
    }
});

export { userRouter };
