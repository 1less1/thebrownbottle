from flask import Flask, request, jsonify
import mysql.connector
import os
from flask_cors import CORS



# Import the name of the python file for the different routes
import shifts
import tables
import tasks

app = Flask(__name__)
CORS(app)

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

@app.route('/tasks/insert', methods=['POST'])
def insert_task():
    return tasks.insert_task(get_db_connection(), request)

@app.route('/tasks/get', methods=['GET'])
def get_tasks():
    return tasks.get_tasks(get_db_connection())

# --------------------------------------------------------


# App will be available on current host IP using port 5000
# Ex: http://134.161.225.3:5000
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
