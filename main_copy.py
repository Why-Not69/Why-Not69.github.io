from flask import Flask, request, jsonify
from flask_cors import CORS  # Добавь это

app = Flask(__name__)
CORS(app)  # Разреши CORS

# Хранилище сообщений
messages = []

@app.route('/messages', methods=['GET'])
def get_messages():
    print("Received GET request for /messages")
    print("Returning messages:", messages)
    return jsonify(messages)


@app.route('/messages', methods=['POST'])
def add_message():
    message = request.json.get('message')
    sender = request.json.get('sender')
    print("Received POST request with message:", message, "from sender:", sender)  # Логирование данных
    if message:
        messages.append({"message": message, "sender": sender})
        return jsonify({"status": "success", "message": "Message added"}), 201
    return jsonify({"status": "error", "message": "No message provided"}), 400


if __name__ == '__main__':
    app.run(port=8000)
