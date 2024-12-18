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
    const [selectedUser, setSelectedUser] = useState<User>();
    const [chatroomName, setChatroomName] = useState<string>('');

    const { t } = useTranslation();
    const router = useRouter();

    const fetchUsers = async () => {
        const users = await UserService.getAllUsers();
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
        if (chatroomName.trim() !== '' && selectedUser?.username) {
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
        if (selectedUser === undefined) {
            return;
        }

        await ChatService.createChatroom({
            name: chatroomName,
            users: [selectedUser],
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
                <div className={styles.createChatroomFormUsersContainer}>
                    <Combobox value={selectedUser} onChange={setSelectedUser}>
                        <ComboboxInput
                            aria-label="Assignee"
                            displayValue={(user: User) => user?.username}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <ComboboxOptions anchor="bottom" className="border empty:invisible">
                            {filteredUsers.map((user) => (
                                <ComboboxOption
                                    key={user.id}
                                    value={user}
                                    className={styles.createChatroomFormUsersOption}
                                >
                                    {user.username}
                                </ComboboxOption>
                            ))}
                        </ComboboxOptions>
                    </Combobox>
                    <label>{t('chats-components.createChatroom.label.users')}</label>
                </div>
                <button type="submit">{t('chats-components.createChatroom.button')}</button>
            </form>
        </>
    );
};

export default CreateChatroom;
