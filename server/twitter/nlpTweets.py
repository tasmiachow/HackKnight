### IMPORTANT DO NOT RUN, DATA IS ALREADY IN SUPABASE
import os
import json
import pandas as pd
import time
import requests
from supabase import create_client
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

OPENROUTER_KEY = os.getenv("OPENROUTER_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
MODEL = "openai/gpt-4o-mini"

HEADERS = {
    "Authorization": f"Bearer {OPENROUTER_KEY}",
    "HTTP-Referer": "http://localhost",  # optional but recommended
    "X-Title": "Finance Sentiment Script",
    "Content-Type": "application/json"
}


supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def analyze_tweet_sentiment(tweet):
    prompt = f"""
    You are a financial sentiment analyzer.
    Analyze the sentiment of the following tweet about a company or stock.
    Respond strictly in JSON:
    {{
      "sentiment": "positive" | "neutral" | "negative",
      "score": number between -1 and 1,
      "reason": "short explanation"
    }}
    Tweet: "{tweet}"
    """

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    try:
        res = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers=HEADERS,
        json=payload,
        timeout=30
        )
        data = res.json()

        if "error" in data:
            print("❌ API Error:", data["error"])
            return {"sentiment": "neutral", "score": 0, "reason": "API error"}

        # Debug if content is empty
        if not data.get("choices") or not data["choices"][0]["message"]["content"].strip():
            print("⚠️ Empty model output:", data)
            return {"sentiment": "neutral", "score": 0, "reason": "empty output"}

        raw = data["choices"][0]["message"]["content"].strip()

        # Clean Markdown if present
        if raw.startswith("```"):
            import re
            raw = re.sub(r"^```[a-zA-Z]*\n", "", raw)
            raw = re.sub(r"```$", "", raw)

        return json.loads(raw)

    except Exception as e:
        print("⚠️ Parse error:", e)
        print("🧾 Raw text (if any):", res.text[:300])
        return {"sentiment": "neutral", "score": 0, "reason": "parse failure"}


def process_tweet_csv(csv_path):
    df = pd.read_csv(csv_path)
    results = []

    for _, row in df.iterrows():
        ticker = str(row["ticker"]).upper()
        tweet = str(row["text"])
        dt = str(row["datetime"])

        sentiment = analyze_tweet_sentiment(tweet)
        time.sleep(0.5)  # polite cooldown

        try:
            created = datetime.fromisoformat(dt.replace("Z", "+00:00"))
        except Exception:
            created = datetime.utcnow()

        record = {
            "ticker": ticker,
            "overall_sentiment": sentiment["sentiment"],
            "score": sentiment["score"],
            "summary": sentiment.get("reason", ""),
            "source": "tweet",
            "created_at": created.isoformat()  # ✅ convert to string
        }

        results.append(record)
        print(f"✅ {ticker}: {sentiment['sentiment']} ({sentiment['score']})")

        supabase.table("sentiment_snapshots").insert(record).execute()

    print(f"🎉 Inserted {len(results)} tweets successfully.")


if __name__ == "__main__":
    process_tweet_csv("../top5_per_company.csv")
