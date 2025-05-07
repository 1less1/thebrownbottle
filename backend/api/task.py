from flask import jsonify
import mysql.connector
import os
import request_helper

from datetime import datetime

# Inserts a new record into the "task" table
def insert_task(db, request):
    try:
        required_fields = ['title', 'description', 'author_id', 'assignee_id', 'due_date',]
        field_types = {
            'title': str,
            'description': str,
            'author_id': int,
            'assignee_id': int,
            'due_date': str,
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_fields(request, required_fields, field_types)

        if error:
            return jsonify(error), 400

        title = fields['title']
        description = fields['description']
        author_id = fields['author_id']
        assignee_id = fields['assignee_id']
        due_date = fields['due_date']

        conn = db
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO task (title, description, author_id, assignee_id, due_date)
            VALUES (%s, %s, %s, %s, %s, %s);
        """, (title, description, author_id, assignee_id, due_date))

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
    


# GET tasks assigned to a specific user (assignee_id included in GET request)
def get_user_tasks(db, request):
    try:
        required_params = ['assignee_id']
        param_types = {'assignee_id': int}

        # Validate the query parameters
        params, error = request_helper.verify_params(request, required_params, param_types)

        if error:
            return jsonify(error), 400

        assignee_id = params['assignee_id']

        conn = db
        cursor = conn.cursor()

        cursor.execute("""
            SELECT 
                task_id, 
                title, 
                description, 
                author_id, 
                assignee_id, 
                DATE_FORMAT(due_date, '%Y-%m-%d') as due_date, 
                complete 
            FROM task 
            WHERE assignee_id = %s
        """, (assignee_id,))

        columns = [col[0] for col in cursor.description]
        result = cursor.fetchall()

        cursor.close()
        conn.close()
        
        # Format data to be entries with "column_name": value
        data = [dict(zip(columns, row)) for row in result]
        
        return jsonify(data), 200

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
