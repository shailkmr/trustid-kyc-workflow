import os
import base64
import requests
from typing import Type, Optional
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from PIL import Image
from io import BytesIO
from pdf2image import convert_from_path

class DocumentOcrToolInput(BaseModel):
    """Input schema for DocumentOcrTool."""
    file_path: str = Field(..., description="The absolute path to the PDF or image file to extract information from.")

class DocumentOcrTool(BaseTool):
    name: str = "document_ocr_tool"
    description: str = "Extracts text and structured information from PDFs and images using the GLM-OCR model. Useful for processing KYC documents like IDs, proofs of address, etc."
    args_schema: Type[BaseModel] = DocumentOcrToolInput

    def _run(self, file_path: str) -> str:
        if not os.path.exists(file_path):
            return f"Error: File not found at {file_path}"

        ext = os.path.splitext(file_path)[1].lower()
        images = []

        try:
            if ext == ".pdf":
                # Convert PDF to list of images
                pages = convert_from_path(file_path)
                images.extend(pages)
            elif ext in [".jpg", ".jpeg", ".png", ".bmp", ".webp"]:
                images.append(Image.open(file_path))
            else:
                return f"Error: Unsupported file extension {ext}"
        except Exception as e:
            return f"Error processing file: {str(e)}"

        results = []
        api_key = os.getenv("OLLAMA_API_KEY")
        # Note: Using the base /api/generate for vision models in Ollama often works better with raw images
        base_url = os.getenv("OLLAMA_BASE_URL", "https://ollama.com").replace("/v1", "")
        url = f"{base_url}/api/generate"

        for i, img in enumerate(images):
            # Ensure image is in RGB for JPEG conversion
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            buffered = BytesIO()
            img.save(buffered, format="JPEG")
            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

            payload = {
                "model": os.getenv("VISION_MODEL", "qwen3-vl:235b"),
                "prompt": "Extract all text and information from this image. Output in a structured format if applicable.",
                "images": [img_str],
                "stream": False
            }
            
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }

            try:
                response = requests.post(url, headers=headers, json=payload)
                if response.status_code == 200:
                    resp_json = response.json()
                    text = resp_json.get("response", "")
                    results.append(f"--- Page {i+1} ---\n{text}")
                else:
                    results.append(f"--- Page {i+1} ---\nError from API: {response.status_code} - {response.text}")
            except Exception as e:
                results.append(f"--- Page {i+1} ---\nException during API call: {str(e)}")

        return "\n\n".join(results)
