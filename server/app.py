from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for later when you connect React

# ✅ Health check route
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to the Flask backend 👋"})

@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"message": "Backend is running 🚀"})

# ✅ Example POST route (just echoes back the data)
@app.route("/echo", methods=["POST"])
def echo():
    data = request.get_json()
    return jsonify({"you_sent": data}), 200

if __name__ == "__main__":
    app.run(debug=True)
