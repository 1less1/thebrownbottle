from flask import jsonify
import mysql.connector
import os
import request_helper

from datetime import datetime

# Insert (POST) New Task Logic --------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

# Inserts a new record into the "task" table
def insert_task(db, request):
    
    try:
        required_fields = ['title', 'description', 'author_id', 'section_id', 'due_date']
        field_types = {
            'title': str,
            'description': str,
            'author_id': int,
            'section_id': int,
            'due_date': str,
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_fields(request, required_fields, field_types)

        if error:
            return jsonify(error), 400

        title = fields['title']
        description = fields['description']
        author_id = fields['author_id']
        section_id = fields['section_id']
        due_date = fields['due_date']

        conn = db
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            INSERT INTO task (title, description, author_id, section_id, due_date)
            VALUES (%s, %s, %s, %s, %s);
        """, (title, description, author_id, section_id, due_date))

        result = {"inserted_id": cursor.lastrowid}

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"status": "success", "row id": result}), 200

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500



# Inserts a new record into the "recurring_task" table.
# Then triggers a mysql stored procedure to migrate
# today's recurring tasks to the normal "task" table.
def insert_recurring_task(db, request):
    
    try:
        required_fields = [
            'title', 'description', 'author_id', 'section_id',
            'start_date', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'
        ]
        field_types = {
            'title': str,
            'description': str,
            'author_id': int,
            'section_id': int,
            'start_date': str,
            'mon': int, 'tue': int, 'wed': int,
            'thu': int, 'fri': int, 'sat': int, 'sun': int,
            'end_date': str,  # Optional
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_fields(request, required_fields, field_types)

        if error:
            return jsonify(error), 400

        title = fields['title']
        description = fields['description']
        author_id = fields['author_id']
        section_id = fields['section_id']
        start_date = fields['start_date']

        # Weekdays
        mon = fields['mon']
        tue = fields['tue']
        wed = fields['wed']
        thu = fields['thu']
        fri = fields['fri']
        sat = fields['sat']
        sun = fields['sun']
        
        # Check optional end_date field
        end_date = fields.get('end_date')
        if not end_date or end_date.lower() == 'none':
            end_date = None

        conn = db
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            INSERT INTO recurring_task 
            (title, description, author_id, section_id, start_date, end_date,
             mon, tue, wed, thu, fri, sat, sun)
            VALUES (%s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s, %s);
        """, (
            title, description, author_id, section_id, start_date, end_date,
            mon, tue, wed, thu, fri, sat, sun
        ))
            

        result = {"inserted_id": cursor.lastrowid}
        conn.commit()
        cursor.close()

        # Call the Stored Procedure to insert today's recurring tasks into 'task' table
        proc_cursor = conn.cursor(dictionary=True)
        proc_cursor.callproc("insert_recurring_tasks")
        conn.commit()
        proc_cursor.close()
        
        conn.close()

        return jsonify({"status": "success", "row id": result}), 200

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
    

# Handles incoming task POST request
# If the request is a recurring task, insert into the 'recurring_task' table
# If the request is not recurring, insert immediately into the 'task' table
def handle_new_task(db, request):

    if request.is_json:
        data = request.get_json()
        start_date = data.get("start_date")
    else:
        return jsonify({"status": "error", "message": "Invalid or missing JSON body"}), 400
    

    if start_date and all(day in data for day in ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']):
        return insert_recurring_task(db, request)
    else:
        return insert_task(db, request)
    
# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------



# GET Requests for 'task' table -------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


# Fetches all tasks that are NOT recurring (recurring_task_id = NULL) from 'task' table
def t_get_all_tasks(db, request):
    try:

        conn = db
        cursor = conn.cursor(dictionary=True)

        # SQL Script - Selects all non-recurring tasks
        cursor.execute("""
            SELECT 
                t.task_id,
                t.title,
                t.description,
                t.author_id,
                CONCAT(e.first_name, ' ', e.last_name) AS author,
                t.section_id,
                s.section_name,
                t.due_date,
                t.complete,
                t.recurring_task_id,
                DATE_FORMAT(t.timestamp, '%m/%d/%Y') AS date,
                DATE_FORMAT(t.timestamp, '%H:%i') AS time
            FROM task t
            JOIN employee e ON t.author_id = e.employee_id
            JOIN section s ON t.section_id = s.section_id
            WHERE t.recurring_task_id IS NULL
            ORDER BY t.due_date ASC;
        """)


        # Fetch the result
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify(result), 200


    except mysql.connector.Error as e:
        # Handle database-specific errors
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500


    except Exception as e:
        # Handle general errors
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
    

# Fetches all recurring tasks (recurring_task_id != NULL) 'task' table
def t_get_all_recurring_tasks(db, request):
    try:

        conn = db
        cursor = conn.cursor(dictionary=True)

        # SQL Script - Selects all non-recurring tasks
        cursor.execute("""
            SELECT 
                t.task_id,
                t.title,
                t.description,
                t.author_id,
                CONCAT(e.first_name, ' ', e.last_name) AS author,
                t.section_id,
                s.section_name,
                t.due_date,
                t.complete,
                t.recurring_task_id,
                DATE_FORMAT(t.timestamp, '%m/%d/%Y') AS date,
                DATE_FORMAT(t.timestamp, '%H:%i') AS time
            FROM task t
            JOIN employee e ON t.author_id = e.employee_id
            JOIN section s ON t.section_id = s.section_id
            WHERE t.recurring_task_id IS NOT NULL
            ORDER BY t.due_date ASC;
        """)


        # Fetch the result
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify(result), 200


    except mysql.connector.Error as e:
        # Handle database-specific errors
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500


    except Exception as e:
        # Handle general errors
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500


# Fetches all tasks for a specified section (section_id) from 'task' table
def t_get_tasks_by_section(db, request):
    try:

        required_params = ['section_id']
        param_types = {'section_id': int}

        # Validate the parameters
        params, error = request_helper.verify_params(request, required_params, param_types)

        if error:
            return jsonify(error), 400
        
        # Extract validated params
        section_id = params['section_id']

        conn = db
        cursor = conn.cursor(dictionary=True)

        # SQL Script - Selects all tasks for a certain section (section_id)
        cursor.execute("""
            SELECT 
                t.task_id,
                t.title,
                t.description,
                t.author_id,
                CONCAT(e.first_name, ' ', e.last_name) AS author,
                t.section_id,
                s.section_name,
                t.due_date,
                t.complete,
                t.recurring_task_id,
                DATE_FORMAT(t.timestamp, '%m/%d/%Y') AS date,
                DATE_FORMAT(t.timestamp, '%H:%i') AS time
            FROM task t
            JOIN employee e ON t.author_id = e.employee_id
            JOIN section s ON t.section_id = s.section_id
            WHERE t.section_id = %s
            ORDER BY t.due_date ASC;
        """, (section_id,))

        # Fetch the result
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify(result), 200


    except mysql.connector.Error as e:
        # Handle database-specific errors
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500


    except Exception as e:
        # Handle general errors
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500


# Fetches all recurring tasks by section (section_id) from 'task' table
def t_get_recurring_tasks_by_section(db, request):
    try:

        required_params = ['section_id']
        param_types = {'section_id': int}

        # Validate the parameters
        params, error = request_helper.verify_params(request, required_params, param_types)

        if error:
            return jsonify(error), 400
        
        # Extract validated params
        section_id = params['section_id']

        conn = db
        cursor = conn.cursor(dictionary=True)

        # SQL Script - Selects all tasks for a certain section that are recurring (recurring_task_id != NULL)
        cursor.execute("""
            SELECT 
                t.task_id,
                t.title,
                t.description,
                t.author_id,
                CONCAT(e.first_name, ' ', e.last_name) AS author,
                t.section_id,
                s.section_name,
                t.due_date,
                t.complete,
                t.recurring_task_id,
                DATE_FORMAT(t.timestamp, '%m/%d/%Y') AS date,
                DATE_FORMAT(t.timestamp, '%H:%i') AS time
            FROM task t
            JOIN employee e ON t.author_id = e.employee_id
            JOIN section s ON t.section_id = s.section_id
            WHERE t.section_id = %s
            AND t.recurring_task_id IS NOT NULL
            ORDER BY t.due_date ASC;
        """, (section_id,))

        # Fetch the result
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify(result), 200


    except mysql.connector.Error as e:
        # Handle database-specific errors
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500


    except Exception as e:
        # Handle general errors
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500


# Normal employee users will use the below functions for app component based requests!

# Fetches all daily tasks that are complete (complete = 1)
# Filters results by specified section_id
def t_get_daily_tasks_complete(db, request):
    return

# Fetches all daily tasks that are incomplete (complete = 0)
# Filters results by specified section_id
def t_get_daily_tasks_incomplete(db, request):
    return

# Allows user to mark a task (specified by task_id) complete or incomplete
def t_edit_task_complete(db, request):
    return


# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------



# Edit (POST) Task Requests -----------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

# Allows user to edit a "normal task's" details (not recurring) from 'task' table
def edit_task(db, request):
    return


# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


