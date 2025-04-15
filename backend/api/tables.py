from flask import Flask, jsonify
import mysql.connector
import os

def get_tables(db):
    conn = db
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SHOW TABLES;")  # Replace with your actual table
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(results)

