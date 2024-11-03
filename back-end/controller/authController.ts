import { Surreal } from 'surrealdb';
import { Request, Response } from 'express';
import { user } from '../types/user';

const login = async (req: Request, res: Response) => {
    const namespace = process.env.DBNAMESPACE || "";
    const database = process.env.DBDATABASE || "";
    const url = process.env.DBURL || "";
    const { email, password } = req.body;
    console.log(namespace, database, url);
    console.log(email, password);
    const db = new Surreal();
    await db.connect(url, {
        namespace: namespace,
        database: database,
    });


    try {

        const token = await db.signin({
            namespace: namespace,
            database: database,
            access: 'user',
            variables: {
                email: email,
                password: password,
            }
        });
        let user: user = new Object() as user;
        await db.query<[user]>('SELECT * FROM $auth.id')
            .then(users => user = users[0])
            .catch((e) => res.status(500).json({ message: 'Error logging in.' })) || new Object();

        db.close();

        return res.json({ accessToken: token, user: user });
    } catch (e) { res.status(401).json({ message: 'Error logging in.', error: e }); }

};

const logout = async (req: Request, res: Response) => {
    const namespace = process.env.DBNAMESPACE || "";
    const database = process.env.DBDATABASE || "";
    const url = process.env.DBURL || "";
    const { token } = req.body;
    const db = new Surreal();
    await db.connect(url, { namespace: namespace, database: database });
    try {
        await db.authenticate(token);
        await db.invalidate();
        res.json({ message: 'Logged out successfully.' });
    } catch (e) { res.json({ message: 'Error logging out.' }); }
};

const register = async (req: Request, res: Response) => {
    const namespace = process.env.DBNAMESPACE || "";
    const database = process.env.DBDATABASE || "";
    const url = process.env.DBURL || "";
    const { name, email, password } = req.body;
    const db = new Surreal();
    await db.connect(url, { namespace: namespace, database: database });
    try {
        const token = await db.signup({
            namespace: namespace,
            database: database,
            access: 'user',
            variables: {
                name: name,
                email: email,
                password: password,
                role: 'user',
            }
        });
        res.json({
            message: 'User registered successfully.',
            token: token
        });

    } catch (e) { res.json({ message: 'Error registering user.' }); }
};

module.exports = {
    login,
    logout,
    register
};
