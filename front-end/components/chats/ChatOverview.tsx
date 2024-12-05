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

import React from 'react';
import { Chat } from '@types';
import styles from '@styles/home.module.css';

type Props = {
    chats: Chat[];
    selectChat: (chat: Chat) => void;
};

const ChatOverviewData: React.FC<Props> = ({ chats, selectChat }: Props) => {
    return (
        <>
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
                            <tr key={index} onClick={() => selectChat(chat)} role="button">
                                <td>{chat.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
};

export default ChatOverviewData;
