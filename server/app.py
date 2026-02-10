import os
from flask import Flask
from flask import jsonify
from flask import send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from extensions import db, bcrypt

# Load environment variables
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

# Initialize Flask app
app = Flask(__name__)
CORS(
    app,
    resources={r"/api/*": {"origins": ["http://localhost:3000"]}}
)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', '')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///dressify.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')

# Initialize Extensions
db.init_app(app)
bcrypt.init_app(app)

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Register Blueprints (Routes)
# Import here to avoid circular dependencies (not strictly needed with extensions.py but safe)
from routes.auth_routes import auth_bp
from routes.product_routes import product_bp
from routes.order_routes import order_bp
from routes.upload_routes import upload_bp
from routes.ai_routes import ai_bp
from routes.avatar_routes import avatar_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(product_bp, url_prefix='/api/products')
app.register_blueprint(product_bp, url_prefix='/api/fashion', name='fashion_api') # Unique name
app.register_blueprint(order_bp, url_prefix='/api/orders')
app.register_blueprint(upload_bp, url_prefix='/api/upload')
app.register_blueprint(ai_bp, url_prefix='/api/ai-hub')
app.register_blueprint(avatar_bp, url_prefix='/api/avatar')

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy", "backend": "Flask/Python"})

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# with app.app_context():
#     print(app.url_map)

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    print(f"Dressify Backend running on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
