import React, { useState, useEffect } from 'react';
import { Chat, User } from '@types';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

import styles from '@styles/home.module.css';
import UserService from '@services/UserService';
import ChatService from '@services/ChatService';
import { Router, useRouter } from 'next/router';


const CreateChatroom: React.FC = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [query, setQuery] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<User>();
    const [chatroomName, setChatroomName] = useState<string>("");

    const router = useRouter();
    useEffect(() => {
        const getAllUsers = UserService.getAllUsers()
            .then(result => {
                setUsers(result)
            })
            .catch(e => console.log(e))

    }, []);

    const filteredUsers =
        query === ''
            ? users
            : users.filter((user) => {
                return user.username.toLowerCase().includes(query.toLowerCase())
            })
    const validate = (): boolean => {
        if (chatroomName.trim() !== '' && selectedUser?.username !== '') {
            return true;
        }
        return false;
    };

    const handleSubmission = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }
        if (selectedUser === undefined) { return; }

        await ChatService.createChatroom({ name: chatroomName, users: [selectedUser], messages: [] })
        router.push('/chats')

    }

    return (
        <>
            <div className={styles.createChatroomContainer}>
                <form className={styles.createChatroomForm} onSubmit={handleSubmission}>
                    <div className={styles.createChatroomFormNameContainer}>
                        <input
                            id='ChatroomName'
                            onChange={(e) => setChatroomName(e.target.value)}
                            value={chatroomName}
                            type="text"
                            required
                        />
                        <label htmlFor='#ChatroomName'>Chatroom Name</label>
                    </div>
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
                        <label> Users</label>

                    </div>
                    <button type="submit" > Create Chatroom </button>
                </form>
            </div>
        </>
    );
};

export default CreateChatroom;
