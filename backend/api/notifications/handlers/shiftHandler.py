from notifications.utils.notify import notify_employee
from notifications.events import NotificationEvent
from notifications.nav import build_notification_data
from notifications.constants import CALENDAR_ROUTE


def handle_shift_created(db, payload):
    """
    Sends a notification when a new shift is assigned to an employee.
    Routes to Calendar -> Shifts subtab when tapped.
    """
    employee_id = payload["employee_id"]  # Used to choose recipient (still required)

    notification_data = build_notification_data(
        event=NotificationEvent.SHIFT_CREATED,
        nav_pathname=CALENDAR_ROUTE,
        nav_params=None,                  # tab/subtab only
        ui={"calendarTab": "shifts"}
    )

    notify_employee(
        db,
        employee_id,
        "New Shift Assigned",
        "You’ve been scheduled for a new shift.",
        notification_data
    )


def handle_shift_updated(db, payload):
    """
    Sends a notification when an existing shift is updated.
    Routes to Calendar -> Shifts subtab when tapped.
    """
    employee_id = payload["employee_id"]

    notification_data = build_notification_data(
        event=NotificationEvent.SHIFT_UPDATED,
        nav_pathname=CALENDAR_ROUTE,
        nav_params=None,
        ui={"calendarTab": "shifts"}
    )

    notify_employee(
        db,
        employee_id,
        "Shift Updated",
        "You have an updated shift.",
        notification_data
    )


def handle_shift_deleted(db, payload):
    """
    Sends a notification when a shift is removed.
    Routes to Calendar -> Shifts subtab when tapped.
    """
    employee_id = payload["employee_id"]

    notification_data = build_notification_data(
        event=NotificationEvent.SHIFT_DELETED,
        nav_pathname=CALENDAR_ROUTE,
        nav_params=None,
        ui={"calendarTab": "shifts"}
    )

    notify_employee(
        db,
        employee_id,
        "Shift Removed",
        "One of your scheduled shifts was removed.",
        notification_data
    )
