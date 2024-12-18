import { UnauthorizedError } from "express-jwt";
import { Chat } from "../model/chat";
import { Message } from "../model/message";
import chatDb from "../repository/chat.db";
import messagesDb from "../repository/messages.db";
import usersDb from "../repository/users.db";
import { ChatInput, MessageInput, Role } from "../types";

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
    if (!chat) {
        throw new Error(`Chat with id ${chatId} does not exist.`);
    }

    if (role === 'admin' || role === 'moderator') {
        return chat;
    } else if (role === 'user') {
        const userIsMember = chatDb.getChatForUser({ username: username })
        if (!userIsMember) {
            throw new UnauthorizedError('credentials_required', {
                message: 'You are not authorized to access this resource.',
            });
        }
        return chat;
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }
};

const createChat = async ({ name, users: userInputs = [] }: ChatInput): Promise<Chat> => {
    //console.log(userInputs);
    const users = await Promise.all(userInputs.map(async userInput => {
        const user = await usersDb.getUserByUsername({ username: userInput.username })
        if (!user) {
            throw new Error(`User with username ${userInput.username} not found`);
        };
        return user;
    }));

    //console.log(users);

    const messages = new Array<MessageInput>();

    return await chatDb.createChat({ name: name, users: users, messages: messages });
};

const updateChat = async ({ name, id }: ChatInput): Promise<Chat> => {

    return await chatDb.updateChatname({ name: name, id });
};

export default {
    getChat,
    getChatById,
    createChat,
    updateChat
};
