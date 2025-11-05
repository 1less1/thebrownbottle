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
            'primary_role': int,
            'secondary_role': int,
            'tertiary_role': int,
            'section_id': int,
            'date': str,
            'start_date': str,
            'end_date': str,
            'full_name': str,
            'is_today': int
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
        full_name = params.get('full_name')
        is_today = params.get('is_today')

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
                CONCAT(e.first_name, ' ', e.last_name) AS full_name,
                TIME_FORMAT(sh.start_time, '%h:%i %p') AS start_time,
                TIME_FORMAT(sh.end_time, '%h:%i %p') AS end_time,
                DATE_FORMAT(sh.date, '%Y-%m-%d') AS date,
                sh.timestamp
            FROM shift sh
            JOIN employee e ON sh.employee_id = e.employee_id
            LEFT JOIN role pr ON e.primary_role = pr.role_id
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

        if full_name is not None:
            query += " AND CONCAT(e.first_name, ' ', e.last_name) COLLATE utf8_general_ci LIKE %s"
            query_params.append(f"%{full_name}%")

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

        # If filtering by today's date, skip all date logic
        if is_today in (1, True, "1"):
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
        cursor.execute("SELECT shift_id FROM shift WHERE shift_id = %s", (shift_id,))
        result = cursor.fetchone()
        
        if not result:
            return jsonify({"status": "error", "message": "Shift not found"}), 404

        # Delete the shift
        cursor.execute("DELETE FROM shift WHERE shift_id = %s", (shift_id,))
        conn.commit()

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

# GET Shedule Data --------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------
def get_schedule_data(db, request):
    """
    Fetches shifts with employee and section info for schedule display
    Supports filtering by section_id, role_id, date range
    
    NEW: Supports include_all_employees parameter to show all employees with LEFT JOIN
    """
    conn = None
    cursor = None
    try:
        # 1. PARAMETER VALIDATION
        param_types = {
            'start_date': str,              # Format: '2025-10-14'
            'end_date': str,                # Format: '2025-10-20'
            'section_id': int,              # Filter by specific section
            'role_id': int,                 # Filter by employee's primary role
            'employee_name': str,           # Wildcard search for employee name
            'include_all_employees': str    # NEW: 'true' or 'false'
        }

        # Validate parameters
        params, error = request_helper.verify_params(request, param_types)
        if error:
            return jsonify(error), 400

        # Extract parameters
        start_date = params.get('start_date')
        end_date = params.get('end_date')
        section_id = params.get('section_id')
        role_id = params.get('role_id')
        employee_name = params.get('employee_name')
        include_all = params.get('include_all_employees', 'false').lower() == 'true'

        # 2. DATABASE CONNECTION
        conn = db
        cursor = conn.cursor(dictionary=True)

        # 3. BUILD THE SQL QUERY BASED ON include_all_employees
        if include_all:
            # LEFT JOIN - Returns ALL employees, with NULL for shifts if they don't have any
            query = """
                SELECT 
                    e.employee_id,
                    CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
                    e.primary_role,
                    r.role_name as primary_role_name,
                    s.shift_id,
                    TIME_FORMAT(s.start_time, '%H:%i') AS start_time,
                    TIME_FORMAT(s.end_time, '%H:%i') AS end_time,
                    DATE_FORMAT(s.date, '%Y-%m-%d') AS date,
                    s.section_id,
                    sec.section_name
                FROM employee e
                INNER JOIN role r ON e.primary_role = r.role_id
                LEFT JOIN shift s ON e.employee_id = s.employee_id
            """
            
            # Add date range condition to LEFT JOIN if provided
            if start_date and end_date:
                query = """
                    SELECT 
                        e.employee_id,
                        CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
                        e.primary_role,
                        r.role_name as primary_role_name,
                        s.shift_id,
                        TIME_FORMAT(s.start_time, '%H:%i') AS start_time,
                        TIME_FORMAT(s.end_time, '%H:%i') AS end_time,
                        DATE_FORMAT(s.date, '%Y-%m-%d') AS date,
                        s.section_id,
                        sec.section_name
                    FROM employee e
                    INNER JOIN role r ON e.primary_role = r.role_id
                    LEFT JOIN shift s ON e.employee_id = s.employee_id 
                        AND s.date >= %s AND s.date <= %s
                """
            
            query += " LEFT JOIN section sec ON s.section_id = sec.section_id WHERE 1=1"
            
        else:
            # INNER JOIN - Returns only employees with shifts (original behavior)
            query = """
                SELECT 
                    s.shift_id,
                    s.employee_id,
                    TIME_FORMAT(s.start_time, '%H:%i') AS start_time,
                    TIME_FORMAT(s.end_time, '%H:%i') AS end_time,
                    DATE_FORMAT(s.date, '%Y-%m-%d') AS date,
                    s.section_id,
                    CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
                    e.primary_role,
                    sec.section_name,
                    r.role_name as primary_role_name
                FROM shift s
                INNER JOIN employee e ON s.employee_id = e.employee_id
                INNER JOIN section sec ON s.section_id = sec.section_id
                INNER JOIN role r ON e.primary_role = r.role_id
                WHERE 1=1
            """

        query_params = []

        # 4. ADD DYNAMIC FILTERS
        # Date range filter (only for INNER JOIN mode, already in LEFT JOIN condition)
        if not include_all:
            if start_date:
                query += " AND s.date >= %s"
                query_params.append(start_date)

            if end_date:
                query += " AND s.date <= %s"
                query_params.append(end_date)
        else:
            # For LEFT JOIN, dates are in the JOIN condition, just add to params
            if start_date and end_date:
                query_params.extend([start_date, end_date])

        # Section filter (only filter shifts, not employees)
        if section_id is not None:
            if include_all:
                # For LEFT JOIN, allow employees without shifts in this section
                query += " AND (s.section_id = %s OR s.section_id IS NULL)"
            else:
                query += " AND s.section_id = %s"
            query_params.append(section_id)

        # Role filter (filter employees by role)
        if role_id is not None:
            query += " AND e.primary_role = %s"
            query_params.append(role_id)

        # Employee name search (wildcard)
        if employee_name:
            query += " AND CONCAT(e.first_name, ' ', e.last_name) LIKE %s"
            query_params.append(employee_name)

        # Order by employee name and date
        query += " ORDER BY e.last_name ASC, e.first_name ASC, s.date ASC;"

        # 5. EXECUTE QUERY
        cursor.execute(query, tuple(query_params))
        result = cursor.fetchall()

        # 6. RETURN RESULTS
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