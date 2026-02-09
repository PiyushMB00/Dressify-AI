import datetime
import os
import google.generativeai as genai
from flask import Blueprint, jsonify, request
from extensions import db
from models import ImageMetadata, AIRecommendation, AIChat
import json
from dotenv import load_dotenv
import google.generativeai as genai
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("No GEMINI_API_KEY found in environment variables")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.5-flash')

ai_bp = Blueprint('ai_hub', __name__)

@ai_bp.route('/image/metadata', methods=['POST'])
def save_image_metadata():
    data = request.json
    try:
        new_image = ImageMetadata(
            user_id=data.get('userId'),
            filename=data.get('filename'),
            original_name=data.get('originalName'),
            filepath=data.get('filepath'),
            filesize=data.get('filesize'),
            mimetype=data.get('mimetype')
        )
        db.session.add(new_image)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Image metadata saved', 'imageId': new_image.id}), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@ai_bp.route('/recommendations', methods=['POST'])
def get_recommendations():
    data = request.json
    try:
        # Extract user data
        preferences = data.get('preferences', '')
        budget = data.get('budget', 'Any')
        style = data.get('style', 'Generic')
        occasion = data.get('occasion', 'General')
        
        # Construct the prompt for Gemini
        prompt = f"""
        Act as a professional fashion stylist. I need 3 specific outfit recommendations based on these constraints:
        - Style: {style}
        - Occasion: {occasion}
        - Budget: {budget}
        - User Preferences: {preferences}

        Return ONLY a raw JSON array (no markdown, no backticks) where each object has these exact keys:
        "name" (string), "category" (string), "description" (string), "price" (string estimate), "color" (string).
        """

        # Call Gemini API
        response = model.generate_content(prompt)
        
        # Clean response string to ensure it parses as JSON
        clean_text = response.text.replace('```json', '').replace('```', '').strip()
        recommendations_data = json.loads(clean_text)
        
        # Save to DB
        new_rec = AIRecommendation(
            user_id=data.get('userId'),
            preferences=preferences,
            budget=budget,
            style=style,
            occasion=occasion,
            recommendations=recommendations_data # Stores the list as JSON
        )
        db.session.add(new_rec)
        db.session.commit()
        
        return jsonify({
            'success': True, 
            'recommendations': recommendations_data, 
            'recommendationId': new_rec.id
        }), 200
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False, 'message': "AI service unavailable. Try again later."}), 500

@ai_bp.route('/chat', methods=['POST'])
def chat_with_ai():
    data = request.json
    user_message = data.get('message')
    conversation_id = data.get('conversationId')
    
    if not user_message:
        return jsonify({'success': False, 'message': "Message is empty"}), 400

    try:
        # Construct a persona for the AI
        system_instruction = "You are 'Dressify AI', a helpful, trendy, and polite fashion assistant. Keep answers concise (under 3 sentences) unless asked for details."
        full_prompt = f"{system_instruction}\nUser: {user_message}"

        # Call Gemini API
        response = model.generate_content(full_prompt)
        ai_reply = response.text

        # Generate Conversation ID if new
        if not conversation_id:
            conversation_id = "chat_" + datetime.datetime.now().strftime("%Y%m%d%H%M%S")

        # Save to DB
        new_chat = AIChat(
            user_id=data.get('userId'),
            message=user_message,
            response=ai_reply,
            conversation_id=conversation_id
        )
        db.session.add(new_chat)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'aiReply': ai_reply,
            'conversationId': conversation_id
        })
    except Exception as e:
        print(f"Chat Error: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500