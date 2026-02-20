from notifications.utils.notify import notify_employee, notify_managers
from notifications.events import NotificationEvent
from notifications.nav import build_notification_data
from notifications.constants import CALENDAR_ROUTE
from notifications.constants import ADMIN_ROUTE


def handle_time_off_created(db, payload):
    """
    Notify managers that a new request has been submitted.
    """
    _request_id = payload["request_id"]
    _employee_id = payload["employee_id"]

    notification_data = build_notification_data(
        event=NotificationEvent.TIME_OFF_CREATED,
        nav_pathname=ADMIN_ROUTE
    )

    notify_managers(
        db,
        "Time Off Request",
        "A new time off request awaits your approval.",
        notification_data
    )


def handle_time_off_updated(db, payload):
    """
    Notify the employee when their request status changes.
    Uses payload IDs for choosing recipient, but routes only to Calendar -> Time Off subtab on tap.
    """
    status = payload["status"]

    if status == "Accepted":
        title = "Time Off Approved"
        body = "Your time off request has been approved."
        event = NotificationEvent.TIME_OFF_APPROVED
    elif status == "Denied":
        title = "Time Off Denied"
        body = "Your time off request has been denied."
        event = NotificationEvent.TIME_OFF_DENIED
    else:
        return  # Ignore other status changes

    # <-- still required to pick recipient
    employee_id = payload["employee_id"]
    # <-- still useful for business logic/logging if needed
    _request_id = payload["request_id"]

    notification_data = build_notification_data(
        event=event,
        nav_pathname=CALENDAR_ROUTE,
        nav_params=None,
        ui={"calendarTab": "time off"}
    )

    notify_employee(
        db,
        employee_id,
        title,
        body,
        notification_data
    )
