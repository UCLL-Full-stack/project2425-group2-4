import { UnauthorizedError } from "express-jwt";
import { Chat } from "../model/chat";
import { Message } from "../model/message";
import chatDb from "../repository/chat.db";
import messagesDb from "../repository/messages.db";
import usersDb from "../repository/users.db";
import { ChatInput, MessageInput, Role } from "../types";
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


const getChatById = async ({
    username,
    role,
    chatId,
}: {
    username: string;
    role: Role;
    chatId: number;
}): Promise<Chat> => {
    const chat = await chatDb.getChatById(chatId);
    if (role === 'admin' || role === 'moderator' || role === 'user') {
        if (!chat) {
            throw new Error(`Chat with id ${chatId} does not exist.`);
        }
        return chat;
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }
};

const createChat = async ({ name, users: userInputs = [] }: ChatInput): Promise<Chat> => {
    console.log(userInputs);
    const users = await Promise.all(userInputs.map(async userInput => {
        if (userInput.username === undefined) {
            console.log('Username is undefined');
            throw new Error('Username id is undefined');
        }
        const user = await usersDb.getUserByUsername({ username: userInput.username })
        if (!user) throw new Error(`User with username ${userInput.username} not found`);
        return user;
    }));

    console.log(users);

    const messages = new Array<MessageInput>();

    return await chatDb.createChat({ name: name, users: users, messages: messages });
};

export default {
    getChat,
    getChatById,
    createChat,
};
