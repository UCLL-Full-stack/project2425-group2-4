import { UnauthorizedError } from "express-jwt";
import { Chat } from "../model/chat";
import chatDb from "../repository/chat.db";
import messagesDb from "../repository/messages.db";
import usersDb from "../repository/users.db";
import { ChatInput, Role } from "../types";
// import messagesDb from "../repository/messages.db";
// import usersDb from "../repository/users.db";
// import { ChatInput, MessageInput, UserInput } from "../types"; // The "Input type" aka lab-03 reference

const getChat = async ({
    username,
    role,
}: {
    username: string;
    role: Role;
}): Promise<Chat[]> => {
    if (role === 'admin' || role === 'moderator') {
        return chatDb.getAllChats();
    } else if (role === 'user') {
        return chatDb.getChatForUser({ username });
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }
};


const getChatById = async (chatId: number): Promise<Chat> => {
    const chat = await chatDb.getChatById(chatId);
    if (!chat) {
        throw new Error(`Chat with id ${chatId} does not exist.`)
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

export default {
    getChat,
    getChatById,
    createChat,
};
