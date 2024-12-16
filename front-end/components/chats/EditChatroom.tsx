import React, { useState, useEffect } from 'react';
import { Chat, User } from '@types';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

import styles from '@styles/home.module.css';
import UserService from '@services/UserService';
import ChatService from '@services/ChatService';
import { Router, useRouter } from 'next/router';
import { useTranslation } from "next-i18next";

type Props = {
    chatId: string;
}

const EditChatroom: React.FC<Props> = ({ chatId }: Props) => {

    const [chatroomName, setChatroomName] = useState<string>("");
    const { t } = useTranslation();

    useEffect(() => {
        const getChatroom = ChatService.getChatById(chatId)
            .then(result => {
                setChatroomName(result.name)
            })
            .catch(e => console)
    }, []);


    const router = useRouter();
    const validate = (): boolean => {
        if (chatroomName.trim() !== '') {
            return true;
        }
        return false;
    };

    const handleSubmission = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        ChatService.updateChatroom({ id: chatId, name: chatroomName })
    }


    return (
        <>
            <form className={styles.createChatroomForm} onSubmit={handleSubmission}>
                <div className={styles.createChatroomFormNameContainer}>
                    <input
                        id='ChatroomName'
                        onChange={(e) => setChatroomName(e.target.value)}
                        value={chatroomName}
                        type="text"
                        required
                    />
                    <label htmlFor='#ChatroomName'>{t("chats-components.editChatroom.chatroom-name")}</label>
                </div>
                <button type="submit" > {t("chats-components.editChatroom.chatroom-edit")} </button>
            </form>
        </>
    );
};

export default EditChatroom;
