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
    if (!user) throw new Error(`User with username: ${username} does not exist.`);
    return User.from(user);
}



const authenticate = async ({ username, password }: { username: string, password: string }): Promise<AuthenticationResponse> => {
    const user = await getUserByUsername({ username });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new Error('Incorrect password.');

    const token: string = generateJwtToken({ username });
    return {
        token,
        id: user.id,
        username,
        email: user.email
    }

}

const createUser = async ({
    username,
    email,
    password
}: UserInput): Promise<AuthenticationResponse> => {
    const existingUser = usersDb.getUserByUsername({ username });

    const hashedPassword = await bcrypt.hash(password, 15);
    const user: UserInput = { username, email, password: hashedPassword };

    await usersDb.createUser(user)
    return authenticate({ username, password })
};

export default { getAllUsers, getUserById, getUserByUsername, authenticate, createUser };
