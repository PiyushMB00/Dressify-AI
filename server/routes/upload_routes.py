import os
from flask import Blueprint, jsonify, request, current_app
from werkzeug.utils import secure_filename

upload_bp = Blueprint('upload', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('/', methods=['POST'])
@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Unique filename to prevent overwrites
        import time
        filename = f"{int(time.time())}_{filename}"
        
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        return jsonify({
            'message': 'File uploaded successfully',
            'filename': filename,
            'url': f'/uploads/{filename}'
        }), 201
        
    return jsonify({'message': 'Invalid file type'}), 400

@upload_bp.route('/analyze', methods=['POST'])
def analyze_image():
    # Mock AI Analysis
    return jsonify({
        'message': 'Image analyzed',
        'analysis': {
            'detectedClothing': [
                {'type': 'shirt', 'color': 'blue', 'confidence': 0.95},
                {'type': 'jeans', 'color': 'black', 'confidence': 0.88}
            ],
            'style': 'Casual',
            'recommendation': 'Great outfit for a weekend!'
        }
    })
