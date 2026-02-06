from app import app
from extensions import db, bcrypt
from models import Product, User

def seed_database():
    with app.app_context():
        db.create_all()
        
        if Product.query.first():
            print("Database already seeded.")
            return

        products = [
             { "name": "Casual T-Shirt", "category": "Casual", "price": 29.99, "image_url": "tshirt.jpg", "description": "Comfortable cotton t-shirt" },
             { "name": "Formal Shirt", "category": "Formal", "price": 49.99, "image_url": "formal.jpg", "description": "Crisp white formal shirt" },
             { "name": "Jeans", "category": "Casual", "price": 59.99, "image_url": "jeans.jpg", "description": "Classic blue denim jeans" },
             { "name": "Summer Dress", "category": "Traditional", "price": 79.99, "image_url": "dress.jpg", "description": "Floral print summer dress" }
        ]

        for p in products:
            new_p = Product(
                name=p['name'],
                category=p['category'],
                price=p['price'],
                image_url=p['image_url'],
                description=p['description']
            )
            db.session.add(new_p)
            
        admin_pass = bcrypt.generate_password_hash("admin123").decode('utf-8')
        admin = User(fullname="Admin User", email="admin@dressify.com", password_hash=admin_pass, is_admin=True)
        db.session.add(admin)

        db.session.commit()
        print("✅ Database initialized and seeded!")

if __name__ == '__main__':
    seed_database()
