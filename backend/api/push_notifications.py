import requests

# Sends a push notification using Expo's push service


def send_push_notification(expo_push_token, title, body, data=None):
    """
    Sends a single push notification to one or multiple devices.

    expo_push_token: String or List of Strings (Expo push tokens)
    title: Notification title
    body: Notification message body
    data: Optional dictionary sent with the notification
    """

    payload = {
        "to": expo_push_token,
        "title": title,
        "body": body,
        "data": data or {},
        "sound": "default",   # Plays the device's default notification sound
        "priority": "high"    # Android: Ensures heads-up notification & vibration
    }

    response = requests.post(
        "https://exp.host/--/api/v2/push/send",
        json=payload,
        headers={"Content-Type": "application/json"}
    )

    response_json = response.json()
    print(f"Expo API Response: {response_json}")  # Log the response from Expo
    return response_json
