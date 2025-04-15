from flask import Flask, jsonify
import mysql.connector
import os

# Import the name of the python file for the different routes
import shifts
import tables

app = Flask(__name__)

def get_db_connection():
    return mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        database=os.environ["DB_NAME"]
    )


@app.route('/health')
def health_check():
    return {"status": "ok"}


@app.route('/shifts')
def get_shifts():
    return shifts.get_shifts(get_db_connection())


@app.route('/tables')
def get_tables():
    return tables.get_tables(get_db_connection())


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
