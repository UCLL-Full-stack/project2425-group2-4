import { Chat } from "../model/chat";
import { Message } from "../model/message";
import { User } from "../model/user";
import database from './database';

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
// If message bugs, do : npx prisma migrate reset; npx ts-node util/seed.ts. It will reset DB.
const postMessage = async (message: Message, chatId: number): Promise<Message> => {
    try {
        const messagePrisma = await database.message.create({
            data: {
                text: message.getText(),
                messenger: { connect: { username: message.getMessenger().getUsername() } },
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


// DeleteMessage
const deleteMessage = async (message: Message, chatId: number): Promise<Message> => {
    try {
        const messagePrisma = await database.message.delete({
            where: {
                id: message.getId(),
            },
            include: {
                messenger: true,
            },
        });
        return Message.from(messagePrisma);
    } catch (error) {
        console.error(error);
        throw new Error("Message couldn't be deleted. Check server log for details.");
    }
};

export default {
    getAllMessages,
    getMessageById,
    postMessage,
    deleteMessage,
}