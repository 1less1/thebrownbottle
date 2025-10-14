from flask import jsonify
import mysql.connector
import os
import request_helper
from datetime import datetime

# GET Time_off_Request ----------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def get_tor(db, request):
    """
    Fetches TOR records based on optional URL query parameters.
    If no parameters are provided, returns all TORs (equivalent to SELECT * FROM time_off_request).
    """
    conn = None
    cursor = None
    try:
        # Expected Parameter Types
        param_types = {
            'request_id': int,
            'employee_id': int,
            'start_date': str,
            'end_date': str,
            'reason': str,
            'status': str,
            'timestamp': str
        }

        # Validate and parse parameters
        params, error = request_helper.verify_params(request, param_types)
        if error:
            return jsonify(error), 400

        # Extract Parameters
        request_id = params.get('request_id')
        employee_id = params.get('employee_id')
        start_date = params.get('start_date')
        end_date = params.get('end_date')
        reason = params.get('reason')
        status = params.get('status')
        timestamp = params.get('timestamp')

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Base Query
        query = """
            SELECT
                tor.request_id,
                tor.employee_id,
                e.first_name,
                e.last_name,
                DATE_FORMAT(tor.start_date, '%Y-%m-%d') AS start_date,
                DATE_FORMAT(tor.end_date, '%Y-%m-%d') AS end_date,
                tor.reason,
                tor.status,
                TIME_FORMAT(tor.timestamp, '%H:%i') AS timestamp
            FROM time_off_request tor
            JOIN employee e ON tor.employee_id = e.employee_id
            WHERE 1 = 1
        """

        query_params = []

        # Build Dynamic Query 
        if request_id is not None:
            query += " AND tor.request_id = %s"
            query_params.append(request_id)

        if employee_id is not None:
            query += " AND tor.employee_id = %s"
            query_params.append(employee_id)

        if start_date:
            try:
                datetime.strptime(start_date, '%Y-%m-%d')
            except ValueError:
                return jsonify({"error": "Invalid date format. Expected YYYY-MM-DD."}), 400
            query += " AND tor.start_date = %s"
            query_params.append(start_date)
        
        if end_date:
            try:
                datetime.strptime(end_date, '%Y-%m-%d')
            except ValueError:
                return jsonify({"error": "Invalid date format. Expected YYYY-MM-DD."}), 400
            query += " AND tor.end_date = %s"
            query_params.append(end_date)

        if reason is not None:
            query += " AND tor.reason = %s"
            query_params.append(reason)

        if status is not None:
            query += " AND tor.status = %s"
            query_params.append(status)

        if timestamp is not None:
            try:
                datetime.strptime(timestamp, '%H:%M:%S')
            except ValueError:
                return jsonify({"error": "Invalid time format. Expected HH:MM:SS."}), 400
            query += " AND tor.timestamp = %s"
            query_params.append(timestamp)

        # Last Query Line
        query += " ORDER BY tor.start_date ASC;"

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
    
    
# POST Time_off_Request ---------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def insert_tor(db, request):
    """
    Inserts a new record into the "time_off_request" table.
    """
    conn = None
    cursor = None
    try:
        # Define Required Fields
        required_fields = [
            'employee_id', 'start_date', 'end_date', 'reason'
        ]

        # Define Expected Field Types
        field_types = {
            'employee_id': int,
            'start_date': str, # YYYY-MM-DD
            'end_date': str, # YYYY-MM-DD
            'reason': str,
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_body(request, field_types, required_fields)

        if error:
            return jsonify(error), 400

        # Extract Parameters
        employee_id = fields['employee_id']
        start_date = fields['start_date']
        end_date = fields['end_date']
        reason = fields['reason']

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Execute Query
        cursor.execute("""
            INSERT INTO time_off_request 
            (employee_id, start_date, end_date, reason)
            VALUES (%s, %s, %s, %s);
        """, (employee_id, start_date, end_date, reason))
        
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

# PATCH Time_off_Request --------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------
    
def update_tor(db, request, request_id):
    """
    Updates an existing TOR record (partial update).
    request_id comes from the URL.
    Other fields (employee_id, start_date, end_date, timestamp, reason, status) are optional.
    """
    conn = None
    cursor = None
    try:
        # Define Expected Field Types
        field_types = {
            'employee_id': int,
            'start_date': str,   # YYYY-MM-DD
            'end_date': str,
            'timestamp': str,    # HH:MM or HH:MM:SS
            'reason': str,
            'status': str,
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
        values.append(request_id)  # WHERE parameter at the end -> WHERE request_id = %s

        conn = db
        cursor = conn.cursor(dictionary=True)

        query = f"""
            UPDATE time_off_request
            SET {set_clause}
            WHERE request_id = %s;
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