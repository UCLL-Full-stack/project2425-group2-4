import { Message } from "../../model/message";
import { User } from "../../model/user";

test('given: valid values for message, when: message is created, then: message is created with those values', () => {
    // given
    const user = new User({
        id: 1,
        username: 'yamaha46',
        email: 'yamahalover46@gmail.com',
        password: 'R6fan99',
        role: 'admin'
    });
    const messageData = {
        id: 1,
        text: 'Hello!',
        messenger: user,
        timestamp: new Date('2023-11-18T10:01:00Z'),
    };

    // when
    const message = new Message(messageData);

    // then
    expect(message.getId()).toEqual(messageData.id);
    expect(message.getText()).toEqual(messageData.text);
    expect(message.getMessenger()).toEqual(messageData.messenger);
    expect(message.getTimestamp()).toEqual(messageData.timestamp);
});

test('given: missing text, when: message is created, then: an error is thrown', () => {
    // given
    const user = new User({
        id: 1,
        username: 'yamaha46',
        email: 'yamahalover46@gmail.com',
        password: 'R6fan99',
        role: 'admin'
    });
    const messageData = {
        messenger: user,
        timestamp: new Date('2023-11-18T10:01:00Z'),
    };

    // when
    const createMessage = () => new Message(messageData as any);

    // then
    expect(createMessage).toThrow("Can't send empty messages");
});

test('given: missing timestamp, when: message is created, then: an error is thrown', () => {
    // given
    const user = new User({
        id: 1,
        username: 'yamaha46',
        email: 'yamahalover46@gmail.com',
        password: 'R6fan99',
        role: 'admin'
    });
    const messageData = {
        text: 'Hello!',
        messenger: user,
    };

    // when
    const createMessage = () => new Message(messageData as any);

    // then
    expect(createMessage).toThrow('Date is incorrect');
});

test('given: missing messenger, when: message is created, then: an error is thrown', () => {
    // given
    const messageData = {
        text: 'Hello!',
        timestamp: new Date('2023-11-18T10:01:00Z'),
    };

    // when
    const createMessage = () => new Message(messageData as any);

    // then
    expect(createMessage).toThrow('User doesn\'t exist');
});

test('given: a message, when: getMessenger is called, then: it returns the correct user', () => {
    // given
    const user = new User({
        id: 1,
        username: 'yamaha46',
        email: 'yamahalover46@gmail.com',
        password: 'R6fan99',
        role: 'admin'
    });
    const messageData = {
        id: 1,
        text: 'Hello!',
        messenger: user,
        timestamp: new Date('2023-11-18T10:01:00Z'),
    };

    // when
    const message = new Message(messageData);

    // then
    expect(message.getMessenger()).toEqual(user);
});