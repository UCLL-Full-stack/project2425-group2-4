import { User } from "../model/user";
import { FriendRequest } from "../model/friendrequest";
import { FriendRequestInput, Status } from "../types";
import database from './database';
import { UserInput } from "../types";
import { assert } from "console";

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

const getAllFriends = async ({ id }: { id: number }): Promise<User[]> => {
    try {
        const friendsPrisma = await database.friends.findMany({
            where: {
                users: {
                    some: {
                        id
                    }
                }
            },
            include: {
                users: true
            }
        });

        return friendsPrisma.flatMap(friendship => 
            friendship.users.filter(user => user.id !== id).map(user => User.from(user))
        );
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const showFriendRequests = async ({ id }: { id: number }): Promise<FriendRequestInput[]> => {
    try {
        const friendRequestsFromDB = await database.friendRequest.findMany({
            where: {
                receiverId: id,
                status: 'pending'
            },
            include: {
                sender: true
            }
        });

        return friendRequestsFromDB.map(friendRequest => ({
            id: friendRequest.id,
            sender: { userId: friendRequest.senderId },
            receiver: { userId: friendRequest.receiverId },
            status: friendRequest.status as Status,
            timestamp: friendRequest.timestamp
        }));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const updateFriendRequestStatus = async (id: number, status: Status): Promise<FriendRequestInput> => {
    const friendRequest = await database.friendRequest.update({
        where: { id },
        data: { status },
        include: { sender: true, receiver: true }
    });
    return {
        id: friendRequest.id,
        sender: { userId: friendRequest.senderId },
        receiver: { userId: friendRequest.receiverId },
        status: friendRequest.status as Status,
        timestamp: friendRequest.timestamp
    };
};

const createFriendship = async (senderId: number, receiverId: number): Promise<void> => {
    await database.friends.create({
        data: {
            users: {
                connect: [{ id: senderId }, { id: receiverId }]
            }
        }
    });
};

const sendFriendRequest = async ({ senderId, receiverId }: { senderId: number, receiverId: number }): Promise<FriendRequestInput> => {
    try {
        const friendRequest = await database.friendRequest.create({
            data: {
                sender: {
                    connect: { id: senderId }
                },
                receiver: {
                    connect: { id: receiverId }
                },
                status: 'pending',
                timestamp: new Date()
            },
            include: {
                sender: true,
                receiver: true
            }
        });
        return {
            id: friendRequest.id,
            sender: { userId: friendRequest.senderId },
            receiver: { userId: friendRequest.receiverId },
            status: friendRequest.status as Status,
            timestamp: friendRequest.timestamp
        };
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    getAllUsers,
    getUserById,
    getUserByUsername,
    getAllFriends,
    sendFriendRequest,
    updateFriendRequestStatus,
    createFriendship,
    showFriendRequests,
    createUser
};
