from flask import jsonify
from notifications.dispatcher import dispatch_notification
from notifications.events import NotificationEvent
import mysql.connector
import os
import request_helper

# Announcements -----------------------------------------------------------------------------------------

# GET Announcements -------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


def get_announcements(db, request):
    """
    Fetches announcement records based on optional URL query parameters.
    If no parameters are provided, returns all announcements (equivalent to SELECT * FROM announcement).
    """
    conn = None
    cursor = None
    try:
        # Expected Parameter Types
        param_types = {
            'announcement_id': int,
            'author_id': int,
            'role_id': int,
            'title': str,
            'recent_only': int, # 1=True, 0=False
            'timestamp_sort': str, # "Newest", "Oldest"
        }

        # Validate and parse parameters
        params, error = request_helper.verify_params(request, param_types)
        if error:
            return jsonify(error), 400

        # Extract Parameters
        announcement_id = params.get('announcement_id')
        author_id = params.get('author_id')
        role_id = params.get('role_id')
        title = params.get('title')
        timestamp_sort = params.get('timestamp_sort')
        recent_only = params.get('recent_only')

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Base Query
        query = """
            SELECT 
                a.announcement_id,
                a.author_id,
                CONCAT(e.first_name, ' ', e.last_name) AS author,
                a.role_id,
                r.role_name,
                a.title,
                a.description,
                DATE_FORMAT(a.timestamp, '%Y-%m-%d %H:%i') AS timestamp
            FROM announcement a
            JOIN employee e ON a.author_id = e.employee_id
            JOIN role r ON a.role_id = r.role_id
            WHERE 1 = 1
        """

        query_params = []

        # Build Dynamic Query
        if announcement_id is not None:
            query += " AND a.announcement_id = %s"
            query_params.append(announcement_id)

        if author_id is not None:
            query += " AND a.author_id = %s"
            query_params.append(author_id)

        if role_id is not None:
            query += " AND a.role_id = %s"
            query_params.append(role_id)

        if title is not None:
            query += " AND a.title = %s"
            query_params.append(title)

        if (recent_only is not None) and (recent_only == 1):
            # Filter announcements inserted within the last 14 days
            query += " AND a.timestamp >= NOW() - INTERVAL 14 DAY"

        # -----------------------------
        # Time Sorting Logic
        # -----------------------------
        order_clauses = []

        # TIMESTAMP SORTING
        if timestamp_sort == "Newest":
            order_clauses.append("a.timestamp DESC")
        elif timestamp_sort == "Oldest":
            order_clauses.append("a.timestamp ASC")

        # Default fallback
        if not order_clauses:
            order_clauses.append("a.timestamp DESC")

        query += " ORDER BY " + ", ".join(order_clauses)

        # Execute Query
        cursor.execute(query, tuple(query_params))
        result = cursor.fetchall()

        return jsonify(result), 200

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


#  POST Announcement ------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def insert_announcement(db, request):
    """
    Inserts a new record into the announcement table.
    """
    conn = None
    cursor = None
    try:
        # Define Required Fields
        required_fields = [
            'author_id',
            'title',
            'description',
            'role_id',
        ]

        # Define Expected Field Types
        field_types = {
            'author_id': int,
            'title': str,
            'description': str,
            'role_id': int
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_body(
            request, field_types, required_fields)

        if error:
            return jsonify(error), 400

        # Extract Parameters
        author_id = fields['author_id']
        title = fields['title']
        description = fields['description']
        role_id = fields['role_id']

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Execute Query
        cursor.execute("""
            INSERT INTO announcement 
            (author_id, title, description, role_id)
            VALUES (%s, %s, %s, %s);
        """, (author_id, title, description, role_id))

        inserted_id = cursor.lastrowid

        conn.commit()

        # Emit notification event
        dispatch_notification(
            db,
            NotificationEvent.ANNOUNCEMENT_CREATED,
            {
                "announcement_id": inserted_id,
                "role_id": role_id,
                "title": title
            }
        )

        return jsonify({"status": "success", "inserted_id": inserted_id}), 201

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


# PATCH Announcement ------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def update_announcement(db, request, announcement_id):
    """
    Updates an existing announcement record (partial update).
    announcement_id comes from the URL.
    """
    conn = None
    cursor = None
    try:
        # Define Expected Field Types
        field_types = {
            'author_id': int,
            'title': str,
            'description': str,
            'role_id': int
        }

        # Validate the fields in JSON body (only optional fields here)
        fields, error = request_helper.verify_body(request, field_types, [])
        if error:
            return jsonify(error), 400
        if not fields:
            return jsonify({"status": "error", "message": "No fields provided to update"}), 400

        # Build dynamic SET clause
        set_clause = ", ".join([f"{col} = %s" for col in fields.keys()])
        values = list(fields.values())
        # WHERE parameter at the end -> WHERE announcement_id = %s
        values.append(announcement_id)

        conn = db
        cursor = conn.cursor(dictionary=True)

        query = f"""
            UPDATE announcement
            SET {set_clause}
            WHERE announcement_id = %s;
        """

        cursor.execute(query, tuple(values))
        conn.commit()
        rowcount = cursor.rowcount

        if rowcount == 0:
            return jsonify({"status": "error", "message": "No announcement found with given ID"}), 404

        return jsonify({"status": "success", "updated_rows": rowcount}), 200

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


# DELETE Announcement -----------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def delete_announcement(db, announcement_id):
    """
    Deletes an announcement record by announcement_id
    """
    conn = None
    cursor = None
    try:
        conn = db
        cursor = conn.cursor(dictionary=True)

        # Check if announcement exists
        cursor.execute(
            "SELECT announcement_id FROM announcement WHERE announcement_id = %s",
            (announcement_id,)
        )
        result = cursor.fetchone()

        if not result:
            return jsonify({"status": "error", "message": "Announcement not found"}), 404

        # Delete the announcement
        cursor.execute(
            "DELETE FROM announcement WHERE announcement_id = %s",
            (announcement_id,)
        )
        conn.commit()

        return jsonify({"status": "success", "message": "Announcement deleted"}), 200

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


# Announcement Acknowledgement --------------------------------------------------------------------------

# POST Acknowledge Announcement -------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def acknowledge_announcement(db, request):
    """
    Records that an employee has acknowledged an announcement record
    """
    conn = None
    cursor = None
    try:
        # Define Required Fields
        required_fields = [
            'announcement_id',
            'employee_id',
        ]

        # Define Expected Field Types
        field_types = {
            'announcement_id': int,
            'employee_id': int
        }

        # Validate the fields in JSON body
        fields, error = request_helper.verify_body(
            request, field_types, required_fields)

        if error:
            return jsonify(error), 400

        # Extract Parameters
        announcement_id = fields['announcement_id']
        employee_id = fields['employee_id']

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Execute Query
        cursor.execute("""
            INSERT INTO announcement_acknowledgment (announcement_id, employee_id)
            VALUES (%s, %s)
            ON DUPLICATE KEY UPDATE id = id;
        """, (announcement_id, employee_id))

        inserted_id = cursor.lastrowid

        conn.commit()

        return jsonify({"status": "success", "inserted_id": inserted_id}), 201

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


# GET Acknowledged Announcement -------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------


def get_acknowledged_announcements(db, request):
    """
    Fetches acknowledgment records from announcement_acknowledgment
    """
    conn = None
    cursor = None
    try:
        # Expected Parameter Types
        param_types = {
            'announcement_id': int,
            'employee_id': int,
            'recent_only': int,  # 1=True, 0=False
        }

        # Validate and parse parameters
        params, error = request_helper.verify_params(request, param_types)
        if error:
            return jsonify(error), 400

        # Extract Parameters
        announcement_id = params.get('announcement_id')
        employee_id = params.get('employee_id')
        recent_only = params.get('recent_only')

        conn = db
        cursor = conn.cursor(dictionary=True)

        # Base query
        query = """
            SELECT 
                aa.announcement_id,
                aa.employee_id,
                DATE_FORMAT(aa.acknowledged_at, '%Y-%m-%d %H:%i') AS acknowledged_at,
                CONCAT(e.first_name, ' ', e.last_name) AS employee_name
            FROM announcement_acknowledgment AS aa
            JOIN employee AS e 
            ON aa.employee_id = e.employee_id
            JOIN announcement AS a
            ON a.announcement_id = aa.announcement_id
            WHERE 1=1
        """

        query_params = []

        # Build Dynamic Query
        if announcement_id is not None:
            query += " AND aa.announcement_id = %s"
            query_params.append(announcement_id)

        if employee_id is not None:
            query += " AND aa.employee_id = %s"
            query_params.append(employee_id)

        if (recent_only is not None) and (recent_only == 1):
            # Filter announcements inserted within the last 14 days
            query += " AND a.timestamp >= NOW() - INTERVAL 14 DAY"

        # Last Query Line
        query += " ORDER BY a.timestamp DESC;"  # Shows newest acknowledgements first

        # Execute Query
        cursor.execute(query, tuple(query_params))
        result = cursor.fetchall()

        return jsonify(result), 200

    except mysql.connector.Error as e:
        print(f"Database error (acknowledgments): {e}")
        return jsonify({"status": "error", "message": "Database error occurred"}), 500

    except Exception as e:
        print(f"Error occurred (acknowledgments): {e}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------
