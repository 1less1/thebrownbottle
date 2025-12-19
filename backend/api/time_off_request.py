from flask import jsonify
from notifications.dispatcher import dispatch_notification
from notifications.events import NotificationEvent
import mysql.connector
import os
import request_helper
from datetime import datetime
from typing import List

# GET Time Off Request ----------------------------------------------------------------------------------
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
            'primary_role': int,
            'secondary_role': int,
            'tertiary_role': int,
            'start_date': str,
            'end_date': str,
            'reason': str,
            'status': List[str],
            'date_sort': str,  # "Newest" or "Oldest" - Sorts by date in relation to the current day
            'timestamp_sort': str  # "Newest" or "Oldest" - Sorts by timestamp
        }

        # Validate and parse parameters
        params, error = request_helper.verify_params(request, param_types)
        if error:
            return jsonify(error), 400

        # Extract Parameters
        request_id = params.get('request_id')
        employee_id = params.get('employee_id')
        primary_role = params.get('primary_role')
        secondary_role = params.get('secondary_role')
        tertiary_role = params.get('tertiary_role')
        start_date = params.get('start_date')
        end_date = params.get('end_date')
        reason = params.get('reason')
        statuses = params.get('status', [])  # List of statuses
        date_sort = params.get("date_sort")
        timestamp_sort = params.get("timestamp_sort")

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Base Query
        query = """
            SELECT
                tor.request_id,
                tor.employee_id,
                e.primary_role,
                pr.role_name AS primary_role_name,
                e.first_name,
                e.last_name,
                DATE_FORMAT(tor.start_date, '%Y-%m-%d') AS start_date,
                DATE_FORMAT(tor.end_date, '%Y-%m-%d') AS end_date,
                tor.reason,
                tor.status,
                DATE_FORMAT(tor.timestamp, '%Y-%m-%d %H:%i') AS timestamp
            FROM time_off_request tor
            JOIN employee e ON tor.employee_id = e.employee_id
            LEFT JOIN role pr ON e.primary_role = pr.role_id
            WHERE 1 = 1
        """

        query_params = []

        # -----------------------------
        # Build Dynamic Query
        # -----------------------------
        if statuses and len(statuses) > 0:
            placeholders = ','.join(['%s'] * len(statuses))
            query += f" AND tor.status IN ({placeholders})"
            query_params.extend(statuses)

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
        # Time Sorting Logic
        # -----------------------------
        order_clauses = []

        # AGE SORTING FIRST
        if date_sort == "Newest":
            order_clauses.append("tor.start_date DESC")
        elif date_sort == "Oldest":
            order_clauses.append("tor.start_date ASC")

        # TIMESTAMP SORTING SECOND
        if timestamp_sort == "Newest":
            order_clauses.append("tor.timestamp DESC")
        elif timestamp_sort == "Oldest":
            order_clauses.append("tor.timestamp ASC")

        # Default fallback
        if not order_clauses:
            order_clauses.append("tor.start_date DESC")

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


# POST Time Off Request ---------------------------------------------------------------------------------
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
            'start_date': str,  # YYYY-MM-DD
            'end_date': str,  # YYYY-MM-DD
            'reason': str,
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_body(
            request, field_types, required_fields)

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

        # Close cursor immediately before notifications
        cursor.close()
        cursor = None

        # --- NOTIFICATION TRIGGER ---
        try:
            dispatch_notification(
                db,
                NotificationEvent.TIME_OFF_CREATED,
                {
                    "request_id": inserted_id,
                    "employee_id": employee_id
                }
            )
        except Exception as e:
            print(f"Notification Error: {e}")
        # ----------------------------

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

# PATCH Time Off Request --------------------------------------------------------------------------------
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
        # WHERE parameter at the end -> WHERE request_id = %s
        values.append(request_id)

        conn = db
        cursor = conn.cursor(dictionary=True)

        # --- FETCH CURRENT DETAILS (Needed for notifications) ---
        cursor.execute(
            "SELECT status, employee_id FROM time_off_request WHERE request_id = %s", (request_id,))
        current = cursor.fetchone()

        if not current:
            cursor.close()
            return jsonify({"status": "error", "message": "Time Off Request not found"}), 404

        old_status = current["status"]
        employee_id = current["employee_id"]
        # --------------------------------------------------------

        query = f"""
            UPDATE time_off_request
            SET {set_clause}
            WHERE request_id = %s;
        """

        cursor.execute(query, tuple(values))
        conn.commit()
        rowcount = cursor.rowcount

        # Close cursor immediately before notifications
        cursor.close()
        cursor = None

        if rowcount == 0:
            return jsonify({"status": "error", "message": "No shift found with given ID"}), 404

        # --- NOTIFICATION TRIGGERS ---
        new_status = fields.get("status")

        if new_status and new_status != old_status:
            try:
                event = None
                if new_status == "Accepted":
                    event = NotificationEvent.TIME_OFF_APPROVED
                elif new_status == "Denied":
                    event = NotificationEvent.TIME_OFF_DENIED

                if event:
                    dispatch_notification(
                        db,
                        event,
                        {
                            "request_id": request_id,
                            "employee_id": employee_id,
                            "status": new_status
                        }
                    )
            except Exception as e:
                # Log the error, but do not fail the request
                print(f"Notification Error in update_tor: {e}")
        # -----------------------------

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

# DELETE Time Off Request -------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


def delete_tor(db, request_id):
    """
    Deletes a time_off_request record by request_id.
    """
    conn = None
    cursor = None
    try:
        conn = db
        cursor = conn.cursor(dictionary=True)

        # Check if shift cover request exists
        cursor.execute(
            "SELECT request_id FROM time_off_request WHERE request_id = %s",
            (request_id,)
        )
        result = cursor.fetchone()

        if not result:
            return jsonify({"status": "error", "message": "Time Off Request not found"}), 404

        # Delete the shift cover request
        cursor.execute(
            "DELETE FROM time_off_request WHERE request_id = %s",
            (request_id,)
        )
        conn.commit()

        return jsonify({"status": "success", "message": "Time Off Request deleted"}), 200

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
