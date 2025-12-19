from flask import jsonify
import mysql.connector
import os
import request_helper

from datetime import datetime

# GET Recurring Tasks -----------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def get_recurring_tasks(db, request):
    """
    Fetches recurring_task records based on optional URL query parameters.
    If no parameters are provided, returns all recurring tasks.
    
    IMPORTANT: Used for getting records in the "recurring_task" table
    """
    conn = None
    cursor = None
    try:
        # Expected Parameter Types
        param_types = {
            'recurring_task_id': int,
            'author_id': int,
            'section_id': int,
            'mon': int,  # 1=True, 0=False
            'tue': int,
            'wed': int,
            'thu': int,
            'fri': int,
            'sat': int,
            'sun': int,
            'start_date': str,  # YYYY-MM-DD
            'end_date': str,    # YYYY-MM-DD
        }

        # Validate and parse parameters
        params, error = request_helper.verify_params(request, param_types)
        if error:
            return jsonify(error), 400

        # Extract parameters
        recurring_task_id = params.get('recurring_task_id')
        author_id = params.get('author_id')
        section_id = params.get('section_id')

        mon = params.get('mon')
        tue = params.get('tue')
        wed = params.get('wed')
        thu = params.get('thu')
        fri = params.get('fri')
        sat = params.get('sat')
        sun = params.get('sun')

        start_date = params.get('start_date')
        end_date = params.get('end_date')

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Base Query
        query = """
            SELECT 
                r.recurring_task_id,
                r.title,
                r.description,
                r.author_id,
                CONCAT(e.first_name, ' ', e.last_name) AS author,
                r.section_id,
                s.section_name,
                r.mon,
                r.tue,
                r.wed,
                r.thu,
                r.fri,
                r.sat,
                r.sun,
                DATE_FORMAT(r.start_date, '%Y-%m-%d') AS start_date,
                DATE_FORMAT(r.end_date, '%Y-%m-%d') AS end_date,
                DATE_FORMAT(r.timestamp, '%Y-%m-%d %H:%i') AS timestamp
            FROM recurring_task r
            JOIN employee e ON r.author_id = e.employee_id
            JOIN section s ON r.section_id = s.section_id
            WHERE 1 = 1
        """

        query_params = []

        # Build Dynamic Query
        if recurring_task_id is not None:
            query += " AND r.recurring_task_id = %s"
            query_params.append(recurring_task_id)

        if author_id is not None:
            query += " AND r.author_id = %s"
            query_params.append(author_id)

        if section_id is not None:
            query += " AND r.section_id = %s"
            query_params.append(section_id)

        # Day-of-week filters (0 or 1)
        dow_map = {
            'mon': mon,
            'tue': tue,
            'wed': wed,
            'thu': thu,
            'fri': fri,
            'sat': sat,
            'sun': sun
        }

        for col, val in dow_map.items():
            if val in (0, 1):
                query += f" AND r.{col} = %s"
                query_params.append(val)

        # Date filters
        if start_date:
            try:
                datetime.strptime(start_date, '%Y-%m-%d')
            except ValueError:
                return jsonify({"error": "Invalid start_date format. Expected YYYY-MM-DD."}), 400

            query += " AND r.start_date = %s"
            query_params.append(start_date)

        if end_date:
            try:
                datetime.strptime(end_date, '%Y-%m-%d')
            except ValueError:
                return jsonify({"error": "Invalid end_date format. Expected YYYY-MM-DD."}), 400

            query += " AND r.end_date = %s"
            query_params.append(end_date)

        # Last Query Line
        query += " ORDER BY r.start_date ASC;"

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


#  POST Recurring Task ----------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

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
            'mon': int, 'tue': int, 'wed': int,
            'thu': int, 'fri': int, 'sat': int, 'sun': int,
            'start_date': str,
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

        # Weekdays
        mon = fields['mon']
        tue = fields['tue']
        wed = fields['wed']
        thu = fields['thu']
        fri = fields['fri']
        sat = fields['sat']
        sun = fields['sun']
        
        start_date = fields['start_date']
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

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


# PATCH Recurring Task ----------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def update_recurring_task(db, request, recurring_task_id):
    """
    Updates an existing recurring_task record (partial update).
    recurring_task_id comes from the URL.
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

            # Day-of-week flags (0 or 1)
            'mon': int,
            'tue': int,
            'wed': int,
            'thu': int,
            'fri': int,
            'sat': int,
            'sun': int,

            # Dates
            'start_date': str,  # YYYY-MM-DD
            'end_date': str,    # YYYY-MM-DD or null
        }

        # Validate the fields in JSON body (all optional)
        fields, error = request_helper.verify_body(request, field_types, [])
        if error:
            return jsonify(error), 400
        if not fields:
            return jsonify({"status": "error", "message": "No fields provided to update"}), 400

        # Validate day-of-week flags
        dow_fields = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
        for dow in dow_fields:
            if dow in fields and fields[dow] not in (0, 1):
                return jsonify({"status": "error", "message": f"Field '{dow}' must be 0 or 1"}), 400

        # Validate date formats (YYYY-MM-DD)
        if 'start_date' in fields:
            try:
                datetime.strptime(fields['start_date'], '%Y-%m-%d')
            except ValueError:
                return jsonify({"status": "error", "message": "Invalid start_date format. Expected YYYY-MM-DD."}), 400

        if 'end_date' in fields and fields['end_date'] is not None:
            try:
                datetime.strptime(fields['end_date'], '%Y-%m-%d')
            except ValueError:
                return jsonify({"status": "error", "message": "Invalid end_date format. Expected YYYY-MM-DD."}), 400

        # Build dynamic SET clause
        set_clause = ", ".join([f"{col} = %s" for col in fields.keys()])
        values = list(fields.values())
        values.append(recurring_task_id)  # WHERE parameter

        conn = db
        cursor = conn.cursor(dictionary=True)

        query = f"""
            UPDATE recurring_task
            SET {set_clause}
            WHERE recurring_task_id = %s;
        """

        cursor.execute(query, tuple(values))
        conn.commit()
        rowcount = cursor.rowcount

        if rowcount == 0:
            return jsonify({"status": "error", "message": "No recurring task found with given ID"}), 404

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


# DELETE Recurring Task -----------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def delete_recurring_task(db, recurring_task_id):
    """
    Deletes a recurring_task record by recurring_task_id
    """
    conn = None
    cursor = None
    try:
        conn = db
        cursor = conn.cursor(dictionary=True)

        # Check if recurring task exists
        cursor.execute(
            "SELECT recurring_task_id FROM recurring_task WHERE recurring_task_id = %s",
            (recurring_task_id,)
        )
        result = cursor.fetchone()

        if not result:
            return jsonify({"status": "error", "message": "Recurring Task not found"}), 404

        # Delete the recurring task
        cursor.execute(
            "DELETE FROM recurring_task WHERE recurring_task_id = %s",
            (recurring_task_id,)
        )
        conn.commit()

        return jsonify({"status": "success", "message": "Recurring Task deleted"}), 200

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



