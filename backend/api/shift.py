from flask import jsonify
import mysql.connector
import os
import request_helper
from datetime import datetime

# GET Shifts --------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def get_shifts(db, request):
    """
    Fetches shift records based on optional URL query parameters.
    If no parameters are provided, returns all shifts (equivalent to SELECT * FROM shift).
    """
    conn = None
    cursor = None
    try:
        # Expected Parameter Types
        param_types = {
            'shift_id': int,
            'employee_id': int,
            'date': str,
            'section_id': int
        }

        # Validate and parse parameters
        params, error = request_helper.verify_params(request, param_types)
        if error:
            return jsonify(error), 400

        # Extract Parameters
        shift_id = params.get('shift_id')
        employee_id = params.get('employee_id')
        date = params.get('date')
        section_id = params.get('section_id')

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Base Query
        query = """
            SELECT
                sh.shift_id,
                sh.employee_id,
                e.first_name,
                e.last_name,
                TIME_FORMAT(sh.start_time, '%H:%i') AS start_time,
                TIME_FORMAT(sh.end_time, '%H:%i') AS end_time,
                DATE_FORMAT(sh.date, '%Y-%m-%d') AS date,
                sh.section_id,
                se.section_name
            FROM shift sh
            JOIN employee e ON sh.employee_id = e.employee_id
            JOIN section se ON se.section_id = sh.section_id
            WHERE 1 = 1
        """

        query_params = []

        # Build Dynamic Query 
        if shift_id is not None:
            query += " AND sh.shift_id = %s"
            query_params.append(shift_id)

        if employee_id is not None:
            query += " AND sh.employee_id = %s"
            query_params.append(employee_id)

        if date:
            try:
                datetime.strptime(date, '%Y-%m-%d')
            except ValueError:
                return jsonify({"error": "Invalid date format. Expected YYYY-MM-DD."}), 400
            query += " AND sh.date = %s"
            query_params.append(date)

        if section_id is not None:
            query += " AND sh.section_id = %s"
            query_params.append(section_id)

        # Last Query Line
        query += " ORDER BY sh.date ASC;"

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
    

#  POST Shift -------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def insert_shift(db, request):
    """
    Inserts a new record into the "shift" table.
    """
    conn = None
    cursor = None
    try:
        # Define Required Fields
        required_fields = [
            'employee_id', 'start_time', 'end_time', 'date', 'section_id'
        ]

        # Define Expected Field Types
        field_types = {
            'employee_id': int,
            'start_time': str, # HH:MM:SS
            'end_time': str, # HH:MM:SS
            'date': str, # YYYY-MM-DD
            'section_id': int,
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_body(request, field_types, required_fields)

        if error:
            return jsonify(error), 400

        # Extract Parameters
        employee_id = fields['employee_id']
        start_time = fields['start_time']
        end_time = fields['end_time']
        date = fields['date']
        section_id = fields['section_id']

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Execute Query
        cursor.execute("""
            INSERT INTO shift 
            (employee_id, start_time, end_time, date, section_id)
            VALUES (%s, %s, %s, %s, %s);
        """, (employee_id, start_time, end_time, date, section_id))
        
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
    
# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


# PATCH Shift -------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def update_shift(db, request, shift_id):
    """
    Updates an existing shift record (partial update).
    shift_id comes from the URL.
    Other fields (employee_id, start_time, end_time, date, section_id) are optional.
    """
    conn = None
    cursor = None
    try:
        # Define Expected Field Types
        field_types = {
            'employee_id': int,
            'start_time': str,   # HH:MM or HH:MM:SS
            'end_time': str,
            'date': str,         # YYYY-MM-DD
            'section_id': int,
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
        values.append(shift_id)  # WHERE parameter at the end -> WHERE shift_id = %s

        conn = db
        cursor = conn.cursor(dictionary=True)

        query = f"""
            UPDATE shift
            SET {set_clause}
            WHERE shift_id = %s;
        """
        
        cursor.execute(query, tuple(values))
        conn.commit()
        rowcount = cursor.rowcount

        if rowcount == 0:
            return jsonify({"status": "error", "message": "No shift found with given ID"}), 404

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