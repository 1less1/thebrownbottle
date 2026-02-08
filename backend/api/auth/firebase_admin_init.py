import os
import firebase_admin
from firebase_admin import credentials

_app = None

def get_firebase_admin_app():
    global _app
    if _app:
        return _app

    # path to service account json
    cred_path = os.environ.get("FIREBASE_SERVICE_ACCOUNT_PATH")
    if not cred_path:
        raise RuntimeError("Missing FIREBASE_SERVICE_ACCOUNT_PATH env var")

    cred = credentials.Certificate(cred_path)
    _app = firebase_admin.initialize_app(cred)
    return _app
