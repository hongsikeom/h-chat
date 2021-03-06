const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const channelmName = document.getElementById('channel-name');
const uesrList = document.getElementById('users');

const socket = io();


// Message to the user side
function displayMessage(msg) {
    const div = document.createElement('div');
    div.classList.add('message');

    if (msg.type === "myself"){
        div.style.background = "#fef01b";
        div.style.float = "right";
    }
    
    div.style.clear = "both";
    div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">${msg.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}



function displayChannelName(channel) {
    channelmName.innerText = channel;
}


function displayUsers(users) {
    uesrList.innerHTML = `${users.map(user => `<li>${user.username}`).join('')}`
}


// Get Username and channel from URL
const { username, channel } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


// Join chat channel
socket.emit('joinChatChannel', { username, channel });


// Get channel and Users
socket.on('channelUsers', ({ channel, users }) => {
    displayChannelName(channel);
    displayUsers(users);
});


// Message from server
socket.on('message', message => {
    displayMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    console.log(msg);

    // Send messages to server
    socket.emit('chatMessage', msg);
    
    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});



