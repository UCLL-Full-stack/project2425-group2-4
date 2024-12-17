import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateChatroom from '../components/chats/CreateChatroom';
import UserService from '../services/UserService';
import ChatService from '../services/ChatService';
import '@testing-library/jest-dom';
import { User } from '../types';
import { useRouter } from 'next/router';

window.React = React

// Mock useRouter
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

// Mock UserService
jest.mock('@services/UserService', () => ({
    getAllUsers: jest.fn(),
}));

// Mock ChatService
jest.mock('@services/ChatService', () => ({
    createChatroom: jest.fn(),
}));

const mockUsers = [
    { id: 1, username: 'user1', email: 'user1@example.com', role: 'user' },
    { id: 2, username: 'user2', email: 'user2@example.com', role: 'user' },
];

beforeEach(() => {
    jest.clearAllMocks();
    (UserService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
});

test('renders CreateChatroom component', async () => {
    render(<CreateChatroom />);

    expect(screen.getByLabelText('Assignee'));
    expect(screen.getByLabelText('ChatroomName'));
    expect(screen.getByText('chats-components.createChatroom.button'));
});

test('filters users based on query', async () => {
    render(<CreateChatroom />);

    fireEvent.change(screen.getByLabelText('Assignee'), { target: { value: 'user1' } });

    await waitFor(() => {
        expect(screen.getByText('user1')).toBeInTheDocument();
        expect(screen.queryByText('user2')).not.toBeInTheDocument();
    });
});

test('creates chatroom on valid submission', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    render(<CreateChatroom />);

    fireEvent.change(screen.getByLabelText('ChatroomName'), { target: { value: 'Test Chatroom' } });
    fireEvent.change(screen.getByLabelText('Assignee'), { target: { value: 'user1' } });

    await waitFor(() => {
        fireEvent.click(screen.getByText('user1'));
    });

    fireEvent.click(screen.getByText('chats-components.createChatroom.button'));

    await waitFor(() => {
        expect(ChatService.createChatroom).toHaveBeenCalledWith({
            name: 'Test Chatroom',
            users: [mockUsers[0]],
            messages: [],
        });
        expect(mockPush).toHaveBeenCalledWith('/chats');
    });
});