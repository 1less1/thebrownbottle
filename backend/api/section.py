from flask import jsonify
import mysql.connector
import os
import request_helper

def insert_section(db, request):

    try:

        required_fields = ['section_id', 'section_name', 'employee_id']
        field_types = {'section_id': int, 'section_name': str, 'employee_id': int}

        # Validate the fields
        fields, error = request_helper.verify_fields(request, required_fields, field_types)

        # Extract validated fields
        section_id = fields['section_id']
        section_name = fields['section_name']
        employee_id = fields['employee_id']

        conn = db
        cursor = conn.cursor()
        
        # SQL Script - %s are placeholders for variables
        cursor.execute("""
            INSERT INTO section (section_id, section_name, employee_id)
            VALUES(%s,%s,%s);
        """, (section_id, section_name, employee_id))

        # Fetch the result
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
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 50


def get_user_section(db, request):
    
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
            SELECT section_id, section_name
            FROM section
            WHERE employee_id = %s;
        """, (employee_id,))

        # Fetch the result
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
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 50