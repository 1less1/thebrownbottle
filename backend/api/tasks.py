from flask import jsonify
import mysql.connector
import os

# Inserts a new record into the "tasks" table
def insert_task(db, request):
    
    try:
        conn = db
        data = request.get_json()

        # Ensure required fields are present - if not, return a HTTP 400 error code
        if not all(key in data for key in ['title', 'description', 'author_id', 'assignee_id', 'due_date', 'complete']):
            return jsonify({"status": "error", "message": "Missing required fields"}), 400

        title = data['title']
        description = data['description']
        author_id = data['author_id']
        assignee_id = data['assignee_id']
        due_date = data['due_date']
        complete = data.get('complete', 0)

        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO tasks (title, description, author_id, assignee_id, due_date, complete)
            VALUES (%s, %s, %s, %s, %s, %s);
        """, (title, description, author_id, assignee_id, due_date, complete))

        # Fetch the result
        result = cursor.fetchall()

        conn.commit()
        cursor.close()
        conn.close()
        
        # Return the results in a structured response
        return jsonify({"status": "success", "data": result}), 200

    except mysql.connector.Error as e:
        # Handle database-specific errors
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500


    except Exception as e:
        # Handle general errors
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
    


# Get tasks assigned to a specific user (assignee_id included in GET request)
def get_user_tasks(db, request):

    try:
        # Retrieve assignee_id from URL query parameters
        assignee_id = request.args.get('assignee_id')

        # Ensure assignee_id is present
        if not assignee_id:
            return jsonify({"status": "error", "message": "Missing required fields: assignee_id"}), 400

        conn = db
        cursor = conn.cursor()

        cursor.execute("""
            SELECT * FROM tasks WHERE assignee_id = %s
        """, (assignee_id,))

        # Fetch the result
        result = cursor.fetchall()

        #conn.commit()
        cursor.close()
        conn.close()

        # Return the results in a structured response
        return jsonify({"status": "success", "data": result}), 200

    except mysql.connector.Error as e:
        # Handle database-specific errors
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500

    except Exception as e:
        # Handle general errors
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
