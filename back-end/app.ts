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


app.get('/test', async (req, res) => {
    const db = new Surreal();
    const url: string = process.env.DBURL || "";
    const namespace: string = process.env.DBNAMESPACE || "";
    const database: string = process.env.DBDATABASE || "";
    const username: string = process.env.DBUSERNAME || "";
    const password: string = process.env.DBPASSWORD || "";

    console.log(url, namespace, database, username, password);

    // Connect to the database
    await db.connect(url);

    // Select a specific namespace / database
    await db.use({
        namespace: namespace,
        database: database
    });

    // Signin as a namespace, database, or root user
    await db.signin({
        username: username,
        password: password
    });

    let people = await db.select("User");

    // Create a new person with a random id
    db.close();
    res.json(people);
});



app.listen(port || 3000, () => {
    console.log(`Back-end is running on port ${port}.`);
});
