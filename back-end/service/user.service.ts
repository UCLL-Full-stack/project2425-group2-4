import usersDb from '../repository/users.db';
import { User } from '../model/user';
import { FriendRequest } from '../model/friendrequest';
import { FriendRequestInput, Status } from '../types';
import bcrypt from 'bcrypt';
import { AuthenticationResponse, UserInput } from '../types';
import { generateJwtToken } from '../util/jwt';

//const getAllUsers = (): User[] => usersDb.getAllUsers();

const getAllUsers = async (): Promise<User[]> => {
    const usersFromDB = await usersDb.getAllUsers();
    if (!usersFromDB) {
        throw new Error('No users to be found.');
    }
    return usersFromDB;
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
    const user = await usersDb.getUserByUsername({ username });
    if (!user || !user.getId()) { throw new Error(`${username} does not exist.`); }
    return await usersDb.getAllFriends({ id: user.getId()! });
};

const showFriendRequests = async (username: string): Promise<FriendRequestInput[]> => {
    const user = await usersDb.getUserByUsername({ username });
    if (!user || !user.getId()) { throw new Error('User does not exist.'); }
    return await usersDb.showFriendRequests({ id: user.getId()! });
};

const handleFriendRequest = async (username: string, id: number, status: Status): Promise<FriendRequestInput> => {
    const receiver = await usersDb.getUserByUsername({ username });
    if (!receiver || !receiver.getId()) { throw new Error('User does not exist.'); }
    
    const friendRequest = await usersDb.updateFriendRequestStatus(id, status);
    if (status === 'accepted') {
        await usersDb.createFriendship(friendRequest.sender.userId, friendRequest.receiver.userId);
    }
    return friendRequest;
};

const sendFriendRequest = async (username: string, friendUsername: string): Promise<FriendRequestInput> => {
    const user = await usersDb.getUserByUsername({ username });
    const friend = await usersDb.getUserByUsername({ username: friendUsername });
    if (!user || !user.getId()) { throw new Error('User does not exist.'); }
    if (!friend || !friend.getId()) { throw new Error('Friend does not exist.'); }
    return await usersDb.sendFriendRequest({ senderId: user.getId()!, receiverId: friend.getId()! });
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
