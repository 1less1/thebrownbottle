from flask import jsonify
import mysql.connector
import os
import request_helper
from typing import List

# GET Employees -----------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


def get_employees(db, request):
    """
    Fetches employee records based on optional URL query parameters.
    If no parameters are provided, returns all employees (equivalent to SELECT * FROM employee).
    """
    conn = None
    cursor = None
    try:
        # Expected Parameter Types
        param_types = {
            'employee_id': int,
            'first_name': str,
            'last_name': str,
            'email': str,
            'phone_number': str,
            'wage': float,
            'admin': int,
            # Used for filtering all 3 role designations below
            'role_id': List[int],
            'primary_role': int,
            'secondary_role': int,
            'tertiary_role': int,
            'full_name': str,
            'is_active': int,
        }

        # Validate and parse parameters
        params, error = request_helper.verify_params(request, param_types)
        if error:
            return jsonify(error), 400

        # Extract Parameters
        employee_id = params.get('employee_id')
        first_name = params.get('first_name')
        last_name = params.get('last_name')
        email = params.get('email')
        phone_number = params.get('phone_number')
        wage = params.get('wage')
        admin = params.get('admin')
        role_ids = params.get('role_id')
        primary_role = params.get('primary_role')
        secondary_role = params.get('secondary_role')
        tertiary_role = params.get('tertiary_role')
        full_name = params.get('full_name')
        is_active = params.get('is_active')

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Base Query
        query = """
            SELECT 
                e.employee_id,
                e.first_name,
                e.last_name,
                CONCAT(e.first_name, ' ', e.last_name) AS full_name,
                e.email,
                e.phone_number,
                e.wage,
                e.admin,
                e.primary_role,
                pr.role_name AS primary_role_name,
                e.secondary_role,
                sr.role_name AS secondary_role_name,
                e.tertiary_role,
                tr.role_name AS tertiary_role_name,
                e.is_active,
                DATE_FORMAT(e.timestamp, '%Y-%m-%d %H:%i') AS timestamp
            FROM employee e
            LEFT JOIN role pr ON e.primary_role = pr.role_id
            LEFT JOIN role sr ON e.secondary_role = sr.role_id
            LEFT JOIN role tr ON e.tertiary_role = tr.role_id
            WHERE 1 = 1
        """

        query_params = []

        # Build Dynamic Query
        if employee_id is not None:
            query += " AND employee_id = %s"
            query_params.append(employee_id)

        if first_name is not None:
            query += " AND first_name = %s"
            query_params.append(first_name)

        if last_name is not None:
            query += " AND last_name = %s"
            query_params.append(last_name)

        if full_name is not None:
            query += " AND CONCAT(e.first_name, ' ', e.last_name) COLLATE utf8_general_ci LIKE %s"
            query_params.append(f"%{full_name}%")

        if email is not None:
            query += " AND email = %s"
            query_params.append(email)

        if phone_number is not None:
            query += " AND phone_number = %s"
            query_params.append(phone_number)

        if wage is not None:
            query += " AND wage = %s"
            query_params.append(wage)

        if admin is not None:
            query += " AND admin = %s"
            query_params.append(admin)

        if is_active is not None:
            query += " AND is_active = %s"
            query_params.append(is_active)

        # Handle multiple Role Clauses
        role_clauses = []
        role_values = []

        # If a list of role_ids is provided, apply to all 3 role columns
        if role_ids and len(role_ids) > 0:
            placeholders = ','.join(['%s'] * len(role_ids))
            role_clauses.append(f"primary_role IN ({placeholders})")
            role_clauses.append(f"secondary_role IN ({placeholders})")
            role_clauses.append(f"tertiary_role IN ({placeholders})")
            # Add values 3 times (once for each column)
            role_values.extend(role_ids)
            role_values.extend(role_ids)
            role_values.extend(role_ids)

        # Individual role filters (optional, if user passes them directly)
        if primary_role is not None:
            role_clauses.append("primary_role = %s")
            role_values.append(primary_role)

        if secondary_role is not None:
            role_clauses.append("secondary_role = %s")
            role_values.append(secondary_role)

        if tertiary_role is not None:
            role_clauses.append("tertiary_role = %s")
            role_values.append(tertiary_role)

        if role_clauses:
            query += " AND (" + " OR ".join(role_clauses) + ")"
            query_params.extend(role_values)

        # Last Query Line
        if role_ids and len(role_ids) > 0:
            query += " ORDER BY e.primary_role ASC, e.last_name ASC;"
        else:
            query += " ORDER BY e.last_name ASC;"

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


#  POST Employee ----------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def insert_employee(db, request):
    """
    Inserts a new record into the "employee" table.
    """
    conn = None
    cursor = None
    try:
        # Define Required Fields
        required_fields = [
            'first_name', 'last_name', 'email', 'phone_number',
            'wage', 'admin', 'primary_role'
        ]

        # Define Expected Field Types
        field_types = {
            'first_name': str,
            'last_name': str,
            'email': str,
            'phone_number': str,  # 'XXX-XXX-XXXX'
            'wage': float,
            'admin': int,
            'primary_role': int,  # role_id
            'secondary_role': int,  # optional
            'tertiary_role': int  # optional
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_body(
            request, field_types, required_fields)

        if error:
            return jsonify(error), 400

        # Extract Parameters
        first_name = fields['first_name']
        last_name = fields['last_name']
        email = fields['email']
        phone_number = fields['phone_number']
        wage = fields['wage']
        admin = fields['admin']
        primary_role = fields['primary_role']
        secondary_role = fields.get('secondary_role')  # optional
        tertiary_role = fields.get('tertiary_role')   # optional

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Execute Query
        cursor.execute("""
            INSERT INTO employee (
                first_name,
                last_name,
                email,
                phone_number,
                wage,
                admin,
                primary_role,
                secondary_role,
                tertiary_role
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
        """, (
            first_name, last_name, email, phone_number,
            wage, admin, primary_role, secondary_role, tertiary_role
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


# PATCH Employee ----------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def update_employee(db, request, employee_id):
    """
    Updates an existing employee_id record (partial update).
    employee_id comes from the URL.
    """
    conn = None
    cursor = None
    try:
        # Define Expected Field Types
        field_types = {
            'first_name': str,
            'last_name': str,
            'email': str,
            'phone_number': str,
            'wage': float,
            'admin': int,
            'primary_role': int,
            'secondary_role': int,
            'tertiary_role': int,
            'is_active': int
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
        # WHERE parameter at the end -> WHERE employee_id = %s
        values.append(employee_id)

        conn = db
        cursor = conn.cursor(dictionary=True)

        query = f"""
            UPDATE employee
            SET {set_clause}
            WHERE employee_id = %s;
        """

        cursor.execute(query, tuple(values))
        conn.commit()
        rowcount = cursor.rowcount

        if rowcount == 0:
            return jsonify({"status": "error", "message": "No employee found with given ID"}), 404

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
