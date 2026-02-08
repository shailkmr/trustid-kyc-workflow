import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OLLAMA_API_KEY")
base_url = os.getenv("OLLAMA_BASE_URL", "https://ollama.com")
model = os.getenv("MODEL", "llama3.1:8b")

print(f"API Key: {api_key[:5]}... if api_key else 'None'")
print(f"Base URL: {base_url}")

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

# Final Test: List Models
url = "https://ollama.com/api/tags"
print(f"\nFinal Test: GET to {url}...")
try:
    response = requests.get(url, headers=headers)
    print(f"Status Code: {response.status_code}")
    models = response.json().get("models", [])
    llama_models = [m["name"] for m in models if "llama" in m["name"].lower()]
    print(f"Available Llama models: {llama_models}")
    if not llama_models:
        print(f"All available models: {[m['name'] for m in models]}")
except Exception as e:
    print(f"Error: {e}")



