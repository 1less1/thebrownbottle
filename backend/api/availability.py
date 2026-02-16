from flask import jsonify
import mysql.connector
import request_helper

# Availability ------------------------------------------------------------------------------------------

# GET Availability --------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def get_availability(db, request):
    """
    Fetches availability records based on optional URL query parameters.
    """
    conn = None
    cursor = None
    try:
        # Expected Parameter Types
        param_types = {
            'availability_id': int,
            'employee_id': int,
            'day_of_week': str,
            'is_available': int, # 1=True, 0=False
        }

        # Validate and parse parameters
        params, error = request_helper.verify_params(request, param_types)
        if error:
            return jsonify(error), 400

        # Extract Parameters
        availability_id = params.get('availability_id')
        employee_id = params.get('employee_id')
        day_of_week = params.get('day_of_week')
        is_available = params.get('is_available')

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Base Query
        query = """
            SELECT 
                a.availability_id,
                a.employee_id,
                CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
                a.day_of_week,
                a.is_available,
                TIME_FORMAT(a.start_time, '%h:%i %p') AS start_time,
                TIME_FORMAT(a.end_time, '%H:%i') AS end_time
            FROM availability a
            JOIN employee e ON a.employee_id = e.employee_id
            WHERE 1 = 1
        """

        query_params = []

        # Build Dynamic Query
        if availability_id is not None:
            query += " AND a.availability_id = %s"
            query_params.append(availability_id)

        if employee_id is not None:
            query += " AND a.employee_id = %s"
            query_params.append(employee_id)

        if day_of_week is not None:
            query += " AND a.day_of_week = %s"
            query_params.append(day_of_week)

        if is_available is not None:
            query += " AND a.is_available = %s"
            query_params.append(is_available)

        # Sorting logic - default by employee then day order
        query += " ORDER BY a.employee_id ASC, FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')"

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


# POST Availability ------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def insert_availability(db, request):
    """
    Inserts a new record into the availability table.
    Uses ON DUPLICATE KEY UPDATE to handle the unique constraint on (employee_id, day_of_week).
    """
    conn = None
    cursor = None
    try:
        # Define Required Fields
        required_fields = [
            'employee_id',
            'day_of_week',
        ]

        # Define Expected Field Types
        field_types = {
            'employee_id': int,
            'day_of_week': str,
            'is_available': int,
            'start_time': str, # Expected Format 'HH:MM'
            'end_time': str    # Expected Format 'HH:MM'
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_body(
            request, field_types, required_fields)

        if error:
            return jsonify(error), 400

        # Extract Parameters
        employee_id = fields['employee_id']
        day_of_week = fields['day_of_week']
        is_available = fields.get('is_available', 1)
        start_time = fields.get('start_time')
        end_time = fields.get('end_time')

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Execute Query with Upsert logic
        cursor.execute("""
            INSERT INTO availability 
            (employee_id, day_of_week, is_available, start_time, end_time)
            VALUES (%s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE 
                is_available = VALUES(is_available),
                start_time = VALUES(start_time),
                end_time = VALUES(end_time);
        """, (employee_id, day_of_week, is_available, start_time, end_time))

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


# PATCH Availability ------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def update_availability(db, request, availability_id):
    """
    Updates an existing availability record (partial update).
    availability_id comes from the URL.
    """
    conn = None
    cursor = None
    try:
        # Define Expected Field Types
        field_types = {
            'day_of_week': str,
            'is_available': int,
            'start_time': str,
            'end_time': str
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
        
        # WHERE parameter at the end -> WHERE availability_id = %s
        values.append(availability_id)

        conn = db
        cursor = conn.cursor(dictionary=True)

        query = f"""
            UPDATE availability
            SET {set_clause}
            WHERE availability_id = %s;
        """

        cursor.execute(query, tuple(values))
        conn.commit()
        rowcount = cursor.rowcount

        #if rowcount == 0:
            #return jsonify({"status": "error", "message": "No availability record found with given ID"}), 404

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


# DELETE Availability -----------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def delete_availability(db, availability_id):
    """
    Deletes an availability record by availability_id
    """
    conn = None
    cursor = None
    try:
        conn = db
        cursor = conn.cursor(dictionary=True)

        # Check if record exists
        cursor.execute(
            "SELECT availability_id FROM availability WHERE availability_id = %s",
            (availability_id,)
        )
        result = cursor.fetchone()

        if not result:
            return jsonify({"status": "error", "message": "Availability record not found"}), 404

        # Delete the record
        cursor.execute(
            "DELETE FROM availability WHERE availability_id = %s",
            (availability_id,)
        )
        conn.commit()

        return jsonify({"status": "success", "message": "Availability record deleted"}), 200

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

