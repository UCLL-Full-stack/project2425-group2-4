import { set } from 'date-fns';
import { Chat } from "../../model/chat";
import { Message } from "../../model/message";
import { User } from "../../model/user";

test('given: valid values for chat, when: chat is created, then: chat is created with those values', () => {
    // given
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
    const chatData = {
        id: 1,
        name: 'Developer life',
        createdAt: set(new Date(), { year: 2023, month: 10, date: 3, hours: 10, minutes: 0 }),
        messages: [message1, message2],
        users: [user1, user2],
    };

    // when
    const chat = new Chat(chatData);

    // then
    expect(chat.getId()).toEqual(chatData.id);
    expect(chat.getName()).toEqual(chatData.name);
    expect(chat.getCreatedAt()).toEqual(chatData.createdAt);
    expect(chat.getMessages()).toEqual(chatData.messages);
    expect(chat.getUsers()).toEqual(chatData.users);
});

test('given: missing name, when: chat is created, then: an error is thrown', () => {
    // given
    const chatData = {
        createdAt: set(new Date(), { year: 2023, month: 10, date: 3, hours: 10, minutes: 0 }),
    };

    // when
    const createChat = () => new Chat(chatData as any);

    // then
    expect(createChat).toThrow('Name is required');
});

test('given: missing createdAt, when: chat is created, then: an error is thrown', () => {
    // given
    const chatData = {
        name: 'Developer life',
    };

    // when
    const createChat = () => new Chat(chatData as any);

    // then
    expect(createChat).toThrow('Date is incorrect');
});

test('given: an existing chat, when: adding a message to chat, then: message is added to chat', () => {
    // given
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
    const chat = new Chat({
        id: 1,
        name: 'Developer life',
        createdAt: set(new Date(), { year: 2023, month: 10, date: 3, hours: 10, minutes: 0 }),
        messages: [message1],
        users: [user1, user2],
    });
    const newMessage = new Message({
        id: 2,
        text: 'Hello back, how are you?',
        messenger: user2,
        timestamp: set(new Date(), { year: 2023, month: 10, date: 18, hours: 10, minutes: 2 }),
    });

    // when
    chat.addMessage(newMessage);

    // then
    expect(chat.getMessages()).toContain(newMessage);
});