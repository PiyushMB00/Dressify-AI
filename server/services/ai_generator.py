import os
import requests
import base64
from io import BytesIO
from PIL import Image

def generate_try_on_image(person_image_data, clothing_image_data, prompt=None):
    """
    Generates a try-on image using an external AI API.
    
    Args:
        person_image_data (bytes): The binary data of the person's image.
        clothing_image_data (bytes): The binary data of the clothing image.
        prompt (str, optional): Custom prompt for the AI. Defaults to a standard try-on prompt.
        
    Returns:
        tuple: (image_data_bytes, error_message)
        If successful, error_message is None.
        If failed, image_data_bytes is None.
    """
    
    api_key = os.getenv('AI_GENERATION_API_KEY')
    api_url = os.getenv('AI_API_URL')
    
    # improved default prompt
    if not prompt:
        prompt = "Apply the clothing from the second image onto the person in the first image, realistic fit, front view, natural lighting, preserving original person details."

    # If no API key/URL, return a mock response or error based on configuration
    if not api_key or not api_url:
        print("[AI SERVICE] AI_GENERATION_API_KEY or AI_API_URL not set. returning mock/error.")
        # For development/demo, we can return the person image as a fallback or raise an error.
        # Returning None, "Configuration Error" lets the caller decide.
        return None, "AI Service is not configured (Missing API Key or URL)"

    try:
        # Prepare the payload
        # Common pattern: Many APIs accept base64 strings
        person_b64 = base64.b64encode(person_image_data).decode('utf-8')
        clothing_b64 = base64.b64encode(clothing_image_data).decode('utf-8')
        
        payload = {
            "prompt": prompt,
            "image1": person_b64, # Adjust key names based on actual API provider
            "image2": clothing_b64,
            "negative_prompt": "distorted, blurry, low quality, bad anatomy, extra limbs",
            "steps": 30, # Example parameter
            "cfg_scale": 7.5 # Example parameter
        }
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        print(f"[AI SERVICE] Sending request to {api_url}...")
        response = requests.post(api_url, json=payload, headers=headers, timeout=60)
        
        if response.status_code == 200:
            result = response.json()
            # Handle different API response formats
            # Option A: Returns a URL
            if 'output_url' in result:
                img_url = result['output_url']
                img_resp = requests.get(img_url)
                return img_resp.content, None
                
            # Option B: Returns base64 directly (e.g. Stable Diffusion WebUI)
            elif 'images' in result and len(result['images']) > 0:
                img_str = result['images'][0]
                return base64.b64decode(img_str), None
                
            # Option C: Generic 'image' field
            elif 'image' in result:
                return base64.b64decode(result['image']), None
                
            else:
                return None, f"Unknown API response format: {result.keys()}"
        else:
            return None, f"API Error {response.status_code}: {response.text}"
            
    except Exception as e:
        import traceback
        traceback.print_exc()
        return None, str(e)
