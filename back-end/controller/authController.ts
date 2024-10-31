import { Surreal } from 'surrealdb';
import { Request, Response } from 'express';

const login = async (req: Request, res: Response) => {
    const namespace = process.env.DBNAMESPACE || "";
    const database = process.env.DBDATABASE || "";
    const url = process.env.DBURL || "";
    const { email, password } = req.body;
    console.log(namespace, database, url);
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

        db.close();

        return res.json({ token });
    } catch (e) { res.json({ message: 'Error logging in.' }); }

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
