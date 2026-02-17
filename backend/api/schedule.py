from flask import jsonify
import mysql.connector
import os
import request_helper
from datetime import datetime, timedelta
from typing import List

# GET Schedule Data -------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------

def get_schedule_data(db, request):
    """
    Returns Sample JSON:
    [
        {
            "employee_id": #,
            "full_name": "Name",
            "primary_role": 1,
            "primary_role_name": "Manager",
            "days": [
            {
                "availability": {
                "all_day": 1,
                "end_time": null,
                "is_available": 1,
                "start_time": null
                },
                "date": "2026-02-15",
                "day_index": 1,
                "day_name": "Sunday",
                "shift": {
                "section_id": 5,
                "section_name": "Bar",
                "shift_id": 50,
                "start_time": "05:00 PM"
                },
                "time_off_approved": 0
            }...
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

    # Extract Parameters
    start_date = params.get("start_date")
    end_date = params.get("end_date")
    section_ids = params.get("section_id", [])
    role_ids = params.get("role_id", [])
    full_name = params.get("full_name")
    
    if params.get("is_today") == "1":
        start_date = end_date = datetime.today().strftime('%Y-%m-%d')

    cursor = None
    try:
        cursor = db.cursor(dictionary=True)

        # 1. Fetch Employee and Base Availability
        emp_query = """
            SELECT 
                e.employee_id, 
                CONCAT(e.first_name, ' ', e.last_name) AS full_name,
                e.primary_role, 
                r.role_name AS primary_role_name,
                a.day_of_week,
                a.is_available,
                TIME_FORMAT(a.start_time, '%h:%i %p') AS avail_start,
                TIME_FORMAT(a.end_time, '%h:%i %p') AS avail_end
            FROM employee e
            INNER JOIN role r ON e.primary_role = r.role_id
            LEFT JOIN availability a ON e.employee_id = a.employee_id
            WHERE e.is_active = 1
        """
        
        emp_filters = []
        emp_params = []
        if role_ids:
            emp_filters.append(f"e.primary_role IN ({','.join(['%s']*len(role_ids))})")
            emp_params.extend(role_ids)
        if full_name:
            emp_filters.append("CONCAT(e.first_name, ' ', e.last_name) LIKE %s")
            emp_params.append(f"%{full_name}%")
        
        if emp_filters:
            emp_query += " AND " + " AND ".join(emp_filters)
        
        emp_query += " ORDER BY e.last_name ASC"
        cursor.execute(emp_query, tuple(emp_params))
        emp_rows = cursor.fetchall()

        employees = {}
        for row in emp_rows:
            eid = row["employee_id"]
            if eid not in employees:
                employees[eid] = {
                    "employee_id": eid,
                    "full_name": row["full_name"],
                    "primary_role": row["primary_role"],
                    "primary_role_name": row["primary_role_name"],
                    "availability_map": {}, 
                    "days": [] 
                }
            if row["day_of_week"]:
                is_all_day = 1 if (row['avail_start'] is None and row['avail_end'] is None and row['is_available'] == 1) else 0
                employees[eid]["availability_map"][row["day_of_week"]] = {
                    "is_available": row["is_available"],
                    "start_time": row['avail_start'],
                    "end_time": row['avail_end'],
                    "all_day": is_all_day
                }

        # 2. Fetch Time Off Separately (Independent of Shifts)
        # This ensures time off shows up even on days with no shifts.
        time_off_query = """
            SELECT employee_id, start_date, end_date
            FROM time_off_request
            WHERE status = 'Accepted'
            AND (start_date <= %s AND end_date >= %s)
        """
        cursor.execute(time_off_query, (end_date, start_date))
        time_off_rows = cursor.fetchall()

        # 3. Fetch Shift Data
        data_query = """
            SELECT 
                s.employee_id, s.shift_id, s.section_id, sec.section_name,
                TIME_FORMAT(s.start_time, '%h:%i %p') AS start_time,
                DATE_FORMAT(s.date, '%Y-%m-%d') AS date
            FROM shift s
            LEFT JOIN section sec ON s.section_id = sec.section_id
            WHERE s.date BETWEEN %s AND %s
        """
        data_params = [start_date, end_date]
        if section_ids:
            data_query += f" AND s.section_id IN ({','.join(['%s']*len(section_ids))})"
            data_params.extend(section_ids)

        cursor.execute(data_query, tuple(data_params))
        shift_rows = cursor.fetchall()

        # Map shifts
        shift_map = {}
        for s in shift_rows:
            key = (s['employee_id'], s['date'])
            shift_map[key] = {
                "shift_id": s["shift_id"],
                "start_time": s["start_time"],
                "section_id": s["section_id"],
                "section_name": s["section_name"]
            }

        # 4. Build the Days List
        start_dt = datetime.strptime(start_date, '%Y-%m-%d')
        end_dt = datetime.strptime(end_date, '%Y-%m-%d')
        num_days = (end_dt - start_dt).days + 1

        for eid in employees:
            for i in range(num_days):
                current_date = start_dt + timedelta(days=i)
                date_str = current_date.strftime('%Y-%m-%d')
                day_name = current_date.strftime('%A')
                day_index = (current_date.weekday() + 1) % 7 + 1 
                
                # Check for Approved Time Off
                time_off_val = 0
                for tor in time_off_rows:
                    if tor['employee_id'] == eid:
                        # tor dates are likely 'date' objects from MySQL connector
                        if tor['start_date'].strftime('%Y-%m-%d') <= date_str <= tor['end_date'].strftime('%Y-%m-%d'):
                            time_off_val = 1
                            break

                # Get Shift (Single object or None)
                shift_output = shift_map.get((eid, date_str))

                # Get Availability
                base_avail = employees[eid]["availability_map"].get(day_name, {
                    "is_available": 1, 
                    "start_time": None,
                    "end_time": None,
                    "all_day": 1
                })

                employees[eid]["days"].append({
                    "date": date_str,
                    "day_name": day_name,
                    "day_index": day_index,
                    "shift": shift_output,
                    "availability": base_avail,
                    "time_off_approved": time_off_val
                })
            
            if "availability_map" in employees[eid]:
                del employees[eid]["availability_map"]

        return jsonify(list(employees.values())), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if cursor: cursor.close()

# -------------------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------------------