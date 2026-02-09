import os
import base64
from io import BytesIO
from flask import Blueprint, request, jsonify
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

# Load env
load_dotenv()

print("HF_TOKEN loaded:", bool(os.getenv("HF_TOKEN")))

avatar_bp = Blueprint("avatar", __name__)

# Initialize Hugging Face client ONCE
client = InferenceClient(
    model="stabilityai/stable-diffusion-xl-base-1.0",
    token=os.getenv("HF_TOKEN")
)

@avatar_bp.route("/generate-avatar", methods=["POST"])
def generate_avatar():
    data = request.get_json()
    prompt = data.get("prompt")

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    try:
        image = client.text_to_image(prompt)

        buffer = BytesIO()
        image.save(buffer, format="PNG")
        image_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

        return jsonify({
            "image": f"data:image/png;base64,{image_base64}"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
