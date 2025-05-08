from flask import jsonify
import mysql.connector
import os
import request_helper

def insert_announcement(db, request):
    try:
        required_fields = ['title', 'description', 'author_id']
        field_types = {
            'title': str,
            'description': str,
            'author_id': int,
            'role_id': int # role_id is optional since it is NOT included in required_fields list
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_fields(request, required_fields, field_types)

        if error:
            return jsonify(error), 400
        
        title = fields['title']
        description = fields['description']
        author_id = fields['author_id']
        role_id = fields.get('role_id')  # Will be None if not provided

        conn = db
        cursor = conn.cursor()

        if role_id is not None: # Handles case WITH assigned role for the announcement
            cursor.execute("""
                INSERT INTO announcement (title, description, author_id, role_id)
                VALUES (%s, %s, %s, %s);
            """, (title, description, author_id, role_id))
        else: # Handles case WITHOUT assigned role for the 
            cursor.execute("""
                INSERT INTO announcement (title, description, author_id)
                VALUES (%s, %s, %s);
            """, (title, description, author_id))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"status": "success"}), 200
    
    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
    

def get_user_announcements(db, request):
    try:

        required_params = ['author_id']
        param_types = {'author_id': int}

        # Validate the parameters
        params, error = request_helper.verify_params(request, required_params, param_types)

        if error:
            return jsonify(error), 400
        
        # Extract validated params
        employee_id = params['author_id']

        conn = db
        cursor = conn.cursor()

        # SQL Script - %s are placeholders for variables
        cursor.execute("""
            SELECT * FROM announcement WHERE author_id = %s;
        """, (employee_id, ))

        # Fetch the result
        columns = [col[0] for col in cursor.description]
        result = cursor.fetchall()

        cursor.close()
        conn.close()
        
        # Format data to be entries with "column_name": value
        data = [dict(zip(columns, row)) for row in result]
        
        return jsonify(data), 200


    except mysql.connector.Error as e:
        # Handle database-specific errors
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500


    except Exception as e:
        # Handle general errors
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
    

def get_all_announcements(db, request):
    try:

        conn = db
        cursor = conn.cursor()

        # SQL Script - Selects announcements from the last 14 days (2 weeks)
        cursor.execute("""
            SELECT 
                a.announcement_id,
                a.author_id,
                CONCAT(e.first_name, ' ', e.last_name) AS author,
                a.role_id,
                r.role_name,
                a.title,
                a.description,
                DATE_FORMAT(a.timestamp, '%m/%d/%Y') AS date,
                DATE_FORMAT(a.timestamp, '%H:%i') AS time
            FROM announcement a
            JOIN employee e ON a.author_id = e.employee_id
            JOIN role r ON a.role_id = r.role_id
            WHERE a.timestamp >= NOW() - INTERVAL 14 DAY
            ORDER BY a.timestamp DESC;
        """)

        # Fetch the result
        columns = [col[0] for col in cursor.description]
        result = cursor.fetchall()

        cursor.close()
        conn.close()
        
        # Format data to be entries with "column_name": value
        data = [dict(zip(columns, row)) for row in result]
        
        return jsonify(data), 200


    except mysql.connector.Error as e:
        # Handle database-specific errors
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500


    except Exception as e:
        # Handle general errors
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
    

    

    
