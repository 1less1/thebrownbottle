from notifications.utils.notify import notify_employee, notify_managers


def handle_time_off_created(db, payload):
    """
    Notify managers that a new request has been submitted.
    """
    notify_managers(
        db,
        "Time Off Request",
        "A new time off request awaits your approval.",
        {
            "request_id": payload["request_id"],
            "employee_id": payload["employee_id"]
        }
    )


def handle_time_off_updated(db, payload):
    """
    Notify the employee when their request status changes.
    """
    status = payload["status"]

    if status == "Accepted":
        title = "Time Off Approved"
        body = "Your time off request has been approved."
    elif status == "Denied":
        title = "Time Off Denied"
        body = "Your time off request has been denied."
    else:
        return  # Ignore other status changes

    notify_employee(
        db,
        payload["employee_id"],
        title,
        body,
        {
            "request_id": payload["request_id"]
        }
    )
