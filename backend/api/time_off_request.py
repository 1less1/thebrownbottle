from flask import jsonify
import mysql.connector
import os
import request_helper

def get_time_off_requests(db, request):
    return