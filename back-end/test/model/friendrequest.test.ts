import { FriendRequest } from '../../model/friendrequest';
import { User } from '../../model/user';
import { Status } from '../../types';
import { FriendRequest as FriendRequestPrisma, User as UserPrisma } from '@prisma/client';

describe('FriendRequest', () => {
    const mockUserSender: User = new User({
        id: 1,
        username: 'senderUser',
        email: 'sender@example.com',
        password: 'password123',
        role: 'user'
    });

    const mockUserReceiver: User = new User({
        id: 2,
        username: 'receiverUser',
        email: 'receiver@example.com',
        password: 'password123',
        role: 'user'
    });

    const mockTimestamp = new Date();

    test('should create a FriendRequest instance', () => {
        const friendRequest = new FriendRequest({
            id: 1,
            sender: mockUserSender,
            receiver: mockUserReceiver,
            status: 'pending' as Status,
            timestamp: mockTimestamp
        });

        expect(friendRequest.id).toBe(1);
        expect(friendRequest.sender).toBe(mockUserSender);
        expect(friendRequest.receiver).toBe(mockUserReceiver);
        expect(friendRequest.status).toBe('pending');
        expect(friendRequest.timestamp).toBe(mockTimestamp);
    });

    test('should throw an error if sender is missing', () => {
        expect(() => {
            new FriendRequest({
                receiver: mockUserReceiver,
                timestamp: mockTimestamp
            } as any);
        }).toThrow('Friend request requires a sender.');
    });

    test('should throw an error if receiver is missing', () => {
        expect(() => {
            new FriendRequest({
                sender: mockUserSender,
                timestamp: mockTimestamp
            } as any);
        }).toThrow('Friend request needs a receiver.');
    });

    test('should throw an error if timestamp is missing', () => {
        expect(() => {
            new FriendRequest({
                sender: mockUserSender,
                receiver: mockUserReceiver
            } as any);
        }).toThrow('Timestamp of the friend request is invalid');
    });

    test('should correctly compare two FriendRequest instances', () => {
        const friendRequest1 = new FriendRequest({
            id: 1,
            sender: mockUserSender,
            receiver: mockUserReceiver,
            status: 'pending' as Status,
            timestamp: mockTimestamp
        });

        const friendRequest2 = new FriendRequest({
            id: 1,
            sender: mockUserSender,
            receiver: mockUserReceiver,
            status: 'pending' as Status,
            timestamp: mockTimestamp
        });

        expect(friendRequest1.equals(friendRequest2)).toBe(true);
    });

    test('should create a FriendRequest instance from Prisma object', () => {
        const prismaFriendRequest: FriendRequestPrisma & { sender: UserPrisma; receiver: UserPrisma } = {
            id: 1,
            senderId: 1,
            receiverId: 2,
            status: 'pending',
            timestamp: mockTimestamp,
            sender: {
                id: 1,
                username: 'senderUser',
                email: 'sender@example.com',
                password: 'password123',
                role: 'user'
            },
            receiver: {
                id: 2,
                username: 'receiverUser',
                email: 'receiver@example.com',
                password: 'password123',
                role: 'user'
            }
        };

        const friendRequest = FriendRequest.from(prismaFriendRequest);

        expect(friendRequest.id).toBe(1);
        expect(friendRequest.sender).toEqual(User.from(prismaFriendRequest.sender));
        expect(friendRequest.receiver).toEqual(User.from(prismaFriendRequest.receiver));
        expect(friendRequest.status).toBe('pending');
        expect(friendRequest.timestamp).toBe(mockTimestamp);
    });
});