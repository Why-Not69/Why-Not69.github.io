document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});

const serverUrl = 'https://2b1a-2a02-a319-82f4-2d00-6c92-23b8-acc6-fdb0.ngrok-free.app';  // URL, предоставленный ngrok

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
        await fetch(`${serverUrl}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: messageText, sender: 'myself' }), // Добавьте идентификатор отправителя
        });
        fetchMessages();  // Обновите сообщения после отправки
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchMessages() {
    try {
        const response = await fetch(`${serverUrl}/messages`);
        const messages = await response.json();
        console.log('Fetched messages:', messages);  // Проверьте, что сообщения получены
        const chatWindow = document.getElementById('chat-window');
        chatWindow.innerHTML = '';  // Очистить чат перед добавлением новых сообщений
        messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', msg.sender === 'myself' ? 'my-message' : 'their-message');
            messageElement.textContent = msg.message;
            chatWindow.appendChild(messageElement);
        });
        scrollToBottom();
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

function scrollToBottom() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

document.addEventListener('DOMContentLoaded', fetchMessages);
