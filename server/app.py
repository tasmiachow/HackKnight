from flask import Flask, jsonify, request
from flask_cors import CORS

from news.yahoo import fetch_yahoo_headlines


app = Flask(__name__)
CORS(app)  # Enable CORS for later when you connect React

# ✅ Health check route
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to the Flask backend 👋"})

@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"message": "Backend is running 🚀"})

#Fetch & return real-time headlines from Yahoo
@app.route("/news/<ticker>", methods=["GET"])
def get_news(ticker):
    try: 
        headlines = fetch_yahoo_headlines(ticker)
        if not headlines:
            return jsonify({"message": f"No news found for ticker {ticker}"}), 404
        return jsonify(headlines), 200 

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#POST analyze ticker post request with Gemini 




#POST refresh ticker - put data into superbase post


#GET sentimenet ticker return stored sentiment data to frontend  


# ✅ Example POST route (just echoes back the data)
@app.route("/echo", methods=["POST"])
def echo():
    data = request.get_json()
    return jsonify({"you_sent": data}), 200

if __name__ == "__main__":
    app.run(debug=True)
