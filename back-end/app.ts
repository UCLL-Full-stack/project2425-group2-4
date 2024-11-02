import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import Surreal from "surrealdb";

const authRouter = require('./routes/authRouter.ts');
const chatRouter = require('./routes/chatRouter.ts');


const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});

app.use('/auth', authRouter);

app.use('/chats', chatRouter);




app.listen(port || 3000, () => {
    console.log(`Back-end is running on port ${port}.`);
});
