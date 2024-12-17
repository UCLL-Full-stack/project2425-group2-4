export type User = {
    id?: number;
    username: string;
    password?: string;
    email?: string;
    token?: string;
    role?: string;
};

export type Message = {
    id?: number;
    //userId: number;
    messenger: User;
    text: string;
    timestamp: Date;
    chatId: number;
};

export type FriendRequest = {
    id: number;
    sender: { userId: number };
    receiver: { userId: number };
    status?: string;
    timestamp: Date;
};

export type Chat = {
    id?: string;
    name: string;
    messages: Message[];
    users: User[];
    createdAt?: Date;
};

export type StatusMessage = {
    message: string;
    type: "error" | "success";
}
