from flask import jsonify
import mysql.connector
import os
import request_helper

def insert_shift_cover_request(db, request):
    
    try:

        required_fields = ['shift_id','requested_employee_id',]
        field_types = {'shift_id': int, 'requested_employee_id': int,}

        # Validate the parameters
        fields, error = request_helper.verify_params(request, required_fields, field_types)

        if error:
            return jsonify(error), 400
        
        # Extract validated params
        shift_id = fields['shift_id']
        accepted_employee_id = None
        requested_employee_id = fields['requested_employee_id']
        status = "Pending"

        conn = db
        cursor = conn.cursor()

        # SQL Script - %s are placeholders for variables
        cursor.execute("""
            INSERT INTO shift_cover_request (
                shift_id, accepted_employee_id, requested_employee_id, status
            )           
            VALUES(%s, %s, %s,%s,);
        """, (shift_id, accepted_employee_id, requested_employee_id, status))

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
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500



def getUserShiftCoverRequest(db, request):

    try:

        required_params = ['requested_employee_id']
        param_types = {'requested_employee_id': int,}

        # Validate the parameters
        params, error = request_helper.verify_params(request, required_params, param_types)

        if error:
            return jsonify(error), 400
        
        # Extract validated params
        requested_employee_id = params['requested_employee_id']

        conn = db
        cursor = conn.cursor()

        # SQL Script - %s are placeholders for variables
        cursor.execute("""
            SELECT *
            FROM shift_cover_request
            WHERE requested_employee_id = (%s);
        """, (requested_employee_id,))

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
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
    

def getAcceptedShiftCoverRequest(db, request):

    try:

        required_params = ['accepted_employee_id']
        param_types = {'accepted_employee_id': int,}

        # Validate the parameters
        params, error = request_helper.verify_params(request, required_params, param_types)

        if error:
            return jsonify(error), 400
        
        # Extract validated params
        requested_employee_id = params['accpeted_employee_id']

        conn = db
        cursor = conn.cursor()

        # SQL Script - %s are placeholders for variables
        cursor.execute("""
            SELECT *
            FROM shift_cover_request
            WHERE accepted_employee_id = (%s);
        """, (requested_employee_id,))

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
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500