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

    if (!userInput.id) {
        throw new Error('Messenger ID is required');
    }

    const messenger = usersDb.getUserById({ id: userInput.id });

    if (!messenger) {
        throw new Error('User not found');
    }

    const chat = chatDb.getChatById({ id: chatId });

    if (!chat) {
        throw new Error('Chat not found');
    }

    const userId = messenger.getId();
    if (userId === undefined) {
        throw new Error('User ID is undefined');
    }

    const message = new Message({ text, userId, timestamp });
    
    const message = new Message({ text, messenger, timestamp });
    chat.addMessage(message);
    chatDb.updateChat(chat);

    return messagesDb.postMessage(message);
};

export default { postMessage };
