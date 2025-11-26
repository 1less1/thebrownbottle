from flask import jsonify
import mysql.connector
import os
import request_helper
from datetime import datetime
from typing import List

# GET Schedule Data -------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def get_schedule_data(db, request):
    """
    Returns structured schedule data for all active employees:
    [
      {
        "employee_id": 12,
        "full_name": "Alex Carter",
        "primary_role": 3,
        "primary_role_name": "Supervisor",
        "shifts": [null, {...}, null, null, null, null, null]
      }
    ]
    """

    param_types = {
        'start_date': str,
        'end_date': str,
        'section_id': List[int],
        'role_id': List[int],
        'full_name': str,
        'is_today': str
    }

    params, error = request_helper.verify_params(request, param_types)
    if error:
        return jsonify(error), 400

    start_date = params.get("start_date")
    end_date = params.get("end_date")
    section_ids = params.get("section_id", []) # List of section_ids
    role_ids = params.get("role_id", []) # List of role_ids
    full_name = params.get("full_name")
    is_today = params.get("is_today")

    try:
        conn = db
        cursor = conn.cursor(dictionary=True)

        if is_today == "1":
            today_str = datetime.today().strftime('%Y-%m-%d')
            start_date = today_str
            end_date = today_str

        # NOTE: Date filtering applied inside LEFT JOIN so NULL shifts remain included
        # Base query: include all active employees
        query = """
            SELECT
                e.employee_id,
                CONCAT(e.first_name, ' ', e.last_name) AS full_name,
                e.primary_role,
                r.role_name AS primary_role_name,
                s.shift_id,
                TIME_FORMAT(s.start_time, '%h:%i %p') AS start_time,
                DATE_FORMAT(s.date, '%Y-%m-%d') AS date,
                DATE_FORMAT(s.date, '%W') AS day_name,
                DAYOFWEEK(s.date) AS day_index,
                s.section_id,
                sec.section_name
            FROM employee e
            INNER JOIN role r ON e.primary_role = r.role_id
            LEFT JOIN shift s
                ON e.employee_id = s.employee_id
                AND s.date BETWEEN %s AND %s
            LEFT JOIN section sec ON s.section_id = sec.section_id
            WHERE e.is_active = 1
        """

        query_params = [start_date, end_date]

        if section_ids and len(section_ids) > 0:
            placeholders = ','.join(['%s'] * len(section_ids))
            query += f" AND s.section_id IN ({placeholders})"
            query_params.extend(section_ids)
                    
        if role_ids and len(role_ids) > 0:
            placeholders = ','.join(['%s'] * len(role_ids))
            query += f" AND e.primary_role IN ({placeholders})"
            query_params.extend(role_ids)

        if full_name:
            query += " AND CONCAT(e.first_name, ' ', e.last_name) LIKE %s"
            query_params.append(f"%{full_name}%")
        
        # Group by role_id if user is trying to filter by role_id or section_id (more pleasing for UI)
        # Otherwise, order by last_name
        if (role_ids and len(role_ids) > 0) or (section_ids and len(section_ids) > 0):
            query += " ORDER BY e.primary_role ASC, e.last_name ASC;"
        else:
            query += " ORDER BY e.last_name ASC;"

        cursor.execute(query, tuple(query_params))
        rows = cursor.fetchall()

        employees = {}

        for row in rows:
            emp_id = row["employee_id"]

            if emp_id not in employees:
                employees[emp_id] = {
                    "employee_id": emp_id,
                    "full_name": row["full_name"],
                    "primary_role": row["primary_role"],
                    "primary_role_name": row["primary_role_name"],
                    "shifts": [None] * 7
                }

            if row["shift_id"] and row["day_index"] is not None:
                array_index = int(row["day_index"]) - 1

                if 0 <= array_index < 7:
                    employees[emp_id]["shifts"][array_index] = {
                        "shift_id": row["shift_id"],
                        "date": row["date"],
                        "day_index": row["day_index"],   # 1 (Sun)... to 7 (Sat)
                        "day_name": row["day_name"],
                        "start_time": row["start_time"],
                        "section_id": row["section_id"],
                        "section_name": row["section_name"]
                    }
                else:
                    print(f"WARNING: Invalid day_index {row['day_index']} for shift_id {row['shift_id']}")

        return jsonify(list(employees.values())), 200

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"status": "error", "message": "Server error"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------