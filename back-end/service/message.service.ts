import { Message } from '../model/message';
import { User } from '../model/user';
import chatDb from '../repository/chat.db';
import messagesDb from '../repository/messages.db';
import usersDb from '../repository/users.db';
import { MessageInput } from '../types';

const postMessage = (chatId: number, {
    text,
    messenger: userInput, // Using a hard-coded user for now
    timestamp = new Date(),
}: MessageInput): Message => {

    if (!text) {
        throw new Error('Text cannot be empty');
    }

    const messenger = usersDb.getUserById({ id: userInput.id });

    if (!messenger) {
        throw new Error('User not found');
    }

    const chat = chatDb.getChatById({ id: chatId });

    if (!chat) {
        throw new Error('Chat not found');
    }

    const message = new Message({ text, messenger, timestamp });
    chat.addMessage(message);
    chatDb.updateChat(chat);

    return message;
};

export default { postMessage };