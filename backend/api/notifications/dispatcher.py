from .events import NotificationEvent
from .handlers.announcementHandler import handle_announcement_created
from .handlers.taskHandler import handle_task_created
from .handlers.shiftHandler import (
    handle_shift_created,
    handle_shift_updated,
    handle_shift_deleted,
)


def dispatch_notification(db, event: NotificationEvent, payload: dict):
    """
    Routes notification events to the correct handler.
    Receives an existing DB connection from the route.
    """

    if event == NotificationEvent.ANNOUNCEMENT_CREATED:
        handle_announcement_created(db, payload)

    if event == NotificationEvent.TASK_CREATED:
        handle_task_created(db, payload)

    if event == NotificationEvent.SHIFT_CREATED:
        handle_shift_created(db, payload)

    if event == NotificationEvent.SHIFT_UPDATED:
        handle_shift_updated(db, payload)

    if event == NotificationEvent.SHIFT_DELETED:
        handle_shift_deleted(db, payload)
