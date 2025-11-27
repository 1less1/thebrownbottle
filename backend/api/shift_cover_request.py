from flask import jsonify
import mysql.connector
import os
import request_helper
from datetime import datetime

# GET Shift_cover_request -------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


def get_scr(db, request):
    """
    Fetches SCR records based on optional URL query parameters.
    If no parameters are provided, returns all SCRs (equivalent to SELECT * FROM shift_cover_request).
    """
    conn = None
    cursor = None
    try:
        # Expected Parameter Types
        param_types = {
            'cover_request_id': int,
            'shift_id': int,
            'accepted_employee_id': int,
            'requested_employee_id': int,
            'employee_id': int,
            'requester_role_id': int,
            'status': str,
            'timestamp': str
        }

        # Validate and parse parameters
        params, error = request_helper.verify_params(request, param_types)
        if error:
            return jsonify(error), 400

        # Extract Parameters
        cover_request_id = params.get('cover_request_id')
        shift_id = params.get('shift_id')
        accepted_employee_id = params.get('accepted_employee_id')
        requested_employee_id = params.get('requested_employee_id')
        employee_id = params.get('employee_id')
        requester_role_id = params.get('requester_role_id')
        status = params.get('status')
        timestamp = params.get('timestamp')

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Base Query
        query = """
            SELECT
                scr.cover_request_id,
                scr.shift_id,
                scr.accepted_employee_id,
                scr.requested_employee_id,

                requester.first_name AS requested_first_name,
                requester.last_name AS requested_last_name,

                accepter.first_name AS accepted_first_name,
                accepter.last_name AS accepted_last_name,

                r.role_id AS requester_role_id,
                r.role_name AS requester_role_name,

                sec.section_id AS section_id,
                sec.section_name AS section_name,

                s.date AS shift_date,
                TIME_FORMAT(s.start_time, '%H:%i %p') AS shift_start,

                DATE_FORMAT(scr.timestamp, '%Y-%m-%d %H:%i') AS timestamp,
                scr.status
            FROM shift_cover_request scr
            JOIN employee requester ON scr.requested_employee_id = requester.employee_id
            LEFT JOIN employee accepter ON scr.accepted_employee_id = accepter.employee_id
            JOIN shift s ON scr.shift_id = s.shift_id
            JOIN role r ON requester.primary_role = r.role_id
            JOIN section sec ON s.section_id = sec.section_id
            WHERE 1 = 1
        """

        query_params = []

        # Build Dynamic Query
        if cover_request_id is not None:
            query += " AND scr.cover_request_id = %s"
            query_params.append(cover_request_id)

        if shift_id is not None:
            query += " AND scr.shift_id = %s"
            query_params.append(shift_id)

        if accepted_employee_id is not None:
            query += " AND scr.accepted_employee_id = %s"
            query_params.append(accepted_employee_id)

        if requested_employee_id is not None:
            query += " AND scr.requested_employee_id = %s"
            query_params.append(requested_employee_id)

        # match either the requester or the accepter for the same employee
        if employee_id is not None:
            query += " AND (scr.requested_employee_id = %s OR scr.accepted_employee_id = %s)"
            query_params.extend([employee_id, employee_id])

        # filter by role of the requester
        if requester_role_id is not None:
            query += " AND r.role_id = %s"
            query_params.append(requester_role_id)

        if timestamp:
            try:
                datetime.strptime(timestamp, '%H:%M:%S')
            except ValueError:
                return jsonify({"error": "Invalid time format. Expected HH:MM:SS."}), 400
            query += " AND scr.timestamp = %s"
            query_params.append(timestamp)

        if status is not None:
            if status.lower() == 'pending' and employee_id is not None:
                query += " AND scr.status IN ('Pending', 'Awaiting Approval')"
            else:
                query += " AND scr.status = %s"
                query_params.append(status)

        # Last Query Line
        query += " ORDER BY scr.timestamp ASC;"

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

#  POST Shift_cover_request -----------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


def insert_scr(db, request):
    """
    Inserts a new record into the "shift_cover_request" table.
    """

    conn = None
    cursor = None
    try:
        # Define Required Fields
        required_fields = [
            'requested_employee_id', 'status', 'shift_id'
        ]

        # Define Expected Field Types
        field_types = {
            'requested_employee_id': int,
            'status': str,
            'shift_id': int,
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_body(
            request, field_types, required_fields)

        if error:
            return jsonify(error), 400

        # Extract Parameters
        requested_employee_id = fields['requested_employee_id']
        status = fields['status']
        shift_id = fields['shift_id']

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Execute Query
        cursor.execute("""
            INSERT INTO shift_cover_request 
            (requested_employee_id, status, shift_id)
            VALUES (%s, %s, %s);
        """, (requested_employee_id, status, shift_id))
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

# PATCH Shift_cover_request -----------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


def update_scr(db, request, cover_request_id):
    """
    Updates an existing shift_cover_request record (partial update).
    cover_request_id comes from the URL.
    Other fields (accepted_employee_id, requested_employee_id, timestamp, status, shift_id) are optional.
    """
    conn = None
    cursor = None
    try:
        # Define Expected Field Types
        field_types = {
            'accepted_employee_id': int,
            'timestamp': str,   # HH:MM or HH:MM:SS
            'status': str,
            'shift_id': int,
            'requested_employee_id': int,
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
        # WHERE parameter at the end -> WHERE cover_request_id = %s
        values.append(cover_request_id)

        conn = db
        cursor = conn.cursor(dictionary=True)

        query = f"""
            UPDATE shift_cover_request
            SET {set_clause}
            WHERE cover_request_id = %s;
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
# DELETE Shift_cover_request ----------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


def delete_scr(db, cover_request_id):
    """
    Permanently removes a shift_cover_request record from the database.
    """
    conn = None
    cursor = None
    try:
        conn = db
        cursor = conn.cursor()
        cursor.execute(
            "DELETE FROM shift_cover_request WHERE cover_request_id = %s",
            (cover_request_id,),
        )
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"status": "error", "message": "No shift cover request found with given ID"}), 404
        return jsonify({"status": "success", "deleted_rows": cursor.rowcount}), 200
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
# APPROVE Shift_cover_request ----------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


def approve_scr(db, cover_request_id):
    conn = db
    cursor = conn.cursor(dictionary=True)

    try:

        cursor.execute("""
            SELECT shift_id, accepted_employee_id
            FROM shift_cover_request
            WHERE cover_request_id = %s
        """, (cover_request_id,))

        row = cursor.fetchone()

        if not row:
            return jsonify({"error": "Request not found"}), 404

        shift_id = row["shift_id"]
        employee_id = row["accepted_employee_id"]

        if employee_id is None:
            return jsonify({"error": "No accepting employee set"}), 400

        cursor.execute("""
            UPDATE shift_cover_request
            SET status = 'Accepted'
            WHERE cover_request_id = %s
        """, (cover_request_id,))

        cursor.execute("""
            UPDATE shift
            SET employee_id = %s
            WHERE shift_id = %s
        """, (employee_id, shift_id))

        cursor.execute("""
            UPDATE shift_cover_request
            SET status = 'Denied'
            WHERE shift_id = %s
            AND cover_request_id != %s
            AND status IN ('Pending', 'Awaiting Approval')
        """, (shift_id, cover_request_id))

        conn.commit()

        return jsonify({"status": "success", "message": "Shift request approved"}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

    finally:
        cursor.close()

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------
