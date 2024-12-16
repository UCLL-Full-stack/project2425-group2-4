import { User, Message, Chat, FriendRequest } from '@types';
import React, { useState, useEffect } from 'react';
import styles from '@styles/home.module.css';
import MessageService from '@services/MessageService';
import UserService from '@services/UserService';

type Props = {
    friendrequest: FriendRequest
};


const FriendRequestBox: React.FC<Props> = ({ friendrequest }) => {

    const acceptRequest = async () => {
        await UserService.handleFriendRequest(friendrequest, true)
        window.location.reload();
    }
    const declineRequest = async () => {
        await UserService.handleFriendRequest(friendrequest, false)
        window.location.reload();
    }


    return (
        <>
            {/* <h1 className={styles.chatroomName}>{chat.name}</h1> */}
            <div className={styles.FriendRequestContainer}>
                <section key={friendrequest.id} className={styles.chatSection}>
                    <p>{friendrequest.sender.username} would like to diddy you up</p>
                </section>
                <div className={styles.FriendRequestContainerButtons}>
                    <button onClick={acceptRequest}>Accept</button>
                    <button onClick={declineRequest}>Decline</button>
                </div>
            </div>
        </>
    );
};

export default FriendRequestBox;
