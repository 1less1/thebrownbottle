from notifications.utils.notify import notify_employee, notify_managers

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
    notify_managers(
        db,
        "Shift Cover Approval Needed",
        "A shift cover request is awaiting approval.",
        {
            "cover_request_id": payload["cover_request_id"],
            "shift_id": payload["shift_id"]
        }
    )


def handle_cover_accepted(db, payload):
    notify_employee(
        db,
        payload["requesting_employee_id"],
        "Shift Cover Approved",
        "Your shift cover request was approved.",
        {
            "cover_request_id": payload["cover_request_id"],
            "shift_id": payload["shift_id"]
        }
    )

    notify_employee(
        db,
        payload["accepted_employee_id"],
        "New Shift Assigned",
        "Your shift cover request was approved.",
        {
            "shift_id": payload["shift_id"]
        }
    )


def handle_cover_denied(db, payload):
    # Notify the person who requested the cover (The original owner)
    notify_employee(
        db,
        payload["requesting_employee_id"],
        "Shift Cover Denied",
        "Your shift cover request was denied.",
        {
            "cover_request_id": payload["cover_request_id"],
            "shift_id": payload["shift_id"]
        }
    )

    # Notify the person who accepted it (The potential coverer), if they exist
    if payload.get("accepted_employee_id"):
        notify_employee(
            db,
            payload["accepted_employee_id"],
            "Shift Cover Denied",
            "The shift cover you requested was denied.",
            {
                "cover_request_id": payload["cover_request_id"],
                "shift_id": payload["shift_id"]
            }
        )
