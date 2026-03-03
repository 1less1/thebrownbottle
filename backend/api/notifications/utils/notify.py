from push_notifications import send_push_notification


def notify_all_employees(db, title, body, data):
    # Sends the same notification to every employee that has a push token.
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT employee_id
            FROM employee
            WHERE employee.is_active = 1
        """)
        employees = cursor.fetchall()

        for row in employees:
            notify_employee(
                db,
                row["employee_id"],  
                title,
                body,
                data or {}
            )
    finally:
        cursor.close()


def notify_employee(db, employee_id, title, body, data):
    """
    Sends a push notification to registered devices.
    """
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT expo_push_token
        FROM push_token
        WHERE user_id = %s;
    """, (employee_id,))

    tokens = [row["expo_push_token"] for row in cursor.fetchall()]
    cursor.close()

    for token in tokens:
        send_push_notification(
            expo_push_token=token,
            title=title,
            body=body,
            data=data
        )


def notify_managers(db, title, body, data):
    """
    Sends a push notification to all active managers.
    """
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT DISTINCT pt.expo_push_token
        FROM push_token pt
        JOIN employee e ON e.employee_id = pt.user_id
        WHERE e.admin = 1 AND e.is_active = 1;
    """)

    tokens = [row["expo_push_token"] for row in cursor.fetchall()]
    cursor.close()

    for token in tokens:
        send_push_notification(
            expo_push_token=token,
            title=title,
            body=body,
            data=data
        )
