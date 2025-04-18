from flask import Flask, jsonify
import mysql.connector
import os

def get_shifts(db):
    conn = db
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT shift_id FROM shift")
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(results)

