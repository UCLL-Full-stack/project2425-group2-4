import { Message } from '../model/message';
import { User } from '../model/user';
import chatDb from '../repository/chat.db';
import messagesDb from '../repository/messages.db';
import usersDb from '../repository/users.db';
import { MessageInput } from '../types';

const sendMessage = ({
    text,
    messenger: userInput, // Using a hard-coded user for now
    timestamp = new Date(),
}: MessageInput): Message => {

    if (!text) {
        throw new Error('Text cannot be empty');
    }

    const messenger = usersDb.getUserById({ id: 1});

    if (!messenger) {
        throw new Error('User not found');
    }

    const message = new Message({ text, messenger, timestamp });
    return messagesDb.sendMessage(message);
};

export default { sendMessage };