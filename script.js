document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});

const serverUrl = 'https://https://worldchat-ae-com.onrender.com';  // URL, предоставленный ngrok

async function sendMessage() {
    const inputField = document.getElementById('message-input');
    let messageText = inputField.value.trim();
    
    if (messageText === '') return;

    // Ограничение длины сообщения
    if (messageText.length > 50) {
        messageText = messageText.substring(0, 50); // Обрезаем сообщение до 50 символов
        alert('Сообщение было обрезано до 50 символов');
    }
    
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
        console.error('Error sending message:', error);
    }
}


async function fetchMessages() {
    try {
        const response = await fetch(`${serverUrl}/messages`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const messages = await response.json(); // This is where the parsing happens
        console.log('Fetched messages:', messages);  // Проверьте содержимое сообщений
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
