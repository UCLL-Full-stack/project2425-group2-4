### User Stories:

## Chatroom

> As a _User_
> I am able to _get in a chat available to me_
> so that I can _view messages in a chatroom_

### Wireframe

![Chatroom Wireframe](Attachments/ChatWireframe.png)

### Acceptance Criteria

- Ability to view messages linked to a specific chatroom.
- Should display the user that sent the message, the date and time of the message being sent, and the message content.
- Orders them by most recent at the bottom.
- The ability to scroll up to view the message history.

## Overview chats

> As a _User_
> I am able to _get a list of chats I am assigned to_
> so that I can _see which chats are available for me_

### Wireframe

![Overview chats Wireframe](Attachments/OverviewChatroomsWF.png)

### Acceptance Criteria

- A list of chats with their name displayed.
- When a chat is clicked, the chat needs to be highlighted.
- When a chat is clicked, the chat should open on the screen.

## Send Message

> As a _User_
> I am able to _send a message to another user_
> so that I can _communicate with them_

### Wireframe

![Send Message Wireframe](Attachments/sendMessageWF.png)

### Acceptance Criteria

- Ability to type and send a message.
- The message should appear in the chatroom in real-time.
- The message should be stored in the database with the correct sender and receiver information.

## Receive Message

> As a _User_
> I am able to _receive messages from another user in real-time_
> so that I can _communicate with them_

### Acceptance Criteria

- Messages sent by another user should appear in the chatroom in real-time.
- The message should be stored in the database with the correct sender and receiver information.

## Friend Request

> As a _User_
> I am able to _send a friend request to another user_
> so that I can _associate with a user_

### Wireframe

![Send Friend Request Wireframe](Attachments/SendFriendrequestWF.png)

- Clicking on a user shows a popup that allows you to send a friend request.

### Acceptance Criteria

- Ability to send a friend request to another user.
- The friend request should be stored in the database with the correct sender and receiver information.

## Overview Friend Requests

> As a _User_
> I am able to _view my friend requests_
> so that I can _accept or reject a request_

### Wireframe

![Friend Request Wireframe](Attachments/friendRequestWireFrame.png)

<<<<<<< HEAD

- # Clicking on a user shows a popup that allows you to send a friend request.
  > > > > > > > parent of 878d306 (converting & merging analysis documents into 1 'PDF' file)

### Acceptance Criteria

- Ability to view pending friend requests.
- Ability to accept or reject a friend request.
- The friend request status should be updated in the database.

## Chat API

### Endpoints:

1. **User Authentication:**

   - `POST /api/auth/register`: Register a new user.
   - `POST /api/auth/login`: Log in a user.
   - `POST /api/auth/logout`: Log out a user.

2. **Friend Requests:**

   - `POST /api/friends/request`: Send a friend request.
   - `GET /api/friends/requests`: Get pending friend requests.
   - `POST /api/friends/requests/{requestId}/accept`: Accept a friend request.
   - `POST /api/friends/requests/{requestId}/reject`: Reject a friend request.

3. **Chats:**

   - `GET /api/chats`: Get a list of chats for the user.
   - `GET /api/chats/{chatId}`: Get messages for a specific chatroom.
   - `POST /api/chats/{chatId}/messages`: Send a message to a chatroom.

4. **Real-time Messaging:**
   - Implement WebSocket in the backend for real-time messaging as the database supports WebSockets.
