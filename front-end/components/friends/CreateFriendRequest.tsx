import React, { useState, useEffect } from 'react';
import { User } from '@types';
import styles from '@styles/home.module.css';
import UserService from '@services/UserService';
import { useTranslation } from 'next-i18next';

type props = {};

const CreateFriendRequest: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [query, setQuery] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const { t } = useTranslation();

    useEffect(() => {
        getUsersWhoArentFriends();
        console.log(users);
    }, []);

    const getUsersWhoArentFriends = async () => {
        try {
            const allUsers = await UserService.getAllUsers();
            const allFriends = await UserService.getAllFriends();

            const usersToPush: Array<User> = [];

            for (let i = 0; i < allUsers.length; i++) {
                let exists = false;
                for (let j = 0; j < allFriends.length; j++) {
                    console.log(allUsers[i]);
                    if (allUsers[i].id === allFriends[j].id) {
                        exists = true;
                    }
                }
                if (!exists) usersToPush.push(allUsers[i]);
            }
            setUsers(usersToPush);
            console.log(usersToPush)
        } catch (e) {
            console.log(e);
            setError(t('friends.component.create-friend-request.fetchError'));
        }
    };

    const filteredUsers =
        query === ''
            ? users
            : users.filter((user) => {
                return user.username.toLowerCase().includes(query.toLowerCase());
            });

    const handleSubmission = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (selectedUser === undefined || selectedUser === null) {
            setError(t('friends.component.create-friend-request.error'));
            return;
        }

        if (selectedUser) {
            try {
                await UserService.sendFriendRequest({ friendUsername: selectedUser.username });
            } catch (e) {
                setError(t('friends.component.create-friend-request.error'));
                return e;
            }
        }
        window.location.reload();
    };

    return (
        <>
            <form className={styles.createChatroomForm} onSubmit={handleSubmission}>
                <h3>{t('friends.component.create-friend-request.title')}</h3>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <div className={styles.createChatroomFormUsersContainer}>
                    <label> {t('friends.component.create-friend-request.label-users')}</label>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                </div>
                <select
                    name={t('friends.component.create-friend-request.label-users')}
                    required
                    onChange={(e) => {
                        const thisUser = users.find((user) => user.id === Number(e.target.value));
                        if (thisUser) {
                            setSelectedUser(thisUser)
                            setQuery(thisUser.username)
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
                <button type="submit">{t('friends.component.create-friend-request.button')}</button>
            </form>
        </>
    );
};

export default CreateFriendRequest;
