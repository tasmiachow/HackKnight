from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow requests from your React frontend

# Health check route
@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"message": "Backend is up!"})

# Example POST route for sentiment analysis
@app.route("/analyze", methods=["POST"])
def analyze_text():
    data = request.get_json()
    text = data.get("text", "")

    # TODO: Call your LangGraph or LLM sentiment pipeline here
    sentiment_result = {
        "sentiment": "positive",
        "score": 0.8,
        "input_text": text
    }

    return jsonify(sentiment_result)

if __name__ == "__main__":
    app.run(debug=True)
