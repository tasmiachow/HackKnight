# server/data_automation.py
import time
from supabase import create_client
import requests
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
BASE_URL = "http://127.0.0.1:5000"  # Flask backend running locally

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def refresh_watchlist_sentiment():
    res = supabase.table("watchlists").select("ticker").execute()
    tickers = list({row["ticker"] for row in res.data})  # unique tickers

    print(f"🔁 Refreshing {len(tickers)} tickers...")

    for ticker in tickers:
        try:
            print(f"➡️ Analyzing {ticker}")
            requests.post(f"{BASE_URL}/analyze", json={"ticker": ticker})
            time.sleep(65)  # cooldown to respect Gemini API rate limit
        except Exception as e:
            print(f"⚠️ Error analyzing {ticker}: {e}")

    print("✅ Refresh cycle complete")

if __name__ == "__main__":
    refresh_watchlist_sentiment()
