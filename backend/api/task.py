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



# NEW GET Requests for App USERS ------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def t_get_tasks(db, request):
    """
    Fetches task records based on optional URL query parameters.
    If no parameters are provided, returns all tasks (equivalent to SELECT * FROM task)
    Expects parameters in the URL. 
    """
    try:
       
       # Expected Parameters
        required_params = []
        # Optional Parameters listed below
        param_types = {
            'section_id': int, 
            'complete': int,  # 0 or 1
            'today': bool,
            'recurring': bool,
            'due_date': str,
        }

        # Validate required and optional params
        params, error = request_helper.verify_params(request, required_params, param_types, allow_optional=True)
        if error:
            return jsonify(error), 400

        # Extract parameters
        section_id = params.get('section_id')
        complete = params.get('complete')
        today = params.get('today', False)
        recurring = params.get('recurring', False)
        due_date = params.get('due_date') # 'YYYY-MM-DD'

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Base Query
        query = """
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
                t.last_modified_by,
                CONCAT(lm.first_name, ' ', lm.last_name) AS last_modified_name,
                DATE_FORMAT(t.timestamp, '%m/%d/%Y') AS date,
                DATE_FORMAT(t.timestamp, '%H:%i') AS time
            FROM task t
            JOIN employee e ON t.author_id = e.employee_id
            JOIN section s ON t.section_id = s.section_id
            LEFT JOIN employee lm ON t.last_modified_by = lm.employee_id
            WHERE 1 = 1
        """

        query_params = []

        if section_id is not None:
            query += " AND t.section_id = %s"
            query_params.append(section_id)

        # Complete Filter
        if complete is not None and complete in (0,1):
            query += " AND t.complete = %s"
            query_params.append(complete)

        # Today Filter
        if today:
            #query += " AND t.due_date = CURDATE()"
            query += " AND t.due_date <= CURDATE()"

        # Recurring Filter
        if recurring:
            query += " AND t.recurring_task_id IS NOT NULL"

        # Due Date Filter
        if due_date:
            # Validate date format -> 'YYYY-MM-DD'
            try:
                datetime.strptime(due_date, '%Y-%m-%d')
            except ValueError:
                return jsonify({"error": "Invalid due_date format. Expected YYYY-MM-DD."}), 400

            query += " AND t.due_date = %s"
            query_params.append(due_date)
        
        # Last Query Line
        query += " ORDER BY t.due_date ASC;"

        # Execute query
        cursor.execute(query, tuple(query_params))
        result = cursor.fetchall()

        cursor.close()
        conn.close()
        return jsonify(result), 200

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------



# PATCH (Update) Requests -------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def t_update_task(db, request, task_id):
    """
    Updates fields of a task with given task_id.
    Only provided fields will be updated (PATCH behavior).
    Expects JSON fields in the request body.
    """
    try:

        required_fields=[]
        field_types = {
            'title': str,
            'description': str,
            'author_id': int,
            'section_id': int,
            'due_date': str,  # YYYY-MM-DD
            'complete': int, # 1 or 0
            'recurring_task_id': int, # Foreign Key
            'last_modified_by': int, # Employee ID
        }

        # Validate required and optional fields
        fields, error = request_helper.verify_fields(request, required_fields, field_types, allow_optional=True)
        if error:
            return jsonify(error), 400

        # No Fields Provided -> Error
        if not fields:
            return jsonify({"status": "error", "message": "No valid fields provided for update"}), 400

        # Validate 'complete' is 0 or 1
        if 'complete' in fields:
            if fields['complete'] not in (0, 1):
                return jsonify({"status": "error", "message": "Field 'complete' must be 0 or 1"}), 400
        
        # Validate 'due_date' is 'YYYY-MM-DD'
        if 'due_date' in fields:
            try:
                datetime.strptime(fields['due_date'], '%Y-%m-%d')
            except ValueError:
                return jsonify({"status": "error", "message": "Invalid due_date format. Expected YYYY-MM-DD."}), 400
        
        conn = db
        cursor = conn.cursor(dictionary=True)

        # Dynamically build the SET clause
        update_clauses = [] # The actual parts of the SQL Statement
        update_values = [] # The values for each Clause

        for key, value in fields.items():
            update_clauses.append(f"{key} = %s")
            update_values.append(value)

        query = f"""
            UPDATE task
            SET {', '.join(update_clauses)}
            WHERE task_id = %s
        """

        update_values.append(task_id)  # Add the task_id to the end of the values list

        cursor.execute(query, tuple(update_values))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"status": "success", "message": f"Task {task_id} updated successfully"}), 200

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

# Allows an Admin to EDIT a nonrecurring task's details
def edit_task(db, request):
    return


# Allows an Admin to DELETE a nonrecurring task's details
def delete_task(db, request):
    return


