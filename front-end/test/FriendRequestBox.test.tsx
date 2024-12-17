import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FriendRequestBox from '@components/friends/FriendRequestBox';
import UserService from '@services/UserService';
import { FriendRequest, User } from '@types';

// Mock UserService
jest.mock('@services/UserService', () => ({
    handleFriendRequest: jest.fn(),
}));

describe('FriendRequestBox', () => {
    const friendRequest: FriendRequest = {
        id: 1,
        sender: { id: 1, username: 'senderUser' },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the friend request box with sender username', () => {
        render(<FriendRequestBox friendrequest={friendRequest} />);

        expect(screen.getByText('senderUser friends.component.friend-request-box.request-sender')).toBeInTheDocument();
        expect(screen.getByText('friends.component.friend-request-box.accept-button')).toBeInTheDocument();
        expect(screen.getByText('friends.component.friend-request-box.decline-button')).toBeInTheDocument();
    });

    it('calls handleFriendRequest with accept when accept button is clicked', async () => {
        render(<FriendRequestBox friendrequest={friendRequest} />);

        fireEvent.click(screen.getByText('friends.component.friend-request-box.accept-button'));

        await waitFor(() => {
            expect(UserService.handleFriendRequest).toHaveBeenCalledWith(friendRequest, true);
        });
    });

    it('calls handleFriendRequest with decline when decline button is clicked', async () => {
        render(<FriendRequestBox friendrequest={friendRequest} />);

        fireEvent.click(screen.getByText('friends.component.friend-request-box.decline-button'));

        await waitFor(() => {
            expect(UserService.handleFriendRequest).toHaveBeenCalledWith(friendRequest, false);
        });
    });
});
