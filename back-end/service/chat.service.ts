import { Chat } from "../model/chat";
import chatDb from "../repository/chat.db";
import messagesDb from "../repository/messages.db";
import usersDb from "../repository/users.db";
import { ChatInput } from "../types";
// import messagesDb from "../repository/messages.db";
// import usersDb from "../repository/users.db";
// import { ChatInput, MessageInput, UserInput } from "../types"; // The "Input type" aka lab-03 reference

//const getAllChats = (): Chat[] => chatDb.getAllChats();

const getAllChats = async (): Promise<Chat[]> => {
    return chatDb.getAllChats();
};

// const getChatById = (id: number): Chat => {
//     const chat = chatDb.getChatById({ id });
//     if (!chat) throw new Error(`Chat with id ${id} does not exist.`);
//     return chat;
// };

const getChatById = async (id: number): Promise<Chat> => {
    const chat = await chatDb.getChatById({ id });
    if (!chat) {
        throw new Error(`Course with id ${id} does not exist.`)
    }
    return chat;
};

const createChat = async ({ name, createdAt, users: userInputs = [], messages: messageInputs = [] }: ChatInput): Promise<Chat> => {
    const users = await Promise.all(userInputs.map(async userInput => {
        if (userInput.id === undefined) {
            throw new Error('User id is undefined');
        }
        const user = await usersDb.getUserById({ id: userInput.id });
        if (!user) throw new Error(`User with id ${userInput.id} not found`);
        return user;
    }));

    const messages = await Promise.all(messageInputs.map(async messageInput => {
        if (messageInput.id === undefined) {
            throw new Error('Message id is undefined');
        }
        const message = await messagesDb.getMessageById({ id: messageInput.id });
        if (!message) throw new Error(`Message with id ${messageInput.id} not found`);
        return message;
    }));

    const chat = new Chat({ name, createdAt, users, messages });
    return await chatDb.createChat(chat);
};

// const createChat = ({
//     name,
//     createdAt,
//     messages: messageInput,
//     users: userInput,
// }: ChatInput): Chat => {

//     const creationTime = Date.now()

//     const existingSchedule = chatDb.getChatById({
//         chatId : ChatInput.id,
//     });

//     if (existingSchedule) throw new Error('This chat already exists.');

//     const chat = new Chat({ name, createdAt: [] });
//     return chatDb.createChat(chat);
// };

export default {
    getAllChats,
    getChatById,
    createChat,
};
