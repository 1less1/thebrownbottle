from flask import jsonify
import mysql.connector
import request_helper

# -------------------------------------------------------------------------------------------------------
# POST Push Token
# -------------------------------------------------------------------------------------------------------


def register_push_token(db, request):
    """
    Registers an Expo push token for a user.
    If the token already exists, it will be ignored.
    """

    conn = None
    cursor = None

    try:
        # Define required fields
        required_fields = [
            'user_id',
            'expo_push_token'
        ]

        # Define expected field types
        field_types = {
            'user_id': int,
            'expo_push_token': str
        }

        # Validate request body
        fields, error = request_helper.verify_body(
            request,
            field_types,
            required_fields
        )

        if error:
            return jsonify(error), 400

        # Extract validated values
        user_id = fields['user_id']
        expo_push_token = fields['expo_push_token']

        conn = db
        cursor = conn.cursor(dictionary=True)

        # OPTIONAL: Comment this out ONLY if you want one device to receive notifications
        # for multiple users simultaneously (e.g. Multi-account support).
        cursor.execute("""
            DELETE FROM push_token
            WHERE expo_push_token = %s AND user_id != %s;
        """, (expo_push_token, user_id))

        # Insert token (IGNORE prevents duplicates)
        cursor.execute("""
            INSERT IGNORE INTO push_token (
                user_id,
                expo_push_token
            )
            VALUES (%s, %s);
        """, (user_id, expo_push_token))

        # Check if a new row was inserted
        if cursor.rowcount > 0:
            print(f"Successfully inserted push token for user_id: {user_id}")
        else:
            print(
                f"Push token for user_id: {user_id} already exists. Ignoring.")

        conn.commit()

        return jsonify({
            "status": "success",
            "message": "Push token registered"
        }), 201

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({
            "status": "error",
            "message": "Database error occurred"
        }), 500

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({
            "status": "error",
            "message": "An unexpected error occurred"
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def delete_push_token(db, request):
    """
    deletes an Expo push token for a user.
    """
    conn = None
    cursor = None

    try:
        # Define required fields
        required_fields = ['user_id', 'expo_push_token']
        field_types = {'user_id': int, 'expo_push_token': str}

        # Validate request body
        fields, error = request_helper.verify_body(
            request, field_types, required_fields)
        if error:
            return jsonify(error), 400

        # Extract validated values
        user_id = fields['user_id']
        expo_push_token = fields['expo_push_token']

        conn = db
        cursor = conn.cursor()

        # Delete the specific push token for the user
        cursor.execute("""
            DELETE FROM push_token
            WHERE user_id = %s AND expo_push_token = %s
        """, (user_id, expo_push_token))

        # Check if a row was deleted
        if cursor.rowcount > 0:
            print(
                f"Successfully unregistered push token for user_id: {user_id}")
        else:
            print(
                f"No push token found to unregister for user_id: {user_id}")

        conn.commit()

        return jsonify({
            "status": "success",
            "message": "Push token unregistered"
        }), 200

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({
            "status": "error",
            "message": "Database error occurred"
        }), 500

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({
            "status": "error",
            "message": "An unexpected error occurred"
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
