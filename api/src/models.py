from dataclasses import dataclass , field
from sqlalchemy import ForeignKey
from flask_sqlalchemy import SQLAlchemy
import enum

db = SQLAlchemy()

# User model
@dataclass
class Users(db.Model):
    __tablename__ = 'users'
    id: int = db.Column(db.Integer, primary_key=True, nullable=False)
    username: str = db.Column(db.String(50), nullable=False)
    email: str = db.Column(db.String(100), nullable=False)
    password: str = db.Column(db.String(255), nullable=False)
    points: int = db.Column(db.Integer, nullable=True)

# Favorites model storing favorite restaurants
@dataclass
class Favorites(db.Model):
    __tablename__ = 'favorites'
    id: int = db.Column(db.Integer, primary_key=True, unique=True, nullable=False)
    user_id: int = db.Column(db.Integer, ForeignKey('users.id'), nullable=False)
    restaurant: int = db.Column(db.Integer, ForeignKey('restaurant.id'), nullable=False)

# Reviews model storing user reviews for restaurants
@dataclass
class Reviews(db.Model):
    __tablename__ = 'reviews'
    id: int = db.Column(db.Integer, primary_key=True, unique=True, nullable=False)
    restaurant_id: int = db.Column(db.Integer, ForeignKey('restaurant.id'), nullable=False)
    user_id: int = db.Column(db.Integer, ForeignKey('users.id'), nullable=False)
    comment: str = db.Column(db.Text, nullable=False)
    rating: float = db.Column(db.Float, nullable=False)

class FoodType(str, enum.Enum):
    MEXICAN = "MEXICAN"
    ITALIAN = "ITALIAN"
    CHINESE = "CHINESE"

# Restaurant model storing restaurant
@dataclass
class Restaurant(db.Model):
    __tablename__ = 'restaurant'
    id: int = db.Column(db.Integer, primary_key=True, nullable=False)
    administrator: int = db.Column(db.Integer, ForeignKey('users.id'), nullable=False)
    location: str = db.Column(db.String(250), nullable=False)
    description: str = db.Column(db.Text, nullable=False)
    food_type: FoodType = db.Column(db.Enum(FoodType), nullable=False)
    name: str = db.Column(db.String(250), nullable=False)

# Restaurant photo model storing photos for restaurants
@dataclass
class RestaurantPhotos(db.Model):
    __tablename__ = 'restaurant_photos'
    id: int = db.Column(db.Integer, primary_key=True, unique=True, nullable=False)
    url: str = db.Column(db.String(250), nullable=False)
    restaurant_id: int = db.Column(db.Integer, ForeignKey('restaurant.id'), nullable=False)

# Dish model storing dishes for restaurants
@dataclass
class Dishes(db.Model):
    __tablename__ = 'dishes'
    id: int = db.Column(db.Integer, primary_key=True, unique=True, nullable=False)
    dish_name: str = db.Column(db.String(250), nullable=False)
    price: float = db.Column(db.Float, nullable=False)
    restaurant_id: int = db.Column(db.Integer, ForeignKey('restaurant.id'), nullable=False)

# Dish photo model storing dishes for restaurants
@dataclass
class DishesPhotos(db.Model):
    __tablename__ = 'dishes_photos'
    id: int = db.Column(db.Integer, primary_key=True, unique=True, nullable=False)
    url: str = db.Column(db.String(250), nullable=False)
    dish_id: int = db.Column(db.Integer, ForeignKey('dishes.id'), nullable=False)

# Reservations model storing user reservations at restaurants
@dataclass
class Reservations(db.Model):
    __tablename__ = 'reservations'
    id: int = db.Column(db.Integer, primary_key=True, unique=True, nullable=False)
    user_id: int = db.Column(db.Integer, ForeignKey('users.id'), nullable=False)
    restaurant_id: int = db.Column(db.Integer, ForeignKey('restaurant.id'), nullable=False)
    date: str = db.Column(db.DateTime, nullable=False)