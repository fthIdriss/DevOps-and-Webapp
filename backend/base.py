from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from datetime import datetime, timedelta
import psycopg2
import psycopg2.extras
import json
import os

# 🔧 App setup
app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

app.config['JWT_SECRET_KEY'] = 'super-secret-key'  # Change this in production!
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=8)
jwt = JWTManager(app)

# 🔌 PostgreSQL config
DB_CONFIG = {
    "dbname": os.environ.get("DB_NAME", "testdb"),
    "user": os.environ.get("DB_USER", "postgres"),
    "password": os.environ.get("DB_PASSWORD", "0000"),
    "host": os.environ.get("DB_HOST", "db"),
    "port": os.environ.get("DB_PORT", "5432")
}

def get_db():
    return psycopg2.connect(**DB_CONFIG, cursor_factory=psycopg2.extras.RealDictCursor)
# 📌 Routes

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'customer')

    if not username or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO users (name, username, email, password, role)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """, (name, username, email, hashed_pw, role))
        conn.commit()
        cur.close()
        conn.close()

        access_token = create_access_token(identity=username)
        return jsonify({"access_token": access_token}), 201
    except psycopg2.errors.UniqueViolation:
        return jsonify({"error": "Username or email already exists"}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cur.fetchone()
        cur.close()
        conn.close()

        if user and bcrypt.check_password_hash(user['password'], password):
            access_token = create_access_token(identity=username)
            return jsonify({"access_token": access_token})
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    username = get_jwt_identity()
    return jsonify({"message": f"Welcome, {username}!"})


@app.route('/api/orders', methods=['POST'])
@jwt_required()
def create_order():
    data = request.json
    current_user = get_jwt_identity()

    required_fields = ['name', 'street', 'city', 'zip', 'lat', 'lng', 'coffee']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing order fields"}), 400

    if not isinstance(data['coffee'], list) or not all(
        isinstance(c, dict) and 'type' in c and 'quantity' in c for c in data['coffee']
    ):
        return jsonify({"error": "Invalid coffee format"}), 400

    # Validate lat and lng are numeric
    try:
        float(data['lat'])
        float(data['lng'])
    except ValueError:
        return jsonify({"error": "Latitude and longitude must be numeric"}), 400

    now = datetime.now()
    formatted_date = now.strftime("%d/%m/%Y")
    formatted_time = now.strftime("%H:%M")

    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id FROM users WHERE username = %s", (current_user,))
        user_row = cur.fetchone()
        if not user_row:
            return jsonify({"error": "User not found"}), 404
        user_id = user_row['id']

        cur.execute("""
            INSERT INTO orders (user_id, name, street, city, zip, lat, lng, coffee, status, date, time)
            VALUES (%s, %s, %s, %s, %s, %s::FLOAT, %s::FLOAT, %s, %s, %s, %s)
            RETURNING *
        """, (
            user_id,
            data['name'],
            data['street'],
            data['city'],
            data['zip'],
            data['lat'],  # Cast to FLOAT
            data['lng'],  # Cast to FLOAT
            json.dumps(data['coffee']),
            'pending',
            formatted_date,
            formatted_time
        ))

        order = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        return jsonify(order), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/orders', methods=['GET'])
@jwt_required()
def get_orders():
    username = get_jwt_identity()

    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id FROM users WHERE username = %s", (username,))
        user_id = cur.fetchone()['id']

        cur.execute("SELECT * FROM orders WHERE user_id = %s", (user_id,))
        user_orders = cur.fetchall()

        cur.close()
        conn.close()
        return jsonify(user_orders), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/orders/<int:order_id>/status', methods=['PUT'])
@jwt_required()
def update_status(order_id):
    new_status = request.json.get('status')
    if new_status not in ['pending', 'done', 'canceled']:
        return jsonify({"error": "Invalid status"}), 400

    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("UPDATE orders SET status = %s WHERE id = %s RETURNING *", (new_status, order_id))
        order = cur.fetchone()

        if order:
            conn.commit()
            cur.close()
            conn.close()
            return jsonify(order), 200
        else:
            return jsonify({"error": "Order not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/orders/<int:order_id>', methods=['DELETE'])
@jwt_required()
def delete_order(order_id):
    username = get_jwt_identity()

    try:
        conn = get_db()
        cur = conn.cursor()

        cur.execute("SELECT id FROM users WHERE username = %s", (username,))
        user_id = cur.fetchone()['id']

        cur.execute("DELETE FROM orders WHERE id = %s AND user_id = %s RETURNING id", (order_id, user_id))
        deleted = cur.fetchone()

        if deleted:
            conn.commit()
            cur.close()
            conn.close()
            return jsonify({"message": "Order deleted"}), 200
        else:
            return jsonify({"error": "Order not found or unauthorized"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)

