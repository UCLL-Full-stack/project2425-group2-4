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

const UserService = {
    loginDiddyFan,
    signupDiddyFan,
}

export default UserService;