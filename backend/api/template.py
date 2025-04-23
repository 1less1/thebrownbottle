# This file will server as a template for database routes/queries

from flask import jsonify
import mysql.connector
import os

def sample_GET_request(db, request):

    try:

        conn = db

        # ----------------------------------------------------------------------------

        # You may or may not need this data section.
        # You will need it if the incoming request has json data attached.
        # If it has no data attached just delete this section and execute a query with the cursor!
        
        data = request.get_json()

        # Make sure incoming request has necessary data
        if not all(key in data for key in ['list', 'of', 'attributes']):
            return jsonify({"status": "error", "message": "Missing required fields"}), 400

        # Extract data from the request and assign it to local variables
        list = data['list']
        of = data['of']
        attributes = data['attributes']

        # ----------------------------------------------------------------------------


        cursor = conn.cursor()


        # SQL Script - %s are placeholders for variables
        cursor.execute("""
            SQL Script Created Here (%s, %s, %s)
        """, (list, of, attributes))

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
    





def sample_POST_request(db, request):

    try:

        conn = db
        data = request.get_json()

        # Make sure POST request has necessary data
        if not all(key in data for key in ['list', 'of', 'attributes']):
            return jsonify({"status": "error", "message": "Missing required fields"}), 400
        
        
        # Extract data from the request and assign it to local variables
        list = data['list']
        of = data['of']
        attributes = data['attributes']


        # Ensure required fields are present - if not, return a HTTP 400 error code
        if not all(key in data for key in ['title', 'description', 'author_id', 'assignee_id', 'due_date', 'complete']):
            return jsonify({"status": "error", "message": "Missing required fields"}), 400


        cursor = conn.cursor()
        

        # SQL Script - %s are placeholders for variables
        cursor.execute("""
            SQL Script Created Here (%s, %s, %s)
        """, (list, of, attributes))


        conn.commit()
        cursor.close()
        conn.close()

        # Fetch the result
        result = cursor.fetchall()

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