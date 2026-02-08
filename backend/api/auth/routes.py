from flask import jsonify

from .verify_firebase import verify_id_token

def firebase_login(get_db_connection, request):
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return jsonify({"message": "Missing Bearer token"}), 401

    id_token = auth_header.split("Bearer ", 1)[1].strip()
    if not id_token:
        return jsonify({"message": "Missing token"}), 401

    try:
        decoded = verify_id_token(id_token)
    except Exception as e:
        print("VERIFY TOKEN ERROR:", repr(e))
        return jsonify({
        "message": "Invalid token",
        "details": str(e),
    }), 401

    email = decoded.get("email")
    if not email:
        return jsonify({"message": "No email on token"}), 401

    conn = get_db_connection()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute(
            """
            SELECT *
            FROM employee
            WHERE email = %s AND is_active = 1
            LIMIT 1
            """,
            (email,)
        )
        row = cur.fetchone()
        if not row:
            return jsonify({"message": "Not authorized"}), 403

        return jsonify({"employee": row}), 200
    finally:
        try:
            conn.close()
        except Exception:
            pass
