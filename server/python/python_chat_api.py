from flask import Flask, request, jsonify
import os
from openai import OpenAI

app = Flask(__name__)

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    # The app will start but will raise when a request requires the key.
    # This avoids hardcoding secrets in the repo.
    pass
else:
    client = OpenAI(api_key=api_key)


@app.route("/", methods=["GET"])
def home():
    """Health check endpoint - returns API status"""
    api_key_local = os.getenv("OPENAI_API_KEY")
    return jsonify({
        "status": "running",
        "message": "Chat API is ready",
        "api_configured": bool(api_key_local)
    }), 200


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True)
    message = data.get("message") or data.get("prompt")
    if not message:
        return jsonify({"error": "no message provided"}), 400

    api_key_local = os.getenv("OPENAI_API_KEY")
    if not api_key_local:
        return jsonify({"error": "OPENAI_API_KEY not set on server"}), 500

    client = OpenAI(api_key=api_key_local)

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": message}],
    )

    text = completion.choices[0].message.content
    return jsonify({"response": text})


if __name__ == '__main__':
    print('=' * 60)
    print('🎨 Dressify AI Chat API')
    print('=' * 60)
    print(f'✅ Running on http://127.0.0.1:5000')
    print(f'🔑 OpenAI API Configured: {bool(OPENAI_API_KEY)}')
    print('=' * 60)

    # Prefer a production WSGI server (waitress) when available or when configured.
    use_waitress = os.getenv('USE_WAITRESS', 'true').lower() in ('1', 'true', 'yes') or os.getenv('FLASK_ENV') == 'production'

    if use_waitress:
        try:
            from waitress import serve
            print('Starting with Waitress WSGI server...')
            serve(app, host='127.0.0.1', port=5000)
        except Exception as e:
            print(f'Waitress not available or failed ({e}). Falling back to Flask dev server.')
            app.run(host='127.0.0.1', port=5000, debug=False)
    else:
        app.run(host='127.0.0.1', port=5000, debug=False)
