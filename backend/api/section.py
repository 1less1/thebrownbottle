from flask import jsonify
import mysql.connector
import os
import request_helper

def get_all_sections(db, requests):
    try:
        
        conn = db
        cursor = conn.cursor()

        # SQL Script - Selects announcements from the last 14 days (2 weeks)
        cursor.execute("""
            SELECT * FROM section;
        """)

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