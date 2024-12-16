// import { Chat } from '@types';
// import React from 'react';
// import styles from '@styles/home.module.css';

// type Props = {
//     chats: Chat[];
// };

// const ChatOverviewData: React.FC<Props> = ({ chats }) => {
//     return (
//         <div className={styles.chatRoomContainer}>
//             {chats.map((chat, index) => (
//                 <section key={index} className={styles.chatSection}>
//                     <h2 className={styles.userName}>
//                         {chats.find((u) => u.id === chat.id)?.id}
//                     </h2>
//                     <h2 className={styles.dateTime}>{new Date(chat.createdAt).toLocaleString()}</h2>
//                 </section>
//             ))}
//         </div>
//     );
// };

// export default ChatOverviewData;

import React, { useState, useEffect } from 'react';
import { Chat, User } from '@types';
import styles from '@styles/home.module.css';
import { useTranslation } from "next-i18next";
import { Button } from '@headlessui/react';
import EditChatroom from './EditChatroom';

type Props = {
    chats: Chat[];
    selectChat: (chat: Chat) => void;
};

const ChatOverviewData: React.FC<Props> = ({ chats, selectChat }: Props) => {
    const [diddyFan, setDiddyFan] = useState<User | null>(null);
    const [chatToEdit, setChatToEdit] = useState<string | undefined>(undefined);
    const [editChatVisible, setEditChatVisible] = useState<boolean>(false);
    const { t } = useTranslation();

    useEffect(() => {
        //setDiddyFan(JSON.parse(sessionStorage.getItem('diddyfan') || '')); // '' is correct what
        //console.log(diddyFan);
    }, []);

    const toggleEditChatPopup = () => {
        editChatVisible ? setEditChatVisible(false) : setEditChatVisible(true);

    }


    return (
        <>
            {(chatToEdit !== undefined && editChatVisible) && (
                <div className={styles.editChatroomContainer} onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        toggleEditChatPopup();
                    }
                }}>
                    <EditChatroom chatId={chatToEdit} />
                </div>
            )}
            {chats && (
                <table className={styles.overviewTable}>
                    {/*  */}
                    <thead>
                        <tr>
                            <th scope="col">Chat Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chats.map((chat, index) => (
                            <>
                                <tr key={index} onClick={() => selectChat(chat)} role="button">
                                    <td>{chat.name}</td>
                                </tr>
                                <svg onClick={() => {
                                    if (chat.id) {
                                        setChatToEdit(chat.id);
                                        setEditChatVisible(true);
                                    }
                                }
                                } viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20.1497 7.93997L8.27971 19.81C7.21971 20.88 4.04971 21.3699 3.27971 20.6599C2.50971 19.9499 3.06969 16.78 4.12969 15.71L15.9997 3.84C16.5478 3.31801 17.2783 3.03097 18.0351 3.04019C18.7919 3.04942 19.5151 3.35418 20.0503 3.88938C20.5855 4.42457 20.8903 5.14781 20.8995 5.90463C20.9088 6.66146 20.6217 7.39189 20.0997 7.93997H20.1497Z" stroke="#FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M21 21H12" stroke="#FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            </>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
};

export default ChatOverviewData;
