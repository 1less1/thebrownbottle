# This file will server as a template for database routes/queries
from flask import jsonify
import mysql.connector
import os
import request_helper


def sample_GET_request(db, request):

    try:

        required_params = ['param1', 'param2', 'param3']
        param_types = {'param1': int, 'param2': str, 'param3': float}

        # Validate the parameters
        params, error = request_helper.verify_params(request, required_params, param_types)

        if error:
            return jsonify(error), 400
        
        # Extract validated params
        param1 = params['param1']
        param2 = params['param2']
        param3 = params['param3']

        conn = db
        cursor = conn.cursor()

        # SQL Script - %s are placeholders for variables
        cursor.execute("""
            SQL Script Created Here (%s, %s, %s)
        """, (param1, param2, param3 ))

        # Fetch the result
        columns = [col[0] for col in cursor.description]
        result = cursor.fetchall()

        cursor.close()
        conn.close()
        
        # Format data to be entries with "column_name": value
        data = [dict(zip(columns, row)) for row in result]
        
        return jsonify(data[0]), 200



    except mysql.connector.Error as e:
        # Handle database-specific errors
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500


    except Exception as e:
        # Handle general errors
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
    





def sample_POST_request(db, request):

    try:

        required_fields = ['field1', 'field2', 'field3']
        field_types = {'field1': int, 'field2': str, 'field3': float}

        # Validate the fields
        fields, error = request_helper.verify_fields(request, required_fields, field_types)

        # Extract validated fields
        field1 = fields['field1']
        field2 = fields['field2']
        field3 = fields['field3']

        conn = db
        cursor = conn.cursor()
        
        # SQL Script - %s are placeholders for variables
        cursor.execute("""
            SQL Script Created Here (%s, %s, %s)
        """, (field1, field2, field3))

        conn.commit()
        cursor.close()
        conn.close()


        return jsonify({"status": "success"}), 200



    except mysql.connector.Error as e:
        # Handle database-specific errors
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500


    except Exception as e:
        # Handle general errors
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500