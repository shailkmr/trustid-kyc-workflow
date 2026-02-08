import os
import requests
from dotenv import load_dotenv
import json

load_dotenv()

api_key = os.getenv("OLLAMA_API_KEY")
base_url = "https://ollama.com/api"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

url = f"{base_url}/tags"
try:
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        models = response.json().get("models", [])
        model_names = [m["name"] for m in models]
        print(f"Total models available: {len(model_names)}")
        print("Models:")
        for name in sorted(model_names):
            print(f" - {name}")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"Error: {e}")
