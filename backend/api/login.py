from flask import jsonify
import mysql.connector
import os
import request_helper

# Future Login Function - /login route already added to main.py
def login(db, request):
    return

# Gets all user data from the employee table with a GET request and employee_id parameter
def get_user_data(db, request):
    try:
        required_params = ['employee_id']
        param_types = {'employee_id': int}

        # Validate the query parameters
        params, error = request_helper.verify_params(request, required_params, param_types)

        if error:
            return jsonify(error), 400

        employee_id = params['employee_id']

        conn = db
        cursor = conn.cursor()

        cursor.execute("""
            SELECT * FROM employee WHERE employee_id = %s;
        """, (employee_id,))

        columns = [col[0] for col in cursor.description]
        result = cursor.fetchall()

        cursor.close()
        conn.close()
        
        # Format data to be entries with "column_name": value
        data = [dict(zip(columns, row)) for row in result]
        
        return jsonify({"status": "success", "data": data}), 200

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
