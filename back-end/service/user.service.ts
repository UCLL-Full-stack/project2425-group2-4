import usersDb from '../repository/users.db';
import { User } from '../model/user';
import bcrypt from 'bcrypt';
import { AuthenticationResponse, UserInput } from '../types';
import { generateJwtToken } from '../util/jwt';

//const getAllUsers = (): User[] => usersDb.getAllUsers();

const getAllUsers = async (): Promise<User[]> => {
    return usersDb.getAllUsers();
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

    if (existingUser) {
        throw new Error(`User with username ${username} is already registered.`);
    }

    const hashedPassword = await bcrypt.hash(password, 15);
    const user = new User({ username, password: hashedPassword, email, role });

    return await usersDb.createUser(user);
};

export default { getAllUsers, getUserById, getUserByUsername, authenticate, createUser };
