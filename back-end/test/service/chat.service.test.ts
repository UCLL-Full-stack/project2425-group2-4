import { set } from 'date-fns';
import { Chat } from '../../model/chat';
import { Message } from '../../model/message';
import { User } from '../../model/user';
import chatDb from '../../repository/chat.db';
import ChatService from '../../service/chat.service';

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

let mockChatDbGetAllChats: jest.Mock;
let mockChatDbGetChatById: jest.Mock;
let mockChatDbUpdateChat: jest.Mock;

beforeEach(() => {
    mockChatDbGetAllChats = jest.fn();
    mockChatDbGetChatById = jest.fn();
    mockChatDbUpdateChat = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('when getAllChats is called, then all chats are returned', () => {
    // given
    chatDb.getAllChats = mockChatDbGetAllChats.mockReturnValue([chat]);

    // when
    const result = ChatService.getAllChats();

    // then
    expect(result).toEqual([chat]);
});

test('given a valid chat id, when getChatById is called, then the chat is returned', () => {
    // given
    chatDb.getChatById = mockChatDbGetChatById.mockReturnValue(chat);

    // when
    const result = ChatService.getChatById(chatData.id);

    // then
    expect(result).toEqual(chat);
});

test('given an invalid chat id, when getChatById is called, then an error is thrown', () => {
    // given
    chatDb.getChatById = mockChatDbGetChatById.mockReturnValue(null);

    // when
    const getChatById = () => ChatService.getChatById(999);

    // then
    expect(getChatById).toThrow('Chat with id 999 does not exist.');
});