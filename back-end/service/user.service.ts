import usersDb from '../repository/users.db';
import { User } from '../model/user';

const getAllUsers = (): User[] => usersDb.getAllUsers();

const getUserById = (id: number): User => {
    const user = usersDb.getUserById({ id });
    if (!user) throw new Error(`User with id ${id} does not exist.`);
    return user;
};

export default { getAllUsers, getUserById };