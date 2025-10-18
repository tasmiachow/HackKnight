import feedparser

BASE_URL = "https://feeds.finance.yahoo.com/rss/2.0/headline?s={ticker}&region=US&lang=en-US"

def fetch_yahoo_headlines(ticker: str):
    """Fetch and parse Yahoo Finance RSS headlines for a given ticker."""
    url = BASE_URL.format(ticker=ticker.upper())
    feed = feedparser.parse(url)

    headlines = []
    for entry in feed.entries:
        headlines.append({
            "title": entry.title,
            "link": entry.link,
            "published": entry.published
        })
    return headlines
