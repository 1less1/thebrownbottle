from notifications.utils.notify import notify_employee


def handle_shift_created(db, payload):
    """
    Sends a notification when a new shift is assigned to an employee.
    """
    notify_employee(
        db,
        payload["employee_id"],
        "New Shift Assigned",
        "You’ve been scheduled for a new shift.",
        {
            "shift_id": payload["shift_id"]
        }
    )


def handle_shift_updated(db, payload):
    """
    Sends a notification when an existing shift is updated.
    """
    notify_employee(
        db,
        payload["employee_id"],
        "Shift Updated",
        "One of your shifts was updated.",
        {
            "shift_id": payload["shift_id"]
        }
    )


def handle_shift_deleted(db, payload):
    """
    Sends a notification when a shift is removed.
    """
    notify_employee(
        db,
        payload["employee_id"],
        "Shift Removed",
        "One of your scheduled shifts was removed.",
        {
            "shift_id": payload["shift_id"]
        }
    )
