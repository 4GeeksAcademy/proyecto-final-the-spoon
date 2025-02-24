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

# Get, add and delete user's restaurants favs
@app.route('/users/<int:user_id>/favorites', methods=['GET', 'POST', 'DELETE'])
def manage_user_favorites(user_id):
    if request.method == 'GET':  
        # Get all user favorites
        favorites = Favorites.query.filter_by(user_id=user_id).all()
        return jsonify(favorites), 200

    elif request.method == 'POST':  
        # Add a restaurant to the user's favorites
        data = request.get_json()
        if "restaurant_id" not in data:
            return jsonify({"error": "Missing restaurant_id"}), 400

        new_favorite = Favorites(user_id=user_id, restaurant=data["restaurant_id"])
        db.session.add(new_favorite)
        db.session.commit()
        return jsonify({"message": "Restaurant added to favorites"}), 201

    elif request.method == 'DELETE':  
        # Delete a user's favorite based on the id received in the body
        data = request.get_json()
        if "id" not in data:
            return jsonify({"error": "Missing required fields"}), 400

        favorite = Favorites.query.filter_by(id=data["id"], user_id=user_id).first()
        if not favorite:
            return jsonify({"error": "Favorite not found"}), 404

        db.session.delete(favorite)
        db.session.commit()
        return jsonify({"message": "Favorite deleted successfully"}), 200

    return jsonify({"error": "Invalid request"}), 405

@app.route('/restaurants/<int:restaurant_id>/reviews', methods=['GET', 'POST', 'DELETE'])
def manage_reviews(restaurant_id):
    if request.method == 'GET':  
        # Retrieve all reviews for a specific restaurant
        reviews = Reviews.query.filter_by(restaurant_id=restaurant_id).all()
        return jsonify(reviews), 200

    elif request.method == 'POST':  
        # Add a new review for a restaurant
        data = request.get_json()
        required_fields = ["user_id", "comment", "rating"]
        
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        new_review = Reviews(
            restaurant_id=restaurant_id,
            user_id=data["user_id"],
            comment=data["comment"],
            rating=data["rating"]
        )
        db.session.add(new_review)
        db.session.commit()
        return jsonify({"message": "Review added successfully"}), 201

    elif request.method == 'DELETE':  
        # Delete a review by its ID, provided in the request body
        data = request.get_json()
        if "id" not in data:
            return jsonify({"error": "Missing required fields"}), 400

        review = Reviews.query.filter_by(id=data["id"], restaurant_id=restaurant_id).first()
        if not review:
            return jsonify({"error": "Review not found"}), 404

        db.session.delete(review)
        db.session.commit()
        return jsonify({"message": "Review deleted successfully"}), 200

    return jsonify({"error": "Invalid request"}), 405  # Method not allowed

@app.route('/users/<int:user_id>/reviews', methods=['GET'])
def get_user_reviews(user_id):
    # Retrieve all reviews made by a specific user
    reviews = Reviews.query.filter_by(user_id=user_id).all()
    return jsonify(reviews), 200

    @app.route('/users/<int:user_id>/reservations', methods=['GET', 'POST'])
def manage_user_reservations(user_id):
    if request.method == 'GET':
        # Retrieve all reservations of a user
        reservations = Reservations.query.filter_by(user_id=user_id).all()
        return jsonify(reservations), 200

    elif request.method == 'POST':
        # Create a new reservation
        data = request.get_json()
        required_fields = {"restaurant_id", "date"}

        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        new_reservation = Reservations(
            user_id=user_id,
            restaurant_id=data["restaurant_id"],
            date=data["date"]
        )

        db.session.add(new_reservation)
        db.session.commit()
        return jsonify({"message": "Reservation created successfully"}), 201

    return jsonify({"error": "Invalid request"}), 405  # Method not allowed

@app.route('/users/<int:user_id>/reservations/<int:reservation_id>', methods=['DELETE'])
def delete_user_reservation(user_id, reservation_id):
    # Find the reservation by ID and user ID
    reservation = Reservations.query.filter_by(id=reservation_id, user_id=user_id).first()

    if not reservation:
        return jsonify({"error": "Reservation not found"}), 404

    db.session.delete(reservation)
    db.session.commit()
    return jsonify({"message": "Reservation cancelled successfully"}), 200

@app.route('/restaurants/<int:restaurant_id>/reservations', methods=['GET'])
def get_restaurant_reservations(restaurant_id):
    # Retrieve all reservations for a specific restaurant
    reservations = Reservations.query.filter_by(restaurant_id=restaurant_id).all()
    return jsonify(reservations), 200

@app.route('/restaurants/<int:restaurant_id>/photos', methods=['GET', 'POST'])
def manage_restaurant_photos(restaurant_id):
    if request.method == 'GET':
        # Retrieve all photos for a specific restaurant
        photos = RestaurantPhotos.query.filter_by(restaurant_id=restaurant_id).all()
        return jsonify(photos), 200

    elif request.method == 'POST':
        # Upload a new photo for a restaurant
        data = request.get_json()
        if "url" not in data:
            return jsonify({"error": "Missing photo URL"}), 400

        new_photo = RestaurantPhotos(
            url=data["url"],
            restaurant_id=restaurant_id
        )
        db.session.add(new_photo)
        db.session.commit()
        return jsonify({"message": "Photo added successfully"}), 201

    return jsonify({"error": "Invalid request"}), 405  # Method not allowed

@app.route('/restaurants/<int:restaurant_id>/photos/<int:photo_id>', methods=['DELETE'])
def delete_restaurant_photo(restaurant_id, photo_id):
    # Delete a specific photo of a restaurant
    photo = RestaurantPhotos.query.filter_by(id=photo_id, restaurant_id=restaurant_id).first()
    if not photo:
        return jsonify({"error": "Photo not found"}), 404

    db.session.delete(photo)
    db.session.commit()
    return jsonify({"message": "Photo deleted successfully"}), 200

@app.route('/restaurants/<int:restaurant_id>/dishes', methods=['GET', 'POST'])
def manage_dishes(restaurant_id):
    if request.method == 'GET':
        # Retrieve all dishes for a specific restaurant
        dishes = Dishes.query.filter_by(restaurant_id=restaurant_id).all()
        return jsonify(dishes), 200

    elif request.method == 'POST':
        # Create a new dish for a restaurant
        data = request.get_json()
        required_fields = {"dish_name", "price"}
        
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        new_dish = Dishes(
            dish_name=data["dish_name"],
            price=data["price"],
            restaurant_id=restaurant_id
        )

        db.session.add(new_dish)
        db.session.commit()
        return jsonify({"message": "Dish added successfully"}), 201

    return jsonify({"error": "Invalid request"}), 405  # Method not allowed

@app.route('/restaurants/<int:restaurant_id>/dishes/<int:dish_id>', methods=['GET', 'PUT', 'DELETE'])
def manage_dish_by_id(restaurant_id, dish_id):
    dish = Dishes.query.filter_by(id=dish_id, restaurant_id=restaurant_id).first()

    if not dish:
        return jsonify({"error": "Dish not found"}), 404

    if request.method == 'GET':
        return jsonify(dish), 200

    elif request.method == 'PUT':
        # Update dish details
        data = request.get_json()
        if "dish_name" in data:
            dish.dish_name = data["dish_name"]
        if "price" in data:
            dish.price = data["price"]

        db.session.commit()
        return jsonify({"message": "Dish updated successfully"}), 200

    elif request.method == 'DELETE':
        # Delete a specific dish
        db.session.delete(dish)
        db.session.commit()
        return jsonify({"message": "Dish deleted successfully"}), 200

    return jsonify({"error": "Invalid request"}), 405  # Method not allowed

@app.route('/restaurants/<int:restaurant_id>/dishes/<int:dish_id>/photos', methods=['GET', 'POST'])
def manage_dish_photos(restaurant_id, dish_id):
    if request.method == 'GET':
        # Retrieve all photos of a specific dish
        photos = DishesPhotos.query.filter_by(dish_id=dish_id).all()
        return jsonify(photos), 200

    elif request.method == 'POST':
        # Upload a new photo for a dish
        data = request.get_json()
        required_fields = {"url"}

        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        new_photo = DishesPhotos(
            url=data["url"],
            dish_id=dish_id
        )

        db.session.add(new_photo)
        db.session.commit()
        return jsonify({"message": "Photo added successfully"}), 201

    return jsonify({"error": "Invalid request"}), 405  # Method not allowed

@app.route('/restaurants/<int:restaurant_id>/dishes/<int:dish_id>/photos/<int:photo_id>', methods=['DELETE'])
def delete_dish_photo(restaurant_id, dish_id, photo_id):
    # Find the photo by ID and dish ID
    photo = DishesPhotos.query.filter_by(id=photo_id, dish_id=dish_id).first()

    if not photo:
        return jsonify({"error": "Photo not found"}), 404

    db.session.delete(photo)
    db.session.commit()
    return jsonify({"message": "Photo deleted successfully"}), 200

if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=PORT, debug=True)
