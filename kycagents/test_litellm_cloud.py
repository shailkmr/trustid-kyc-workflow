import os
import litellm
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OLLAMA_API_KEY")

print("\n--- Attempt 6: LiteLLM + OpenAI format + /v1 ---")
try:
    response = litellm.completion(
        model="openai/rnj-1:8b",
        api_base="https://ollama.com/v1",
        api_key=api_key,
        messages=[{"role": "user", "content": "Hello! Respond with 'SUCCESS'"}],
    )
    print("RESULT: Success with LiteLLM OpenAI format!")
    print(f"RESPONSE: {response.choices[0].message.content}")
except Exception as e:
    print(f"RESULT: Failed with LiteLLM OpenAI format. Error: {e}")
