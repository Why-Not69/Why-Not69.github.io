import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

messages = []

@app.route('/messages', methods=['GET'])
def get_messages():
    return jsonify(messages)

@app.route('/messages', methods=['POST'])
def add_message():
    message = request.json.get('message')
    sender = request.json.get('sender', 'unknown')
    if message:
        messages.append({"message": message, "sender": sender})
        print(f"Received POST request with message: {message} from sender: {sender}")
        return jsonify({"status": "success", "message": "Message added"}), 201
    return jsonify({"status": "error", "message": "No message provided"}), 400

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))  # Use PORT environment variable or default to 8000
    app.run(host='0.0.0.0', port=port)
