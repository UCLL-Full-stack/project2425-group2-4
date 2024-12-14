
import usersDb from '../../repository/users.db';
import { User } from '../../model/user';
import bcrypt from 'bcrypt';
import userService from '../../service/user.service';
import { AuthenticationResponse, UserInput } from '../../types';
import { generateJwtToken } from '../../util/jwt';

jest.mock('../../repository/users.db');
jest.mock('bcrypt');
jest.mock('../../util/jwt');

const user1 = new User({
    id: 1,
    username: 'yamaha46',
    email: 'yamahalover46@gmail.com',
    password: 'hashedPassword1',
    role: 'admin'
});

const user2 = new User({
    id: 2,
    username: 'Broski21',
    email: 'broskibroski@gmail.com',
    password: 'hashedPassword2',
    role: 'moderator'
});

beforeEach(() => {
    jest.clearAllMocks();
});

test('when getAllUsers is called, then all users are returned with redacted passwords', async () => {
    // given
    (usersDb.getAllUsers as jest.Mock).mockResolvedValue([user1, user2]);

    // when
    const result = await userService.getAllUsers();

    // then
    expect(result).toEqual([
        { ...user1, password: 'hashedPassword1' },
        { ...user2, password: 'hashedPassword2' }
    ]);
    expect(usersDb.getAllUsers).toHaveBeenCalled();
});

test('given a valid user id, when getUserById is called, then the user is returned', async () => {
    // given
    (usersDb.getUserById as jest.Mock).mockResolvedValue(user1);

    // when
    const result = await userService.getUserById(1);

    // then
    expect(result).toEqual(user1);
    expect(usersDb.getUserById).toHaveBeenCalledWith({ id: 1 });
});

test('given an invalid user id, when getUserById is called, then an error is thrown', async () => {
    // given
    (usersDb.getUserById as jest.Mock).mockResolvedValue(null);

    // when
    const getUserById = userService.getUserById(999);

    // then
    await expect(getUserById).rejects.toThrow('User with id 999 does not exist.');
});

test('given a valid username, when getUserByUsername is called, then the user is returned', async () => {
    // given
    (usersDb.getUserByUsername as jest.Mock).mockResolvedValue(user1);

    // when
    const result = await userService.getUserByUsername({ username: 'yamaha46' });

    // then
    expect(result).toEqual(user1);
    expect(usersDb.getUserByUsername).toHaveBeenCalledWith({ username: 'yamaha46' });
});

test('given an invalid username, when getUserByUsername is called, then an error is thrown', async () => {
    // given
    (usersDb.getUserByUsername as jest.Mock).mockResolvedValue(null);

    // when
    const getUserByUsername = userService.getUserByUsername({ username: 'unknown' });

    // then
    await expect(getUserByUsername).rejects.toThrow('User with username: unknown does not exist.');
});

test('given valid credentials, when authenticate is called, then a token is returned', async () => {
    // given
    (usersDb.getUserByUsername as jest.Mock).mockResolvedValue(user1);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (generateJwtToken as jest.Mock).mockReturnValue('token');

    // when
    const result = await userService.authenticate({ username: 'yamaha46', password: 'hashedPassword1', email: 'yamahalover46@gmail.com', role: 'admin' });

    // then
    expect(result).toEqual({
        token: 'token',
        username: 'yamaha46',
        email: 'yamahalover46@gmail.com',
        role: 'admin'
    });
    expect(usersDb.getUserByUsername).toHaveBeenCalledWith({ username: 'yamaha46' });
    expect(bcrypt.compare).toHaveBeenCalledWith('hashedPassword1', 'hashedPassword1');
    expect(generateJwtToken).toHaveBeenCalledWith({ username: 'yamaha46', role: 'admin' });
});

test('given an invalid password, when authenticate is called, then an error is thrown', async () => {
    // given
    (usersDb.getUserByUsername as jest.Mock).mockResolvedValue(user1);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    // when
    const authenticate = userService.authenticate({ username: 'yamaha46', password: 'wrongPassword', email: 'yamahalover46@gmail.com', role: 'admin' });

    // then
    await expect(authenticate).rejects.toThrow('Incorrect password.');
});

test('given a missing password, when authenticate is called, then an error is thrown', async () => {
    // when
    const authenticate = userService.authenticate({ username: 'yamaha46', password: undefined, email: 'yamahalover46@gmail.com', role: 'admin' });

    // then
    await expect(authenticate).rejects.toThrow('Password is required.');
});

test('when createUser is called with valid data, then the user is created successfully', async () => {
    // given
    const userInput: UserInput = {
        username: 'newUser',
        email: 'newuser@gmail.com',
        password: 'password',
        role: 'user'
    };
    (usersDb.getUserByUsername as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    (usersDb.createUser as jest.Mock).mockResolvedValue(user1);

    // when
    const result = await userService.createUser(userInput);

    // then
    expect(result).toEqual(user1);
    expect(usersDb.getUserByUsername).toHaveBeenCalledWith({ username: 'newUser' });
    expect(bcrypt.hash).toHaveBeenCalledWith('password', 15);
    expect(usersDb.createUser).toHaveBeenCalledWith(expect.any(User));
});

test('when createUser is called with an existing username, then an error is thrown', async () => {
    // given
    const userInput: UserInput = {
        username: 'yamaha46',
        email: 'newuser@gmail.com',
        password: 'password',
        role: 'user'
    };
    (usersDb.getUserByUsername as jest.Mock).mockResolvedValue(user1);

    // when
    const createUser = userService.createUser(userInput);

    // then
    await expect(createUser).rejects.toThrow('User with username yamaha46 is already registered.');
});

test('when createUser is called with a missing password, then an error is thrown', async () => {
    // given
    const userInput: UserInput = {
        username: 'newUser',
        email: 'newuser@gmail.com',
        password: undefined,
        role: 'user'
    };

    // when
    const createUser = userService.createUser(userInput);

    // then
    await expect(createUser).rejects.toThrow('Password is required.');
});