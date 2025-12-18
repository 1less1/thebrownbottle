from .events import NotificationEvent
from .handlers.announcementHandler import handle_announcement_created


def dispatch_notification(db, event: NotificationEvent, payload: dict):
    """
    Routes notification events to the correct handler.
    Receives an existing DB connection from the route.
    """

    if event == NotificationEvent.ANNOUNCEMENT_CREATED:
        handle_announcement_created(db, payload)
