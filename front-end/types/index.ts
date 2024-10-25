export type User = {
    id: number;
    username: string;
    password: string;
    email: string;
};

export type Message =  {
    id: number;
    text: string;
    timestamp: Date;
};

export type FriendRequest = {
    id: number;
    status: string;
    sent_at: Date;
    responded_at: Date;
};

export type Chat = {
    id: number;
    name: string;
    created_at: Date;
};