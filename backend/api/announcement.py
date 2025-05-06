from flask import jsonify
import mysql.connector
import os
import request_helper

def insert_announcement(db, request):
    try:
        required_fields = ['title', 'description', 'employee_id']
        field_types = {
            'title': str,
            'description': str,
            'employee_id': int
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_fields(request, required_fields, field_types)

        if error:
            return jsonify(error), 400
        
        title = fields['title']
        description = fields['description']
        employee_id = fields['employee_id']

        conn = db
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO announcement (title, description, employee_id, timestamp)
            VALUES (%s, %s, %s, NOW());
        """, (title, description, employee_id))

        result = cursor.fetchall()

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"status": "success", "data": result}), 200
    
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

        result = cursor.fetchall()

        conn.commit()
        cursor.close()
        conn.close()


        return jsonify({"status": "success", "data": result}), 200


    except mysql.connector.Error as e:
        # Handle database-specific errors
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500


    except Exception as e:
        # Handle general errors
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
    

    
