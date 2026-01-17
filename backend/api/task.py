from flask import jsonify
from notifications.dispatcher import dispatch_notification
from notifications.events import NotificationEvent
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

    IMPORTANT: Used for getting records in the "task" table
    """
    conn = None
    cursor = None
    try:
       # Expected Parameter Types
        param_types = {
            'task_id': int,
            'author_id': int,
            'section_id': int, 
            'complete': int,  # 1=True, 0=False
            'today': int, # 1=True, 0=False
            'past': int, # 1=True, 0=False
            'future': int, # 1=True, 0=False
            'recurring': int, # 1=True, 0=False
            'due_date': str, # YYYY-MM-DD
            'timestamp_sort': str, # "Newest", "Oldest"
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
        today = params.get('today')
        past = params.get('past')
        future = params.get('future')
        recurring = params.get('recurring')
        due_date = params.get('due_date')
        timestamp_sort = params.get('timestamp_sort')

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Base Query
        query = """
            SELECT 
                t.task_id,
                t.type,
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
                DATE_FORMAT(t.timestamp, '%Y-%m-%d %H:%i') AS timestamp
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

        if complete is not None and complete in (0, 1):
            query += " AND t.complete = %s"
            query_params.append(complete)

        # Date filters
        if past == 1 and today == 1 and future == 1:
            # everything
            pass  # no filter, since all dates are included
        if past == 0 and today == 0 and future == 0:
            pass
        elif past == 1 and today == 1:
            query += " AND t.due_date <= CURDATE()"
        elif today == 1 and future == 1:
            query += " AND t.due_date >= CURDATE()"
        elif past == 1:
            query += " AND t.due_date < CURDATE()"
        elif today == 1:
            query += " AND t.due_date = CURDATE()"
        elif future == 1:
            query += " AND t.due_date > CURDATE()"

        if recurring == 1:
            query += " AND t.recurring_task_id IS NOT NULL"
        elif recurring == 0:
            query += " AND t.recurring_task_id IS NULL"

        if due_date:
            # Validate date format -> 'YYYY-MM-DD'
            try:
                datetime.strptime(due_date, '%Y-%m-%d')
            except ValueError:
                return jsonify({"error": "Invalid due_date format. Expected YYYY-MM-DD."}), 400

            query += " AND t.due_date = %s"
            query_params.append(due_date)
        
        # -----------------------------
        # Time Sorting Logic
        # -----------------------------
        order_clauses = []
        
        # TIMESTAMP SORTING
        if timestamp_sort == "Newest":
            order_clauses.append("t.timestamp DESC")
        elif timestamp_sort == "Oldest":
            order_clauses.append("t.timestamp ASC")

        # Default fallback
        if not order_clauses:
            order_clauses.append("t.timestamp DESC")

        query += " ORDER BY " + ", ".join(order_clauses)

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


# POST Task ---------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def insert_task(db, request):
    """
    Inserts a new record into the "task" table
    """
    conn = None
    cursor = None
    try:
        # Define Required Fields
        required_fields = ['title', 'description',
                           'author_id', 'section_id', 'due_date']

        # Define Expected Field Types
        field_types = {
            'title': str,
            'description': str,
            'author_id': int,
            'section_id': int,
            'due_date': str,
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_body(
            request, field_types, required_fields)

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

        # Emit Notification Event
        dispatch_notification(
            db,
            NotificationEvent.TASK_CREATED,
            {
                "task_id": inserted_id
            }
        )

        return jsonify({"status": "success", "inserted_id": inserted_id}), 201

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
            'complete': int,  # 1 or 0
            'recurring_task_id': int,  # Foreign Key
            'last_modified_by': int,  # Employee ID
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
        # WHERE parameter at the end -> WHERE task_id = %s
        values.append(task_id)

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


# DELETE Task -------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def delete_task(db, task_id):
    """
    Deletes a task record by task_id
    """
    conn = None
    cursor = None
    try:
        conn = db
        cursor = conn.cursor(dictionary=True)

        # Check if task exists
        cursor.execute(
            "SELECT task_id FROM task WHERE task_id = %s",
            (task_id,)
        )
        result = cursor.fetchone()

        if not result:
            return jsonify({"status": "error", "message": "Task not found"}), 404

        # Delete the task
        cursor.execute(
            "DELETE FROM task WHERE task_id = %s",
            (task_id,)
        )
        conn.commit()

        return jsonify({"status": "success", "message": "Task deleted"}), 200

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


# CONVERT Task ------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def convert_task(db, request):
    """
    Converts a task between Normal and Recurring types within a transaction.
    - Table 'task' ALWAYS has type='normal'
    - Table 'recurring_task' ALWAYS has type='recurring'
    """
    conn = None
    cursor = None
    try:
        field_types = {
            'direction': str, 'task_id': int, 'recurring_task_id': int,
            'title': str, 'description': str, 'author_id': int,
            'section_id': int, 'due_date': str, 'mon': int, 'tue': int, 
            'wed': int, 'thu': int, 'fri': int, 'sat': int, 'sun': int,
            'start_date': str, 'end_date': str,
        }

        fields, error = request_helper.verify_body(
            request, field_types, 
            ['direction', 'title', 'description', 'author_id', 'section_id']
        )
        if error:
            return jsonify(error), 400

        direction = fields['direction']
        conn = db
        cursor = conn.cursor(dictionary=True)

        conn.start_transaction()

        if direction == 'to_recurring':
            # --- NORMAL -> RECURRING ---
            if 'task_id' not in fields:
                return jsonify({"error": "task_id is required"}), 400

            # 1. Create the template (ALWAYS 'recurring')
            sql_recurring = """
                INSERT INTO recurring_task 
                (type, title, description, author_id, section_id, mon, tue, wed, thu, fri, sat, sun, start_date, end_date)
                VALUES ('recurring', %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql_recurring, (
                fields['title'], fields['description'], fields['author_id'], fields['section_id'],
                fields.get('mon', 0), fields.get('tue', 0), fields.get('wed', 0), fields.get('thu', 0), 
                fields.get('fri', 0), fields.get('sat', 0), fields.get('sun', 0),
                fields.get('start_date'), fields.get('end_date')
            ))
            new_recurring_id = cursor.lastrowid

            # 2. Link the task (Keep its type as 'normal')
            sql_link = """
                UPDATE task SET recurring_task_id = %s, title = %s, description = %s, section_id = %s
                WHERE task_id = %s
            """
            cursor.execute(sql_link, (new_recurring_id, fields['title'], fields['description'], fields['section_id'], fields['task_id']))

        elif direction == 'to_normal':
            # --- RECURRING -> NORMAL ---
            if 'recurring_task_id' not in fields or 'due_date' not in fields:
                return jsonify({"error": "recurring_task_id and due_date are required"}), 400

            # 1. Deduplication check
            sql_check = "SELECT task_id FROM task WHERE recurring_task_id = %s AND due_date = %s LIMIT 1"
            cursor.execute(sql_check, (fields['recurring_task_id'], fields['due_date']))
            existing_task = cursor.fetchone()

            if existing_task:
                # Merge into existing (Type is already 'normal')
                sql_merge = "UPDATE task SET title = %s, description = %s, section_id = %s WHERE task_id = %s"
                cursor.execute(sql_merge, (fields['title'], fields['description'], fields['section_id'], existing_task['task_id']))
            else:
                # Insert new standalone (Type ALWAYS 'normal')
                sql_insert = """
                    INSERT INTO task (type, title, description, author_id, section_id, due_date)
                    VALUES ('normal', %s, %s, %s, %s, %s)
                """
                cursor.execute(sql_insert, (fields['title'], fields['description'], fields['author_id'], fields['section_id'], fields['due_date']))

            # 2. Delete the template
            cursor.execute("DELETE FROM recurring_task WHERE recurring_task_id = %s", (fields['recurring_task_id'],))

        conn.commit()
        return jsonify({"status": "success"}), 200

    except Exception as e:
        if conn: conn.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if cursor: cursor.close()

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


