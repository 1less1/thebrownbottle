from flask import jsonify
import mysql.connector
import os
import request_helper

# GET Announcements -------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def get_announcements(db, request):
    """
    Fetches announcement records based on optional URL query parameters.
    If no parameters are provided, returns all announcements (equivalent to SELECT * FROM announcement).
    """
    conn = None
    cursor = None
    try:
        # Expected Parameter Types
        param_types = {
            'announcement_id': int,
            'author_id': int,
            'role_id': int,
            'title': str
        }

        # Validate and parse parameters
        params, error = request_helper.verify_params(request, param_types)
        if error:
            return jsonify(error), 400

        # Extract Parameters
        announcement_id = params.get('announcement_id')
        author_id = params.get('author_id')
        role_id = params.get('role_id')
        title = params.get('title')

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Base Query
        query = """
            SELECT 
                a.announcement_id,
                a.author_id,
                CONCAT(e.first_name, ' ', e.last_name) AS author,
                a.role_id,
                r.role_name,
                a.title,
                a.description,
                DATE_FORMAT(a.timestamp, '%Y-%m-%d %H:%i') AS timestamp
            FROM announcement a
            JOIN employee e ON a.author_id = e.employee_id
            JOIN role r ON a.role_id = r.role_id
            WHERE 1 = 1
        """

        query_params = []

        # Build Dynamic Query 
        if announcement_id is not None:
            query += " AND a.announcement_id = %s"
            query_params.append(announcement_id)

        if author_id is not None:
            query += " AND a.author_id = %s"
            query_params.append(author_id)

        if role_id is not None:
            query += " AND a.role_id = %s"
            query_params.append(role_id)

        if title is not None:
            query += " AND a.title = %s"
            query_params.append(title)

        # Last Query Line
        query += " AND a.timestamp >= NOW() - INTERVAL 14 DAY ORDER BY a.timestamp DESC;"

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


#  POST Announcement ------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def insert_announcement(db, request):
    """
    Inserts a new record into the "announcement" table.
    """
    conn = None
    cursor = None
    try:
        # Define Required Fields
        required_fields = [
            'author_id',
            'title',
            'description'
        ]

        # Define Expected Field Types
        field_types = {
            'author_id': int,
            'title': str,
            'description': str,
            'role_id': int  # Optional: defaults to 1 if not provided
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_body(request, field_types, required_fields)

        if error:
            return jsonify(error), 400

        # Extract Parameters
        author_id = fields['author_id']
        title = fields['title']
        description = fields['description']
        role_id = fields.get('role_id', 1)

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Execute Query
        cursor.execute("""
            INSERT INTO announcement 
            (author_id, title, description, role_id)
            VALUES (%s, %s, %s, %s);
        """, (author_id, title, description, role_id))
        
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


# PATCH Announcement ------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def update_announcement(db, request, announcement_id):
    """
    Updates an existing announcement record (partial update).
    announcement_id comes from the URL.
    """
    conn = None
    cursor = None
    try:
        # Define Expected Field Types
        field_types = {
            'author_id': int,
            'title': str,
            'description': str,
            'role_id': int
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
        values.append(announcement_id)  # WHERE parameter at the end -> WHERE announcement_id = %s

        conn = db
        cursor = conn.cursor(dictionary=True)

        query = f"""
            UPDATE announcement
            SET {set_clause}
            WHERE announcement_id = %s;
        """
        
        cursor.execute(query, tuple(values))
        conn.commit()
        rowcount = cursor.rowcount

        if rowcount == 0:
            return jsonify({"status": "error", "message": "No announcement found with given ID"}), 404

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

    

    
