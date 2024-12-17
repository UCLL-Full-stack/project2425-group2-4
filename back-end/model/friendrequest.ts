import {
    User as UserPrisma,
    Chat as ChatPrisma,
    Message as MessagePrisma,
    FriendRequest as FriendRequestPrisma
} from '@prisma/client';

import { Status } from '../types';
import { User } from './user';


export class FriendRequest {
    readonly id?: number;
    readonly sender: User;
    readonly receiver: User;
    readonly status?: Status;
    readonly timestamp: Date;

    constructor(friendRequest: {
        id?: number;
        sender: User;
        receiver: User;
        status?: Status;
        timestamp: Date;
    }) {

        this.validate(friendRequest);
        this.id = friendRequest.id;
        this.sender = friendRequest.sender;
        this.receiver = friendRequest.receiver;
        this.status = friendRequest.status;
        this.timestamp = friendRequest.timestamp;
    }

    validate(friendRequest: { sender: User; receiver: User; timestamp:Date }) {
        if (!friendRequest.sender) {
            throw new Error('Friend request requires a sender.')
        }
        if (!friendRequest.receiver) {
            throw new Error('Friend request needs a receiver.')
        }
        if (!friendRequest.timestamp) {
            throw new Error('Timestamp of the friend request is invalid');
        }
    }
    
    equals(friendRequest: FriendRequest): boolean {
        return (this.id == friendRequest.id &&
            this.sender == friendRequest.sender &&
            this.receiver == friendRequest.receiver &&
            this.status == friendRequest.status &&
            this.timestamp == friendRequest.timestamp);
    }

    static from({
        id,
        sender,
        receiver,
        status,
        timestamp
    }: FriendRequestPrisma & { sender: UserPrisma; receiver: UserPrisma }): FriendRequest {
        return new FriendRequest({
            id,
            sender: User.from(sender),
            receiver: User.from(receiver),
            status: status as Status,
            timestamp
        });
    }
}

