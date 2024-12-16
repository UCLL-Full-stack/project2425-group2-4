import React, { useState, useEffect } from 'react';
import { Chat, User } from '@types';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

import styles from '@styles/home.module.css';
import UserService from '@services/UserService';
import ChatService from '@services/ChatService';
import { Router, useRouter } from 'next/router';
import { useTranslation } from "next-i18next";

type props = {

}

const CreateFriendRequest: React.FC = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [query, setQuery] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<User>(users[0]);

    const { t } = useTranslation();

    useEffect(() => {
        getUsersWhoArentFriends();
        console.log(users);

    }, []);

    const getUsersWhoArentFriends = async () => {

        const allUsers = await UserService.getAllUsers();
        const allFriends = await UserService.getAllFriends();

        const usersToPush: Array<User> = [];
        console.log(allUsers)
        console.log(allFriends)

        for (let i = 0; i < allUsers.length; i++) {
            console.log(allUsers[i])
            console.log(usersToPush)
            let exists = false;
            for (let j = 0; j < allFriends.length; j++) {
                if (allUsers[i].id === allFriends[j].id) {
                    exists = true;
                }
            }
            if (!exists) usersToPush.push(allUsers[i])
        }
        setUsers(usersToPush);
    }

    const filteredUsers =
        query === ''
            ? users
            : users.filter((user) => {
                return user.username.toLowerCase().includes(query.toLowerCase())
            })

    const handleSubmission = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (selectedUser === undefined) { return; }

        await UserService.sendFriendRequest({ friendUsername: selectedUser.username })
        window.location.reload();
    }

    return (
        <>
            <form className={styles.createChatroomForm} onSubmit={handleSubmission}>
                <div className={styles.createChatroomFormUsersContainer}>
                    <Combobox
                        value={selectedUser}
                        onChange={setSelectedUser}
                    >
                        <ComboboxInput
                            aria-label="Assignee"
                            displayValue={(user: User) => user?.username}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <ComboboxOptions anchor="bottom" className="border empty:invisible">
                            {filteredUsers.map((user) => (
                                <ComboboxOption key={user.id} value={user} className={styles.createChatroomFormUsersOption}>
                                    {user.username}
                                </ComboboxOption>
                            ))}
                        </ComboboxOptions>
                    </Combobox>
                    <label> {t("friends.component.create-friend-request.label-users")}</label>
                </div>
                <button type="submit" >{t("friends.component.create-friend-request.button")}</button>
            </form>
        </>
    );
};

export default CreateFriendRequest;
