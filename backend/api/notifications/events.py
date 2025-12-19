from enum import Enum


class NotificationEvent(Enum):
    """
    Defines all notification events in the system.
    This file contains NO logic — only intent definitions.
    """

    # SHIFT EVENTS
    SHIFT_CREATED = "shift.created"
    SHIFT_UPDATED = "shift.updated"
    SHIFT_DELETED = "shift.deleted"

    # Shift Cover Events
    SHIFT_COVER_AWAITING_APPROVAL = "shift_cover.awaiting_approval"
    SHIFT_COVER_ACCEPTED = "shift_cover.accepted"
    SHIFT_COVER_DENIED = "shift_cover.denied"

    # Announcement Events
    ANNOUNCEMENT_CREATED = "announcement.created"

    # Task Events
    TASK_CREATED = "task.created"
