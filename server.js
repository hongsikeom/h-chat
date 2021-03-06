const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const messageFormat = require('./utils/messages');
const { userJoinChannel, getCurrentUser, userLeave, getUsersInChannel } = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Socket
const serverName = 'H-CHAT'

// When client connects to the server
io.on('connect', socket => {
    // When user connects to the channel
    socket.on('joinChatChannel', ({ username, channel }) => {
        const user = userJoinChannel(socket.id, username, channel);
        socket.join(user.channel);

        // Send message to the current user
        socket.emit('message', messageFormat(serverName, 'Welcome to H-CHAT', 'others'));

        // Send messages to the users except for the current user
        socket.broadcast.to(user.channel).emit('message',  messageFormat(serverName, `${user.username} has joined the chat!`, 'others'));

        // Send users and channel name
        io.to(user.channel).emit('channelUsers', {
            channel: user.channel,
            users: getUsersInChannel(user.channel)
        })
    });

    socket.on('chatMessage', (msg) => {
        // Get current user
        const user = getCurrentUser(socket.id);
        // Send messages to all users in the channel
        socket.emit('message', messageFormat(user.username, msg, 'myself'));
        socket.broadcast.to(user.channel).emit('message', messageFormat(user.username, msg, 'others'));
    });

    // When user disconnects the server
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            // Send messages to all users in the channel
            io.to(user.channel).emit('message', messageFormat(serverName, `${user.username} has left the chat`, 'others'));

            io.to(user.channel).emit('channelUsers', {
                channel: user.channel,
                users: getUsersInChannel(user.channel)
            })
        }
    });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log (`Server is running on port ${PORT}`));
