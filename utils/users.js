const users = [];


// Join user to the chat channel
function userJoinChannel(id, username, channel) {
    const user = { id, username, channel };
    users.push(user);

    return user;
}


// Return current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}


// When user leaves chat channel
function userLeave (id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}


// Get users in the channel
function getUsersInChannel(channel) {
    return users.filter(user => user.channel === channel);
}


module.exports = {
    userJoinChannel, 
    getCurrentUser,
    userLeave,
    getUsersInChannel
}