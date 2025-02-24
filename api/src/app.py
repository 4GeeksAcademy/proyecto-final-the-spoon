import os
import time
from flask import Flask, request, jsonify
from flask_migrate import Migrate
from models import db, Users, Favorites, Reviews, Reservations, Restaurant, RestaurantPhotos, Dishes, DishesPhotos, FoodType
from utils import generate_sitemap, APIException
from flask_cors import CORS
from admin import setup_admin

app = Flask(__name__)
app.url_map.strict_slashes = False
start_time = time.time()


db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test2.db" # Si peta, cambiar la versión test1 a test2...
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

MIGRATE = Migrate(app, db)
db.init_app(app)
CORS(app)
setup_admin(app)

# Error handler
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    return generate_sitemap(app)

# Ruta de salud
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "uptime": round(time.time() - start_time, 2)}), 200

############## API Endpoints ##############

@app.route('/restaurants', methods=['GET'])
def get_restaurants():
    restaurants = Restaurant.query.all()
    return jsonify(restaurants), 200

# Get restaurant by id
@app.route('/restaurants/<int:restaurant_id>', methods=['GET'])
def get_restaurant(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    return jsonify(restaurant) if restaurant else (jsonify({"error": "Restaurant not found"}), 400)

# Crear un nuevo restaurante
@app.route('/restaurants', methods=['POST'])
def create_restaurant():
    data = request.get_json()
    required_fields = {"administrator", "location", "description", "food_type", "name"}
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        new_restaurant = Restaurant(
            id = data.get("id"),
            administrator=data["administrator"],
            location=data["location"],
            description=data["description"],
            food_type=FoodType(data["food_type"]),  # Convierte el string a Enum
            name=data["name"]
        )

        db.session.add(new_restaurant)
        db.session.commit()

        return jsonify({
            "id": new_restaurant.id,
            "administrator": new_restaurant.administrator,
            "location": new_restaurant.location,
            "description": new_restaurant.description,
            "food_type": new_restaurant.food_type.value,
            "name": new_restaurant.name
        }), 201

    except ValueError:
        return jsonify({"error": "Invalid food_type value"}), 400

# Get all users
@app.route('/users', methods=['GET'])
def get_users():
    users = Users.query.all()
    return jsonify(users), 200

# Get user by id
@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = Users.query.get(user_id)
    return jsonify(user) if user else (jsonify({"error": "User not found"}), 400)

# Create a new user
@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    required_fields = {"username", "email", "password"}
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    new_user = Users(
        id = data.get("id"),
        username=data["username"],
        email=data["email"],
        password=data["password"],
        # points=data.get("points", 0)  # Si no se envía, toma 0 por defecto
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify({
        "id": new_user.id,
        "username": new_user.username,
        "email": new_user.email,
        "points": new_user.points
    }), 201

# Get user's favs
@app.route('/users/<int:user_id>/favorites', methods=['GET'])
def get_user_favorites(user_id):
    favorites = Favorites.query.filter_by(user_id=user_id).all()
    return jsonify([favorite.to_dict() for favorite in favorites]), 200

# Add a restaurant to the favorites
@app.route('/users/<int:user_id>/favorites', methods=['POST'])
def add_favorite(user_id):
    data = request.get_json()
    new_favorite = Favorites(user_id=user_id, **data)
    db.session.add(new_favorite)
    db.session.commit()
    return jsonify(new_favorite.to_dict()), 201

# Delete a restaurant from favorites
@app.route('/users/<int:user_id>/favorites/<int:favorite_id>', methods=['DELETE'])
def delete_favorite(user_id, favorite_id):
    favorite = Favorites.query.filter_by(user_id=user_id, id=favorite_id).first()
    if not favorite:
        return jsonify({"error": "Favorite not found"}), 404
    db.session.delete(favorite)
    db.session.commit()
    return jsonify({"message": "Favorite deleted successfully"}), 200

# Create a review for a restaurant
@app.route('/reviews', methods=['POST'])
def create_review():
    data = request.get_json()
    new_review = Reviews(**data)
    db.session.add(new_review)
    db.session.commit()
    return jsonify(new_review.to_dict()), 201

# Get reviews of a restaurant
@app.route('/reviews/<int:restaurant_id>', methods=['GET'])
def get_reviews(restaurant_id):
    reviews = Reviews.query.filter_by(restaurant=restaurant_id).all()
    return jsonify([review.to_dict() for review in reviews]), 200

# Create a reservation
@app.route('/reservations', methods=['POST'])
def create_reservation():
    data = request.get_json()
    new_reservation = Reservations(**data)
    db.session.add(new_reservation)
    db.session.commit()
    return jsonify(new_reservation.to_dict()), 201

# Get a user's reservations
@app.route('/users/<int:user_id>/reservations', methods=['GET'])
def get_user_reservations(user_id):
    reservations = Reservations.query.filter_by(user_id=user_id).all()
    return jsonify([reservation.to_dict() for reservation in reservations]), 200

# Delete a reservation
@app.route('/reservations/<int:reservation_id>', methods=['DELETE'])
def delete_reservation(reservation_id):
    reservation = Reservations.query.get(reservation_id)
    if not reservation:
        return jsonify({"error": "Reservation not found"}), 404
    db.session.delete(reservation)
    db.session.commit()
    return jsonify({"message": "Reservation deleted successfully"}), 200

if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=PORT, debug=True)
