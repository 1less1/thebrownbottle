from .events import NotificationEvent
from .handlers.announcementHandler import handle_announcement_created
from .handlers.taskHandler import handle_task_created
from .handlers.shiftHandler import (
    handle_shift_created,
    handle_shift_updated,
    handle_shift_deleted,
)
from .handlers.shiftCoverHandler import (
    handle_cover_awaiting_approval,
    handle_cover_accepted,
    handle_cover_denied,
)


def dispatch_notification(db, event: NotificationEvent, payload: dict):
    """
    Routes notification events to the correct handler.
    Receives an existing DB connection from the route.
    """

    # Shift Dispatchers
    if event == NotificationEvent.SHIFT_CREATED:
        handle_shift_created(db, payload)

    if event == NotificationEvent.SHIFT_UPDATED:
        handle_shift_updated(db, payload)

    if event == NotificationEvent.SHIFT_DELETED:
        handle_shift_deleted(db, payload)

    # Shift Cover Dispatchers
    if event == NotificationEvent.SHIFT_COVER_AWAITING_APPROVAL:
        handle_cover_awaiting_approval(db, payload)

    if event == NotificationEvent.SHIFT_COVER_ACCEPTED:
        handle_cover_accepted(db, payload)

    if event == NotificationEvent.SHIFT_COVER_DENIED:
        handle_cover_denied(db, payload)

    # Announcement Dispatchers
    if event == NotificationEvent.ANNOUNCEMENT_CREATED:
        handle_announcement_created(db, payload)

    # Task Dispatchers
    if event == NotificationEvent.TASK_CREATED:
        handle_task_created(db, payload)
