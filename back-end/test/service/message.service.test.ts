import { set } from 'date-fns';
import { Message } from '../../model/message';
import { User } from '../../model/user';
import { Chat } from '../../model/chat';
import chatDb from '../../repository/chat.db';
import messagesDb from '../../repository/messages.db';
import usersDb from '../../repository/users.db';
import messageService from '../../service/message.service';

jest.mock('../../repository/chat.db');
jest.mock('../../repository/messages.db');
jest.mock('../../repository/users.db');

const user1 = new User({
    id: 1,
    username: 'yamaha46',
    email: 'yamahalover46@gmail.com',
    password: 'R6fan99',
    role: 'admin'
});

const user2 = new User({
    id: 2,
    username: 'Broski21',
    email: 'broskibroski@gmail.com',
    password: 'nuggetslovr6',
    role: 'moderator'
});

const messageData = {
    text: 'Hello!',
    messenger: { username: 'yamaha46' },
    timestamp: set(new Date(), { year: 2023, month: 10, date: 18, hours: 10, minutes: 1 }),
};

const message = new Message({
    id: 1,
    text: 'Hello!',
    messenger: user1,
    timestamp: set(new Date(), { year: 2023, month: 10, date: 18, hours: 10, minutes: 1 }),
});

const chatData = {
    id: 1,
    name: 'Developer life',
    createdAt: set(new Date(), { year: 2023, month: 10, date: 3, hours: 10, minutes: 0 }),
    messages: [message],
    users: [user1, user2],
};

const chat = new Chat(chatData);

beforeEach(() => {
    jest.clearAllMocks();
});

test('given valid message data, when postMessage is called, then the message is posted', async () => {
    // given
    (usersDb.getUserByUsername as jest.Mock).mockResolvedValue(user1);
    (chatDb.getChatById as jest.Mock).mockResolvedValue(chat);
    (messagesDb.postMessage as jest.Mock).mockResolvedValue(message);

    // when
    const result = await messageService.postMessage(chatData.id, messageData);

    // then
    expect(result).toEqual(message);
    expect(usersDb.getUserByUsername).toHaveBeenCalledWith({ username: messageData.messenger.username });
    expect(chatDb.getChatById).toHaveBeenCalledWith(chatData.id);
    expect(messagesDb.postMessage).toHaveBeenCalledWith(expect.any(Message), chatData.id);
    expect(chatDb.updateChat).toHaveBeenCalledWith({ chat });
});

test('given missing text, when postMessage is called, then an error is thrown', async () => {
    // given
    const invalidMessageData = { ...messageData, text: '' };

    // when
    const postMessage = messageService.postMessage(chatData.id, invalidMessageData);

    // then
    await expect(postMessage).rejects.toThrow('Text cannot be empty');
});

test('given invalid user id, when postMessage is called, then an error is thrown', async () => {
    // given
    (usersDb.getUserByUsername as jest.Mock).mockResolvedValue(null);

    // when
    const postMessage = messageService.postMessage(chatData.id, messageData);

    // then
    await expect(postMessage).rejects.toThrow('User not found');
});

test('given invalid chat id, when postMessage is called, then an error is thrown', async () => {
    // given
    (usersDb.getUserByUsername as jest.Mock).mockResolvedValue(user1);
    (chatDb.getChatById as jest.Mock).mockResolvedValue(null);

    // when
    const postMessage = messageService.postMessage(chatData.id, messageData);

    // then
    await expect(postMessage).rejects.toThrow('Chat not found');
});

test('given valid chat and message id, when deleteMessage is called, then the message is deleted', async () => {
    // given
    const messageId = 1;
    (chatDb.getChatById as jest.Mock).mockResolvedValue(chat);
    (messagesDb.getMessageById as jest.Mock).mockResolvedValue(message);
    (messagesDb.deleteMessage as jest.Mock).mockResolvedValue(null);

    // when
    const result = await messageService.deleteMessage(chatData.id, messageId);

    // then
    expect(result).toEqual('Message has been successfully deleted.');
    expect(chatDb.getChatById).toHaveBeenCalledWith(chatData.id);
    expect(messagesDb.getMessageById).toHaveBeenCalledWith({ id: messageId });
    expect(messagesDb.deleteMessage).toHaveBeenCalledWith(message);
    expect(chatDb.updateChat).toHaveBeenCalledWith({ chat });
});

test('given invalid chat id, when deleteMessage is called, then an error is thrown', async () => {
    // given
    const messageId = 1;
    (chatDb.getChatById as jest.Mock).mockResolvedValue(null);

    // when
    const deleteMessage = messageService.deleteMessage(chatData.id, messageId);

    // then
    await expect(deleteMessage).rejects.toThrow('Chat not found');
});

test('given invalid message id, when deleteMessage is called, then an error is thrown', async () => {
    // given
    const messageId = 1;
    (chatDb.getChatById as jest.Mock).mockResolvedValue(chat);
    (messagesDb.getMessageById as jest.Mock).mockResolvedValue(null);

    // when
    const deleteMessage = messageService.deleteMessage(chatData.id, messageId);

    // then
    await expect(deleteMessage).rejects.toThrow('Message not found');
});