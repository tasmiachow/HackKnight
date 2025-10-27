## Inspiration
In the stock market, information moves fast, and investors who can stay on top of news have the edge.

That’s where Sentivest comes in. Our platform analyzes tweets and news articles about major companies using AI to determine whether the sentiment is positive, neutral, or negative.

Instead of manually reading dozens of headlines, investors can instantly see which stocks are getting good press and which ones might be in trouble.

With Sentivest, users can quickly gauge public reaction and use that insight to decide whether it’s the right time to buy, sell, or hold.


## What it does
SentiVest is a web app that tracks the market’s mood in real time.

Your Watchlist – Add tickers (e.g., TSLA, AAPL, GOOG) to track company sentiment.

Sentiment Snapshot – Displays the overall tone (positive, neutral, or negative) of recent news and tweets.

Overall Sentiment Score – Calculates aggregate market mood based on overall news sentiment.

Latest Headlines – Shows the articles contributing to the sentiment score, helping users see why sentiment changed.

Market Moodboard – A dynamic particle visualization representing the current energy of the market.
Sentiment History – Graphs sentiment trends for tracked companies over time.

Live Data Feed – Displays recent updates as new data is processed.


## Demo 
<img src = "/sent.gif">

### Check out full youtube demo here:

[![Watch the tutorial](https://img.youtube.com/vi/SYQBFUTtbag/0.jpg)](https://youtu.be/SYQBFUTtbag "Click to watch the tutorial")


## How we built it
Frontend: React + Tailwind for the dashboard and visualizations.

Backend: Flask handles server logic, routes, and communication with the Gemini API and Supabase.

Sentiment Analysis: Gemini API for classifying news and tweets.

Database & Auth: Supabase for user login (Google/email) and data storage.

## Challenges we ran into
Hitting Gemini API rate limits during large sentiment analysis batches.

## Accomplishments that we're proud of

Implemented Supabase authentication with persistent user sessions and linked sentiment data to individual accounts.

Created a dynamic React dashboard that updates sentiment results in real time using Flask endpoints.

Added a Market Moodboard visualization that maps overall sentiment trends into an interactive, animated UI.

## What we learned
How to fine-tune prompts and handle Gemini API responses for consistent sentiment outputs.

Strategies for batching and caching LLM requests to stay within rate limits.

Effective frontend–backend synchronization between Flask, Supabase, and React.

## What's next for Sentivest
Build a notifications system for significant sentiment shifts.

Expand the Market Moodboard into a global “sentiment heatmap” for sectors and indices.





# Backend Setup 
npm install -g supabase   # install supabase (use npx if npn doesnt work)
npx supabase login        # login and enter code given from bowser
cd backend
python -m venv venv         # create virtual environment
source venv/bin/activate    # Mac/Linux

# Activate 

## venv\Scripts\activate       # Windows

pip install -r requirements.txt  # install dependencies


## RUn the flask server
python app.py
