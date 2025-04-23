from flask import jsonify
import mysql.connector
import os

# Use this function to verify field data for requests with a JSON Body!!!
def verify_fields(request, required_fields, field_types):
    # request = http request object
    # required_fields = list of the the expected fields in the request
    # field_types = dictionary mappings of each field to their expected data type

    data = request.get_json()

    # Check if URL parameters are present
    if not data:
        return None, {"status": "error", "message": "No URL parameters found"}


    # Restrict the Request to only have expected fields (no extra)
    for field in data:
        if field not in field_types:
            return None, {"status": "error", "message": f"Unexpected field: '{field}'"}
    
    fields = {}

    # Check for missing required fields
    for field in required_fields:
        if field not in data:
            return None, {"status": "error", "message": f"Missing required field: '{field}'"}


    # Validate and convert field types
    for field, expected_type in field_types.items():
        value = data.get(field)

        try:
            value = expected_type(value)

        except (ValueError, TypeError):
            return None, {
                "status": "error",
                "message": f"Field '{field}' must be of type {expected_type.__name__}"
            }

        fields[field] = value

    return fields, None


# Use this function to verify paramater data for requests (usually POST) with URL Paramaters 
def verify_params(request, required_params, param_types):
    # request = http request object
    # required_params = list of the the expected parameters in the request
    # param_types = dictionary mappings of each paramater to their expected data type

    data = request.args

    # Check if JSON data is present
    if data is None:
        return None, {"status": "error", "message": "Invalid or missing JSON body"}


    # Restrict the Request to only have expected parameters (no extra)
    for param in data:
        if param not in param_types:
            return None, {"status": "error", "message": f"Unexpected parameter: '{param}'"}
    
    params = {}

    # Check for missing required parameters
    for param in required_params:
        if param not in data:
            return None, {"status": "error", "message": f"Missing required parameter: '{param}'"}


    # Validate and convert parameter types
    for param, expected_type in param_types.items():
        value = data.get(param)

        try:
            value = expected_type(value)

        except (ValueError, TypeError):
            return None, {
                "status": "error",
                "message": f"Parameter '{param}' must be of type {expected_type.__name__}"
            }

        params[param] = value

    return params, None