import mysql.connector
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import threading

# Import the name of the python file for the different routes
import employee
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




# Employee Routes - /employee ---------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

@app.route('/employee', methods=['GET'])
def get_employees():
    """
    GET employees by building a modular query
    """
    return employee.get_employees(get_db_connection(), request)

@app.route('/employee/insert', methods=['POST'])
def insert_employee():
    """
    POST new employees to the 'employee' table
    """
    with request_lock:  # Serialize concurrent requests to be processed in order for multiple role inserts from different clients
        return employee.insert_employee(get_db_connection(), request)
    
@app.route('/employee/update/<int:employee_id>', methods=['PATCH'])
def update_employee(employee_id):
    """
    PATCH (Update) employees by id
    """
    with request_lock:
        return employee.update_employee(get_db_connection(), request, employee_id)

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------



# Role Routes - /role -----------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

@app.route('/role', methods=['GET'])
def get_roles():
    """
    GET roles by building a modular query
    """
    return role.get_roles(get_db_connection(), request)

@app.route('/role/insert', methods=['POST'])
def insert_role():
    """
    POST new roles to the 'role' table
    """
    with request_lock:  # Serialize concurrent requests to be processed in order for multiple role inserts from different clients
        return role.insert_role(get_db_connection(), request)
    
@app.route('/role/update/<int:role_id>', methods=['PATCH'])
def update_role(role_id):
    """
    PATCH (Update) roles by id
    """
    with request_lock:
        return role.update_role(get_db_connection(), request, role_id)

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------



# Section Routes - /section -----------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

@app.route('/section', methods=['GET'])
def get_sections():
    """
    GET sections by building a modular query
    """
    return section.get_sections(get_db_connection(), request)

@app.route('/section/insert', methods=['POST'])
def insert_section():
    """
    POST new sections to the 'section' table
    """
    with request_lock:  # Serialize concurrent requests to be processed in order for multiple section inserts from different clients
        return section.insert_section(get_db_connection(), request)
    
@app.route('/section/update/<int:section_id>', methods=['PATCH'])
def update_section(section_id):
    """
    PATCH (Update) sections by id
    """
    with request_lock:
        return section.update_section(get_db_connection(), request, section_id)

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------



# Task Routes - /task -----------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

@app.route('/task', methods=['GET'])
def get_tasks():
    """
    GET tasks by building a modular query
    """
    return task.get_tasks(get_db_connection(), request)

@app.route('/task/insert', methods=['POST'])
def handle_new_task():
    """
    POST new tasks to the 'task' or 'recurring_task' table
    """
    with request_lock:  # Serialize concurrent requests to be processed in order for multiple task inserts from different clients
        return task.handle_new_task(get_db_connection(), request)

@app.route('/task/update/<int:task_id>', methods=['PATCH'])
def update_task(task_id):
    """
    PATCH (Update) tasks by id
    """
    with request_lock:
        return task.update_task(get_db_connection(), request, task_id)

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------



# Recurring Task Routes - /recurring-task ---------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

# Admin Based Routes:
@app.route('/recurring-task', methods=['GET'])
def get_recurring_tasks():
    """
    GET recurring tasks by building a modular query
    """
    return recurring_task.get_recurring_tasks(get_db_connection(), request)

@app.route('/recurring-task/insert', methods=['POST'])
def insert_recurring_task():
    """
    POST new recurring tasks to the 'recurring_task' table
    """
    with request_lock:  # Serialize concurrent requests to be processed in order for multiple recurring task inserts from different clients
        return recurring_task.insert_recurring_task(get_db_connection(), request)

@app.route('/recurring-task/update/<int:recurring_task_id>', methods=['PATCH'])
def update_recurring_task(recurring_task_id):
    """
    PATCH (Update) tasks by id
    """
    with request_lock:
        return recurring_task.update_recurring_task(get_db_connection(), request, recurring_task_id)

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------



# Announcement Routes - /announcement -------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

@app.route('/announcement', methods=['GET'])
def get_announcements():
    """
    GET announcements by building a modular query
    """
    return announcement.get_announcements(get_db_connection(), request)

@app.route('/announcement/insert', methods=['POST'])
def insert_announcement():
    """
    POST new announcements to the 'announcement' table
    """
    with request_lock:  # Serialize concurrent requests to be processed in order for multiple announcement inserts from different clients
        return announcement.insert_announcement(get_db_connection(), request)
    
@app.route('/announcement/update/<int:announcement_id>', methods=['PATCH'])
def update_announcement(announcement_id):
    """
    PATCH (Update) announcements by id
    """
    with request_lock:
        return announcement.update_announcement(get_db_connection(), request, announcement_id)

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
    POST new shifts to the 'shift' table
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