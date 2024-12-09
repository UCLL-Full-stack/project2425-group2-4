import {
    User as UserPrisma,
    Chat as ChatPrisma,
    Message as MessagePrisma,
} from '@prisma/client';

import { Chat } from './chat';
import { Message } from './message';

export class User {
    readonly id: number;
    readonly username: string;
    readonly email: string;
    readonly password: string;
    readonly chats?: Chat[];
    readonly messages?: Message[];


    constructor(user: {
        id: number;
        username: string;
        email: string;
        password: string;
        chats?: Chat[];
        messages?: Message[];
    }) {
        this.validate(user);

        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
        this.chats = user.chats;
        this.messages = user.messages;
    }

    getId(): number {
        return this.id;
    }

    getUsername(): string {
        return this.username;
    }

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    getChats(): Chat[] | undefined {
        return this.chats;
    }

    getMessages(): Message[] | undefined {
        return this.messages;
    }

    validate(user: {
        username: string;
        email: string;
        password: string;
    }) {
        if (!user.username?.trim()) {
            throw new Error('Username is required');
        }
        if (!user.email?.trim()) {
            throw new Error('Email is required');
        }
        if (!user.password?.trim()) {
            throw new Error('Password is required');
        }
    }

    equals(user: User): boolean {
        return (
            this.username === user.getUsername() &&
            this.email === user.getEmail() &&
            this.password === user.getPassword()
        );
    }

    static from({
        id,
        username,
        password,
        email,
        chats,
        messages,
    }: UserPrisma & { chats?: ChatPrisma[]; messages?: MessagePrisma[] }): User {
        return new User({
            id,
            username,
            password,
            email,
            chats: (chats || []).map(chat => new Chat(chat)),
            messages: (messages || []).map(message => new Message(message)),
        });
    }
}
