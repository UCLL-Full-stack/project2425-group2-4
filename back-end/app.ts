import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { chatRouter } from './controller/chat.routes';
import { messageRouter } from './controller/message.routes';
import { userRouter } from './controller/user.routes';
import { expressjwt } from 'express-jwt';
import helmet from 'helmet';

const app = express();
app.use(helmet());

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            // Allow connections to own server and the external API
            connectSrc: ["'self'", 'https://api.ucll.be'],
        },
    })
);


dotenv.config();
const port = process.env.APP_PORT || 3000;

// const corsOptions = {
//     origin: 'http://localhost:8080', // Allow only this origin
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     preflightContinue: false,
//     optionsSuccessStatus: 200,
// };
app.use(cors({ origin: 'http://localhost:8080' }));
app.use(bodyParser.json());

app.use(
    expressjwt({
        secret: process.env.JWT_SECRET || 'default_secret',
        algorithms: ['HS256'],
    }).unless({
        path: ['/api-docs', /^\/api-docs\/.*/, '/user/login', '/user/signup', '/status'],
    })
);


app.use('/user', userRouter);
app.use('/chats', chatRouter);
app.use('/chats', messageRouter);

app.get('/status', (req, res) => {
    res.json({ message: 'Diddyscord API is running...' });
});

const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Diddyscord API',
            version: '1.0',
        },
    },
    apis: ['./controller/*.routes.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ status: 'unauthorized', message: err.message });
    } else if (err.name === 'DiddyscordError') {
        res.status(400).json({ status: 'domain error', message: err.message });
    } else {
        res.status(400).json({ status: 'application error', message: err.message });
    }
});


app.listen(port || 3000, () => {
    console.log(`Back-end is running on port ${port}.`);
});
