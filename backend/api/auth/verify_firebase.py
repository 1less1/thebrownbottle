from firebase_admin import auth as admin_auth
from .firebase_admin_init import get_firebase_admin_app


def verify_id_token(id_token: str) -> dict:
    get_firebase_admin_app()  # ensure initialized
    # returns decoded claims (trusted)
    decoded = admin_auth.verify_id_token(id_token, clock_skew_seconds=10)
    return decoded
