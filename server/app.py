from flask import Flask, jsonify, request
from flask_cors import CORS

#functions 
from news.yahoo import fetch_yahoo_headlines
from sentiment.gemini import analyze_sentiment

#supabase connection 
from supabase import create_client, Client
import os

from dotenv import load_dotenv
load_dotenv()





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





#entimenet ticker return stored sentiment data to frontend  

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


@app.route("/watchlist/<user_id>", methods=["GET"])
def get_watchlist(user_id):
    try:
        res = supabase.table("watchlists").select("ticker").eq("user_id", user_id).execute()
        tickers = [r["ticker"] for r in res.data]
        return jsonify({"watchlist": tickers}), 200
    except Exception as e:
        print("⚠️ Watchlist fetch error:", e)
        return jsonify({"error": str(e)}), 500
    


@app.route("/watchlist/add", methods=["POST"])
def add_to_watchlist():
    data = request.get_json()
    user_id = data.get("user_id")
    ticker = data.get("ticker")

    if not user_id or not ticker:
        return jsonify({"error": "user_id and ticker required"}), 400

    try:
        supabase.table("watchlists").insert({
            "user_id": user_id,
            "ticker": ticker.upper()
        }).execute()
        return jsonify({"message": f"Added {ticker} to watchlist"}), 201
    except Exception as e:
        print("⚠️ Add watchlist error:", e)
        return jsonify({"error": str(e)}), 500
    



@app.route("/watchlist/remove", methods=["POST"])
def remove_from_watchlist():
    data = request.get_json()
    user_id = data.get("user_id")
    ticker = data.get("ticker")

    if not user_id or not ticker:
        return jsonify({"error": "user_id and ticker required"}), 400

    try:
        supabase.table("watchlists").delete() \
            .eq("user_id", user_id).eq("ticker", ticker.upper()) \
            .execute()
        return jsonify({"message": f"Removed {ticker} from watchlist"}), 200
    except Exception as e:
        print("⚠️ Remove watchlist error:", e)
        return jsonify({"error": str(e)}), 500



@app.route("/sentiment/overall/<user_id>", methods=["GET"])
def get_overall_sentiment_for_user(user_id):
    """
    Aggregate sentiment for all tickers in a user's Supabase watchlist.
    Example: GET /sentiment/overall/abc123
    """
    try:
        # 1️⃣ Fetch the user's watchlist
        res = supabase.table("watchlists").select("ticker").eq("user_id", user_id).execute()
        tickers = [r["ticker"] for r in res.data]

        if not tickers:
            return jsonify({"error": "No tickers found in user watchlist"}), 404

        # 2️⃣ Aggregate sentiment for those tickers
        total_score = 0
        total_bull_ratio = 0
        total_articles = 0
        valid_tickers = 0

        for ticker in tickers:
            result = supabase.table("sentiment_snapshots") \
                .select("score, overall_sentiment") \
                .eq("ticker", ticker.upper()) \
                .order("created_at", desc=True) \
                .limit(1) \
                .execute()

            if not result.data:
                continue

            row = result.data[0]
            score = float(row.get("score", 0))
            mood = row.get("overall_sentiment", "neutral").lower()
            bull_ratio = 1 if mood in ["positive", "bullish"] else 0

            total_score += score
            total_bull_ratio += bull_ratio
            total_articles += 1
            valid_tickers += 1

        if valid_tickers == 0:
            return jsonify({
                "score": 0,
                "bullRatio": 0,
                "articles": 0,
                "message": "No sentiment data found for user watchlist"
            }), 404

        avg_score = total_score / valid_tickers
        avg_bull = total_bull_ratio / valid_tickers

        return jsonify({
            "score": round(avg_score, 3),
            "bullRatio": round(avg_bull, 3),
            "articles": total_articles
        }), 200

    except Exception as e:
        print("⚠️ Overall sentiment error:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/history/watchlist/<user_id>", methods=["GET"])
def get_watchlist_history(user_id):
    """
    Returns sentiment history (time series) for all tickers in a user's watchlist.
    Used for multi-line Sentiment Snapshot chart.
    """
    try:
        # Get user's watchlist tickers
        wl_res = supabase.table("watchlists").select("ticker").eq("user_id", user_id).execute()
        tickers = [r["ticker"] for r in wl_res.data]

        if not tickers:
            return jsonify({"message": "No tickers in watchlist", "data": []}), 404

        all_data = []
        for ticker in tickers:
            res = supabase.table("sentiment_snapshots") \
                          .select("score, created_at") \
                          .eq("ticker", ticker.upper()) \
                          .order("created_at", desc=False) \
                          .execute()
            data = res.data or []
            formatted = [
                {"ticker": ticker, "time": d["created_at"], "sentiment": float(d["score"])}
                for d in data if d.get("score") is not None
            ]
            all_data.extend(formatted)

        return jsonify(all_data), 200

    except Exception as e:
        print("⚠️ Watchlist history fetch error:", e)
        return jsonify({"error": str(e)}), 500
    
    
# ✅ Example POST route (just echoes back the data)
@app.route("/echo", methods=["POST"])
def echo():
    data = request.get_json()
    return jsonify({"you_sent": data}), 200

if __name__ == "__main__":
    app.run(debug=True)
