import telegram
from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

TELEGRAM_BOT_TOKEN = '7581506666:AAGWFOMWp-5Y6qYd6OME1AgtmSeZCziYbOQ'
bot = telegram.Bot(token=TELEGRAM_BOT_TOKEN)

DATA_FILE = 'data.json'

def load_data():
    global data
    try:
        with open(DATA_FILE, "r") as f:
            if f.read().strip() == "":
                data = {}
            else:
                f.seek(0)
                data = json.load(f)
    except FileNotFoundError:
        data = {}

def save_data():
    with open(DATA_FILE, "w") as f:
        json.dump(data, f)

def get_telegram_username(user_id):
    try:
        user_info = bot.get_chat(user_id)
        return user_info.username
    except Exception as e:
        print(f"Error fetching Telegram username: {e}")
        return None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/start', methods=['POST'])
def start():
    user_id = request.json.get("user_id")
    if user_id not in data:
        username = get_telegram_username(user_id)
        data[user_id] = {"coins": 0, "level": 1, "taps": 0, "username": username}
        save_data()
    return jsonify(data[user_id])

@app.route('/tap', methods=['POST'])
def tap():
    user_id = request.json.get("user_id")
    if user_id in data:
        data[user_id]["taps"] += 1
        earned_coins = 1 * data[user_id]["level"]
        data[user_id]["coins"] += earned_coins
        save_data()
        return jsonify({"coins": data[user_id]["coins"], "earned": earned_coins})
    return jsonify({"error": "User not found"}), 404

@app.route('/stats', methods=['POST'])
def stats():
    user_id = request.json.get("user_id")
    if user_id in data:
        return jsonify(data[user_id])
    return jsonify({"error": "User not found"}), 404

@app.route('/leaderboard', methods=['GET'])
def leaderboard():
    sorted_players = sorted(data.items(), key=lambda x: x[1].get("coins", 0), reverse=True)
    leaderboard_data = [{"username": player[1].get("username", "Unknown"), "coins": player[1].get("coins", 0)} for player in sorted_players]
    return jsonify({"leaderboard": leaderboard_data})

@app.route('/friends', methods=['GET'])
def friends():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID not provided"}), 400
    friends_list = [{"username": user["username"], "progress": user["coins"]} for user in data.values() if user.get("referral") == user_id]
    return jsonify({"friends": friends_list})

if __name__ == '__main__':
    load_data()
    app.run(debug=True)
