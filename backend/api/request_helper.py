from flask import jsonify
import mysql.connector
from typing import List, Any
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


def verify_params(request, param_types):
    """
    Validates query parameters in a GET request against expected types.
    Supports repeated query params for lists (ints, strings, etc.).
    """
    data = request.args
    params = {}

    for param, expected_type in param_types.items():
        try:
            # Handle Lists
            if getattr(expected_type, "__origin__", None) == list:
                inner_type = expected_type.__args__[0] if expected_type.__args__ else str
                values = data.getlist(param)
                if values:
                    # Convert each value to the inner type
                    converted = []
                    for v in values:
                        if v == "":
                            continue  # skip blanks
                        try:
                            converted.append(inner_type(v))
                        except (ValueError, TypeError):
                            raise ValueError(f"Parameter '{param}' must be a list of {inner_type.__name__}")
                    params[param] = converted

            # Handle Booleans
            elif expected_type == bool:
                raw_value = data.get(param)
                if raw_value is None:
                    continue
                val = str(raw_value).strip().lower()
                if val in ['true', '1', 'yes']:
                    params[param] = True
                elif val in ['false', '0', 'no']:
                    params[param] = False
                else:
                    raise ValueError(f"Parameter '{param}' must be a boolean")

            # Handle "Any" (accept raw string)
            elif expected_type == Any:
                raw_value = data.get(param)
                if raw_value is not None:
                    params[param] = raw_value

            # Handle Scalars (int, str, float, etc.)
            else:
                raw_values = data.getlist(param)
                if len(raw_values) > 1:
                    raise ValueError(f"Parameter '{param}' should not be repeated")

                raw_value = raw_values[0] if raw_values else None
                if raw_value is None:
                    continue

                params[param] = expected_type(raw_value)

        except (ValueError, TypeError) as e:
            return None, {
                "status": "error",
                "message": str(e) or f"Parameter '{param}' must be of type {expected_type}"
            }

    return params, None
