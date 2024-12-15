import { User } from "../model/user";
import { FriendRequest, User as UserPrisma } from '@prisma/client';
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

const getAllFriends = async ({ id }: { id: number }): Promise<User[]> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: { id },
            include: {
                Friends: true
            }
        });
        if (!userPrisma) throw new Error('User not found.');


        const friends: Array<User> = [];

        userPrisma.Friends.forEach(async (friendId) => {
            const friend = await getUserById(friendId)
            if (!friend) throw new Error('Friend not found.');
            friends.push(friend);
        })
        return friends;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const sendFriendRequest = async ({ senderId, receipientId }: { senderId: number, receipientId: number }): Promise<FriendRequest> => {
    try {
        const friendRequest = await database.friendRequest.create({
            data: {
                sender: {
                    connect: { id: senderId }
                },
                receiver: {
                    connect: { id: receipientId }
                }
            }
        });
        return friendRequest;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const handleFriendRequest = async ({ id, receiver, accepted }: { id: number, receiver: User, accepted: boolean }): Promise<FriendRequest> => {
    try {
        const friendRequest = await database.friendRequest.findFirst({
            where: {
                id
            }
        });


        if (!friendRequest) throw new Error('Friend request not found.');
        if (!friendRequest.senderId) throw new Error('Sender not found')


        const sender = await getUserById({ id: friendRequest.senderId });


        if (friendRequest.receiverId !== receiver.id) throw new Error('Unauthorized to handle this friend request.');


        if (accepted) {
            const updatedFriendRequest = await database.friendRequest.update({
                where: { id: friendRequest.id },
                data: {
                    accepted: true,
                    declined: false
                }
            });
            console.log(updatedFriendRequest);

            await database.friends.create({
                data: {
                    users: {
                    }
                }
            });
            console.log(sender);
            return updatedFriendRequest;
        }
        else {
            const updatedFriendRequest = await database.friendRequest.update({
                where: { id: friendRequest.id },
                data: {
                    accepted: false,
                    declined: true
                }
            });
            return updatedFriendRequest;
        }
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
}

const showFriendRequests = async ({ id }: { id: number }): Promise<FriendRequest[]> => {
    try {
        const friendRequests = await database.friendRequest.findMany({
            where: {
                receiverId: id
            }
        });
        return friendRequests;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
}

export default {
    getAllUsers,
    getUserById,
    getUserByUsername,
    getAllFriends,
    sendFriendRequest,
    handleFriendRequest,
    showFriendRequests,
    createUser
};
