import feedparser
import re
import requests
import time

BASE_URL = "https://feeds.finance.yahoo.com/rss/2.0/headline?s={ticker}"
QUOTE_URL = "https://query1.finance.yahoo.com/v10/finance/quoteSummary/{ticker}?modules=price"

BASE_KEYWORDS = [
    "stock", "market", "shares", "price", "investor", "earnings",
    "forecast", "profit", "loss", "growth", "ceo", "trading",
    "valuation", "report", "revenue", "results", "quarter"
]

# 🧠 cache to avoid repeated API calls
_company_cache = {}

def get_company_name(ticker: str) -> str:
    """Fetch company long name from Yahoo Finance with caching and fallback."""
    ticker = ticker.upper()
    if ticker in _company_cache:
        return _company_cache[ticker]

    try:
        res = requests.get(QUOTE_URL.format(ticker=ticker), timeout=5)
        # Handle rate limit
        if res.status_code == 429:
            print(f"⚠️ Rate limited for {ticker}, using cached or fallback value.")
            return ticker
        res.raise_for_status()
        data = res.json()
        name = (
            data["quoteSummary"]["result"][0]["price"].get("longName")
            or ticker
        )
        _company_cache[ticker] = name
        # Avoid hammering Yahoo's API
        time.sleep(0.5)
        return name
    except Exception as e:
        print(f"⚠️ Could not fetch company name for {ticker}: {e}")
        return ticker

def fetch_yahoo_headlines(ticker: str, limit: int = 5):
    """Fetch and parse Yahoo Finance RSS headlines for a given ticker."""
    url = BASE_URL.format(ticker=ticker.upper())
    feed = feedparser.parse(url)

    company_name = get_company_name(ticker)
    dynamic_keywords = BASE_KEYWORDS + [ticker.lower(), company_name.lower()]

    headlines = []

    for entry in feed.entries:
        title = re.sub(r"\s+", " ", entry.title).strip()
        link = entry.link
        published = getattr(entry, "published", None)

        if not any(word in title.lower() for word in dynamic_keywords):
            continue

        headlines.append({
            "title": title,
            "link": link,
            "published": published
        })

        if len(headlines) >= limit:
            break

    return headlines
