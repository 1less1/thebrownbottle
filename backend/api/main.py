import mysql.connector
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

# Import the name of the python file for the different routes
import tasks
import shifts
import tables

# Initialize environment variables
BACKEND_ADDRESS = os.environ["BACKEND_ADDRESS"]
BACKEND_PORT = os.environ["BACKEND_PORT"]


# Initialize the App
app = Flask(__name__)
CORS(app)


# Function which creates a MySQL connection
def get_db_connection():
    return mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        database=os.environ["DB_NAME"]
    )



# Test Routes --------------------------------------------

@app.route('/health')
def health_check():
    return {"status": "ok"}

@app.route('/shifts')
def get_shifts():
    return shifts.get_shifts(get_db_connection())


@app.route('/tables')
def get_tables():
    return tables.get_tables(get_db_connection())

# --------------------------------------------------------


# Task Routes - /tasks -----------------------------------

@app.route('/tasks/insert-task', methods=['POST'])
def insert_task():
    return tasks.insert_task(get_db_connection(), request)

@app.route('/tasks/get-user-tasks', methods=['GET'])
def get_tasks():
    return tasks.get_user_tasks(get_db_connection(), request)

# --------------------------------------------------------


# App will be available on current host IP using port 5000
# Ex: http://134.161.225.3:5000
if __name__ == '__main__':
    app.run(debug=True, host=BACKEND_ADDRESS, port=int(BACKEND_PORT))