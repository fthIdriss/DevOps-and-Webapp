import psycopg2
import psycopg2.extras
import os

# 🔧 Database configuration
DB_CONFIG = {
    "dbname": os.environ.get("DB_NAME", "testdb"),
    "user": os.environ.get("DB_USER", "postgres"),
    "password": os.environ.get("DB_PASSWORD", "0000"),
    "host": os.environ.get("DB_HOST", "postgres"),
    "port": os.environ.get("DB_PORT", "5432")
}

def get_db():
    return psycopg2.connect(**DB_CONFIG, cursor_factory=psycopg2.extras.RealDictCursor)

def create_users_table():
    create_table_query = """
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'customer'
    );
    """

    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute(create_table_query)
        conn.commit()
        cur.close()
        conn.close()
        print("Users table created (or already exists).")
    except Exception as e:
        print(f"Error creating users table: {e}")

def create_orders_table():
    create_table_query = """
    CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        name VARCHAR(100),
        street VARCHAR(100),
        city VARCHAR(100),
        zip VARCHAR(20),
        lat FLOAT,
        lng FLOAT,
        coffee JSONB,
        status VARCHAR(50) DEFAULT 'pending',
        date VARCHAR(20),
        time VARCHAR(10)
    );
    """

    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute(create_table_query)
        conn.commit()
        cur.close()
        conn.close()
        print("Orders table created (or already exists).")
    except Exception as e:
        print(f"Error creating orders table: {e}")

def check_and_create_tables():
    
    create_users_table()
    create_orders_table()
    wait_for_db()
    

import time

def wait_for_db(retries=10, delay=2):
    for i in range(retries):
        try:
            conn = get_db()
            conn.close()
            print("✅ Database is ready.")
            return
        except Exception as e:
            print(f"⏳ Waiting for DB... ({i+1}/{retries})")
            time.sleep(delay)
    raise Exception("❌ Database not available after waiting.")


if __name__ == "__main__":
    check_and_create_tables()
