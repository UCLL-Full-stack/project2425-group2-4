import { User } from "../model/user";

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

// Logging purposes
const getAllUsers = (): User[] => users;

const getUserById = ({ id }: { id: number }): User | null => {
    try {
        return users.find((user) => user.getId() === id) || null;
    } catch (error) {
        console.error(error);
        throw new Error('User nonexistent');
    }
};

export default {
    getAllUsers,
    getUserById,
};