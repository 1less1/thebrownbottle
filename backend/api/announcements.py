from flask import jsonify
import mysql.connector
import os
import request_helper

from datetime import datetime

def insert_announcement (db, request):
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
            INSERT INTO announcements (title, description, employee_id)
            VALUES (%s, %s, %s);
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
    

    
