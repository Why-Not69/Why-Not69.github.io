from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__)

# Хранилище сообщений в памяти
messages = []
MAX_MESSAGES = 1000  # Максимальное количество сообщений
MAX_MESSAGE_LENGTH = 50  # Максимальная длина сообщения

# Главная страница
@app.route('/')
def index():
    return send_from_directory('', 'index.html')

# Статические файлы
@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('', filename)

# Получение сообщений
@app.route('/messages', methods=['GET'])
def get_messages():
    return jsonify(messages)

# Отправка сообщений
@app.route('/messages', methods=['POST'])
def post_message():
    data = request.json
    message = data.get('message')
    sender = data.get('sender')
    if message and sender:
        # Ограничиваем длину сообщения
        if len(message) > MAX_MESSAGE_LENGTH:
            message = message[:MAX_MESSAGE_LENGTH]

        # Добавляем новое сообщение в список
        messages.append({'message': message, 'sender': sender})
        
        # Оставляем только последние MAX_MESSAGES сообщений
        if len(messages) > MAX_MESSAGES:
            messages.pop(0)  # Удаляем самое старое сообщение

        return '', 201
    return 'Bad Request', 400

if __name__ == '__main__':
    # Для отладки только
    app.run(host='0.0.0.0', port=8000)
