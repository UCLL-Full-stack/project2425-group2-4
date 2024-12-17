import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../components/header'; // Adjust path as necessary
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { User } from '@types';

// Mocking dependencies
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('next-i18next', () => ({
    useTranslation: jest.fn(() => ({
        t: (key: string) => key, // Mock translation function
    })),
}));

// Mocking sessionStorage
Object.defineProperty(window, 'sessionStorage', {
    value: {
        getItem: jest.fn(),
        removeItem: jest.fn(),
        setItem: jest.fn(),
    },
    writable: true,
});

describe('Header Component', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({
            locale: 'en',
            push: mockPush,
        });
    });

    test('renders header with home and login links when not logged in', () => {
        render(<Header />);

        expect(screen.getByText('header.diddyscord-logo')).toBeInTheDocument();
        expect(screen.getByText('header.links.home')).toBeInTheDocument();
        expect(screen.getByText('header.links.login')).toBeInTheDocument();

        expect(screen.queryByText('header.links.chats')).not.toBeInTheDocument();
        expect(screen.queryByText('header.links.friends')).not.toBeInTheDocument();
    });

    test('renders header with home, chats, and friends links when logged in', () => {
        const mockUser = { username: 'testuser', id: 1, role: 'user' };

        window.sessionStorage.getItem = jest.fn().mockReturnValue(
            JSON.stringify(mockUser)
        );

        render(<Header />);

        expect(screen.getByText('header.diddyscord-logo')).toBeInTheDocument();
        expect(screen.getByText('header.links.home')).toBeInTheDocument();

        expect(screen.getByText('header.links.chats')).toBeInTheDocument();
        expect(screen.getByText('header.links.friends')).toBeInTheDocument();

        expect(screen.queryByText('header.links.login')).not.toBeInTheDocument();
    });

});

