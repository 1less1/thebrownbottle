from flask import jsonify
from notifications.dispatcher import dispatch_notification
from notifications.events import NotificationEvent
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
            'primary_role': int,
            'secondary_role': int,
            'tertiary_role': int,
            'section_id': int,
            'date': str,
            'start_date': str,
            'end_date': str,
            'is_today': int,  # 1=True, 0=False
            'next_shift': int  # 1=True, 0=False
        }

        # Validate and parse parameters
        params, error = request_helper.verify_params(request, param_types)
        if error:
            return jsonify(error), 400

        # Extract Parameters
        shift_id = params.get('shift_id')
        employee_id = params.get('employee_id')
        primary_role = params.get('primary_role')
        secondary_role = params.get('secondary_role')
        tertiary_role = params.get('tertiary_role')
        section_id = params.get('section_id')
        date = params.get('date')
        start_date = params.get('start_date')
        end_date = params.get('end_date')
        is_today = params.get('is_today')
        next_shift = params.get('next_shift')

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Base Query
        query = """
            SELECT
                sh.shift_id,
                sh.employee_id,
                e.first_name,
                e.last_name,
                e.primary_role,
                pr.role_name AS primary_role_name,
                sh.section_id,
                se.section_name,
                TIME_FORMAT(sh.start_time, '%h:%i %p') AS start_time,
                DATE_FORMAT(sh.date, '%Y-%m-%d') AS date,
                DATE_FORMAT(sh.date, '%W') AS day_name,
                DAYOFWEEK(sh.date) AS day_index,
                DATE_FORMAT(sh.timestamp, '%Y-%m-%d %H:%i') AS timestamp
            FROM shift sh
            JOIN employee e ON sh.employee_id = e.employee_id
            LEFT JOIN role pr ON e.primary_role = pr.role_id
            JOIN section se ON se.section_id = sh.section_id
            WHERE 1 = 1
        """
        # day_name = Sunday, Monday, Tuesday, etc.
        # day_index = 1 (Sun)... to 7 (Sat)

        query_params = []

        # -----------------------------
        # Next Shift Logic (returns early if criteria is met!)
        # -----------------------------
        if str(next_shift) == "1" and employee_id:

            # Only filter by employee and date — nothing else
            query += " AND sh.employee_id = %s"
            query_params.append(employee_id)

            # Correct next-shift logic (time-aware)
            query += " AND sh.date >= CURDATE()"
            query += " ORDER BY sh.date ASC, sh.start_time ASC LIMIT 1"

            cursor.execute(query, tuple(query_params))
            result = cursor.fetchall()
            return jsonify(result), 200

        # -----------------------------
        # Build Dynamic Query
        # -----------------------------
        if shift_id is not None:
            query += " AND sh.shift_id = %s"
            query_params.append(shift_id)

        if employee_id is not None:
            query += " AND sh.employee_id = %s"
            query_params.append(employee_id)

        if section_id is not None:
            query += " AND sh.section_id = %s"
            query_params.append(section_id)

        # Handle multiple Role Clauses
        role_clauses = []
        role_values = []

        if primary_role is not None:
            role_clauses.append("e.primary_role = %s")
            role_values.append(primary_role)

        if secondary_role is not None:
            role_clauses.append("e.secondary_role = %s")
            role_values.append(secondary_role)

        if tertiary_role is not None:
            role_clauses.append("e.tertiary_role = %s")
            role_values.append(tertiary_role)

        if role_clauses:
            query += " AND (" + " OR ".join(role_clauses) + ")"
            query_params.extend(role_values)

        # -----------------------------
        # Date Sorting Logic
        # -----------------------------
        if str(is_today) == "1":
            query += " AND sh.date = CURDATE()"

        else:
            # Date range: both start and end
            if start_date and end_date:
                try:
                    datetime.strptime(start_date, '%Y-%m-%d')
                    datetime.strptime(end_date, '%Y-%m-%d')
                except ValueError:
                    return jsonify({"error": "Invalid date range format. Expected YYYY-MM-DD."}), 400

                query += " AND sh.date BETWEEN %s AND %s"
                query_params.append(start_date)
                query_params.append(end_date)

            # Single exact date (only used if not using range and not using is_today)
            elif date:
                try:
                    datetime.strptime(date, '%Y-%m-%d')
                except ValueError:
                    return jsonify({"error": "Invalid date format. Expected YYYY-MM-DD."}), 400

                query += " AND sh.date = %s"
                query_params.append(date)

        # Last Query Line
        query += " ORDER BY sh.date, sh.start_time;"

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
            'employee_id', 'start_time', 'date', 'section_id'
        ]

        # Define Expected Field Types
        field_types = {
            'employee_id': int,
            'start_time': str,  # HH:MM:SS
            'date': str,  # YYYY-MM-DD
            'section_id': int,
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_body(
            request, field_types, required_fields)

        if error:
            return jsonify(error), 400

        # Extract Parameters
        employee_id = fields['employee_id']
        start_time = fields['start_time']
        date = fields['date']
        section_id = fields['section_id']

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Execute Query
        cursor.execute("""
            INSERT INTO shift 
            (employee_id, start_time, date, section_id)
            VALUES (%s, %s, %s, %s);
        """, (employee_id, start_time, date, section_id))

        inserted_id = cursor.lastrowid

        conn.commit()

        dispatch_notification(
            db,
            NotificationEvent.SHIFT_CREATED,
            {
                "employee_id": employee_id,
                "shift_id": inserted_id
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


# PATCH Shift -------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def update_shift(db, request, shift_id):
    """
    Updates an existing shift record (partial update).
    shift_id comes from the URL.
    Other fields (employee_id, start_time, date, section_id) are optional.
    """
    conn = None
    cursor = None
    try:
        # Define Expected Field Types
        field_types = {
            'employee_id': int,
            'start_time': str,   # HH:MM or HH:MM:SS
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
        # WHERE parameter at the end -> WHERE shift_id = %s
        values.append(shift_id)

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Grab employee id before update
        cursor.execute(
            "SELECT employee_id FROM shift WHERE shift_id = %s",
            (shift_id,)
        )
        shift = cursor.fetchone()

        if not shift:
            return jsonify({"status": "error", "message": "No shift found with given ID"}), 404

        employee_id = shift["employee_id"]

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

        dispatch_notification(
            db,
            NotificationEvent.SHIFT_UPDATED,
            {
                "shift_id": shift_id,
                "employee_id": employee_id
            }
        )

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

# --------------------------------------------------------------------------------------
# --------------------------------------------------------------------------------------


# DELETE Shift -------------------------------------------------------------------------
# --------------------------------------------------------------------------------------

def delete_shift(db, shift_id):
    """
    Deletes a shift record by shift_id.
    """
    conn = None
    cursor = None
    try:
        conn = db
        cursor = conn.cursor(dictionary=True)

        # Check if shift exists
        cursor.execute(
            "SELECT shift_id, employee_id FROM shift WHERE shift_id = %s",
            (shift_id,)
        )
        shift = cursor.fetchone()

        if not shift:
            return jsonify({"status": "error", "message": "Shift not found"}), 404

        cursor.execute("DELETE FROM shift WHERE shift_id = %s", (shift_id,))
        conn.commit()

        dispatch_notification(
            db,
            NotificationEvent.SHIFT_DELETED,
            {
                "employee_id": shift["employee_id"],
                "shift_id": shift_id
            }
        )

        return jsonify({"status": "success", "message": "Shift deleted"}), 200

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
