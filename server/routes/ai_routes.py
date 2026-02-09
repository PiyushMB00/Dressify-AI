import datetime
from flask import Blueprint, jsonify, request
from extensions import db
from models import ImageMetadata, AIRecommendation, AIChat

ai_bp = Blueprint('ai_hub', __name__)

@ai_bp.route('/image/metadata', methods=['POST'])
def save_image_metadata():
    data = request.json
    try:
        new_image = ImageMetadata(
            user_id=data.get('userId'), # In real app, get from session/token
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
        # Mock Logic based on input
        style = data.get('style', 'Generic')
        occasion = data.get('occasion', 'General')
        
        mock_recommendations = [
            {
                'name': f"{style} Outfit 1",
                'category': 'Full Body',
                'description': f"A perfect {style.lower()} look for {occasion.lower()}.",
                'price': '$45',
                'color': 'Blue'
            },
             {
                'name': f"{occasion} Accessory",
                'category': 'Accessory',
                'description': f"Stylish accessory to match your {style.lower()} vibe.",
                'price': '$20',
                'color': 'Silver'
            }
        ]
        
        new_rec = AIRecommendation(
            user_id=data.get('userId'),
            preferences=data.get('preferences'),
            budget=data.get('budget'),
            style=style,
            occasion=occasion,
            recommendations=mock_recommendations
        )
        db.session.add(new_rec)
        db.session.commit()
        
        return jsonify({
            'success': True, 
            'recommendations': mock_recommendations, 
            'recommendationId': new_rec.id
        }), 200
        
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'message': str(e)}), 500

@ai_bp.route('/chat', methods=['POST'])
def chat_with_ai():
    data = request.json
    user_message = data.get('message')
    conversation_id = data.get('conversationId')
    
    # Simple keyword-based mock AI
    # Enhanced Mock Logic
    msg_low = user_message.lower()
    ai_reply = "I'm your AI fashion assistant! Ask me about trends, color matching, or outfit ideas."
    
    if 'color' in msg_low or 'match' in msg_low:
        ai_reply = "For color matching, remember the rule of three: pick a base color, a complementary color, and an accent. Try pairing neutral tons like beige or grey with a bold pop of red or electric blue."
    elif 'trend' in msg_low:
        ai_reply = "Current trends favor sustainable fabrics, oversized silhouettes, and 90s retro vibes. Baggy denim and cropped tops are having a big moment!"
    elif 'work' in msg_low or 'office' in msg_low:
        ai_reply = "For the workplace, business casual is key. A fitted blazer over a plain tee with chinos or dark jeans works wonders. Keep accessories minimal."
    elif 'party' in msg_low or 'club' in msg_low:
        ai_reply = "Time to shine! Sequins and metallic fabrics are perfect for parties. Don't be afraid to experiment with bold jewelry and high-contrast shoes."
    elif 'casual' in msg_low:
        ai_reply = "Casual doesn't mean messy. Elevate a simple hoodie and jeans look with clean white sneakers and a layered necklace or a cool watch."
    elif 'wedding' in msg_low:
        ai_reply = "For a wedding, consider the dress code. For formal, a long gown or dark suit. For semi-formal, a cocktail dress or light suit/blazer is appropriate."
    elif 'winter' in msg_low or 'cold' in msg_low:
        ai_reply = "Layering is essential for winter! Start with thermal basics, add a chunky knit sweater, and finish with a structured wool coat and a scarf."
    elif 'summer' in msg_low or 'hot' in msg_low:
        ai_reply = "Stay cool with breathable fabrics like linen and cotton. Light colors reflect heat better. Think sundresses, shorts, and open-toed sandals."

        
    try:
        new_chat = AIChat(
            user_id=data.get('userId'),
            message=user_message,
            response=ai_reply,
            conversation_id=conversation_id or "new_conv_" + datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        )
        db.session.add(new_chat)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'aiReply': ai_reply,
            'conversationId': new_chat.conversation_id
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
