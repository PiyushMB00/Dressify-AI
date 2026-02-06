from flask import Blueprint, jsonify, request
from models import Product
from extensions import db

product_bp = Blueprint('products', __name__)

@product_bp.route('/', methods=['GET'])
def get_products():
    category = request.args.get('category')
    if category:
        products = Product.query.filter_by(category=category).all()
    else:
        products = Product.query.all()
        
    output = []
    for product in products:
        output.append({
            'id': product.id,
            'name': product.name,
            'category': product.category,
            'price': product.price,
            'image': product.image_url,
            'description': product.description
        })
    return jsonify({'products': output, 'count': len(output)})

@product_bp.route('/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify({
        'id': product.id,
        'name': product.name,
        'category': product.category,
        'price': product.price,
        'image': product.image_url,
        'description': product.description
    })

@product_bp.route('/add', methods=['POST'])
def add_product():
    data = request.json
    new_product = Product(
        name=data['name'],
        category=data['category'],
        price=data['price'],
        image_url=data.get('image'),
        description=data.get('description')
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({'message': 'Product added successfully'}), 201
