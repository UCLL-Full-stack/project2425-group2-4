import { User } from "../model/user";
import { User as UserPrisma } from '@prisma/client';
import database from './database';
import { UserInput } from "../types";

// const createUser = async ({
//     username,
//     password,
//     email
// }: UserInput): Promise<User> => {
//     if (await checkUserExistsByUsername({ username })) throw new Error('A user with this username already exists')
//     try {
//         const userPrisma = await database.user.create({
//             data: { username, password, email },
//         });
//         return userPrisma;
//     } catch (error) {
//         console.error(error);
//         throw new Error('An error occured trying to create user: users.db::createUser');
//     }
// };

const createUser = async (user: User): Promise<User> => {
    try {
        const userPrisma = await database.user.create({
            data: {
                username: user.getUsername(),
                password: user.getPassword(),
                email: user.getEmail(),
                role: user.getRole(),
            },
        });
        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

// const gjetAllUsers = (): User[] => users;

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany();
        return usersPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Couldn\'t gather the users. Check server log for details.');
    }
};

// const checkUserExistsByUsername = async ({ username }: { username: string }): Promise<Boolean> => {
//     try {
//         const userPrisma = await database.user.findUnique({
//             where: { username }
//         });
//         if (!userPrisma) return false;
//         return true;

//     } catch (error) {
//         console.error(error);
//         throw new Error('An error occured trying to fetch username: users.db::getUserByUsername');
//     }


//     return true;
// }

const getUserByUsername = async ({ username }: { username: string }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { username }
        });
        return userPrisma ? User.from(userPrisma) : null;
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
