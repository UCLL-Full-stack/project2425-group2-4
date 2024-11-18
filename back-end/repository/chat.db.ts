import { Chat } from "../model/chat";
import { Message } from "../model/message";
import { User } from "../model/user";
//import database from './database';

// creating hard-coded DB
const user1 = new User({
    id: 1,
    username: "yamaha46",
    email: "yamahalover46@gmail.com",
    password: "R6fan99",
});

const user2 = new User({
    id: 2,
    username: "Broski21",
    email: "broskibroski@gmail.com",
    password: "nuggetslovr6",
});

const chats = [
    new Chat({
        id: 1,
        name: "AI is fun",
        createdAt: new Date('2023-10-01T10:00:00Z'),
        messages: [
            new Message({
                id: 1,
                text: "Hello!",
                messenger: user1,
                timestamp: new Date('2023-18-11T10:01:00Z'),
            }),
            new Message({
                id: 2,
                text: "Hello back, how are you?",
                messenger: user2,
                timestamp: new Date('2023-18-11T10:02:00Z'),
            }),
            new Message({
                id: 3,
                text: "Good good, weather could be better but asides that we gucci",
                messenger: user1,
                timestamp: new Date('2023-18-11T10:03:00Z'),
            }),
            new Message({
                id: 4,
                text: "Great to hear that ur doing well! Weather does suck right now..",
                messenger: user2,
                timestamp: new Date('2023-18-11T10:04:00Z'),
            }),
        ],
        users: [
            user1,
            user2
        ]
    }),
];

// To show all chats within the page
const getAllChats = (): Chat[] => chats;

// To access the chat's page
const getChatById = ({ id }: { id: number }): Chat | null => {
    try {
        return chats.find((chat) => chat.getId() === id) || null;
    } catch (error) {
        console.error(error);
        throw new Error("Diddy says: not found :O");
    }
};

// const createChat = (chat: Chat): Chat => {
//     chats.push(chat);
//     return chat;
// };

export default {
    getAllChats,
    getChatById,
    //createChat,
};