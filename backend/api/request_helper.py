from flask import jsonify
import mysql.connector
import os

# Use this function to verify field data for requests with a JSON Body
def verify_body(request, field_types, required_fields):
    """
    Validates JSON body fields against expected types and checks for required fields.

    Args:
        request: Flask request object.
        field_types: Dict mapping field names to expected types.
        required_fields: List of field names that must be present.

    Returns:
        Tuple: (validated_fields_dict, error_response_dict or None)
    """
    data = request.get_json()
    if not data:
        return None, {"status": "error", "message": "Missing or invalid JSON body."}

    fields = {}

    # Check for required fields
    for field in required_fields:
        if field not in data:
            return None, {"status": "error", "message": f"Missing required field: '{field}'"}

    # Validate and convert field types
    for field, expected_type in field_types.items():
        raw_value = data.get(field)
        if raw_value is None:
            continue  # Skip optional fields

        try:
            if expected_type == bool:
                val = str(raw_value).strip().lower()
                if val in ['true', '1', 'yes']: value = True
                elif val in ['false', '0', 'no']: value = False
                else: raise ValueError()
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
def verify_params(request, param_types):
    """
    Validates query parameters in a GET request against expected types.

    Args:
        request: Flask request object.
        param_types: Dict mapping param names to expected types.

    Returns:
        Tuple: (validated_params_dict, error_response_dict or None)
    """
    data = request.args
    params = {}

    for param, expected_type in param_types.items():
        raw_value = data.get(param)
        if raw_value is None:
            continue  # Skip missing optional params

        try:
            if expected_type == bool:
                val = str(raw_value).strip().lower()
                if val in ['true', '1', 'yes']: value = True
                elif val in ['false', '0', 'no']: value = False
                else: raise ValueError()
            else:
                value = expected_type(raw_value)
        except (ValueError, TypeError):
            return None, {
                "status": "error",
                "message": f"Parameter '{param}' must be of type {expected_type.__name__}"
            }

        params[param] = value

    return params, None

