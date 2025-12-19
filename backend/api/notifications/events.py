from enum import Enum


class NotificationEvent(Enum):
    """
    Defines all notification events in the system.
    This file contains NO logic — only intent definitions.
    """

    ANNOUNCEMENT_CREATED = "announcement.created"
    TASK_CREATED = "task.created"

    SHIFT_CREATED = "shift.created"
    SHIFT_UPDATED = "shift.updated"
    SHIFT_DELETED = "shift.deleted"
