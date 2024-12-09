import { Chat } from "../model/chat";
import { Message } from "../model/message";
import { User } from "../model/user";
import database from './database';

// creating hard-coded DB
// const user1 = new User({
//     id: 1,
//     username: "yamaha46",
//     email: "yamahalover46@gmail.com",
//     password: "R6fan99",
// });

// const user2 = new User({
//     id: 2,
//     username: "Broski21",
//     email: "broskibroski@gmail.com",
//     password: "nuggetslovr6",
// });

// const messages = [
//     new Message({
//         id: 1,
//         text: "Hello!",
//         messenger: user1,
//         timestamp: new Date('2023-18-11T10:01:00Z'),
//     }),
//     new Message({
//         id: 2,
//         text: "Hello back, how are you?",
//         messenger: user2,
//         timestamp: new Date('2023-18-11T10:02:00Z'),
//     }),
//     new Message({
//         id: 3,
//         text: "Good good, weather could be better but asides that we gucci",
//         messenger: user1,
//         timestamp: new Date('2023-18-11T10:03:00Z'),
//     }),
//     new Message({
//         id: 4,
//         text: "Great to hear that ur doing well! Weather does suck right now..",
//         messenger: user2,
//         timestamp: new Date('2023-18-11T10:04:00Z'),
//     }),
// ];

// We could use getAllMessages & getMessageById for logging purposes,
// leave as is for now. xd
//const getAllMessages = (): Message[] => messages;

const getAllMessages = async (): Promise<Message[]> => {
    try {
        const messagesPrisma = await database.message.findMany({
            include: {
                messenger: true,
            },
        });
        const messages = await Promise.all(messagesPrisma.map(async (messagePrisma) => await Message.from(messagePrisma)));
        return messages;
    } catch (error) {
        console.error(error);
        throw new Error("Can't gather the messages. Check server log for details.");
    }
}

// const getMessageById = ({ id }: { id: number }): Message | null => {
//     return messages.find((message) => message.getId() === id) || null;
// };

const getMessageById = async ({ id }: { id: number }): Promise<Message | null> => {
    try {
        const messagePrisma = await database.message.findUnique({
            where: { id },
            include: {
                messenger: true,
            }
        });
        return messagePrisma ? Message.from(messagePrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Message couldn\'t be found. Check server log for details.');
    }
};

// Can be reworked, not that complex
const postMessage = async (message: Message, chatId: number): Promise<Message> => {
    try {
        const messagePrisma = await database.message.create({
            data: {
                text: message.getText(),
                messenger: { connect: { id: message.getMessenger().getId() } },
                timestamp: message.getTimestamp(),
                chat: { connect: { id: chatId } },
            },
            include: {
                messenger: true,
            },
        });
        return Message.from(messagePrisma);
    } catch (error) {
        console.error(error);
        throw new Error("Message couldn't be sent. Check server log for details.");
    }
};

// const postMessage = (message: Message): Message => {
//     messages.push(message);
//     return message;
// };


export default {
    getAllMessages,
    getMessageById,
    postMessage,
}