import { User } from "../model/user";
import { User as UserPrisma } from '@prisma/client';
import database from './database';
import { UserInput } from "../types";

const users = [
    new User({
        id: 1,
        username: "yamaha46",
        email: "yamahalover46@gmail.com",
        password: "R6fan99",
    }),
    new User({
        id: 2,
        username: "Broski21",
        email: "broskibroski@gmail.com",
        password: "nuggetslovr6",
    }),
];

const createUser = async ({
    username,
    password,
    email
}: UserInput): Promise<UserPrisma> => {
    try {
        const userPrisma = await database.user.create({
            data: { username, password, email },
        });
        return userPrisma;
    } catch (error) {
        console.error(error);
        throw new Error('An error occured trying to create user: users.db::createUser');
    }
};

// const getAllUsers = (): User[] => users;

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany();
        return usersPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Couldn\'t gather the users. Check server log for details.');
    }
};

// const getUserById = ({ id }: { id: number }): User | null => {
//     try {
//         return users.find((user) => user.getId() === id) || null;
//     } catch (error) {
//         console.error(error);
//         throw new Error('User nonexistent');
//     }
// };

const getUserByUsername = async ({ username }: { username: string }): Promise<UserPrisma> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: { username }
        });
        if (!userPrisma) throw new Error(`User with username: ${username} does not exist.`);
        return userPrisma;
    } catch (error) {
        console.error(error);
        throw new Error('An error occured trying to fetch username: users.db::getUserByUsername');
    }
};

const getUserById = async ({ id }: { id: number }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: { id },
        });

        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};


export default {
    getAllUsers,
    getUserById,
    getUserByUsername,
    createUser
};
