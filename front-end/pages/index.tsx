import Head from 'next/head';
import Image from 'next/image';
import Header from '@components/header';
import styles from '@styles/home.module.css';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Chatrooms</title>
        <meta name="description" content="Courses app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.main}>
        <span>
          {/* <Image
            src="/images/courses.png"
            alt="Courses Logo"
            className={styles.vercelLogo}
            width={50}
            height={50}
          /> */}
          <h1>Diddyscord</h1>
        </span>

        <div className={styles.description}>
          <p>
          Diddyscord is a real-time chat application designed to facilitate seamless communication between users. 
          With Diddyscord, users can register, send friend requests, and engage in private or group chats.
          The app guarantees that messages are sent instantly, enabling immediate communication. 
          Users have the ability to see their chat history, handle friend requests, and get alerts about 
          new messages and friend requests. Diddyscord strives to offer a platform that is both user-friendly 
          and efficient for keeping in touch with friends and colleagues.
          </p>
        </div>
      </main>
    </>
  );
};

export default Home;
