import os
import time
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from flask_cors import CORS

app = Flask(__name__)
start_time = time.time()

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['JWT_SECRET_KEY'] = 'supersecretkey'  # Cambiar
 esto en producción
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)  # Permite que React se conecte a Flask

# Modelo de Usuario
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# Crear la base de datos 
with app.app_context():
    db.create_all()

# Ruta de salud
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "uptime": round(time.time() - start_time, 2)}), 200

# ✅ Ruta de inicio
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Bienvenido a la API de The Spoon"}), 200

# ✅ Registro de usuario
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    if not data.get('email') or not data.get('password'):
        return jsonify({"message": "Email y contraseña requeridos"}), 400

    # Verificar si el usuario ya existe
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"message": "Usuario ya existe"}), 409

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "Usuario registrado con éxito"}), 201

# ✅ Inicio de sesión
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data.get('email') or not data.get('password'):
        return jsonify({"message": "Email y contraseña requeridos"}), 400

    user = User.query.filter_by(email=data['email']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.email)
        return jsonify({"token": access_token}), 200

    return jsonify({"message": "Credenciales inválidas"}), 401

# ✅ Ruta privada protegida
@app.route('/private', methods=['GET'])
@jwt_required()
def private():
    current_user = get_jwt_identity()
    return jsonify({"message": f"Bienvenido {current_user}"}), 200

if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=PORT, debug=True)
