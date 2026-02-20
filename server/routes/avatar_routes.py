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
from extensions import db

avatar_bp = Blueprint("avatar", __name__)

# ---------- HuggingFace Client ----------
client = InferenceClient(
    model="stabilityai/stable-diffusion-xl-base-1.0",
    token=os.getenv("HF_TOKEN")
)

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

@avatar_bp.route('/callback')
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
    return redirect('/avatar-customizer.html')