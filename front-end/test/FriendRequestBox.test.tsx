import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FriendRequestBox from '../components/friends/FriendRequestBox'; // Adjust path as necessary
import UserService from '@services/UserService';
import { User } from '@types';
import { useTranslation } from 'next-i18next';

// Mocking UserService and useTranslation
jest.mock('@services/UserService', () => ({
    handleFriendRequest: jest.fn(),
}));
jest.mock('next-i18next', () => ({
    useTranslation: jest.fn(() => ({
        t: (key: string) => key, // Mock translation function
    })),
}));

describe('FriendRequestBox Component', () => {
    const mockFriendRequest = {
        id: 123,
        sender: { id: 456, username: 'TestUser' },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the friend request details', () => {
        render(<FriendRequestBox friendrequest={mockFriendRequest} />);

        // Assert that sender's username and static text are rendered
        expect(
            screen.getByText('TestUser friends.component.friend-request-box.request-sender')
        ).toBeInTheDocument();

        // Assert that buttons are rendered
        expect(
            screen.getByText('friends.component.friend-request-box.accept-button')
        ).toBeInTheDocument();
        expect(
            screen.getByText('friends.component.friend-request-box.decline-button')
        ).toBeInTheDocument();
    });

    test('calls acceptRequest when the accept button is clicked', async () => {
        render(<FriendRequestBox friendrequest={mockFriendRequest} />);

        const acceptButton = screen.getByText('friends.component.friend-request-box.accept-button');
        fireEvent.click(acceptButton);

        // Wait for the handleFriendRequest to be called
        await waitFor(() => {
            expect(UserService.handleFriendRequest).toHaveBeenCalledWith(mockFriendRequest, true);
        });
    });

    test('calls declineRequest when the decline button is clicked', async () => {
        render(<FriendRequestBox friendrequest={mockFriendRequest} />);

        const declineButton = screen.getByText(
            'friends.component.friend-request-box.decline-button'
        );
        fireEvent.click(declineButton);

        // Wait for the handleFriendRequest to be called
        await waitFor(() => {
            expect(UserService.handleFriendRequest).toHaveBeenCalledWith(mockFriendRequest, false);
        });
    });

    test('reloads the page after accepting a friend request', async () => {
        // Mock `window.location.reload`
        const reloadMock = jest.fn();
        Object.defineProperty(window, 'location', {
            value: { reload: reloadMock },
            writable: true,
        });

        render(<FriendRequestBox friendrequest={mockFriendRequest} />);

        const acceptButton = screen.getByText('friends.component.friend-request-box.accept-button');
        fireEvent.click(acceptButton);

        // Wait for the page to reload
        await waitFor(() => {
            expect(reloadMock).toHaveBeenCalled();
        });
    });

    test('reloads the page after declining a friend request', async () => {
        // Mock `window.location.reload`
        const reloadMock = jest.fn();
        Object.defineProperty(window, 'location', {
            value: { reload: reloadMock },
            writable: true,
        });

        render(<FriendRequestBox friendrequest={mockFriendRequest} />);

        const declineButton = screen.getByText(
            'friends.component.friend-request-box.decline-button'
        );
        fireEvent.click(declineButton);

        // Wait for the page to reload
        await waitFor(() => {
            expect(reloadMock).toHaveBeenCalled();
        });
    });
});
