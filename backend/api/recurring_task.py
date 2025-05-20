from flask import jsonify
import mysql.connector
import os
import request_helper

from datetime import datetime

# GET Requests for 'recurring_task' table ---------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

# Fetches all recurring tasks from 'recurring_task' table
def rt_get_all_recurring_tasks(db, request):
    try:

        conn = db
        cursor = conn.cursor(dictionary=True)

        # SQL Script - Selects all non-recurring tasks
        cursor.execute("""
            SELECT 
                rt.recurring_task_id,
                rt.title,
                rt.description,
                rt.author_id,
                CONCAT(e.first_name, ' ', e.last_name) AS author,
                rt.section_id,
                s.section_name,
                rt.mon,
                rt.tue,
                rt.wed,
                rt.thu,
                rt.fri,
                rt.sat,
                rt.sun,
                DATE_FORMAT(rt.start_date, '%m/%d/%Y') AS start_date,
                DATE_FORMAT(rt.end_date, '%m/%d/%Y') AS end_date,
                DATE_FORMAT(rt.timestamp, '%m/%d/%Y') AS date,
                DATE_FORMAT(rt.timestamp, '%H:%i') AS time
            FROM recurring_task rt
            JOIN employee e ON rt.author_id = e.employee_id
            JOIN section s ON rt.section_id = s.section_id
            ORDER BY rt.timestamp DESC;
        """)


        # Fetch the result
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify(result), 200


    except mysql.connector.Error as e:
        # Handle database-specific errors
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500


    except Exception as e:
        # Handle general errors
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500


# Fetches all recurring tasks by section from 'recurring_task' table
def rt_get_recurring_tasks_by_section(db, request):
    try:

        required_params = ['section_id']
        param_types = {'section_id': int}

        # Validate the parameters
        params, error = request_helper.verify_params(request, required_params, param_types)

        if error:
            return jsonify(error), 400
        
        # Extract validated params
        section_id = params['section_id']

        conn = db
        cursor = conn.cursor(dictionary=True)

        # SQL Script - Selects all non-recurring tasks
        cursor.execute("""
            SELECT 
                rt.recurring_task_id,
                rt.title,
                rt.description,
                rt.author_id,
                CONCAT(e.first_name, ' ', e.last_name) AS author,
                rt.section_id,
                s.section_name,
                rt.mon,
                rt.tue,
                rt.wed,
                rt.thu,
                rt.fri,
                rt.sat,
                rt.sun,
                DATE_FORMAT(rt.start_date, '%m/%d/%Y') AS start_date,
                DATE_FORMAT(rt.end_date, '%m/%d/%Y') AS end_date,
                DATE_FORMAT(rt.timestamp, '%m/%d/%Y') AS date,
                DATE_FORMAT(rt.timestamp, '%H:%i') AS time
            FROM recurring_task rt
            JOIN employee e ON rt.author_id = e.employee_id
            JOIN section s ON rt.section_id = s.section_id
            WHERE rt.section_id = %s
            ORDER BY rt.timestamp DESC;
        """, (section_id,))


        # Fetch the result
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify(result), 200


    except mysql.connector.Error as e:
        # Handle database-specific errors
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500


    except Exception as e:
        # Handle general errors
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
    

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------



# Edit (POST) Task Requests -----------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


# Allows user to edit a "recurring task's" details from 'recurring task' table
def edit_recurring_task(db, request):
    return


# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------