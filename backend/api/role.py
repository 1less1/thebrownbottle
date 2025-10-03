from flask import jsonify
import mysql.connector
import os
import request_helper

# GET Roles ---------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def get_roles(db, request):
    """
    Fetches role records based on optional URL query parameters.
    If no parameters are provided, returns all roles (equivalent to SELECT * FROM role).
    """
    conn = None
    cursor = None
    try:
        # Expected Parameter Types
        param_types = {
            'role_id': int,
            'role_name': str
        }

        # Validate and parse parameters
        params, error = request_helper.verify_params(request, param_types)
        if error:
            return jsonify(error), 400

        # Extract Parameters
        role_id = params.get('role_id')
        role_name = params.get('role_name')

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Base Query
        query = """
            SELECT
                role_id,
                role_name
            FROM role 
            WHERE 1 = 1
        """

        query_params = []

        # Build Dynamic Query 
        if role_id is not None:
            query += " AND role_id = %s"
            query_params.append(role_id)

        if role_name is not None:
            query += " AND role_name = %s"
            query_params.append(role_name)

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


#  POST Role --------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def insert_role(db, request):
    """
    Inserts a new record into the "role" table.
    """
    conn = None
    cursor = None
    try:
        # Define Required Fields
        required_fields = [
            'role_name'
        ]

        # Define Expected Field Types
        field_types = {
            'role_name': str
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_body(request, field_types, required_fields)

        if error:
            return jsonify(error), 400

        # Extract Parameters
        role_name = fields['role_name']

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Execute Query
        cursor.execute("""
            INSERT INTO role 
            (role_name)
            VALUES (%s);
        """, (role_name,))
        
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


# PATCH Role --------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def update_role(db, request, role_id):
    """
    Updates an existing role record (partial update).
    role_id comes from the URL.
    """
    conn = None
    cursor = None
    try:
        # Define Expected Field Types
        field_types = {
            'role_name': str
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
        values.append(role_id)  # WHERE parameter at the end -> WHERE role_id = %s

        conn = db
        cursor = conn.cursor(dictionary=True)

        query = f"""
            UPDATE role
            SET {set_clause}
            WHERE role_id = %s;
        """
        
        cursor.execute(query, tuple(values))
        conn.commit()
        rowcount = cursor.rowcount

        if rowcount == 0:
            return jsonify({"status": "error", "message": "No role found with given ID"}), 404

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