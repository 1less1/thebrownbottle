import mysql.connector
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import threading
from auth.routes import firebase_login

# Python SQL Table Handlers
import role
import section
import employee
import availability
import recurring_task
import task
import announcement
import shift
import shift_cover_request
import time_off_request
import push_token

# Custom Python Handlers (Joined SQL Tables)
import schedule


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


# Auth --------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

@app.route("/auth/firebase-login", methods=["POST"])
def auth_firebase_login():
    return firebase_login(get_db_connection, request)

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


# Role Routes - /role -----------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

@app.route('/role', methods=['GET'], strict_slashes=False)
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

@app.route('/section', methods=['GET'], strict_slashes=False)
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


# Employee Routes - /employee ---------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

@app.route('/employee', methods=['GET'], strict_slashes=False)
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


# Availability Routes - /availability -------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

@app.route('/availability', methods=['GET'], strict_slashes=False)
def get_availability():
    """
    GET employee availability (modular query)
    """
    return availability.get_availability(get_db_connection(), request)

@app.route('/availability/insert', methods=['POST'])
def insert_availability():
    """
    POST new employee availability to the 'availability' table
    """
    with request_lock:
        return availability.insert_availability(get_db_connection(), request)

@app.route('/availability/update/<int:availability_id>', methods=['PATCH'])
def update_availability(availability_id):
    """
    PATCH (Update) employee availability by id
    """
    with request_lock:
        return availability.update_availability(get_db_connection(), request, availability_id)


@app.route('/availability/delete/<int:availability_id>', methods=['DELETE'])
def delete_availability(availability_id):
    """
    DELETE employee availability by id
    """
    with request_lock:
        return availability.delete_availability(get_db_connection(), availability_id)

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


# Recurring Task Routes - /recurring-task ---------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

# Admin Based Routes:
@app.route('/recurring-task', methods=['GET'], strict_slashes=False)
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


@app.route('/recurring-task/delete/<int:recurring_task_id>', methods=['DELETE'])
def delete_recurring_task(recurring_task_id):
    """
    DELETE recurring task by id
    """
    with request_lock:
        return recurring_task.delete_recurring_task(get_db_connection(), recurring_task_id)

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


# Task Routes - /task -----------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

@app.route('/task', methods=['GET'], strict_slashes=False)
def get_tasks():
    """
    GET tasks by building a modular query
    """
    return task.get_tasks(get_db_connection(), request)


@app.route('/task/insert', methods=['POST'])
def handle_new_task():
    """
    POST new tasks to the 'task' table
    """
    with request_lock:  # Serialize concurrent requests to be processed in order for multiple task inserts from different clients
        return task.insert_task(get_db_connection(), request)


@app.route('/task/update/<int:task_id>', methods=['PATCH'])
def update_task(task_id):
    """
    PATCH (Update) tasks by id
    """
    with request_lock:
        return task.update_task(get_db_connection(), request, task_id)


@app.route('/task/delete/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """
    DELETE task by id
    """
    with request_lock:
        return task.delete_task(get_db_connection(), task_id)


@app.route('/task/convert', methods=['POST'])
def convert_task():
    """
    POST route to handle converting Normal Task -> Recurring or Recurring -> Normal.
    Uses a transaction to ensure database integrity.
    """
    with request_lock:
        return task.convert_task(get_db_connection(), request)

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


# Announcement Routes - /announcement -------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

@app.route('/announcement', methods=['GET'], strict_slashes=False)
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


@app.route('/announcement/delete/<int:announcement_id>', methods=['DELETE'])
def delete_announcement(announcement_id):
    """
    DELETE announcement by id
    """
    with request_lock:
        return announcement.delete_announcement(get_db_connection(), announcement_id)


@app.route('/announcement/acknowledgement', methods=['GET'])
def get_acknowledged_announcements():
    """
    GET acknowledgment records
    """
    return announcement.get_acknowledged_announcements(get_db_connection(), request)


@app.route('/announcement/acknowledge', methods=['POST'])
def acknowledge_announcement():
    """
    POST announcement acknowledgement by announcement id and employee id
    """
    return announcement.acknowledge_announcement(get_db_connection(), request)


# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


# Shift Routes - /shift ---------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

@app.route('/shift', methods=['GET'], strict_slashes=False)
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


@app.route('/shift/delete/<int:shift_id>', methods=['DELETE'])
def delete_shift(shift_id):
    """
    DELETE shift by id
    """
    with request_lock:
        return shift.delete_shift(get_db_connection(), shift_id)

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


# Schedule - /schedule ----------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

@app.route('/schedule', methods=['GET'])
def get_schedule():
    """
    New endpoint for schedule data with built-in filtering.
    Returns combined shift + employee + section + role data.
    """
    return schedule.get_schedule_data(get_db_connection(), request)

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


# Shift Cover Request Routes - /scr ---------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

@app.route('/scr', methods=['GET'], strict_slashes=False)
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
def update_shift_cover_request(cover_request_id):
    """
    PATCH (Update) shift cover requests by id
    """
    with request_lock:
        return shift_cover_request.update_scr(get_db_connection(), request, cover_request_id)


@app.route('/scr/delete/<int:cover_request_id>', methods=['DELETE'])
def delete_shift_cover_request(cover_request_id):
    """
    DELETE shift cover requests by id
    """
    with request_lock:
        return shift_cover_request.delete_scr(get_db_connection(), cover_request_id)


@app.route("/scr/approve/<int:cover_request_id>", methods=["PATCH"])
def approve_shift_request(cover_request_id):
    """
    UPDATE ("Approve") shift cover requests by id and UPDATE the targeted shift Record
    """
    with request_lock:
        return shift_cover_request.approve_scr(get_db_connection(), cover_request_id)

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


# Time Off Request Routes - /tor ------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

@app.route('/tor', methods=['GET'], strict_slashes=False)
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


@app.route('/tor/delete/<int:request_id>', methods=['DELETE'])
def delete_time_off_request(request_id):
    """
    DELETE time off requests by id
    """
    with request_lock:
        return time_off_request.delete_tor(get_db_connection(), request_id)

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


# Push Token Routes - /push-token -----------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


@app.route('/push-token/register', methods=['POST'])
def register_push_token():
    """
    POST Expo push token for a user device
    """
    return push_token.register_push_token(get_db_connection(), request)


@app.route('/push-token/delete', methods=['DELETE'])
def delete_push_token():
    """
    DELETE Expo push token for a user device
    """
    return push_token.delete_push_token(get_db_connection(), request)

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


for rule in app.url_map.iter_rules():
    print(rule)


# App will be available on current host IP using port 5000
# Ex: http://134.161.225.3:5000
if __name__ == '__main__':
    app.run(debug=True, host=BACKEND_ADDRESS, port=int(BACKEND_PORT))
