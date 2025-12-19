from push_notifications import send_push_notification


def handle_task_created(db, payload: dict):
    """
    Sends push notifications for a newly created task.

    A notification is sent ONLY to employees who:
    - Have a shift TODAY
    - Whose shift section matches the task section
    - Are active
    - Have a push token

    """

    task_id = payload["task_id"]

    cursor = db.cursor(dictionary=True)

    # Fetch authoritative task data
    cursor.execute("""
        SELECT title, section_id, complete
        FROM task
        WHERE task_id = %s;
    """, (task_id,))

    task = cursor.fetchone()

    # Safety checks
    if not task or task["complete"] == 1:
        cursor.close()
        return

    title = task["title"]
    section_id = task["section_id"]

    # Fetch push tokens for employees who have a shift TODAY in this section
    cursor.execute("""
        SELECT DISTINCT pt.expo_push_token
        FROM shift s
        JOIN employee e
            ON e.employee_id = s.employee_id
        JOIN push_token pt
            ON pt.user_id = e.employee_id
        WHERE
            s.date = CURDATE()
            AND s.section_id = %s
            AND e.is_active = 1
            AND pt.expo_push_token IS NOT NULL;
    """, (section_id,))

    tokens = [row["expo_push_token"] for row in cursor.fetchall()]

    if not tokens:
        cursor.close()
        return

    # Expo batching
    chunk_size = 100
    for i in range(0, len(tokens), chunk_size):
        send_push_notification(
            expo_push_token=tokens[i:i + chunk_size],
            title="New Task Posted",
            body=title,
            data={"task_id": task_id}
        )

    cursor.close()
