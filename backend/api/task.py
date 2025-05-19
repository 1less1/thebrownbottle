from flask import jsonify
import mysql.connector
import os
import request_helper

from datetime import datetime

# Insert New Task Logic ---------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

# Inserts a new record into the "task" table
def insert_task(db, request):
    
    try:
        required_fields = ['title', 'description', 'author_id', 'section_id', 'due_date']
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

        result = {"inserted_id": cursor.lastrowid}

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"status": "success", "row id": result}), 200

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500



# Inserts a new record into the "recurring_task" table
def insert_recurring_task(db, request):
    
    try:
        required_fields = ['title', 'description', 'author_id', 'section_id', 'start_date']
        field_types = {
            'title': str,
            'description': str,
            'author_id': int,
            'section_id': int,
            'recurrence_day': str,
            'start_date': str,
            'end_date': str,  # Optional
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_fields(request, required_fields, field_types)

        if error:
            return jsonify(error), 400

        title = fields['title']
        description = fields['description']
        author_id = fields['author_id']
        section_id = fields['section_id']
        recurrence_day = fields['recurrence_day']
        start_date = fields['start_date']
        end_date = fields.get('end_date')
        if end_date in (None, '', 'none', 'None'):
            end_date = None

        conn = db
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO recurring_task 
            (title, description, author_id, section_id, recurrence_day, start_date, end_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s);
        """, (title, description, author_id, section_id, recurrence_day, start_date, end_date))
            

        result = {"inserted_id": cursor.lastrowid}
        conn.commit()
        cursor.close()

        # Call the Stored Procedure
        proc_cursor = conn.cursor()
        proc_cursor.callproc("insert_recurring_tasks")
        conn.commit()
        proc_cursor.close()
        
        conn.close()

        return jsonify({"status": "success", "row id": result}), 200

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
    

# Handles incoming task POST request
# If the request is a recurring task, insert into the 'recurring_task' table
# If the request is not recurring, insert immediately into the 'task' table
def handle_new_task(db, request):

    if request.is_json:
        data = request.get_json()
        recurrence_day = data.get("recurrence_day")
    else:
        return jsonify({"status": "error", "message": "Invalid or missing JSON body"}), 400
    

    if recurrence_day:
        return insert_recurring_task(db, request)
    else:
        return insert_task(db, request)
    
# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------




def get_role_tasks(db, request):
    return
