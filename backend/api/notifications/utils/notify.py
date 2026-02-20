from push_notifications import send_push_notification


def notify_employee(db, employee_id, title, body, data):
    # Sends a push notification to all devices registered to a specific employee_id
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT expo_push_token
        FROM push_token
        WHERE user_id = %s
          AND expo_push_token IS NOT NULL;
    """, (employee_id,))

    tokens = [row["expo_push_token"] for row in cursor.fetchall()]
    cursor.close()

    if not tokens:
        return

    # Expo batching
    chunk_size = 100
    for i in range(0, len(tokens), chunk_size):
        send_push_notification(
            expo_push_token=tokens[i:i + chunk_size],
            title=title,
            body=body,
            data=data
        )


def notify_managers(db, title, body, data):
    # Sends a push notification to all active managers (admin = 1) who have a push token
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT DISTINCT pt.expo_push_token
        FROM push_token pt
        JOIN employee e ON e.employee_id = pt.user_id
        WHERE e.admin = 1
          AND e.is_active = 1
          AND pt.expo_push_token IS NOT NULL;
    """)

    tokens = [row["expo_push_token"] for row in cursor.fetchall()]
    cursor.close()

    if not tokens:
        return

    # Expo batching
    chunk_size = 100
    for i in range(0, len(tokens), chunk_size):
        send_push_notification(
            expo_push_token=tokens[i:i + chunk_size],
            title=title,
            body=body,
            data=data
        )
