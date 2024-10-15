# description

Real-time chatbot, where user A can send messages to User B

# MVP

For an MVP we need:

- The ability for a user to send messages to another user.
- The ability for a user to receive messages from another user in realtime.

# Tables

## User:

- id **PK**
- username
- email
- password

## Friend Request:

- id **PK**
- status
- sent_at
- responded_at
- sender_id (fk many2one user.id)
- receiver_id (fkmany2one user.id)

## Message:

- id **PK**
- text
- timestamp
- sender_id (fk many2one, user.id)
- receiver_id (fk many2one user.id)
- chat_id (fk many2one chat.id)

## Chat:

- id **PK**
- users (fk many2many)
- created_at

# Backlog

- attachments
- settings & privacy for friend requests
- profile
- notifications
- **BACKUPS**
