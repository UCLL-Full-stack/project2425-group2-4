import { User } from "@types";

const loginDiddyFan = (diddy: User) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(diddy),
    });
};

const UserService = {
    loginDiddyFan,
}

export default UserService;