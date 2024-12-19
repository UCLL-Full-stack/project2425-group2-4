import usersDb from '../../repository/users.db';
import userService from '../../service/user.service';
import { User } from '../../model/user';
import { UserInput, FriendRequestInput, Status } from '../../types';

jest.mock('../../repository/users.db');

describe('FriendRequest Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('getAllFriends should throw an error if user does not exist', async () => {
        (usersDb.getUserByUsername as jest.Mock).mockResolvedValue(null);

        await expect(userService.getAllFriends('nonExistentUser')).rejects.toThrow('nonExistentUser does not exist.');
    });

    test('getAllFriends should return friends if user exists', async () => {
        const mockUser = { getId: () => 1 };
        const mockFriends: UserInput[] = [{ id: 2, username: 'friend1', email: 'friend1@example.com', role: 'user' }];

        (usersDb.getUserByUsername as jest.Mock).mockResolvedValue(mockUser);
        (usersDb.getAllFriends as jest.Mock).mockResolvedValue(mockFriends);

        const friends = await userService.getAllFriends('existingUser');
        expect(friends).toEqual(mockFriends);
    });

    test('showFriendRequests should throw an error if user does not exist', async () => {
        (usersDb.getUserByUsername as jest.Mock).mockResolvedValue(null);

        await expect(userService.showFriendRequests('nonExistentUser')).rejects.toThrow('User does not exist.');
    });

    test('showFriendRequests should return friend requests if user exists', async () => {
        const mockUser = { getId: () => 1 };
        const mockFriendRequests: FriendRequestInput[] = [
            { id: 1, sender: { userId: 2 }, receiver: { userId: 1 }, status: 'pending', timestamp: new Date() }
        ];

        (usersDb.getUserByUsername as jest.Mock).mockResolvedValue(mockUser);
        (usersDb.showFriendRequests as jest.Mock).mockResolvedValue(mockFriendRequests);

        const friendRequests = await userService.showFriendRequests('existingUser');
        expect(friendRequests).toEqual(mockFriendRequests);
    });

    test('handleFriendRequest should throw an error if user does not exist', async () => {
        (usersDb.getUserByUsername as jest.Mock).mockResolvedValue(null);

        await expect(userService.handleFriendRequest('nonExistentUser', 1, 'accepted')).rejects.toThrow('User does not exist.');
    });

    test('handleFriendRequest should update friend request status and create friendship if accepted', async () => {
        const mockUser = { getId: () => 1 };
        const mockFriendRequest = { id: 1, sender: { userId: 2 }, receiver: { userId: 1 }, status: 'pending', timestamp: new Date() };

        (usersDb.getUserByUsername as jest.Mock).mockResolvedValue(mockUser);
        (usersDb.updateFriendRequestStatus as jest.Mock).mockResolvedValue(mockFriendRequest);
        (usersDb.createFriendship as jest.Mock).mockResolvedValue(null);

        const updatedFriendRequest = await userService.handleFriendRequest('existingUser', 1, 'accepted');
        expect(updatedFriendRequest).toEqual(mockFriendRequest);
        expect(usersDb.createFriendship).toHaveBeenCalledWith(2, 1);
    });

    test('sendFriendRequest should throw an error if user does not exist', async () => {
        (usersDb.getUserByUsername as jest.Mock).mockResolvedValue(null);

        await expect(userService.sendFriendRequest('nonExistentUser', 'friendUser')).rejects.toThrow('User does not exist.');
    });

    test('sendFriendRequest should throw an error if friend does not exist', async () => {
        const mockUser = { getId: () => 1 };

        (usersDb.getUserByUsername as jest.Mock).mockImplementation(({ username }) => {
            if (username === 'nonExistentUser') return null;
            if (username === 'existingUser') return mockUser;
        });

        await expect(userService.sendFriendRequest('existingUser', 'nonExistentUser')).rejects.toThrow('Friend does not exist.');
    });

    test('sendFriendRequest should send a friend request if both users exist', async () => {
        const mockUser = { getId: () => 1 };
        const mockFriend = { getId: () => 2 };
        const mockFriendRequest: FriendRequestInput = { id: 1, sender: { userId: 1 }, receiver: { userId: 2 }, status: 'pending', timestamp: new Date() };

        (usersDb.getUserByUsername as jest.Mock).mockImplementation(({ username }) => {
            if (username === 'existingUser') return mockUser;
            if (username === 'friendUser') return mockFriend;
        });
        (usersDb.sendFriendRequest as jest.Mock).mockResolvedValue(mockFriendRequest);

        const friendRequest = await userService.sendFriendRequest('existingUser', 'friendUser');
        expect(friendRequest).toEqual(mockFriendRequest);
    });
});