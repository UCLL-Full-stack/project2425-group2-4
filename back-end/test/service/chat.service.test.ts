import { set } from 'date-fns';
import { Chat } from '../../model/chat';
import { Message } from '../../model/message';
import { User } from '../../model/user';
import chatDb from '../../repository/chat.db';
import usersDb from '../../repository/users.db';
import chatService from '../../service/chat.service';
import { UnauthorizedError } from 'express-jwt';
import { ChatInput, Role } from '../../types';

jest.mock('../../repository/chat.db');
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

const user3 = new User({
    id: 3,
    username: 'test',
    email: 'test@test.be',
    password: 'test123',
    role: 'user'
})

const message1 = new Message({
    id: 1,
    text: 'Hello!',
    messenger: user1,
    timestamp: set(new Date(), { year: 2023, month: 10, date: 18, hours: 10, minutes: 1 }),
});

const message2 = new Message({
    id: 2,
    text: 'Hello back, how are you?',
    messenger: user2,
    timestamp: set(new Date(), { year: 2023, month: 10, date: 18, hours: 10, minutes: 2 }),
});

const message3 = new Message({
    id: 3,
    text: 'Good and you?',
    messenger: user2,
    timestamp: set(new Date(), { year: 2023, month: 10, date: 18, hours: 10, minutes: 3 }),
});

const chatData = {
    id: 1,
    name: 'Developer life',
    createdAt: set(new Date(), { year: 2023, month: 10, date: 3, hours: 10, minutes: 0 }),
    messages: [message1, message2, message3],
    users: [user1, user2],
};

const chat = new Chat(chatData);

beforeEach(() => {
    jest.clearAllMocks();
});

test('when getAllChats is called, then all chats are returned', async () => {
    // given
    (chatDb.getAllChats as jest.Mock).mockResolvedValue([chat]);

    // when
    const result = await chatService.getChat({ username: 'yamaha46', role: 'admin' });

    // then
    expect(result).toEqual([chat]);
    expect(chatDb.getAllChats).toHaveBeenCalled();
});

test('given a user role, when getChat is called, then the user\'s chats are returned', async () => {
    // given
    (chatDb.getChatForUser as jest.Mock).mockResolvedValue([chat]);

    // when
    const result = await chatService.getChat({ username: 'Broski21', role: 'user' });

    // then
    expect(result).toEqual([chat]);
    expect(chatDb.getChatForUser).toHaveBeenCalledWith({ username: 'Broski21' });
});

test('given a valid chat id, when getChatById is called, then the chat is returned', async () => {
    // given
    (chatDb.getChatById as jest.Mock).mockResolvedValue(chat);

    // when
    const result = await chatService.getChatById({ username: 'yamaha46', role: 'admin', chatId: chatData.id });

    // then
    expect(result).toEqual(chat);
    expect(chatDb.getChatById).toHaveBeenCalledWith(chatData.id);
});

test('given an invalid chat id, when getChatById is called, then an error is thrown', async () => {
    // given
    (chatDb.getChatById as jest.Mock).mockResolvedValue(null);

    // when
    const getChatById = chatService.getChatById({ username: 'admin', role: 'admin', chatId: 999 });

    // then
    await expect(getChatById).rejects.toThrow('Chat with id 999 does not exist.');
});

test('given a user role, when getChatById is called for a chat that isn\'t for his role, then it should give an error that it doesn\'t exist', async () => {
    // when
    const getChatById = chatService.getChatById({ username: 'test', role: 'user', chatId: 1 });

    // then
    await expect(getChatById).rejects.toThrow('Chat with id 1 does not exist.');
});

test('when createChat is called with valid data, then the chat is created successfully', async () => {
    // given
    const chatInput: ChatInput = {
        name: 'Developer life',
        users: [ user1, user2 ]
    };

    (usersDb.getUserByUsername as jest.Mock).mockImplementation(({ username }) => {
        if (username === 'yamaha46') return user1;
        if (username === 'Broski21') return user2;
        return null;
    });

    (chatDb.createChat as jest.Mock).mockResolvedValue(chat);

    // when
    const result = await chatService.createChat(chatInput);

    // then
    expect(result).toEqual(chat);
    expect(usersDb.getUserByUsername).toHaveBeenCalledWith({ username: 'yamaha46' });
    expect(usersDb.getUserByUsername).toHaveBeenCalledWith({ username: 'Broski21' });
    expect(chatDb.createChat).toHaveBeenCalledWith({
        name: 'Developer life',
        users: [user1, user2],
        messages: []
    });
});

test('should throw an error when creating a chat with a non-existent user', async () => {
    // given
    const chatInput: ChatInput = {
        name: 'Developer life',
        users: [
            { username: 'yamaha46', email: 'yamahalover46@gmail.com', role: 'admin' },
            { username: 'nonExistentUser', email: 'nonexistent@example.com', role: 'user' }
        ]
    };

    (usersDb.getUserByUsername as jest.Mock).mockImplementation(({ username }) => {
        if (username === 'yamaha46') return { id: 1, username: 'yamaha46', email: 'yamahalover46@gmail.com', password: 'R6fan99', role: 'admin' };
        return null;
    });

    // when
    const createChatPromise = chatService.createChat(chatInput);

    // then
    await expect(createChatPromise).rejects.toThrow('User with username nonExistentUser not found');
});