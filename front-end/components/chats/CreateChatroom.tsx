import React, { useState, useEffect } from 'react';
import { Chat, User } from '@types';
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Label,
} from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

import styles from '@styles/home.module.css';
import UserService from '@services/UserService';
import ChatService from '@services/ChatService';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const CreateChatroom: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [query, setQuery] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [chatroomName, setChatroomName] = useState<string>('');
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const { t } = useTranslation();
    const router = useRouter();

    const fetchUsers = async () => {
        const users = await UserService.getAllFriends();
        setUsers(users);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers =
        query === ''
            ? users
            : users.filter((user) => user.username.toLowerCase().includes(query.toLowerCase()));

    const validate = (): boolean => {
        if (chatroomName.trim() !== '') {
            return true;
        }
        setError(t('chats-components.createChatroom.error'));
        return false;
    };

    const handleSubmission = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();


        if (!validate()) {
            return;
        }
        if (selectedUsers.length === 0) {
            return;
        }

        await ChatService.createChatroom({
            name: chatroomName,
            users: selectedUsers,
            messages: [],
        });
        router.push('/chats');
    };

    return (
        <>
            <form className={styles.createChatroomForm} onSubmit={handleSubmission}>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <div className={styles.createChatroomFormNameContainer}>
                    <input
                        id="ChatroomName"
                        onChange={(e) => setChatroomName(e.target.value)}
                        value={chatroomName}
                        type="text"
                        required
                    />
                    <label htmlFor="ChatroomName">
                        {t('chats-components.createChatroom.label.chatroomName')}
                    </label>
                </div>
                <label style={{ alignSelf: 'end' }}> {t('friends.component.create-friend-request.label-users')}</label>
                <div className={styles.createChatroomFormUsersContainer}>
                    <input
                        type="text"
                        style={{ width: '100%' }}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <select
                    name={t('friends.component.create-friend-request.label-users')}
                    multiple
                    onChange={(e) => {
                        const thisUser = users.find((user) => user.id === Number(e.target.value));
                        if (thisUser) {
                            setSelectedUsers([...selectedUsers, thisUser]);
                            users.splice(users.indexOf(thisUser), 1);
                            setUsers(users);
                        }
                    }}
                    size={10}
                >
                    {
                        filteredUsers.map((user) => (
                            <option
                                key={user.id}
                                value={user.id}
                            >
                                {user.username}
                            </option>
                        ))
                    }
                </select>

                <label style={{ alignSelf: 'end' }}> {t('friends.component.create-friend-request.label-users')}</label>
                <select
                    name={t('friends.component.create-friend-request.label-selected-users')}
                    multiple
                    onChange={(e) => {
                        const thisUser = selectedUsers.find((user) => user.id === Number(e.target.value));
                        if (thisUser) {
                            setUsers([...users, thisUser]);
                            selectedUsers.splice(selectedUsers.indexOf(thisUser), 1);
                            setSelectedUsers(selectedUsers);
                        }
                    }}
                    size={10}
                >
                    {
                        selectedUsers.map((user) => (
                            <option
                                key={user.id}
                                value={user.id}
                            >
                                {user.username}
                            </option>
                        ))
                    }
                </select>
                <button type="submit">{t('chats-components.createChatroom.button')}</button>
            </form>
        </>
    );
};

export default CreateChatroom;
