import { Message } from '../model/message';
import { User } from '../model/user';
import chatDb from '../repository/chat.db';
import messagesDb from '../repository/messages.db';
import usersDb from '../repository/users.db';
import { MessageInput } from '../types';
import database from '../repository/database';



// const getMessageById = async (messageId: number): Promise<Message | null> => {
//     const message = await messagesDb.getMessageById({ id: Number(messageId) });
//     if (!message) {
//         throw new Error(`Message with id ${messageId} doesn't exist.`);
//     }
//     return message;
// };





const postMessage = async (chatId: number, {
    text,
    messenger: userInput,
    timestamp = new Date(),
}: MessageInput): Promise<Message> => {

    if (!text) {
        throw new Error('Text cannot be empty');
    }

    if (!userInput.username) {
        throw new Error('Messenger username is required');
    }

    const messenger = await usersDb.getUserByUsername({ username: userInput.username });

    if (!messenger) {
        //console.error(`User with id ${userInput.username} not found`);
        throw new Error('User not found');
    }

    const chat = await chatDb.getChatById(chatId);

    if (!chat) {
        //console.error(`Chat with id ${chatId} not found`);
        throw new Error('Chat not found');
    }

    const userId = messenger.getId();
    if (userId === undefined) {
        throw new Error('Username is undefined');
    }


    const message = new Message({ text, messenger, timestamp });
    chat.addMessage(message);
    await chatDb.updateChat({ chat });

    return await messagesDb.postMessage(message, chatId);
};


const deleteMessage = async (chatId: number, messageId: number): Promise<string> => {
    const chat = await chatDb.getChatById(chatId);

    if (!chat) {
        //console.error(`Chat with id ${chatId} not found`);
        throw new Error('Chat not found');
    }

    const existingMessage = await messagesDb.getMessageById({ id: messageId });

    if (!existingMessage) {
        //console.error(`Message with id ${messageId} not found`);
        throw new Error('Message not found');
    }

    // Maybe implement a removeMessage within the chatDb as well?
    await chatDb.updateChat({ chat });
    await messagesDb.deleteMessage(existingMessage);

    return 'Message has been successfully deleted.';
};


export default { postMessage, deleteMessage };
