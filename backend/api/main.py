import mysql.connector
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import threading

# Import the name of the python file for the different routes
import login
import user
import role
import section
import task
import recurring_task
import announcement
import shift
import shift_cover_request
import time_off_request


# Initialize environment variables
BACKEND_ADDRESS = os.environ["BACKEND_ADDRESS"]
BACKEND_PORT = os.environ["BACKEND_PORT"]


# Initialize the App
app = Flask(__name__)
CORS(app)

# Create a global lock
request_lock = threading.Lock()


# Function which creates a MySQL connection
def get_db_connection():
    return mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        database=os.environ["DB_NAME"]
    )

@app.route('/health')
def health_check():
    return {"status": "ok"}




# User Routes - /user -----------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

@app.route('/user/get-user-data', methods=['GET'])
def get_user_data():
    return user.get_user_data(get_db_connection(), request)

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------



# Role Routes - /role -----------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

@app.route('/role/get-all-roles', methods=['GET'])
def get_all_roles():
    return role.get_all_roles(get_db_connection(), request)

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------



# Section Routes - /section -----------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

@app.route('/section/get-all-sections', methods=['GET'])
def get_all_sections():
    return section.get_all_sections(get_db_connection(), request)

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------



# Task Routes - /task -----------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

# All routes below query the 'task' table

@app.route('/task/new-task', methods=['POST'])
def handle_new_task():
    """
    POST new tasks to the 'task' table
    """
    with request_lock:  # Serialize concurrent requests to be processed in order for multiple task inserts from different clients
        return task.handle_new_task(get_db_connection(), request)

@app.route('/task', methods=['GET'])
def get_tasks():
    """
    GET tasks by building a modular query
    """
    return task.t_get_tasks(get_db_connection(), request)

@app.route('/task/<int:task_id>', methods=['PATCH'])
def update_task(task_id):
    """
    PATCH (Update) tasks by id
    """
    with request_lock:
        return task.t_update_task(get_db_connection(), request, task_id)


# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------



# Recurring Task Routes - /recurring-task ---------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

# All routes below query the 'recurring_task' table

# Admin Based Routes:
@app.route('/recurring-task/all', methods=['GET'])
def rt_get_all_recurring_tasks():
    """
    NOT Modular
    """
    return recurring_task.rt_get_all_recurring_tasks(get_db_connection(), request)

@app.route('/recurring-task/recurring-tasks-by-section', methods=['GET'])
def rt_get_recurring_tasks_by_section():
    """
    NOT Modular
    """
    return recurring_task.rt_get_recurring_tasks_by_section(get_db_connection(), request)

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------



# Announcement Routes - /announcement -------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

@app.route('/announcement/insert-announcement', methods=['POST'])
def insert_announcement():
    """
    NOT Modular
    """
    with request_lock:
        return announcement.insert_announcement(get_db_connection(), request)

@app.route('/announcement/get-user-announcements', methods=['GET'])
def get_user_announcements():
    """
    NOT Modular
    """
    return announcement.get_user_announcements(get_db_connection(), request)

@app.route('/announcement/get-announcements-by-role', methods=['GET'])
def get_announcements_by_role():
    """
    NOT Modular
    """
    return announcement.get_announcements_by_role(get_db_connection(), request)

@app.route('/announcement/get-all-announcements', methods=['GET'])
def get_all_announcements():
    """
    NOT Modular
    """
    return announcement.get_all_announcements(get_db_connection(), request)

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


# Shift Routes - /shift ---------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

@app.route('/shift', methods=['GET'])
def get_shifts():
    """
    GET shifts by building a modular query
    """
    return shift.get_shifts(get_db_connection(), request)

@app.route('/shift/insert', methods=['POST'])
def insert_shift():
    """
    POST new shifts to the 'task' table
    """
    with request_lock:  # Serialize concurrent requests to be processed in order for multiple shift inserts from different clients
        return shift.insert_shift(get_db_connection(), request)
    
@app.route('/shift/update/<int:shift_id>', methods=['PATCH'])
def update_shift(shift_id):
    """
    PATCH (Update) shifts by id
    """
    with request_lock:
        return shift.update_shift(get_db_connection(), request, shift_id)

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


# Time Off Request Routes - /tor ------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

@app.route('/tor', methods=['GET'])
def get_time_off_requests():
    """
    GET time off requests by building a modular query
    """
    return time_off_request.get_tor(get_db_connection(), request)

@app.route('/tor/insert', methods=['POST'])
def insert_time_off_request():
    """
    POST new time off requests to the 'time_off_request' table
    """
    with request_lock:  # Serialize concurrent requests to be processed in order for multiple shift inserts from different clients
        return time_off_request.insert_tor(get_db_connection(), request)
    
@app.route('/tor/update/<int:request_id>', methods=['PATCH'])
def update_time_off_request(request_id):
    """
    PATCH (Update) time off requests by id
    """
    with request_lock:
        return time_off_request.update_tor(get_db_connection(), request, request_id)

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------



# Shift Cover Request Routes - /scr ---------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

@app.route('/scr', methods=['GET'])
def get_shift_cover_requests():
    """
    GET shift cover requests by building a modular query
    """
    return shift_cover_request.get_scr(get_db_connection(), request)

@app.route('/scr/insert', methods=['POST'])
def insert_shift_cover_request():
    """
    POST new time off requests to the 'shift_cover_request' table
    """
    with request_lock:  # Serialize concurrent requests to be processed in order for multiple shift inserts from different clients
        return shift_cover_request.insert_scr(get_db_connection(), request)
    
@app.route('/scr/update/<int:cover_request_id>', methods=['PATCH'])
def update_shft_cover_request(cover_request_id):
    """
    PATCH (Update) shift cover requests by id
    """
    with request_lock:
        return shift_cover_request.update_scr(get_db_connection(), request, cover_request_id)

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------



# App will be available on current host IP using port 5000
# Ex: http://134.161.225.3:5000
if __name__ == '__main__':
    app.run(debug=True, host=BACKEND_ADDRESS, port=int(BACKEND_PORT))