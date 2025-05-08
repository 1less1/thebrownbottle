from flask import jsonify
import mysql.connector
import os
import request_helper


def get_user_shifts(db, request):
    try:

        required_params = ['employee_id']
        param_types = {'employee_id': int}

        # Validate the parameters
        params, error = request_helper.verify_params(request, required_params, param_types)

        if error:
            return jsonify(error), 400
        
        # Extract validated params
        employee_id = params['employee_id']

        conn = db
        cursor = conn.cursor()

        # SQL Script - %s are placeholders for variables
        cursor.execute("""
            SELECT 
                s.shift_id,
                s.employee_id,
                DATE_FORMAT(s.date, '%m/%d/%Y') AS date, 
                CAST(TIME_FORMAT(s.start_time, '%H:%i') AS CHAR) AS start_time,
                CAST(TIME_FORMAT(s.end_time, '%H:%i') AS CHAR) AS end_time,
                sec.section_name
            FROM shift s
            JOIN section sec ON s.section_id = sec.section_id
            WHERE s.employee_id = %s;
        """, (employee_id,))

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
    

def insert_shifts(db, request):
    return