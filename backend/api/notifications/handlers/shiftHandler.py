from push_notifications import send_push_notification


def _notify_employee(db, employee_id, title, body, data):
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT expo_push_token
        FROM push_token
        WHERE user_id = %s;
    """, (employee_id,))

    tokens = [r["expo_push_token"] for r in cursor.fetchall()]

    for token in tokens:
        send_push_notification(
            expo_push_token=token,
            title=title,
            body=body,
            data=data
        )

    cursor.close()


def handle_shift_created(db, payload):
    _notify_employee(
        db,
        payload["employee_id"],
        "New Shift Assigned",
        "You’ve been scheduled for a new shift.",
        {"shift_id": payload["shift_id"]}
    )


def handle_shift_updated(db, payload):
    _notify_employee(
        db,
        payload["employee_id"],
        "Shift Updated",
        "One of your shifts were updated.",
        {"shift_id": payload["shift_id"]}
    )


def handle_shift_deleted(db, payload):
    _notify_employee(
        db,
        payload["employee_id"],
        "Shift Removed",
        "One of your scheduled shifts was removed.",
        {"shift_id": payload["shift_id"]}
    )
