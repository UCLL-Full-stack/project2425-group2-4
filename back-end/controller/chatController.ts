import { StringRecordId, Surreal } from 'surrealdb';
import { Request, Response } from 'express';
import { user } from '../types/user';
import { message } from '../types/message';
import { chat } from '../types/chat';


const getChats = async (req: Request, res: Response) => {
    const namespace = process.env.DBNAMESPACE || "";
    const database = process.env.DBDATABASE || "";
    const url = process.env.DBURL || "";
    const { token } = req.body;
    console.log(namespace, database, url);
    const db = new Surreal();
    await db.connect(url, {
        namespace: namespace,
        database: database,
    });

    try {

        //await db.authenticate(token);
        await db.signin({
            namespace: namespace,
            database: database,
            access: 'user',
            variables: {
                email: "jan@jan.be",
                password: "jan123",
            }
        });

        db.select('chat')
            .then((chats) => { db.close; res.json(chats); })
            .catch((e) => { db.close(); res.status(500).json({ message: 'Error fetching chats.' }); });

    } catch (e) { res.status(500).json({ message: 'Error authenticating.' }); }


};

const createChat = async (req: Request, res: Response) => {
    const namespace = process.env.DBNAMESPACE || "";
    const database = process.env.DBDATABASE || "";
    const url = process.env.DBURL || "";
    const { token, name } = req.body;
    const db = new Surreal();
    await db.connect(url, { namespace: namespace, database: database });
    try {

        //await db.authenticate(token);
        await db.signin({
            namespace: namespace,
            database: database,
            access: 'user',
            variables: {
                email: "jan@jan.be",
                password: "jan123",
            }
        });
        let user: user = new Object() as user;

        await db.query<[user]>('SELECT * FROM $auth.id').then((u) => user = u[0]).catch((e) => { db.close(); res.status(500).json({ message: 'Error fetching user' }) }).finally(() => console.log({ user: user }));

        let newChat: chat[] = await db.create<chat>('chat', { name: name }).catch((e) => { db.close(); res.status(500).json({ message: 'Error creating chat' }) }) || new Object() as Array<chat>;

        await db.query('RELATE $chat->hasUser->$auth;', { chat: newChat[0] }).catch((e) => { db.close; res.status(500).json({ message: 'Error allocating user to new chat' }) });

        await db.query('SELECT *,->hasUser->user.{username,id,email,role} as users, <-writtenIn<-message.{ text,id,timestamp,messenger.{username,email,role}} as messages from $fd', { fd: newChat[0] })
            .then((chat) => { db.close(); res.json(chat) })
            .catch((e) => { db.close(); res.status(500).json({ message: 'Error fetching chat' }) })

    } catch (e) { db.close(); res.status(500).json({ message: 'Error authenticating.' }); }
};

const getChat = async (req: Request, res: Response) => {
    const namespace = process.env.DBNAMESPACE || "";
    const database = process.env.DBDATABASE || "";
    const url = process.env.DBURL || "";

    const { token } = req.body;
    const { chatId } = req.params;

    console.log(namespace, database, url, chatId);
    const db = new Surreal();
    await db.connect(url, { namespace: namespace, database: database });
    try {
        //await db.authenticate(token);
        await db.signin({
            namespace: namespace,
            database: database,
            access: 'user',
            variables: {
                email: "jan@jan.be",
                password: "jan123",
            }
        });


        await db.query('SELECT *,->hasUser->user.{username,id,email,role} as users, <-writtenIn<-message.{ text,id,timestamp,messenger.{username,email,role}} as messages from $fd', { fd: new StringRecordId(chatId) })
            .then((chat) => { db.close(); res.json(chat[0]) })
            .catch((e) => { db.close(); res.status(500).json({ message: 'Error fetching chat' }) })
    } catch (e) { db.close(); res.status(500).json({ message: 'Error authenticating' }) }
};

const sendMessage = async (req: Request, res: Response) => {
    const namespace = process.env.DBNAMESPACE || "";
    const database = process.env.DBDATABASE || "";
    const url = process.env.DBURL || "";
    const { token, messageContent } = req.body;
    const chatId = req.params.chatId;
    const db = new Surreal();
    await db.connect(url, { namespace: namespace, database: database });

    try {
        //await db.authenticate(token);
        await db.signin({
            namespace: namespace,
            database: database,
            access: 'user',
            variables: {
                email: "jan@jan.be",
                password: "jan123",
            }
        });
        let message: message[] = await db.create<message>('message', { text: messageContent }).catch((e) => { db.close(); res.status(500).json({ message: "Error creating new message" }) }) || new Object() as Array<message>;

        await db.query('RELATE $message->writtenIn->$chat;', { message: message[0], chat: new StringRecordId(chatId) }).catch(() => { db.close(); res.status(500).json({ message: "Error relating message to chat" }) });

        res.json(message);
    } catch (e) { res.status(500).json({ message: "Error authenticating" }) }

};

module.exports = {
    getChats,
    getChat,
    createChat,
    sendMessage
};
