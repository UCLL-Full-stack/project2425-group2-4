import { User } from '@types';

const getUser = async () => {
    return fetch(
        process.env.NEXT_PUBLIC_API_URL + "/user",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
};

const UserService = {
    getUser,
};

export default UserService;