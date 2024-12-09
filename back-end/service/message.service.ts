import { Message } from '../model/message';
import { User } from '../model/user';
import chatDb from '../repository/chat.db';
import messagesDb from '../repository/messages.db';
import usersDb from '../repository/users.db';
import { MessageInput } from '../types';

const postMessage = async (chatId: number, {
    text,
    messenger: userInput,
    timestamp = new Date(),
}: MessageInput): Promise<Message> => {

    if (!text) {
        throw new Error('Text cannot be empty');
    }

    const messenger = await usersDb.getUserById({ id: userInput.id });

    if (!messenger) {
        console.error(`User with id ${userInput.id} not found`);
        throw new Error('User not found');
    }

    const chat = await chatDb.getChatById({ id: chatId });

    if (!chat) {
        console.error(`Chat with id ${chatId} not found`);
        throw new Error('Chat not found');
    }

    const message = new Message({ text, messenger, timestamp });
    chat.addMessage(message);
    await chatDb.updateChat({ chat });

    return await messagesDb.postMessage(message, chatId);
};

export default { postMessage };