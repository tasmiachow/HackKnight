# backend/sentiment/gemini.py

import os
from dotenv import load_dotenv
from google import genai
import json
import re 

# Load .env API key
load_dotenv()

# Initialize Gemini client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

MODEL_NAME = "gemini-2.5-flash"


#Helper function FOR GEMINI bc it doesnt want to return JSON :\\\
def clean_gemini_json(raw_text: str):
    """
    Clean Gemini's raw response text and safely parse it as JSON.
    Removes markdown code fences and trailing text.
    """
    raw = raw_text.strip()

    # Remove markdown code fences if they exist
    if raw.startswith("```"):
        raw = re.sub(r"^```[a-zA-Z]*\n", "", raw)  # remove ```json or ```
        raw = re.sub(r"```$", "", raw)

    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        print("⚠️ JSON parse failed:", e)
        return {
            "overall_sentiment": "neutral",
            "score": 0,
            "summary": "Unable to determine sentiment at this time."
        }

def analyze_sentiment(headlines, ticker):
    """
    Analyze overall sentiment across all headlines for one ticker.
    Returns a JSON object with overall sentiment and score.
    """
    text_block = "\n".join([f"- {h['title']}" for h in headlines])
    prompt = f"""
    You are a financial sentiment analyzer.

    Analyze the following headlines about {ticker} and determine the overall sentiment trend.
    Respond ONLY in valid JSON (no explanations, no extra text) formatted exactly as:
    {{
    "overall_sentiment": "positive" | "negative" | "neutral",
    "score": float between -1 and 1,
    "summary": "concise one-sentence overview of the sentiment trend"
    }}

    Headlines (up to 10):
    {text_block}
    """

    # Generate content using Gemini client

    # Parse the response safely
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
        )
        print("🔹 Raw Gemini output:", repr(response.text))
        return clean_gemini_json(response.text)
    except Exception as e:
        print("⚠️ Error:", e)
        return {
            "overall_sentiment": "neutral",
            "score": 0,
            "summary": "Unable to determine sentiment at this time."
        }
    


