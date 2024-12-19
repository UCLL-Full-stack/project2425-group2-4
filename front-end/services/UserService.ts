import { FriendRequest, User } from "@types";

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
    const token = JSON.parse(sessionStorage.getItem('token') || '{}')?.token;
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

const sendFriendRequest = async ({ friendUsername }: { friendUsername: string }) => {
    const token = JSON.parse(sessionStorage.getItem('token') || '{}')?.token;
    const body = {
        friendUsername
    }
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/user/friends', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body)
    })
}

const handleFriendRequest = async (friendRequest: FriendRequest, status: string) => {
    const token = JSON.parse(sessionStorage.getItem('token') || '{}')?.token;
    const body = {
        id: friendRequest.id,
        status: status
    };
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/user/friendrequests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error('Failed to handle friend request');
    }

    return response.json();
};

const getAllFriends = async (): Promise<User[]> => {
    const token = JSON.parse(sessionStorage.getItem('token') || '{}')?.token;
    console.log(token);
    const result = await fetch(process.env.NEXT_PUBLIC_API_URL + '/user/friends', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    })
    if (result.ok) { return result.json(); }
    throw new Error('Failed to get friends')
}

const UserService = {
    loginDiddyFan,
    signupDiddyFan,
    handleFriendRequest,
    getAllFriends,
    sendFriendRequest,
    getAllUsers
}

export default UserService;
