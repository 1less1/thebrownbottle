from flask import jsonify
import mysql.connector
import os
import request_helper
from datetime import datetime
from typing import List

# GET Shift Cover Request -------------------------------------------------------------------------------
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
            'employee_id': int,  # Filter all requests either requested by or accepted by the provided employee_id parameter
            'requested_primary_role': int,
            'requested_secondary_role': int,
            'requested_tertiary_role': int,
            'status': List[str],
            'date_sort': str, # "Newest" or "Oldest" - Sorts by date in relation to the current day
            'timestamp_sort' : str # "Newest" or "Oldest" - Sorts by timestamp
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
        requested_primary_role = params.get('requested_primary_role') 
        requested_secondary_role = params.get('requested_secondary_role')
        requested_tertiary_role = params.get('requested_tertiary_role')
        statuses = params.get('status', []) # List of statuses
        date_sort = params.get ("date_sort")
        timestamp_sort = params.get ("timestamp_sort")

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
                requester.primary_role AS requested_primary_role,

                accepter.first_name AS accepted_first_name,
                accepter.last_name AS accepted_last_name,
                accepter.primary_role AS accepted_primary_role,

                requester_role.role_name AS requested_primary_role_name,
                accepter_role.role_name AS accepted_primary_role_name,

                sec.section_id AS section_id,
                sec.section_name AS section_name,

                DATE_FORMAT(s.date, '%Y-%m-%d') AS shift_date,
                TIME_FORMAT(s.start_time, '%h:%i %p') AS shift_start,

                DATE_FORMAT(scr.timestamp, '%Y-%m-%d %H:%i') AS timestamp,
                scr.status
            FROM shift_cover_request scr
            JOIN employee requester ON scr.requested_employee_id = requester.employee_id
            LEFT JOIN employee accepter ON scr.accepted_employee_id = accepter.employee_id
            JOIN shift s ON scr.shift_id = s.shift_id
            JOIN role requester_role ON requester.primary_role = requester_role.role_id -- Updated JOIN for requester role
            LEFT JOIN role accepter_role ON accepter.primary_role = accepter_role.role_id -- New: JOIN for accepter role
            JOIN section sec ON s.section_id = sec.section_id
            WHERE 1 = 1
        """

        query_params = []

        # -----------------------------
        # Build Dynamic Query
        # -----------------------------
        if statuses and len(statuses) > 0:
            placeholders = ','.join(['%s'] * len(statuses))
            query += f" AND scr.status IN ({placeholders})"
            query_params.extend(statuses)

        if cover_request_id is not None:
            query += " AND scr.cover_request_id = %s"
            query_params.append(cover_request_id)

        if shift_id is not None:
            query += " AND scr.shift_id = %s"
            query_params.append(shift_id)

        # Employee ID filter logic
        if employee_id is not None:
            # If employee_id is provided, ignore accepted_employee_id and requested_employee_id
            query += " AND (scr.requested_employee_id = %s OR scr.accepted_employee_id = %s)"
            query_params.extend([employee_id, employee_id])
        else:
            # Otherwise, allow filtering by accepted_employee_id and/or requested_employee_id
            if accepted_employee_id is not None:
                query += " AND scr.accepted_employee_id = %s"
                query_params.append(accepted_employee_id)

            if requested_employee_id is not None:
                query += " AND scr.requested_employee_id = %s"
                query_params.append(requested_employee_id)


        # Handle multiple Role Clauses
        role_clauses = []
        role_values = []

        if requested_primary_role is not None:
            role_clauses.append("requester.primary_role = %s")
            role_values.append(requested_primary_role)

        if requested_secondary_role is not None:
            role_clauses.append("requester.secondary_role = %s")
            role_values.append(requested_secondary_role)

        if requested_tertiary_role is not None:
            role_clauses.append("requester.tertiary_role = %s")
            role_values.append(requested_tertiary_role)

        if role_clauses:
            query += " AND (" + " OR ".join(role_clauses) + ")"
            query_params.extend(role_values)

        # -----------------------------
        # Time Sorting Logic
        # -----------------------------
        order_clauses = []

        # AGE SORTING FIRST
        if date_sort == "Newest":
            order_clauses.append("s.date DESC")
        elif date_sort == "Oldest":
            order_clauses.append("s.date ASC")
        
        # TIMESTAMP SORTING SECOND
        if timestamp_sort == "Newest":
            order_clauses.append("scr.timestamp DESC")
        elif timestamp_sort == "Oldest":
            order_clauses.append("scr.timestamp ASC")

        # Default fallback
        if not order_clauses:
            order_clauses.append("s.date DESC")

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

#  POST Shift Cover Request -----------------------------------------------------------------------------
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
            'requested_employee_id', 'shift_id'
        ]

        # Define Expected Field Types
        field_types = {
            'requested_employee_id': int,
            'shift_id': int,
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_body(
            request, field_types, required_fields)

        if error:
            return jsonify(error), 400

        # Extract Parameters
        requested_employee_id = fields['requested_employee_id']
        shift_id = fields['shift_id']

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Execute Query
        cursor.execute("""
            INSERT INTO shift_cover_request 
            (requested_employee_id, shift_id)
            VALUES (%s, %s);
        """, (requested_employee_id, shift_id))

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

# PATCH Shift Cover Request -----------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


def update_scr(db, request, cover_request_id):
    """
    Updates an existing shift_cover_request record (partial update).
    cover_request_id comes from the URL.
    Other fields (accepted_employee_id, shift_id, status) are optional.
    """
    conn = None
    cursor = None
    try:
        # Define Expected Field Types
        field_types = {
            'accepted_employee_id': int,
            'shift_id': int,
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
        values.append(cover_request_id) # WHERE parameter at the end -> WHERE cover_request_id = %s

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
# -------------------------------------------------------------------------------------------------------

# DELETE Shift Cover Request ----------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def delete_scr(db, cover_request_id):
    """
    Deletes a shift_cover_request record by cover_request_id.
    """
    conn = None
    cursor = None
    try:
        conn = db
        cursor = conn.cursor(dictionary=True)

        # Check if shift cover request exists
        cursor.execute(
            "SELECT cover_request_id FROM shift_cover_request WHERE cover_request_id = %s",
            (cover_request_id,)
        )
        result = cursor.fetchone()

        if not result:
            return jsonify({"status": "error", "message": "Shift cover request not found"}), 404

        # Delete the shift cover request
        cursor.execute(
            "DELETE FROM shift_cover_request WHERE cover_request_id = %s",
            (cover_request_id,)
        )
        conn.commit()

        return jsonify({"status": "success", "message": "Shift cover request deleted"}), 200

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

# APPROVE Shift Cover Request ---------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


def approve_scr(db, cover_request_id):
    conn = db
    cursor = conn.cursor(dictionary=True)

    try:

        # Get shift cover request from API URL
        cursor.execute("""
            SELECT shift_id, accepted_employee_id
            FROM shift_cover_request
            WHERE cover_request_id = %s
        """, (cover_request_id,))

        row = cursor.fetchone()

        if not row:
            return jsonify({"error": "Shift cover request not found"}), 404

        shift_id = row["shift_id"]
        accepted_employee_id = row["accepted_employee_id"]

        # Update the shift cover request status to "Accepted"
        cursor.execute("""
            UPDATE shift_cover_request
            SET status = 'Accepted'
            WHERE cover_request_id = %s
        """, (cover_request_id,))

        # Update the target shift with the NEW accepted_employee_id
        cursor.execute("""
            UPDATE shift
            SET employee_id = %s
            WHERE shift_id = %s
        """, (accepted_employee_id, shift_id))


        cursor.execute("""
            UPDATE shift_cover_request
            SET status = 'Denied'
            WHERE shift_id = %s
            AND cover_request_id != %s
            AND status = 'Pending'
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
