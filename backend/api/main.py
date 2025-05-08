import mysql.connector
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

# Import the name of the python file for the different routes
import login
import user
import task
import announcement
import section
import shift
import shift_cover_request
import time_off_request


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

# --------------------------------------------------------




# User Routes - /user ------------------------------------

@app.route('/user/get-user-data', methods=['GET'])
def get_user_data():
    return user.get_user_data(get_db_connection(), request)

# --------------------------------------------------------


# Task Routes - /task ------------------------------------

@app.route('/task/insert-task', methods=['POST'])
def insert_task():
    return task.insert_task(get_db_connection(), request)

@app.route('/task/get-user-tasks', methods=['GET'])
def get_tasks():
    return task.get_user_tasks(get_db_connection(), request)

# --------------------------------------------------------


# Announcement Routes - /announcement --------------------

@app.route('/announcement/insert-announcement', methods=['POST'])
def insert_announcement():
    return announcement.insert_announcement(get_db_connection(), request)

@app.route('/announcement/get-user-announcements', methods=['GET'])
def get_user_announcements():
    return announcement.get_user_announcements(get_db_connection(), request)

@app.route('/announcement/get-all-announcements', methods=['GET'])
def get_all_announcements():
    return announcement.get_all_announcements(get_db_connection(), request)

# --------------------------------------------------------


# Task Routes - /time-off-request ------------------------

@app.route('/time-off-request/BLAH', methods=['GET'])
def get_time_off_requests():
    return time_off_request.get_time_off_requests(get_db_connection(), request)

# --------------------------------------------------------


# Section Routes - /section ------------------------------

@app.route('/section/insert-section', methods=['POST'])
def insert_section():
    return section.insert_section(get_db_connection(), request)

@app.route('/section/get-user-section', methods=['GET'])
def get_user_section():
    return section.get_user_section(get_db_connection(), request)


# --------------------------------------------------------


# Shift Routes - /shift ----------------------------------

@app.route('/shift/get-user-shifts', methods=['GET'])
def get_user_shifts():
    return shift.get_user_shifts(get_db_connection(), request)

@app.route('/shift/insert-shifts', methods=['POST'])
def insert_shifts():
    return shift.insert_shifts(get_db_connection(), request)

# --------------------------------------------------------


# Shift Cover Request Routes - /shift-cover-request ------

@app.route('/shift-cover-request/create-shift-cover-cover-request', methods=['POST'])
def insert_shift_cover_request():
    return shift_cover_request.insert_shift_cover_request(get_db_connection(), request)

@app.route('/shift-cover-request/get-all-cover-requests', methods=['GET'])
def get_all_cover_requests():
    return shift_cover_request.get_all_cover_requests(get_db_connection(), request)

@app.route('/shift-cover-request/get-user-shift-cover-request', methods=['GET'])
def get_user_shift_cover_request():
    return shift_cover_request.get_user_shift_cover_request(get_db_connection(), request)

@app.route('/shift/get-accepted-shift-cover-request', methods=['GET'])
def get_accepted_shift_cover_request():
    return shift_cover_request.get_accepted_shift_cover_request(get_db_connection(), request)

# --------------------------------------------------------


# App will be available on current host IP using port 5000
# Ex: http://134.161.225.3:5000
if __name__ == '__main__':
    app.run(debug=True, host=BACKEND_ADDRESS, port=int(BACKEND_PORT))