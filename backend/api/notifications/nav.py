from typing import Any, Dict, Optional
from notifications.events import NotificationEvent


def build_notification_data(
    event: NotificationEvent,
    nav_pathname: str,
    nav_params: Optional[Dict[str, Any]] = None,
    ui: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    # Builds a consistent data payload for Expo push notifications (event + navigation target + optional UI hints)
    payload: Dict[str, Any] = {
        "event": event.value,
        "nav": {
            "pathname": nav_pathname,
            "params": nav_params or {}
        }
    }

    # Adds optional UI hints (e.g., calendar subtab selection) without requiring detail-screen params
    if ui:
        payload["ui"] = ui

    return payload
