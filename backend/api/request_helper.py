from flask import jsonify
import mysql.connector
import os

# Use this function to verify field data for requests with a JSON Body!!!
def verify_fields(request, required_fields, field_types, allow_optional=False):
    # request = http request object
    # required_fields = list of the the expected fields in the request
    # field_types = dictionary mappings of each field to their expected data type

    data = request.get_json()

    if not data:
        return None, {"status": "error", "message": "Missing or invalid JSON body."}

    # Reject unexpected fields unless optional is allowed
    if not allow_optional:
        for field in data:
            if field not in field_types:
                return None, {"status": "error", "message": f"Unexpected field: '{field}'"}

    fields = {}

    # Check for required fields
    for field in required_fields:
        if field not in data:
            return None, {"status": "error", "message": f"Missing required field: '{field}'"}

    # Validate and convert field types
    for field, expected_type in field_types.items():
        if field not in data:
            continue  # Skip optional fields not provided

        raw_value = data.get(field)

        try:
            if expected_type == bool:
                if str(raw_value).lower() == 'true':
                    value = True
                elif str(raw_value).lower() == 'false':
                    value = False
                else:
                    raise ValueError(f"Invalid boolean string: '{raw_value}'")
            else:
                value = expected_type(raw_value)
        except (ValueError, TypeError):
            return None, {
                "status": "error",
                "message": f"Field '{field}' must be of type {expected_type.__name__}"
            }

        fields[field] = value

    return fields, None



# Use this function to verify paramater data for requests (usually POST) with URL Paramaters 
def verify_params(request, required_params, param_types, allow_optional=False):
    # request = http request object
    # required_params = list of the the expected parameters in the request
    # param_types = dictionary mappings of each paramater to their expected data type

    data = request.args

    if data is None:
        return None, {"status": "error", "message": "Missing query parameters."}

    # Check for unexpected parameters if strict mode
    if not allow_optional:
        for param in data:
            if param not in param_types:
                return None, {"status": "error", "message": f"Unexpected parameter: '{param}'"}

    params = {}

    # Check for required parameters
    for param in required_params:
        if param not in data:
            return None, {"status": "error", "message": f"Missing required parameter: '{param}'"}

    # Validate and convert parameters
    for param, expected_type in param_types.items():
        if param not in data:
            continue  # Skip optional parameters not provided

        raw_value = data.get(param)

        try:
            if expected_type == bool:
                if str(raw_value).lower() == 'true':
                    value = True
                elif str(raw_value).lower() == 'false':
                    value = False
                else:
                    raise ValueError(f"Invalid boolean string: '{raw_value}'")
            else:
                value = expected_type(raw_value)

        except (ValueError, TypeError):
            return None, {
                "status": "error",
                "message": f"Parameter '{param}' must be of type {expected_type.__name__}"
            }

        params[param] = value

    return params, None
