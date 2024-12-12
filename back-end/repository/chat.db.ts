import { Chat } from "../model/chat";
import { Message } from "../model/message";
import { User } from "../model/user";
import database from "./database";

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
        console.error(error);
        throw new Error('Chats couldn\'t be found. See server log for details.');
    }
};

const getChatById = async (chatId: number): Promise<Chat | null> => {
    try {
        const chatPrisma = await database.chat.findUnique({
            where: { id: chatId },
            include: {
                users: true,
                messages: true,
            }
        })
        return chatPrisma ? Chat.from(chatPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error("Chat ID not found. Check server log for details.");
    }
};

const createChat = async ( chat : Chat): Promise<Chat> => {
    try {
        const chatPrisma = await database.chat.create({
            data: {
                name: chat.getName(),
                createdAt: chat.getCreatedAt(),
                users: {
                    connect: chat.getUsers()?.map(user => ({ id: user.getId() })) || []
                },
                messages: {
                    connect: chat.getMessages()?.map(message => ({ id: message.getId() })) || []
                },
            },
            include: {
                users: true,
                messages: true,
            }
        });
        return Chat.from(chatPrisma);
    } catch (error) {
        console.error(error);
        throw new Error("Couldn't create chat. Check server log for details.");
    }
};

const updateChat = async ({ chat }: { chat: Chat; }): Promise<Chat | null> => {
    try {
        const chatPrisma = await database.chat.update({
            where: { id: chat.getId() },
            data: {
                messages: {
                    connect: chat.getMessages()?.map(message => ({ id: message.getId() })).filter(message => message.id !== undefined)
                },
            },
            include: {
                users: true,
                messages: true,
            }
        });
        return Chat.from(chatPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Chat couldn\'t be updated. Check server log for details.')
    }
};


export default {
    getAllChats,
    getChatById,
    updateChat,
    createChat,
};
