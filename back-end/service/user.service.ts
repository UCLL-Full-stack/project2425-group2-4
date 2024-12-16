import usersDb from '../repository/users.db';
import { User } from '../model/user';
import bcrypt from 'bcrypt';
import { AuthenticationResponse, UserInput } from '../types';
import { generateJwtToken } from '../util/jwt';
import { FriendRequest } from '@prisma/client';

//const getAllUsers = (): User[] => usersDb.getAllUsers();

const getAllUsers = async (): Promise<User[]> => {
    const usersFromDB = await usersDb.getAllUsers();
    const usersToReturn: User[] = [];

    usersFromDB.forEach((user) => {
        const userToPush: User = new User({ username: user.username, id: user.id, email: user.email, role: user.role, password: user.password })
        usersToReturn.push(userToPush)
    })


    return usersToReturn;
};

const getUserById = async (id: number): Promise<User> => {
    const user = await usersDb.getUserById({ id });
    if (!user) {
        throw new Error(`User with id ${id} does not exist.`);
    }
    return user;
};

const getUserByUsername = async ({ username }: { username: string }): Promise<User> => {
    const user = await usersDb.getUserByUsername({ username })
    if (!user) {
        throw new Error(`User with username: ${username} does not exist.`);
    }
    return user;
}

const authenticate = async ({ username, password }: UserInput): Promise<AuthenticationResponse> => {
    const user = await getUserByUsername({ username });
    if (password === undefined) {
        throw new Error('Password is required.');
    }

    const isValidPassword = await bcrypt.compare(password, user.getPassword());

    if (!isValidPassword) {
        throw new Error('Incorrect password.');
    }
    return {
        token: generateJwtToken({ username, role: user.getRole() }),
        username: username,
        email: user.getEmail(),
        role: user.getRole(),
    };
};

const createUser = async ({
    username,
    email,
    password,
    role,
}: UserInput): Promise<User> => {
    const existingUser = await usersDb.getUserByUsername({ username });

    if (password === undefined) {
        throw new Error('Password is required.');
    }

    if (existingUser) {
        throw new Error(`User with username ${username} is already registered.`);
    }

    const hashedPassword = await bcrypt.hash(password, 15);
    const user = new User({ username, password: hashedPassword, email, role });

    return await usersDb.createUser(user);
};

const getAllFriends = async (username: string): Promise<User[]> => {
    const user = await getUserByUsername({ username });
    if (!user.id) { throw new Error('User does not exist.'); }
    return await usersDb.getAllFriends({ id: user.id });
};

const sendFriendRequest = async (username: string, friendUsername: string): Promise<FriendRequest> => {
    const user = await getUserByUsername({ username });
    const friend = await getUserByUsername({ username: friendUsername });
    if (!user.id) { throw new Error('User does not exist.'); }
    if (!friend.id) { throw new Error('Friend does not exist.'); }
    return await usersDb.sendFriendRequest({ senderId: user.id, receipientId: friend.id })
};


const handleFriendRequest = async (username: string, id: number, accepted: boolean): Promise<FriendRequest> => {
    const receiver = await getUserByUsername({ username });
    if (!receiver.id) { throw new Error('User does not exist.'); }
    return usersDb.handleFriendRequest({ id, receiver, accepted });
}
const showFriendRequests = async (username: string): Promise<{ id: number, sender: UserInput }[]> => {
    const user = await getUserByUsername({ username });
    if (!user.id) { throw new Error('User does not exist.'); }
    return await usersDb.showFriendRequests({ id: user.id });
};



export default {
    getAllUsers,
    getUserById,
    getUserByUsername,
    authenticate,
    getAllFriends,
    sendFriendRequest,
    handleFriendRequest,
    showFriendRequests,
    createUser
};
