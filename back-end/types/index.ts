type Role = 'admin' | 'moderator' | 'user';

type Status = 'accepted' | 'declined' | 'pending';

type ChatInput = {
    id?: number;
    name: string;
    messages?: MessageInput[];
    users?: UserInput[];
}

type MessageInput = {
    id?: number;
    text: string;
    messenger: { username: string };
    timestamp: Date;
}

type UserInput = {
    id?: number;
    username: string;
    email: string;
    password?: string;
    role: Role;
}

type FriendRequestInput = {
    id?: number;
    sender: { userId: number };
    receiver: { userId: number };
    status: Status;
    timestamp: Date;
}

type AuthenticationResponse = {
    token: string;
    username: string;
    email: string;
    role: string;
};


export {
    Role,
    Status,
    ChatInput,
    MessageInput,
    UserInput,
    FriendRequestInput,
    AuthenticationResponse
}
