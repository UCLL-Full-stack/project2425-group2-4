import { User, Message, Chat, FriendRequest } from '@types';
import React, { useState, useEffect } from 'react';
import styles from '@styles/home.module.css';
import MessageService from '@services/MessageService';
import UserService from '@services/UserService';
import { useTranslation } from "next-i18next";

type Props = {
    friendrequest: FriendRequest
};


const FriendRequestBox: React.FC<Props> = ({ friendrequest }) => {
    const { t } = useTranslation();
    const [senderUsername, setSenderUsername] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await UserService.getAllUsers();
                if (users === undefined) throw new Error('No users found');
                const sender = users.find(user => user.id === friendrequest.sender.userId);
                if (sender) {
                    setSenderUsername(sender.username);
                }
            } catch (error) {
                console.error('Failed to fetch users', error);
            }
        };

        fetchUsers();
    }, [friendrequest.sender.userId])


    const acceptRequest = async () => {
        try {
            await UserService.handleFriendRequest(friendrequest, 'accepted')
            window.location.reload();
        } catch (e) {
            setError(t("friends.component.friend-request-box.error-message"));
        }

    }
    const declineRequest = async () => {
        await UserService.handleFriendRequest(friendrequest, 'declined')
        window.location.reload();
    }


    return (
        <>
            {/* <h1 className={styles.chatroomName}>{chat.name}</h1> */}
            <div className={styles.FriendRequestContainer}>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <section key={friendrequest.id} className={styles.chatSection}>
                    <p>{senderUsername} {t("friends.component.friend-request-box.request-sender")}</p>
                </section>
                <div className={styles.FriendRequestContainerButtons}>
                    <button onClick={acceptRequest}>{t("friends.component.friend-request-box.accept-button")}</button>
                    <button onClick={declineRequest}>{t("friends.component.friend-request-box.decline-button")}</button>
                </div>
            </div>
        </>
    );
};

export default FriendRequestBox;
