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

const userRouter = express.Router();

export { userRouter };
