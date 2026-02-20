from notifications.utils.notify import notify_employee, notify_managers
from notifications.events import NotificationEvent
from notifications.nav import build_notification_data
from notifications.constants import CALENDAR_ROUTE
from notifications.constants import ADMIN_ROUTE

"""
Shift Cover Notification Handlers

This module sends push notifications for shift cover request events.
It reacts to dispatched events only and performs no database mutations.

Notifications are sent when:
- A shift cover request requires manager approval
- A request is approved
- A request is denied

All business logic and state changes occur upstream.
"""


def handle_cover_awaiting_approval(db, payload):
    # Routes managers to Calendar -> Shift Cover subtab when they tap the notification
    data = build_notification_data(
        event=NotificationEvent.SHIFT_COVER_AWAITING_APPROVAL,
        nav_pathname=ADMIN_ROUTE,
    )

    notify_managers(
        db,
        "Shift Cover Approval Needed",
        "A shift cover request is awaiting approval.",
        data
    )


def handle_cover_accepted(db, payload):
    # Routes involved employees to Calendar -> Shift Cover subtab when they tap the notification
    data = build_notification_data(
        event=NotificationEvent.SHIFT_COVER_ACCEPTED,
        nav_pathname=CALENDAR_ROUTE,
        nav_params=None,
        ui={"calendarTab": "shift cover"}
    )

    notify_employee(
        db,
        payload["requesting_employee_id"],
        "Shift Cover Approved",
        "Your shift cover request was approved.",
        data
    )

    notify_employee(
        db,
        payload["accepted_employee_id"],
        "New Shift Assigned",
        "Your shift cover request was approved.",
        data
    )


def handle_cover_denied(db, payload):
    # Routes involved employees to Calendar -> Shift Cover subtab when they tap the notification
    data = build_notification_data(
        event=NotificationEvent.SHIFT_COVER_DENIED,
        nav_pathname=CALENDAR_ROUTE,
        nav_params=None,
        ui={"calendarTab": "shift cover"}
    )

    notify_employee(
        db,
        payload["requesting_employee_id"],
        "Shift Cover Denied",
        "Your shift cover request was denied.",
        data
    )

    if payload.get("accepted_employee_id"):
        notify_employee(
            db,
            payload["accepted_employee_id"],
            "Shift Cover Denied",
            "The shift cover you requested was denied.",
            data
        )
