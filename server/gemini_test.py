import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"Loaded API key: {api_key[:6]}..." if api_key else "❌ No API key found")

client = genai.Client(api_key=api_key)

try:
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Say hello from Gemini in one short sentence."
    )
    print("✅ Gemini Response:", response.text)
except Exception as e:
    print("❌ Gemini Error:", e)
