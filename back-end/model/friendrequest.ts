import {
    User as UserPrisma,
    Chat as ChatPrisma,
    Message as MessagePrisma,
    FriendRequest as FriendRequestPrisma
} from '@prisma/client';

import { Role } from '../types';
import { Chat } from './chat';
import { Message } from './message';


export class FriendRequest {
    readonly id: number;
    readonly senderId: number;
    readonly receiverId: number;
    readonly accepted: Boolean;
    readonly declined: Boolean;

    constructor(friendRequest: {
        id: number;
        senderId: number;
        receiverId: number;
        accepted?: Boolean;
        declined?: Boolean;
    }) {
        this.id = friendRequest.id;
        this.senderId = friendRequest.senderId;
        this.receiverId = friendRequest.receiverId;
        this.accepted = friendRequest.accepted || false;
        this.declined = friendRequest.declined || false;
    }
    equals(friendRequest: FriendRequest): boolean {
        return (this.id == friendRequest.id &&
            this.senderId == friendRequest.senderId &&
            this.receiverId == friendRequest.receiverId &&
            this.accepted == friendRequest.accepted &&
            this.declined == friendRequest.declined)
    }

    static from({
        id,
        senderId,
        receiverId,
        accepted,
        declined
    }: FriendRequestPrisma): FriendRequest {
        return new FriendRequest({ id, senderId, receiverId, accepted, declined })
    }
}

