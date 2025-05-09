from flask import jsonify
import mysql.connector
import os
import request_helper

from datetime import datetime

# Inserts a new record into the "task" table
def insert_task(db, request):
    
    try:
        required_fields = ['title', 'description', 'author_id', 'section_id', 'due_date',]
        field_types = {
            'title': str,
            'description': str,
            'author_id': int,
            'section_id': int,
            'due_date': str,
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_fields(request, required_fields, field_types)

        if error:
            return jsonify(error), 400

        title = fields['title']
        description = fields['description']
        author_id = fields['author_id']
        section_id = fields['section_id']
        due_date = fields['due_date']

        conn = db
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO task (title, description, author_id, section_id, due_date)
            VALUES (%s, %s, %s, %s, %s);
        """, (title, description, author_id, section_id, due_date))

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
    

def get_role_tasks(db, request):
    return
