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
    If no parameters are provided, returns all recurring tasks (equivalent to SELECT * FROM recurring_task).
    """
    conn = None
    cursor = None
    try:
        # Expected Parameter Types
        param_types = {
            'recurring_task_id': int,
            'author_id': int,
            'section_id': int,
            'start_date': str,
            'end_date': str
        }

        # Validate and parse parameters
        params, error = request_helper.verify_params(request, param_types)
        if error:
            return jsonify(error), 400

        # Extract Parameters
        recurring_task_id = params.get('recurring_task_id')
        author_id = params.get('author_id')
        section_id = params.get('section_id')
        start_date = params.get('start_date')
        end_date = params.get('end_date')

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Base Query
        query = """
            SELECT
                recurring_task_id,
                title,
                description,
                author_id,
                section_id,
                mon,
                tue,
                wed,
                thu,
                fri,
                sat,
                sun,
                start_date,
                end_date,
                DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i') AS timestamp
            FROM recurring_task 
            WHERE 1 = 1
        """

        query_params = []

        # Build Dynamic Query 
        if recurring_task_id is not None:
            query += " AND recurring_task_id = %s"
            query_params.append(recurring_task_id)

        if author_id is not None:
            query += " AND author_id = %s"
            query_params.append(author_id)

        if section_id is not None:
            query += " AND section_id = %s"
            query_params.append(section_id)

        if start_date is not None:
            query += " AND start_date = %s"
            query_params.append(start_date)

        if end_date is not None:
            query += " AND end_date = %s"
            query_params.append(end_date)

        # Last Query Line
        query += ";"

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
    """
    conn = None
    cursor = None
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
            'end_date': str  # Optional
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_body(request, field_types, required_fields)

        if error:
            return jsonify(error), 400

        # Extract Parameters
        title = fields['title']
        description = fields['description']
        author_id = fields['author_id']
        section_id = fields['section_id']
        start_date = fields['start_date']
        mon = fields['mon']
        tue = fields['tue']
        wed = fields['wed']
        thu = fields['thu']
        fri = fields['fri']
        sat = fields['sat']
        sun = fields['sun']
        end_date = fields.get('end_date')

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
            'start_date': str,
            'end_date': str,
            'mon': int, 'tue': int, 'wed': int,
            'thu': int, 'fri': int, 'sat': int, 'sun': int
        }

        # Validate the fields in JSON body (only optional fields here)
        fields, error = request_helper.verify_body(request, field_types, [])
        if error:
            return jsonify(error), 400
        if not fields:
            return jsonify({"status": "error", "message": "No fields provided to update"}), 400

        # Build dynamic SET clause
        set_clause = ", ".join([f"{col} = %s" for col in fields.keys()])
        values = list(fields.values())
        values.append(recurring_task_id)  # WHERE parameter at the end -> WHERE recurring_task_id = %s

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


