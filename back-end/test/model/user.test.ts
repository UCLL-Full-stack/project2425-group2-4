import { User } from "../../model/user";

test('given: valid values for user, when: user is created, then: user is created with those values', () => {
    // given
    const userData = {
        id: 1,
        username: 'yamaha46',
        email: 'yamahalover46@gmail.com',
        password: 'R6fan99',
    };

    // when
    const user = new User(userData);

    // then
    expect(user.getId()).toEqual(userData.id);
    expect(user.getUsername()).toEqual(userData.username);
    expect(user.getEmail()).toEqual(userData.email);
    expect(user.getPassword()).toEqual(userData.password);
});

test('given: missing username, when: user is created, then: an error is thrown', () => {
    // given
    const userData = {
        email: 'yamahalover46@gmail.com',
        password: 'R6fan99',
    };

    // when
    const createUser = () => new User(userData as any);

    // then
    expect(createUser).toThrow('Username is required');
});

test('given: missing email, when: user is created, then: an error is thrown', () => {
    // given
    const userData = {
        username: 'yamaha46',
        password: 'R6fan99',
    };

    // when
    const createUser = () => new User(userData as any);

    // then
    expect(createUser).toThrow('Email is required');
});

test('given: missing password, when: user is created, then: an error is thrown', () => {
    // given
    const userData = {
        username: 'yamaha46',
        email: 'yamahalover46@gmail.com',
    };

    // when
    const createUser = () => new User(userData as any);

    // then
    expect(createUser).toThrow('Password is required');
});