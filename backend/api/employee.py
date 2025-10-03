from flask import jsonify
import mysql.connector
import os
import request_helper

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
            'primary_role': str,
            'secondary_role': str,
            'tertiary_role': str
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
        primary_role = params.get('primary_role')
        secondary_role = params.get('secondary_role')
        tertiary_role = params.get('tertiary_role')

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Base Query
        query = """
            SELECT *
            FROM employee 
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

        if primary_role is not None:
            query += " AND primary_role = %s"
            query_params.append(primary_role)

        if secondary_role is not None:
            query += " AND secondary_role = %s"
            query_params.append(secondary_role)

        if tertiary_role is not None:
            query += " AND tertiary_role = %s"

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
            'phone_number': str, # 'XXX-XXX-XXXX'
            'wage': float,
            'admin': int,
            'primary_role': int, # role_id
            'secondary_role': int, # optional
            'tertiary_role': int # optional
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_body(request, field_types, required_fields)

        if error:
            return jsonify(error), 400

        # Extract Parameters
        first_name      = fields['first_name']
        last_name       = fields['last_name']
        email           = fields['email']
        phone_number    = fields['phone_number']
        wage            = fields['wage']
        admin           = fields['admin']
        primary_role    = fields['primary_role']
        secondary_role  = fields.get('secondary_role')  # optional
        tertiary_role   = fields.get('tertiary_role')   # optional

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
            'tertiary_role': int
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
        values.append(employee_id)  # WHERE parameter at the end -> WHERE employee_id = %s

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
