from flask import jsonify
import mysql.connector
import os
import request_helper
from datetime import datetime

# GET Requests ------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def get_tasks(db, request):
    """
    Fetches task records based on optional URL query parameters.
    If no parameters are provided, returns all tasks (equivalent to SELECT * FROM task)
    Expects parameters in the URL. 
    """
    conn = None
    cursor = None
    try:
       # Expected Parameter Types
        param_types = {
            'task_id': int,
            'author_id': int,
            'section_id': int, 
            'complete': int,  # 0 or 1
            'today': bool,
            'recurring': bool,
            'due_date': str,
        }

        # Validate and parse parameters
        params, error = request_helper.verify_params(request, param_types)
        if error:
            return jsonify(error), 400

        # Extract parameters
        task_id = params.get('task_id')
        author_id = params.get('author_id')
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
                DATE_FORMAT(t.due_date, '%Y-%m-%d') AS due_date,
                t.complete,
                t.recurring_task_id,
                t.last_modified_by,
                t.last_modified_at,
                CONCAT(lm.first_name, ' ', lm.last_name) AS last_modified_name,
                t.timestamp
            FROM task t
            JOIN employee e ON t.author_id = e.employee_id
            JOIN section s ON t.section_id = s.section_id
            LEFT JOIN employee lm ON t.last_modified_by = lm.employee_id
            WHERE 1 = 1
        """

        query_params = []

        # Build Dynamic Query 
        if task_id is not None:
            query += " AND t.task_id = %s"
            query_params.append(task_id)

        if author_id is not None:
            query += " AND t.author_id = %s"
            query_params.append(author_id)

        if section_id is not None:
            query += " AND t.section_id = %s"
            query_params.append(section_id)

        if complete is not None and complete in (0,1):
            query += " AND t.complete = %s"
            query_params.append(complete)

        if today:
            query += " AND t.due_date <= CURDATE()"

        if recurring:
            query += " AND t.recurring_task_id IS NOT NULL"

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

        # Execute Query
        cursor.execute(query, tuple(query_params))
        result = cursor.fetchall()

        return jsonify(result), 200

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
    
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


# POST Tasks --------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def insert_task(db, request):
    """
    Inserts a new record into the "task" table
    """
    conn = None
    cursor = None
    try:
        # Define Required Fields
        required_fields = ['title', 'description', 'author_id', 'section_id', 'due_date']

        # Define Expected Field Types
        field_types = {
            'title': str,
            'description': str,
            'author_id': int,
            'section_id': int,
            'due_date': str,
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_body(request, field_types, required_fields)

        if error:
            return jsonify(error), 400

        title = fields['title']
        description = fields['description']
        author_id = fields['author_id']
        section_id = fields['section_id']
        due_date = fields['due_date']

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Execute Query
        cursor.execute("""
            INSERT INTO task (title, description, author_id, section_id, due_date)
            VALUES (%s, %s, %s, %s, %s);
        """, (title, description, author_id, section_id, due_date))

        inserted_id = cursor.lastrowid

        conn.commit()

        return jsonify({"status": "success", "inserted_id": inserted_id}), 200

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
    
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
    


def insert_recurring_task(db, request):
    """
    Inserts a new record into the "recurring_task" table.
    Then triggers a mysql stored procedure to migrate
    today's recurring tasks to the normal "task" table.
    """
    conn = None
    cursor = None
    proc_cursor = None
    try:
        # Define Required Fields
        required_fields = [
            'title', 'description', 'author_id', 'section_id',
            'start_date', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'
        ]
        
        # Define Expected Field Types
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
        fields, error = request_helper.verify_body(request, field_types, required_fields)

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

        # Execute Query
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
            

        inserted_id = cursor.lastrowid
        
        conn.commit()

        # Call the Stored Procedure to insert today's recurring tasks into 'task' table
        proc_cursor = conn.cursor(dictionary=True)
        proc_cursor.callproc("insert_recurring_tasks")
        conn.commit()

        return jsonify({"status": "success", "inserted_id": inserted_id}), 200

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
    
    finally:
        if cursor:
            cursor.close()
        if proc_cursor:
            proc_cursor.close()
        if conn:
            conn.close()

def handle_new_task(db, request):
    """
    Handles incoming task POST request:
    If the request is a recurring task, insert into the 'recurring_task' table
    If the request is not recurring, insert immediately into the 'task' table
    """

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


# PATCH Task --------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def update_task(db, request, task_id):
    """
    Updates an existing task record (partial update).
    task_id comes from the URL.
    """
    conn = None
    cursor = None
    try:
        # Define Expected Field Types
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

        # Validate the fields in JSON body (only optional fields here)
        fields, error = request_helper.verify_body(request, field_types, [])
        if error:
            return jsonify(error), 400
        if not fields:
            return jsonify({"status": "error", "message": "No fields provided to update"}), 400

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

        # Build dynamic SET clause
        set_clause = ", ".join([f"{col} = %s" for col in fields.keys()])
        values = list(fields.values())
        values.append(task_id)  # WHERE parameter at the end -> WHERE task_id = %s

        conn = db
        cursor = conn.cursor(dictionary=True)

        query = f"""
            UPDATE task
            SET {set_clause}
            WHERE task_id = %s;
        """

        cursor.execute(query, tuple(values))
        conn.commit()
        rowcount = cursor.rowcount

        if rowcount == 0:
            return jsonify({"status": "error", "message": "No task found with given ID"}), 404

        return jsonify({"status": "success", "updated_rows": rowcount}), 200

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

