import { User } from "@types";

const loginDiddyFan = (diddy: User) => {
    console.log(JSON.stringify(diddy));
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(diddy)
    });
};

const signupDiddyFan = (diddy: User) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/user/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(diddy)
    });
}

const getAllUsers = async (): Promise<User[]> => {
    const token = JSON.parse(sessionStorage.getItem('diddyfan') || '{}')?.token;
    const users = await fetch(process.env.NEXT_PUBLIC_API_URL + '/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    })
    if (users.ok) { return users.json(); }
    throw new Error('Failed to get users');

}
const UserService = {
    loginDiddyFan,
    signupDiddyFan,
    getAllUsers
}

export default UserService;
