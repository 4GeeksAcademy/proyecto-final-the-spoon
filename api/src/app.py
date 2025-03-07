import os
import time
import bcrypt
from dotenv import load_dotenv

load_dotenv()

from datetime import datetime
from flask import Flask, request, jsonify
from flask_migrate import Migrate
from src.models import db, Users, Favorites, Reviews, Reservations, Restaurant, RestaurantPhotos, Dishes, DishesPhotos, FoodType
from sqlalchemy import or_
from flask_jwt_extended import ( create_access_token, get_csrf_token, jwt_required, JWTManager, set_access_cookies, unset_jwt_cookies)
from src.utils import generate_sitemap, APIException
from flask_cors import CORS
from src.admin import setup_admin
import cloudinary
import cloudinary.uploader
import cloudinary.api

load_dotenv()

app = Flask(__name__)
app.url_map.strict_slashes = False
start_time = time.time()

# Cloudinary config
cloudinary.config(
    cloud_name="dnew8rn7z",
    api_key="768347444436787",
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)


db_url = os.getenv("DATABASE_URL")

if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test2.db" # Si peta, cambiar la versión test1 a test2...
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

jwt_key = os.getenv("JWT_SECRET_KEY")

# print db_url
print(db_url)
# JWT
app.config["JWT_SECRET_KEY"] = jwt_key
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_CSRF_PROTECT"] = True
app.config["JWT_CSRF_IN_COOKIES"] = True
app.config["JWT_COOKIE_SECURE"] = True

jwt = JWTManager(app)

MIGRATE = Migrate(app, db)
db.init_app(app)
app.config["CORS_HEADERS"] = "Content-Type"
CORS(app, supports_credentials=True)
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

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    required_fields = ["username", "email", "password"]

    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    existing_user = (
        db.session.query(Users)
        .filter(or_(Users.username == username, Users.email == email))
        .first()
    )
    if existing_user:
        return jsonify({"error": "Username or Email already registered"}), 400

    hashedPassword = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode(
        "utf-8"
    )

    new_user = Users(username=username, email=email, password=hashedPassword)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@app.route("/login", methods=["POST"])
def get_login():
    data = request.get_json()

    email = data["email"]
    password = data["password"]

    required_fields = ["email", "password"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    user = Users.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "User not found"}), 400

    is_password_valid = bcrypt.checkpw(
        password.encode("utf-8"), user.password.encode("utf-8")
    )

    if not is_password_valid:
        return jsonify({"error": "Password not correct"}), 400

    access_token = create_access_token(identity=str(user.id))
    csrf_token = get_csrf_token(access_token)
    response = jsonify(
        {"msg": "login successful", "user": user, "csrf_token": csrf_token}
    )
    set_access_cookies(response, access_token)

    return response

@app.route("/logout", methods=["POST"])
@jwt_required()
def logout_with_cookies():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

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
    
    # Verificar que los campos obligatorios estén presentes en los datos recibidos
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Crear un nuevo usuario
    new_user = Users(
        username=data["username"],
        email=data["email"],
        password=data["password"],
    )

    # Añadir el nuevo usuario a la base de datos
    db.session.add(new_user)
    db.session.commit()

    # Retornar una respuesta exitosa con el mensaje de usuario creado
    return jsonify({
        "message": "Usuario creado exitosamente",
        "id": new_user.id,
        "username": new_user.username,
        "email": new_user.email,
    }), 201  # Código de estado 201: Creado

@app.route('/restaurants/<int:restaurant_id>', methods=['PUT'])
def update_restaurant(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    
    if not restaurant:
        return jsonify({"error": "Restaurant not found"}), 404
    
    data = request.get_json()

    restaurant.name = data.get('name', restaurant.name)
    restaurant.description = data.get('description', restaurant.description)
    restaurant.food_type = data.get('food_type', restaurant.food_type)
    restaurant.location = data.get('location', restaurant.location)
    
    try:
        db.session.commit()
        return jsonify({"message": "Restaurant updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error updating restaurant", "details": str(e)}), 500

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

@app.route('/users/<int:user_id>/restaurants', methods=['GET'])
def get_restaurants_by_admin(user_id):
    restaurants = Restaurant.query.filter_by(administrator=user_id).all()
    
    if not restaurants:
        return jsonify({"error": "No restaurants found for this administrator"}), 404
    
    return jsonify(restaurants), 200

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
        if not reservations:
            return jsonify({"error": "No reservations found"}), 404

        reservations_data = []
        for reservation in reservations:
            restaurant = Restaurant.query.get(reservation.restaurant_id)
        
            reservations_data.append({
                "id": reservation.id,
                "date": reservation.date.strftime("%Y-%m-%d %H:%M:%S"),
                "people": reservation.people,
                "restaurant": {
                    "id": restaurant.id,
                    "name": restaurant.name,
                    "location": restaurant.location
                }
            })

        return jsonify(reservations_data), 200
    
    elif request.method == 'POST':
        # Create a new reservation
        data = request.get_json()
        required_fields = {"restaurant_id", "date", "people"}

        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        try:
            reservation_date = datetime.strptime(data["date"], "%Y-%m-%d %H:%M:%S")
        except ValueError:
            return jsonify({"error": "Invalid date format. Use 'YYYY-MM-DD HH:MM:SS'"}), 400

        new_reservation = Reservations(
            user_id=user_id,
            restaurant_id=data["restaurant_id"],
            date=reservation_date,
            people=data["people"]
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
