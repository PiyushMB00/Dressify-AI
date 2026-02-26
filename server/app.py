import os
from datetime import timedelta
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from flask_session import Session
from extensions import db, bcrypt
from flask_talisman import Talisman

# -------------------------------
# Load environment variables
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

# -------------------------------
# Create Flask app
# -------------------------------
app = Flask(__name__)

from flask import request, session

@app.before_request
def log_every_request():
    print("\n" + "─"*70)
    print("➡️ NEW REQUEST")
    print("Time:", __import__("datetime").datetime.now())
    print("Method:", request.method)
    print("URL:", request.url)
    print("Path:", request.path)
    print("Query:", request.args.to_dict())
    print("Headers:", dict(request.headers))
    print("Cookies:", request.cookies)
    print("Session:", dict(session))
    print("─"*70)

@app.before_request
def print_session_config():
    if not hasattr(app, "config_printed"):
        print("\n===== SESSION CONFIG =====")
        for k in [
            "SESSION_TYPE",
            "SESSION_COOKIE_SECURE",
            "SESSION_COOKIE_SAMESITE",
            "SECRET_KEY"
        ]:
            print(k, "=", app.config.get(k))
        print("==========================\n")

        app.config_printed = True


# Talisman(app, force_https=False)

# -------------------------------
# Security / Core Config
# -------------------------------
app.config['SESSION_USE_SIGNER'] = True
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
if not app.config['SECRET_KEY']:
    raise RuntimeError("SECRET_KEY not set in .env")

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL',
    'sqlite:///dressify.db'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# -------------------------------
# Session Configuration (OAuth Critical)
# -------------------------------
app.config.update(
    SECRET_KEY=os.getenv("SECRET_KEY", "dev-secret-key"),
    SESSION_TYPE="filesystem",
    SESSION_PERMANENT=True,

    SESSION_COOKIE_HTTPONLY=True,

    # IMPORTANT
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=False,   # True only if using HTTPS

)

app.config['SESSION_FILE_DIR'] = os.path.join(app.root_path, 'flask_session')
os.makedirs(app.config['SESSION_FILE_DIR'], exist_ok=True)

Session(app)

# -------------------------------
# CORS Configuration (Required for OAuth + Sessions)
# -------------------------------
CORS(app, 
     supports_credentials=True, 
     origins=["http://127.0.0.1:3000"],
     allow_headers=["Content-Type", "Authorization"],
     expose_headers=["Content-Type", "Set-Cookie"]
     )

# -------------------------------
# Upload Folder
# -------------------------------
app.config['UPLOAD_FOLDER'] = os.path.join(BASE_DIR, 'uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# -------------------------------
# Initialize Extensions
# -------------------------------
db.init_app(app)
bcrypt.init_app(app)

# -------------------------------
# Import Blueprints
# -------------------------------
from routes.auth_routes import auth_bp
from routes.product_routes import product_bp
from routes.order_routes import order_bp
from routes.upload_routes import upload_bp
from routes.ai_routes import ai_bp
from routes.avatar_routes import avatar_bp

# -------------------------------
# Register Blueprints
# -------------------------------
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(product_bp, url_prefix='/api/products')
app.register_blueprint(order_bp, url_prefix='/api/orders')
app.register_blueprint(upload_bp, url_prefix='/api/upload')
app.register_blueprint(ai_bp, url_prefix='/api/ai-hub')
app.register_blueprint(avatar_bp, url_prefix='/api/avatar')

# -------------------------------
# Database Initialization
# -------------------------------
with app.app_context():
    db.create_all()
    print("Database tables created successfully!")

# -------------------------------
# Routes
# -------------------------------
@app.route('/')
def index():
    return jsonify({"message": "Welcome to Dressify AI Backend"})

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy", "backend": "Flask/Python"})

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# @app.route('/test-session')
# def test_session():
#     from flask import session
#     session['test'] = 'working'
#     return "set"

@app.route('/check-session')
def check_session():
    from flask import session
    return str(session.get('test'))


@app.route("/debug/session-set")
def session_set():
    session["test"] = "working"
    session.modified = True
    return {"session": dict(session)}

@app.route("/debug/session-read")
def session_read():
    return {"session": dict(session)}


# -------------------------------
# Run Server
# -------------------------------
if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    app.run(
        host="0.0.0.0",
        port=port,
        debug=True,
        use_reloader=True
    )