from flask import Blueprint, jsonify, request, current_app
from models import Order, Product, User
from extensions import db
import jwt

order_bp = Blueprint('orders', __name__)

def get_user_from_token(request):
    token = request.headers.get('Authorization')
    if not token:
        return None
    try:
        if token.startswith('Bearer '):
            token = token.split(' ')[1]
        data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        return User.query.get(data['user_id'])
    except:
        return None

@order_bp.route('/', methods=['POST'])
def create_order():
    user = get_user_from_token(request)
    if not user:
        return jsonify({'message': 'Unauthorized'}), 401
        
    data = request.json
    items = data.get('items', [])
    
    if not items:
        return jsonify({'message': 'No items in order'}), 400
        
    total = 0
    for item in items:
        product = Product.query.get(item['productId'])
        if product:
            total += product.price * item.get('quantity', 1)
            
    new_order = Order(
        user_id=user.id,
        items=items,
        total_amount=total,
        status='pending'
    )
    
    db.session.add(new_order)
    db.session.commit()
    
    return jsonify({'message': 'Order placed successfully', 'order_id': new_order.id}), 201

@order_bp.route('/', methods=['GET'])
def get_orders():
    user = get_user_from_token(request)
    if not user:
        return jsonify({'message': 'Unauthorized'}), 401
    
    if user.is_admin:
        orders = Order.query.all()
    else:
        orders = Order.query.filter_by(user_id=user.id).all()
        
    output = []
    for order in orders:
        output.append({
            'id': order.id,
            'total': order.total_amount,
            'status': order.status,
            'items': order.items,
            'date': order.created_at
        })
        
    return jsonify({'orders': output})
