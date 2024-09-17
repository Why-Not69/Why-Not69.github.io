document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});

const maxMessages = 100;

// Генерируем уникальный идентификатор пользователя (если его нет в localStorage)
let userId = localStorage.getItem('userId');
if (!userId) {
    userId = 'user-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
}

// Функция отправки сообщения
function sendMessage() {
    const inputField = document.getElementById('message-input');
    const messageText = inputField.value.trim();

    if (messageText === '') return;

    if (messageText.length > 50) {
        inputField.value = messageText.slice(0, 50); // Ограничение на 50 символов
        return;
    }

    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'my-message');
    messageElement.textContent = messageText;

    appendMessage(messageElement);
    inputField.value = '';

    // Отправка сообщения на сервер с идентификатором пользователя
    fetch('/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: messageText, userId: userId })
    }).then(() => {
        fetchMessages();  // Обновляем чат после отправки сообщения
    });

    scrollToBottom();
}

// Функция для получения истории сообщений с сервера
function fetchMessages() {
    fetch('/history')
        .then(response => response.json())
        .then(data => {
            const chatWindow = document.getElementById('chat-window');
            chatWindow.innerHTML = '';  // Очищаем текущее содержимое чата

            data.forEach(message => {
                const messageElement = document.createElement('div');
                
                // Если сообщение отправлено текущим пользователем, применяем класс для своих сообщений
                if (message.userId === userId) {
                    messageElement.classList.add('message', 'my-message');
                } else {
                    messageElement.classList.add('message', 'their-message');
                }

                messageElement.textContent = message.text;
                chatWindow.appendChild(messageElement);
            });

            scrollToBottom();
        });
}

// Функция для добавления сообщения в чат
function appendMessage(messageElement) {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.appendChild(messageElement);

    // Удаляем старые сообщения, если их больше 100
    if (chatWindow.children.length > maxMessages) {
        chatWindow.removeChild(chatWindow.firstChild);
    }

    scrollToBottom();
}

// Функция для автоматической прокрутки чата вниз
function scrollToBottom() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

///////////NEW CODE////////

let remainingMessages = 50; // Количество оставшихся сообщений

// Обновляем оставшееся количество сообщений в placeholder
function updateMessagePlaceholder() {
    const inputField = document.getElementById('message-input');
    inputField.placeholder = `Введите сообщение... (осталось ${remainingMessages} сообщений)`;
}

// Вызываем функцию обновления при загрузке страницы
updateMessagePlaceholder();

// Функция отправки сообщения
function sendMessage() {
    const inputField = document.getElementById('message-input');
    const messageText = inputField.value.trim();

    if (messageText === '') return;

    if (remainingMessages > 0) {
        remainingMessages -= 1; // Уменьшаем количество сообщений на 1
        updateMessagePlaceholder(); // Обновляем placeholder
    } else {
        alert('У вас закончились сообщения! Пополните баланс.');
        return;
    }

    // Логика отправки сообщения на сервер...

    inputField.value = ''; // Очищаем поле ввода после отправки сообщения
}

document.getElementById('buy-messages-button').addEventListener('click', () => {
    // Логика пополнения баланса через Telegram звезды
    alert('Перейдите в Telegram для пополнения баланса');
    // Здесь будет логика взаимодействия с Telegram API
});

document.getElementById('close-popup-button').addEventListener('click', () => {
    // Закрыть окно пополнения и открыть чат
    document.getElementById('balance-popup').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';
});

// Показать окно пополнения баланса при загрузке страницы
window.onload = function() {
    document.getElementById('balance-popup').style.display = 'block';
}
////////// NEW CODE\\\\\\\\\
// Периодически запрашиваем сообщения с сервера каждые 2 секунды
setInterval(fetchMessages, 2000);
