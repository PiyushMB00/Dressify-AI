import os
import base64
from io import BytesIO
from huggingface_hub import InferenceClient
from PIL import Image
import requests
import secrets
from flask import Blueprint, request, redirect, session, jsonify
from urllib.parse import urlencode, quote
import hashlib, base64
from flask import url_for, render_template
import urllib.parse

# If you use db from extensions, you can uncomment this line:
# from extensions import db

avatar_bp = Blueprint("avatar", __name__)

# ---------- HuggingFace Client ----------
client = InferenceClient(
    model="stabilityai/stable-diffusion-xl-base-1.0",
    token=os.getenv("HF_TOKEN")
)

CLIENT_ID = os.getenv("SNAP_CLIENT_ID")
CLIENT_SECRET = os.getenv("SNAP_CLIENT_SECRET")
REDIRECT_URI = os.getenv("SNAP_REDIRECT_URI")

# ============================================================
# CREATE AVATAR ROUTE (BACKEND ONLY — Python)
# ============================================================

@avatar_bp.route("/create", methods=["POST"])
def create_avatar():
    print("➡️ /create endpoint hit")

    try:
        # ---------- JSON request ----------
        if request.is_json:
            data = request.get_json()
            name = data.get("name")

            if not name:
                return jsonify({"error": "Name is required"}), 400

            print(f"✅ Avatar created for: {name}")

            return jsonify({
                "message": "Avatar profile updated",
                "name": name
            }), 200

        # ---------- Image upload ----------
        if "image" in request.files:
            image_file = request.files["image"]
            prompt = request.form.get("prompt", "Fashionable outfit")

            init_image = Image.open(image_file).convert("RGB")

            buffer = BytesIO()
            init_image.save(buffer, format="PNG")

            result = client.text_to_image(
                prompt=f"Preserve same person. Change clothing. {prompt}",
                image=buffer.getvalue()
            )

            out_buffer = BytesIO()
            result.save(out_buffer, format="PNG")

            img_b64 = base64.b64encode(out_buffer.getvalue()).decode()

            return jsonify({
                "image": f"data:image/png;base64,{img_b64}"
            })

        return jsonify({"error": "No valid data received"}), 400

    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"error": str(e)}), 500


# ============================================================
# SNAPCHAT LOGIN
# ============================================================

@avatar_bp.route('/snap/login')
def snap_login():
    code_verifier = secrets.token_urlsafe(64)
    session['code_verifier'] = code_verifier
    hashed = hashlib.sha256(code_verifier.encode('ascii')).digest()
    code_challenge = base64.urlsafe_b64encode(hashed).decode('ascii').replace('=', '')
    state = secrets.token_urlsafe(16)
    session['oauth_state'] = state

    params = {
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": "https://auth.snapchat.com/oauth2/api/user.display_name https://auth.snapchat.com/oauth2/api/user.bitmoji.avatar",
        "state": state,
        "code_challenge": code_challenge,
        "code_challenge_method": "S256"
    }
    auth_url = "https://accounts.snapchat.com/accounts/oauth2/auth"
    return redirect(f"{auth_url}?{urllib.parse.urlencode(params)}")

# ============================================================
# SNAPCHAT CALLBACK
# ============================================================

@avatar_bp.route('/snap/callback')
def callback():
    code = request.args.get('code')
    token_url = "https://accounts.snapchat.com/accounts/oauth2/token"
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code_verifier": session.get('code_verifier')
    }
    
    r = requests.post(token_url, data=data).json()
    token = r.get("access_token")
    if not token: return redirect('/avatar-customizer.html?error=auth_failed')

    headers = {"Authorization": f"Bearer {token}"}
    query = "{me{displayName, bitmoji{avatar}}}"
    snap_response = requests.post("https://kit.snapchat.com/v1/me", json={'query': query}, headers=headers).json()
    
    # SAVE DATA TO SESSION
    session['snap_user'] = snap_response.get('data', {}).get('me', {})
    
    # REDIRECT back to your main avatar customizer page
    return redirect('http://127.0.0.1:3000/avatar-customizer.html')


# ============================================================
# SESSION & LOGOUT MANAGEMENT
# ============================================================

@avatar_bp.route('/session')
def get_session():
    # Return the user data saved during callback as JSON
    user_data = session.get('snap_user')
    if user_data:
        return jsonify({"user": user_data}), 200
        
    # Return a 200 OK instead of a 401 so the browser doesn't throw a red error in the console. 
    return jsonify({"user": None}), 200

@avatar_bp.route('/logout')
def logout():
    # 1. Clear your local Flask session
    session.clear()
    
    # 2. Redirect strictly back to your app, NOT to Snapchat's website.
    # This prevents users from getting stranded on the Snapchat account dashboard!
    return redirect("http://127.0.0.1:3000/avatar-customizer.html")

# ============================================================
# OUTFIT SAVING AND LOADING ROUTES
# ============================================================

@avatar_bp.route('/<user_id>/save-outfit', methods=['POST', 'OPTIONS'])
def save_outfit(user_id):
    # Handle the CORS preflight check specifically just in case
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    data = request.get_json()
    print(f"✅ Saving outfit for {user_id}: {data}")
    
    # TODO: Later, you can add your database saving logic here
    
    return jsonify({"message": "Outfit saved successfully!"}), 200

@avatar_bp.route('/<user_id>/outfits', methods=['GET'])
def load_outfits(user_id):
    # Mocking saved outfits to send back to the frontend
    mock_outfits = [
        {"id": 1, "name": "My Favorite Look", "outfit": {"tops": "t1", "bottoms": "b1", "shoes": "s1"}},
        {"id": 2, "name": "Casual Sunday", "outfit": {"tops": "t2", "bottoms": "b4", "shoes": "s4"}}
    ]
    return jsonify({"outfits": mock_outfits}), 200