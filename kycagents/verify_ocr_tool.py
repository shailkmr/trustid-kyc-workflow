from PIL import Image, ImageDraw, ImageFont
import os
from kycagents.tools.ocr_tool import DocumentOcrTool
from dotenv import load_dotenv

load_dotenv()

def create_test_image(path):
    # Create a white image
    img = Image.new('RGB', (400, 200), color=(255, 255, 255))
    d = ImageDraw.Draw(img)
    
    # Try to use a default font
    try:
        # On Windows, Arial is usually available
        font = ImageFont.truetype("arial.ttf", 20)
    except:
        font = ImageFont.load_default()
        
    d.text((10, 10), "TEST OCR DOCUMENT", fill=(0, 0, 0), font=font)
    d.text((10, 50), "Name: John Doe", fill=(0, 0, 0), font=font)
    d.text((10, 90), "ID Number: 123456789", fill=(0, 0, 0), font=font)
    
    img.save(path)
    print(f"Created test image at {path}")

def test_tool():
    test_img = "test_ocr_document.jpg"
    create_test_image(test_img)
    abs_path = os.path.abspath(test_img)
    
    print(f"Running OCR on {abs_path}...")
    tool = DocumentOcrTool()
    result = tool._run(file_path=abs_path)
    
    print("\n--- OCR Result ---")
    print(result)
    print("-------------------")
    
    # Cleanup
    # os.remove(test_img)

if __name__ == "__main__":
    test_tool()
