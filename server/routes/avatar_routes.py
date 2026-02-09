import os
import base64
from io import BytesIO
from flask import Blueprint, request, jsonify
from huggingface_hub import InferenceClient
from PIL import Image
from dotenv import load_dotenv

load_dotenv()

avatar_bp = Blueprint("avatar", __name__)

client = InferenceClient(
    model="stabilityai/stable-diffusion-xl-base-1.0",
    token=os.getenv("HF_TOKEN")
)

@avatar_bp.route("/edit-avatar", methods=["POST"])
def edit_avatar():
    print("➡️ edit-avatar endpoint hit")

    if "image" not in request.files:
        return jsonify({"error": "Image file is required"}), 400

    prompt = request.form.get("prompt")
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    try:
        # Load image
        image_file = request.files["image"]
        init_image = Image.open(image_file).convert("RGB")

        # Convert image to bytes (HF free-tier compatible)
        buffer = BytesIO()
        init_image.save(buffer, format="PNG")
        image_bytes = buffer.getvalue()

        final_prompt = (
            "Preserve the same person and face. "
            "Change clothing only. "
            f"{prompt}. "
            "Realistic photography, high quality."
        )

        # IMPORTANT: text_to_image with image conditioning
        result = client.text_to_image(
            prompt=final_prompt,
            image=image_bytes
        )

        out_buffer = BytesIO()
        result.save(out_buffer, format="PNG")
        img_b64 = base64.b64encode(out_buffer.getvalue()).decode()

        return jsonify({
            "image": f"data:image/png;base64,{img_b64}"
        })

    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"error": str(e)}), 500
