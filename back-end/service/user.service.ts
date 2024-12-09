import usersDb from '../repository/users.db';
import { User } from '../model/user';

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

export default { getAllUsers, getUserById };