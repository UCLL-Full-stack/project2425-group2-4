// role

export type User = {
    id: number;
    username: string;
    email: string;
};

export type Message = {
    id: number;
    //userId: number;
    messenger: User;
    text: string;
    timestamp: Date;
};

export type FriendRequest = {
    id: number;
    status: string;
    sentAt: Date;
    respondedAt: Date;
};

export type Chat = {
    id: number;
    name: string;
    messages: Message[];
    users: User[];
    createdAt: Date;
};

export type StatusMessage = {
    message: string;
    type: "error" | "success";
}