from flask import Flask, request, jsonify, render_template
from collections import deque
import os

app = Flask(__name__)

# Очередь для хранения сообщений (не более 100)
messages = deque(maxlen=100)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send', methods=['POST'])
def send_message():
    data = request.get_json()
    message = data.get('message')
    user_id = data.get('userId')  # Получаем userId из запроса
    if message and user_id:
        # Сохраняем сообщение с автором (userId)
        messages.append({'text': message, 'userId': user_id})
    return jsonify({'status': 'Message received'})

@app.route('/history', methods=['GET'])
def get_history():
    return jsonify(list(messages))

# Обработчик Webhook для Telegram
@app.route('/telegram-webhook', methods=['POST'])
def telegram_webhook():
    data = request.json
    # Проверяем, что это подтверждение оплаты
    if 'pre_checkout_query' in data:
        return jsonify({"ok": True})
    
    if 'message' in data and 'successful_payment' in data['message']:
        # Платеж прошел успешно, увеличиваем баланс сообщений
        return jsonify({"ok": True})

    return jsonify({"ok": True})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
