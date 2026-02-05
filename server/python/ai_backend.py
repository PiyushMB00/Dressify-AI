"""
Dressify AI Backend - Python Server (Port 8001)
Handles AI recommendations using OpenAI GPT-4o
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from openai import OpenAI
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize OpenAI client
API_KEY = os.getenv("OPENAI_API_KEY", "")
if API_KEY:
    client = OpenAI(api_key=API_KEY)

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "running",
        "service": "Dressify AI Python Backend",
        "port": 8001,
        "openai_configured": bool(API_KEY)
    }), 200

@app.route('/gemini-chat', methods=['POST'])
def gemini_chat():
    """
    Handle AI chat requests and return responses
    Compatible with both OpenAI and Gemini APIs
    """
    try:
        data = request.get_json()
        message = data.get('message')
        
        if not message:
            return jsonify({"error": "No message provided"}), 400
        
        if not API_KEY:
            # Return fallback response
            return jsonify({
                "reply": "API key not configured. Please set OPENAI_API_KEY environment variable.",
                "status": "no_api_key"
            }), 200
        
        # Use OpenAI GPT-4o for best results
        try:
            response = client.chat.completions.create(
                model="gpt-4o",  # Use GPT-4o for best quality
                messages=[
                    {"role": "system", "content": "You are Dressify AI, an expert fashion consultant. Provide helpful, concise, and stylish fashion recommendations."},
                    {"role": "user", "content": message}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            reply = response.choices[0].message.content
            return jsonify({"reply": reply}), 200
            
        except Exception as e:
            # Fallback to GPT-3.5-turbo if GPT-4o is not available
            print(f"GPT-4o error, falling back to GPT-3.5-turbo: {str(e)}")
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are Dressify AI, an expert fashion consultant."},
                    {"role": "user", "content": message}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            reply = response.choices[0].message.content
            return jsonify({"reply": reply}), 200
    
    except Exception as error:
        print(f"Error: {str(error)}")
        return jsonify({
            "error": str(error),
            "reply": "I apologize, but I'm unable to process your request right now."
        }), 500

@app.route('/recommend', methods=['POST'])
def get_recommendations():
    """
    Get AI fashion recommendations based on user preferences
    """
    try:
        data = request.get_json()
        preferences = data.get('preferences', 'casual')
        budget = data.get('budget', 'medium')
        style = data.get('style', 'casual')
        occasion = data.get('occasion', 'everyday')
        
        if not API_KEY:
            return jsonify({
                "recommendations": [],
                "status": "no_api_key",
                "message": "API key not configured"
            }), 200
        
        prompt = f"""As Dressify AI fashion expert, provide 5 fashion item recommendations in JSON format.
        
User Preferences:
- Style preferences: {preferences}
- Budget: {budget}
- Fashion style: {style}
- Occasion: {occasion}

Return ONLY a valid JSON array with exactly this structure (no markdown, no extra text):
[
  {{
    "name": "item name",
    "category": "category (Tops/Bottoms/Shoes/Accessories/Dresses)",
    "description": "brief 1-2 line description",
    "color": "color",
    "price": "price range",
    "why": "why this suits them"
  }}
]"""
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1500
        )
        
        reply_text = response.choices[0].message.content
        
        # Parse JSON from response
        try:
            # Remove markdown code blocks if present
            if "```json" in reply_text:
                reply_text = reply_text.split("```json")[1].split("```")[0]
            elif "```" in reply_text:
                reply_text = reply_text.split("```")[1].split("```")[0]
            
            recommendations = json.loads(reply_text.strip())
            
            return jsonify({
                "recommendations": recommendations,
                "status": "success"
            }), 200
            
        except json.JSONDecodeError:
            # Return as text if JSON parsing fails
            return jsonify({
                "recommendations": [{"description": reply_text}],
                "status": "text_response"
            }), 200
    
    except Exception as error:
        print(f"Recommendation error: {str(error)}")
        return jsonify({
            "error": str(error),
            "recommendations": []
        }), 500

if __name__ == '__main__':
    print("=" * 60)
    print("🎨 Dressify AI Python Backend")
    print("=" * 60)
    print(f"✅ Running on http://0.0.0.0:8001")
    print(f"🔑 OpenAI API Configured: {bool(API_KEY)}")
    if not API_KEY:
        print("⚠️  WARNING: OPENAI_API_KEY not set - AI features will be limited")
    print("=" * 60)

    # Prefer a production WSGI server (waitress) when available or when configured.
    use_waitress = os.getenv('USE_WAITRESS', 'true').lower() in ('1', 'true', 'yes') or os.getenv('FLASK_ENV') == 'production'

    if use_waitress:
        try:
            from waitress import serve
            print("Starting with Waitress WSGI server...")
            serve(app, host='0.0.0.0', port=8001)
        except Exception as e:
            print(f"Waitress not available or failed ({e}). Falling back to Flask dev server.")
            app.run(host='0.0.0.0', port=8001, debug=False)
    else:
        app.run(host='0.0.0.0', port=8001, debug=False)
