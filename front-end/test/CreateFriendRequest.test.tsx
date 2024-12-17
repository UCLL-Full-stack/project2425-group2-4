import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateFriendRequest from '@components/friends/CreateFriendRequest';
import UserService from '@services/UserService';
import '@testing-library/jest-dom'
import { User } from '@types';

// Mock UserService
jest.mock('@services/UserService', () => ({
    getAllUsers: jest.fn(),
    getAllFriends: jest.fn(),
    sendFriendRequest: jest.fn(),
}));

describe('CreateFriendRequest', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the form and combobox', () => {
        render(<CreateFriendRequest />);

        expect(screen.getByLabelText('Assignee')).toBeInTheDocument();
        expect(screen.getByText('friends.component.create-friend-request.label-users')).toBeInTheDocument();
        expect(screen.getByText('friends.component.create-friend-request.button')).toBeInTheDocument();
    });

    it('fetches users who are not friends and displays them in the combobox', async () => {
        const allUsers: User[] = [
            { id: 1, username: 'user1' },
            { id: 2, username: 'user2' },
        ];
        const allFriends: User[] = [{ id: 1, username: 'user1' }];

        (UserService.getAllUsers as jest.Mock).mockResolvedValue(allUsers);
        (UserService.getAllFriends as jest.Mock).mockResolvedValue(allFriends);

        render(<CreateFriendRequest />);

        await waitFor(() => {
            expect(screen.getByText('user2')).toBeInTheDocument();
        });
    });

    it('filters users based on query', async () => {
        const allUsers: User[] = [
            { id: 1, username: 'user1' },
            { id: 2, username: 'user2' },
        ];
        const allFriends: User[] = [];

        (UserService.getAllUsers as jest.Mock).mockResolvedValue(allUsers);
        (UserService.getAllFriends as jest.Mock).mockResolvedValue(allFriends);

        render(<CreateFriendRequest />);

        await waitFor(() => {
            expect(screen.getByText('user1')).toBeInTheDocument();
            expect(screen.getByText('user2')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText('Assignee'), { target: { value: 'user1' } });

        await waitFor(() => {
            expect(screen.getByText('user1')).toBeInTheDocument();
            expect(screen.queryByText('user2')).not.toBeInTheDocument();
        });
    });

    it('sends a friend request on form submission', async () => {
        const allUsers: User[] = [
            { id: 1, username: 'user1' },
            { id: 2, username: 'user2' },
        ];
        const allFriends: User[] = [];

        (UserService.getAllUsers as jest.Mock).mockResolvedValue(allUsers);
        (UserService.getAllFriends as jest.Mock).mockResolvedValue(allFriends);

        render(<CreateFriendRequest />);

        await waitFor(() => {
            expect(screen.getByText('user1')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText('Assignee'), { target: { value: 'user1' } });
        fireEvent.click(screen.getByText('user1'));
        fireEvent.submit(screen.getByText('friends.component.create-friend-request.button'));

        await waitFor(() => {
            expect(UserService.sendFriendRequest).toHaveBeenCalledWith({ friendUsername: 'user1' });
        });
    });
});
