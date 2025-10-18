import time
import requests

# --- CONFIG ---
TICKERS = ["AAPL", "TSLA", "MSFT", "GOOGL", "NVDA", "AMZN"]
BASE_URL = "http://127.0.0.1:5000/analyze"
DELAY_BETWEEN_TICKERS = 60       # seconds between each call (1 min)
CYCLE_INTERVAL = 3600            # seconds between each full cycle (1 hour)

def run_cycle():
    print("🚀 Starting sentiment refresh cycle...")
    for ticker in TICKERS:
        try:
            res = requests.post(BASE_URL, json={"ticker": ticker})
            if res.status_code == 200:
                print(f"✅ {ticker} → success ({res.json()['overall']['overall_sentiment']})")
            else:
                print(f"⚠️ {ticker} → error ({res.status_code})")
        except Exception as e:
            print(f"❌ {ticker} failed:", e)
        
        # wait 1 min between tickers to respect Gemini rate limit
        print("⏳ cooldown 1 min...")
        time.sleep(DELAY_BETWEEN_TICKERS)
    print("🕒 cycle complete. Waiting 1 hour before next run.\n")

if __name__ == "__main__":
    while True:
        run_cycle()
        time.sleep(CYCLE_INTERVAL)
