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
 *            role:
 *               $ref: '#/components/schemas/Role'
 *      UserInput:
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
 *              type: string
 *              description: User's password.
 *            role:
 *               $ref: '#/components/schemas/Role'
 *      FriendRequestInput:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            sender:
 *              type: object
 *              properties:
 *                userId:
 *                  type: number
 *                  format: int64
 *            receiver:
 *              type: object
 *              properties:
 *                userId:
 *                  type: number
 *                  format: int64
 *            status:
 *              type: string
 *              enum: [accepted, declined, pending]
 *            timestamp:
 *              type: string
 *              format: date-time
 *      FriendRequest:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              description: The ID of the friend request.
 *            status:
 *              type: string
 *              description: Status of the friend request. Either 'accepted', 'declined' or 'pending'.
 *      AuthenticationResponse:
 *          type: object
 *          properties:
 *            token:
 *              type: string
 *              description: JWT access token.
 *            username:
 *              type: string
 *              description: The username of the user itself.
 *            email:
 *              type: string
 *              description: User's email.
 *            role:
 *              type: string
 *              description: User's role.
 *      AuthenticationRequest:
 *          type: object
 *          properties:
 *            username:
 *              type: string
 *              description: User name.
 *            password:
 *              type: string
 *              description: User password.
 *      Role:
 *          type: string
 *          enum: [admin, moderator, user]
 *      Status:
 *          type: string
 *          enum: [accepted, declined, pending]
 */


import express, { Request, Response, NextFunction } from 'express';
import userService from '../service/user.service';
import { UserInput } from '../types';

const userRouter = express.Router();


/**
 * @swagger
 * /user:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all users
 *     tags: [User]
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
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all friends
 *     tags: [Friends]
 *     responses:
 *       200:
 *         description: A list of friends.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
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
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all friend requests
 *     tags: [Friends]
 *     responses:
 *       200:
 *         description: A list of friend requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/FriendRequestInput'
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
 *     security:
 *       - bearerAuth: []
 *     summary: Accept or decline a friend request.
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FriendRequest'
 *     responses:
 *       200:
 *         description: Friend request handled.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FriendRequest'
 */
userRouter.post('/friendrequests', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: UserInput };
        const { username } = request.auth;
        const { id, status } = req.body;
        await userService.handleFriendRequest(username, id, status);
        res.status(200).json("Friend request handled")
    } catch (error) {
        next(error);
    }
});


/**
 * @swagger
 * /user/friends:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Send a new friend request
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               friendUsername:
 *                 type: string
 *                 example: john_doe
 *     responses:
 *       200:
 *         description: New friend request sent.
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
 * /user/signup:
 *  post:
 *      summary: Sign a user up. The role in the front-end is 'user' as default, but within the back-end you can choose.
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UserInput'
 *                  example:
 *                      username: "john_doe"
 *                      email: "john.doe@example.com"
 *                      password: "password123"
 *                      role: "user"
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
 *   post:
 *      summary: Login using a username & password. Returns an object with JWT token and user name when succesful.
 *      tags: [User]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AuthenticationRequest'
 *            example:
 *              username: "john_doe"
 *              password: "password123"
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
