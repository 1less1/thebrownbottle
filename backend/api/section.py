from flask import jsonify
import mysql.connector
import os
import request_helper

# GET Sections ------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def get_sections(db, request):
    """
    Fetches section records based on optional URL query parameters.
    If no parameters are provided, returns all sections (equivalent to SELECT * FROM section).
    """
    conn = None
    cursor = None
    try:
        # Expected Parameter Types
        param_types = {
            'section_id': int,
            'section_name': str
        }

        # Validate and parse parameters
        params, error = request_helper.verify_params(request, param_types)
        if error:
            return jsonify(error), 400

        # Extract Parameters
        section_id = params.get('section_id')
        section_name = params.get('section_name')

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Base Query
        query = """
            SELECT
                section_id,
                section_name
            FROM section 
            WHERE 1 = 1
        """

        query_params = []

        # Build Dynamic Query 
        if section_id is not None:
            query += " AND section_id = %s"
            query_params.append(section_id)

        if section_name is not None:
            query += " AND section_name = %s"
            query_params.append(section_name)

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


#  POST Section -----------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def insert_section(db, request):
    """
    Inserts a new record into the "section" table.
    """
    conn = None
    cursor = None
    try:
        # Define Required Fields
        required_fields = [
            'section_name'
        ]

        # Define Expected Field Types
        field_types = {
            'section_name': str
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_body(request, field_types, required_fields)

        if error:
            return jsonify(error), 400

        # Extract Parameters
        section_name = fields['section_name']

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Execute Query
        cursor.execute("""
            INSERT INTO section 
            (section_name)
            VALUES (%s);
        """, (section_name,))
        
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


# PATCH Section -----------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def update_section(db, request, section_id):
    """
    Updates an existing section record (partial update).
    section_id comes from the URL.
    """
    conn = None
    cursor = None
    try:
        # Define Expected Field Types
        field_types = {
            'section_name': str
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
        values.append(section_id)  # WHERE parameter at the end -> WHERE section_id = %s

        conn = db
        cursor = conn.cursor(dictionary=True)

        query = f"""
            UPDATE section
            SET {set_clause}
            WHERE section_id = %s;
        """
        
        cursor.execute(query, tuple(values))
        conn.commit()
        rowcount = cursor.rowcount

        if rowcount == 0:
            return jsonify({"status": "error", "message": "No section found with given ID"}), 404

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