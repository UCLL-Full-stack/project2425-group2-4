import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import Surreal from "surrealdb";



const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const db = new Surreal();
    const namespace = process.env.DBNAMESPACE || "";
    const database = process.env.DBDATABASE || "";
    const url = process.env.DBURL || "";

    await db.connect(url, {
        namespace: namespace,
        database: database,
    });

    const token = await db.signin({
        namespace: namespace,
        database: database,

        // Provide the name of the access method
        access: 'user',

        // Provide the variables used by the signin query
        variables: {
            email: email,
            password: password,
        }
    });

    db.close();
    return res.json({ token });
});



app.listen(port || 3000, () => {
    console.log(`Back-end is running on port ${port}.`);
});
