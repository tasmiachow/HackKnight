from flask import Flask, jsonify, request
from flask_cors import CORS

#functions 
from news.yahoo import fetch_yahoo_headlines
from sentiment.gemini import analyze_sentiment

#supabase connection 
from supabase import create_client, Client
import os




SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

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

@app.route("/test", methods=["POST"])
def test():
    data = request.get_json()
    print("✅ Got test:", data)
    return jsonify({"received": data}), 200

#POST analyze ticker post request with Gemini 
@app.route("/analyze", methods=["POST"])
def analyze_headlines():
    data = request.get_json()
    ticker = data.get("ticker")
    if not ticker: 
        return{"error": "ticker is required"}, 400
    
    headlines = fetch_yahoo_headlines(ticker)
    if not headlines:
        return {"error": f"No headlines found for {ticker}"}, 404
    
    overall = analyze_sentiment(headlines, ticker)


    try:
        supabase.table("sentiment_snapshots").insert({
            "ticker": ticker.upper(),
            "overall_sentiment": overall["overall_sentiment"],
            "score": overall["score"],
            "summary": overall["summary"]
        }).execute()
    except Exception as e:
        print("⚠️ Supabase insert error:", e)

    return {"ticker": ticker, "overall": overall}, 200





#GET sentimenet ticker return stored sentiment data to frontend  

@app.route("/history/<ticker>", methods=["GET"])
def get_history(ticker):
    try: 
        res = supabase.table("sentiment_snapshots") \
                      .select("score, created_at") \
                      .eq("ticker", ticker.upper()) \
                      .order("created_at", desc=False) \
                      .execute()
        data = res.data or []
        return jsonify(data), 200
    except Exception as e:
        print("⚠️ History fetch error:", e)
        return jsonify({"error": str(e)}), 500

# ✅ (Optional) Use the 5-minute aggregation for charts
@app.route("/history/<ticker>/window", methods=["GET"])
def get_sentiment_window(ticker):
    hours = request.args.get("hours", 24, type=int)
    try:
        res = supabase.rpc("get_sentiment_window", {"p_ticker": ticker.upper(), "p_hours": hours}).execute()
        data = res.data or []
        return jsonify(data), 200
    except Exception as e:
        print("⚠️ Sentiment window fetch error:", e)
        return jsonify({"error": str(e)}), 500


# Route to get average twitter score if there are tweets on that comapny 
@app.route("/twitter/average/<ticker>", methods=["GET"])
def get_twitter_avg_for_ticker(ticker):
    """
    Returns the average tweet sentiment for a specific ticker.
    Example: GET /twitter/average/TSLA
    """
    try:
        # Fetch all tweet-based sentiment rows for that ticker
        res = supabase.table("sentiment_snapshots") \
                      .select("score") \
                      .eq("source", "tweet") \
                      .eq("ticker", ticker.upper()) \
                      .execute()

        data = res.data or []
        scores = [float(row["score"]) for row in data if row.get("score") is not None]

        if not scores:
            return jsonify({
                "ticker": ticker.upper(),
                "avg_score": None,
                "count": 0,
                "message": f"No tweet sentiment data found for {ticker.upper()}"
            }), 404

        avg_score = round(sum(scores) / len(scores), 4)

        return jsonify({
            "ticker": ticker.upper(),
            "avg_score": avg_score,
            "count": len(scores)
        }), 200

    except Exception as e:
        print("⚠️ Twitter avg fetch error:", e)
        return jsonify({"error": str(e)}), 500




# ✅ Example POST route (just echoes back the data)
@app.route("/echo", methods=["POST"])
def echo():
    data = request.get_json()
    return jsonify({"you_sent": data}), 200

if __name__ == "__main__":
    app.run(debug=True)
