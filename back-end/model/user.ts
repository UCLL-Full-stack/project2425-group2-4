import {
    User as UserPrisma,
    Chat as ChatPrisma,
    Message as MessagePrisma,
    Friends as FriendsPrisma,
} from '@prisma/client';

import { Role } from '../types';
import { Message } from './message';
import { FriendRequest } from './friendrequest';

export class User {
    readonly id?: number;
    readonly username: string;
    readonly email: string;
    readonly password: string;
    readonly role: Role;

    constructor(user: {
        id?: number;
        username: string;
        email: string;
        password: string;
        role: Role;
    }) {
        this.validate(user);

        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
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
        role
    }: UserPrisma & { chats?: ChatPrisma[]; messages?: MessagePrisma[]; friends?: FriendRequest[] }): User {
        return new User({
            id,
            username,
            password,
            email,
            role: role as Role,
        });
    }
}
