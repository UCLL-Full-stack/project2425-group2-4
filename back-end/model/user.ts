import {
    User as UserPrisma,
    Chat as ChatPrisma,
    Message as MessagePrisma,
} from '@prisma/client';

import { Role } from '../types';
import { Chat } from './chat';
import { Message } from './message';

export class User {
    private id?: number;
    private username: string;
    private email: string;
    private password: string;
    private chats?: Chat[];
    private messages?: Message[];
    private role: Role;

    constructor(user: {
        id?: number;
        username: string;
        email: string;
        password: string;
        chats?: Chat[];
        messages?: Message[];
        role: Role;
    }) {
        this.validate(user);

        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
        this.chats = user.chats;
        this.messages = user.messages;
        this.role = user.role;
    }

    getId(): number | undefined {
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

    getRole(): Role {
        return this.role;
    }

    validate(user: {
        username: string;
        email: string;
        password: string;
        role: Role;
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
        if (!user.role) {
            throw new Error('Role is required.');
        }
    }

    equals(user: User): boolean {
        return (
            this.username === user.getUsername() &&
            this.email === user.getEmail() &&
            this.password === user.getPassword() &&
            this.role === user.getRole()
        );
    }

    static from({
        id,
        username,
        password,
        email,
        chats,
        messages,
        role
    }: UserPrisma & { chats?: ChatPrisma[]; messages?: MessagePrisma[] }): User {
        return new User({
            id,
            username,
            password,
            email,
            chats: (chats || []).map(chat => new Chat(chat)),
            messages: (messages || []).map(message => new Message({
                ...message,
                messenger: new User({ id: message.userId, username: username, email: email, password: password, role: role as Role })
            })),
            role: role as Role,
        });
    }
}
