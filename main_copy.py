from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__)

messages = []

@app.route('/messages', methods=['GET'])
def get_messages():
    return jsonify(messages)

@app.route('/messages', methods=['POST'])
def post_message():
    data = request.json
    message = data.get('message')
    sender = data.get('sender')
    messages.append({'message': message, 'sender': sender})
    return '', 201

@app.route('/')
def serve_index():
    return send_from_directory('static', 'index.html')

# Удалите ненужные маршруты для статики, они не нужны
# @app.route('/styles.css')
# def serve_styles():
#     return send_from_directory('static', 'styles.css')

# @app.route('/script.js')
# def serve_script():
#     return send_from_directory('static', 'script.js')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)
