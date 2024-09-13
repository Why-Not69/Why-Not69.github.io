<!-- Поле ввода сообщения -->
<input type="text" id="message-input" placeholder="Введите сообщение... (осталось 50 сообщений)" maxlength="50">
<button id="send-button">Отправить</button>

<script>
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
