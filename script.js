document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
    const inputField = document.getElementById('message-input');
    const messageText = inputField.value.trim();
    
    if (messageText === '') return;
    
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'my-message');
    messageElement.textContent = messageText;
    
    document.getElementById('chat-window').appendChild(messageElement);
    inputField.value = '';
    scrollToBottom();

    // Отправка сообщения на сервер
    try {
        await fetch('http://localhost:5000/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: messageText }),
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchMessages() {
    try {
        const response = await fetch('http://localhost:5000/messages');
        const messages = await response.json();
        const chatWindow = document.getElementById('chat-window');
        chatWindow.innerHTML = '';
        messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'their-message');
            messageElement.textContent = msg;
            chatWindow.appendChild(messageElement);
        });
        scrollToBottom();
    } catch (error) {
        console.error('Error:', error);
    }
}

function scrollToBottom() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

document.addEventListener('DOMContentLoaded', fetchMessages);
