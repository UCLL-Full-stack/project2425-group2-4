import { Chat } from "../model/chat";
import { Message } from "../model/message";
import { User } from "../model/user";
import database from "./database";
//import database from './database';

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

// const chats = [
//     new Chat({
//         id: 1,
//         name: "AI is fun",
//         createdAt: new Date('2023-10-01T10:00:00Z'),
//         messages: [
//             new Message({
//                 id: 1,
//                 text: "I like turtles",
//                 messenger: user1,
//                 timestamp: new Date('2023-10-23T13:04:00Z'),
//             }),
//             new Message({
//                 id: 2,
//                 text: "me too",
//                 messenger: user2,
//                 timestamp: new Date('2023-10-23T13:12:00Z'),
//             }),
//             new Message({
//                 id: 3,
//                 text: "wow ur so cool",
//                 messenger: user1,
//                 timestamp: new Date('2023-10-23T13:34:23Z'),
//             }),
//             new Message({
//                 id: 4,
//                 text: "i know right",
//                 messenger: user2,
//                 timestamp: new Date('2023-10-23T14:04:34Z'),
//             }),
//         ],
//         users: [
//             user1,
//             user2
//         ]
//     }),
//     new Chat({
//         id: 2,
//         name: "Developer life",
//         createdAt: new Date('2023-10-03T10:00:00Z'),
//         messages: [
//             new Message({
//                 id: 1,
//                 text: "Hello!",
//                 messenger: user1,
//                 timestamp: new Date('2023-10-03T10:01:00Z'),
//             }),
//             new Message({
//                 id: 2,
//                 text: "Hello back, how are you?",
//                 messenger: user2,
//                 timestamp: new Date('2023-10-03T10:02:00Z'),
//             }),
//             new Message({
//                 id: 3,
//                 text: "Good good, weather could be better but asides that we gucci",
//                 messenger: user1,
//                 timestamp: new Date('2023-10-03T10:03:00Z'),
//             }),
//             new Message({
//                 id: 4,
//                 text: "Great to hear that ur doing well! Weather does suck right now..",
//                 messenger: user2,
//                 timestamp: new Date('2023-10-03T10:04:00Z'),
//             }),
//         ],
//         users: [
//             user1,
//             user2
//         ]
//     }),
// ];

// To show all chats within the page
const getAllChats = async (): Promise<Chat[]> => {
    try {
        const chatsPrisma = await database.chat.findMany({
            include: {
                users: true,
                messages: true,
            },
        });
        return chatsPrisma.map((chatPrisma) => Chat.from(chatPrisma));
    } catch (error) {
        console.log(error);
        throw new Error('Chats couldn\'t be found. See server log for details.');
    }
};

// To access the chat's page
// const getChatById = ({ id }: { id: number }): Chat | null => {
//     try {
//         return chats.find((chat) => chat.getId() === id) || null;
//     } catch (error) {
//         console.error(error);
//         throw new Error("Chat ID not found. See server log for details.");
//     }
// };

const getChatById = async ({ id }: { id: number }): Promise<Chat | null> => {
    try {
        const chatPrisma = await database.chat.findUnique({
            where: { id },
            include: {
                users: true,
                messages: true,
            }
        })
        return chatPrisma ? Chat.from(chatPrisma) : null;
    } catch (error) {
        console.log(error);
        throw new Error("Chat ID not found. Check server log for details.");
    }
};

// const updateChat = (updatedChat: Chat): void => {
//     const index = chats.findIndex(chat => chat.getId() === updatedChat.getId());
//     if (index !== -1) {
//         chats[index] = updatedChat;
//     } else {
//         throw new Error('Chat not found');
//     }
// };

const updateChat = async ({ chat, }: { chat: Chat; }): Promise<Chat | null> => {
    try {
        const chatPrisma = await database.chat.update({
            where: { id: chat.getId() },
            data: {
                messages: {
                    connect: chat.getMessages()?.map((message) => ({ id: message.getId() }))
                },
            },
            include: {
                users: true,
                messages: true,
            }
        });
        return Chat.from(chatPrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Chat couldn\'t be updated. Check server log for details.')
    }
};

export default {
    getAllChats,
    getChatById,
    updateChat,
};