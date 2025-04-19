from flask import jsonify
import mysql.connector
import os

# Inserts a new record into the "tasks" table
def insert_task(db, request):
    
    try:
        conn = db
        data = request.get_json()

        # Ensure required fields are presentc - if not, return a HTTP 400 error code
        if not all(key in data for key in ['title', 'description', 'author_id', 'assignee_id', 'due_date']):
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
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (title, description, author_id, assignee_id, due_date, complete))

        task_id = cursor.lastrowid

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"status": "success", "message": "Task inserted", "task_id": task_id})

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An error occurred"}), 500


# Gets All Tasks from the task table (for now!!!)
def get_tasks(db):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM tasks;")
    results = cursor.fetchall()
    cursor.close()
    return jsonify(results)