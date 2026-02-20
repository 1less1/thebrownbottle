from push_notifications import send_push_notification
from notifications.events import NotificationEvent
from notifications.nav import build_notification_data
from notifications.constants import HOME_ROUTE


def handle_announcement_created(db, payload: dict):
    """
    Handles notifications for newly created announcements.
    Uses the existing DB connection passed from the route.
    """

    announcement_id = payload["announcement_id"]
    role_id = payload["role_id"]
    title = payload["title"]

    cursor = db.cursor(dictionary=True)

    # Fetch recipients
    cursor.execute("""
        SELECT DISTINCT pt.expo_push_token
        FROM push_token pt
        JOIN employee e ON e.employee_id = pt.user_id
        WHERE e.is_active = 1
          AND e.primary_role = %s;
    """, (role_id,))

    tokens = [row["expo_push_token"] for row in cursor.fetchall()]

    # Build navigation-only notification payload (routes user to announcements tab)
    notification_data = build_notification_data(
        event=NotificationEvent.ANNOUNCEMENT_CREATED,
        nav_pathname=HOME_ROUTE
    )

    # Send notifications in batches
    chunk_size = 100
    for i in range(0, len(tokens), chunk_size):
        send_push_notification(
            expo_push_token=tokens[i:i + chunk_size],
            title="New Announcement",
            body=title,
            data=notification_data
        )

    cursor.close()
