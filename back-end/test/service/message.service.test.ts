import { set } from 'date-fns';
import { Message } from '../../model/message';
import { User } from '../../model/user';
import { Chat } from '../../model/chat';
import chatDb from '../../repository/chat.db';
import messagesDb from '../../repository/messages.db';
import usersDb from '../../repository/users.db';
import MessageService from '../../service/message.service';

const user1 = new User({
    id: 1,
    username: 'yamaha46',
    email: 'yamahalover46@gmail.com',
    password: 'R6fan99',
});

const user2 = new User({
    id: 2,
    username: 'Broski21',
    email: 'broskibroski@gmail.com',
    password: 'nuggetslovr6',
});

const messageData = {
    text: 'Hello!',
    messenger: {
        id: 1,
        username: 'yamaha46',
        email: 'yamahalover46@gmail.com',
        password: 'R6fan99',
    },
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

let mockChatDbGetChatById: jest.Mock;
let mockChatDbUpdateChat: jest.Mock;
let mockMessagesDbPostMessage: jest.Mock;
let mockUsersDbGetUserById: jest.Mock;

beforeEach(() => {
    mockChatDbGetChatById = jest.fn();
    mockChatDbUpdateChat = jest.fn();
    mockMessagesDbPostMessage = jest.fn();
    mockUsersDbGetUserById = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given valid message data, when postMessage is called, then the message is posted', () => {
    // given
    usersDb.getUserById = mockUsersDbGetUserById.mockReturnValue(user1);
    chatDb.getChatById = mockChatDbGetChatById.mockReturnValue(chat);
    messagesDb.postMessage = mockMessagesDbPostMessage.mockReturnValue(message);

    // when
    const result = MessageService.postMessage(chatData.id, messageData);

    // then
    expect(result).toEqual(message);
    expect(mockUsersDbGetUserById).toHaveBeenCalledWith({ id: messageData.messenger.id });
    expect(mockChatDbGetChatById).toHaveBeenCalledWith({ id: chatData.id });
    expect(mockMessagesDbPostMessage).toHaveBeenCalledWith(message);
    expect(mockChatDbUpdateChat).toHaveBeenCalledWith(chat);
});

test('given missing text, when postMessage is called, then an error is thrown', () => {
    // given
    const invalidMessageData = { ...messageData, text: '' };

    // when
    const postMessage = () => MessageService.postMessage(chatData.id, invalidMessageData);

    // then
    expect(postMessage).toThrow('Text cannot be empty');
});

test('given invalid user id, when postMessage is called, then an error is thrown', () => {
    // given
    usersDb.getUserById = mockUsersDbGetUserById.mockReturnValue(null);

    // when
    const postMessage = () => MessageService.postMessage(chatData.id, messageData);

    // then
    expect(postMessage).toThrow('User not found');
});

test('given invalid chat id, when postMessage is called, then an error is thrown', () => {
    // given
    usersDb.getUserById = mockUsersDbGetUserById.mockReturnValue(user1);
    chatDb.getChatById = mockChatDbGetChatById.mockReturnValue(null);

    // when
    const postMessage = () => MessageService.postMessage(chatData.id, messageData);

    // then
    expect(postMessage).toThrow('Chat not found');
});