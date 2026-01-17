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
        if field not in data:
            continue # Skip if the key isn't even in the request

        raw_value = data.get(field)
        
        # If the key IS in data but the value IS None, the user wants to set it to NULL
        if raw_value is None:
            fields[field] = None
            continue

        try:
            if expected_type == bool:
                val = str(raw_value).strip().lower()
                if val in ['true', '1', 'yes']: value = True
                elif val in ['false', '0', 'no']: value = False
                else: raise ValueError()
            else:
                # Type cast the value (e.g., int("5") -> 5)
                value = expected_type(raw_value)
            
            fields[field] = value
            
        except (ValueError, TypeError):
            return None, {
                "status": "error",
                "message": f"Field '{field}' must be of type {expected_type.__name__}"
            }

        fields[field] = value

    return fields, None


def verify_params(request, param_types):
    data = request.args
    params = {}

    for param, expected_type in param_types.items():
        try:
            # 1. Handle Lists
            if getattr(expected_type, "__origin__", None) == list:
                inner_type = expected_type.__args__[0] if expected_type.__args__ else str
                values = data.getlist(param)
                if values:
                    converted = []
                    for v in values:
                        # NEW: Ignore empty strings or literal "null" strings in lists
                        if v == "" or v.lower() == "null":
                            continue 
                        try:
                            converted.append(inner_type(v))
                        except (ValueError, TypeError):
                            raise ValueError(f"Parameter '{param}' must be a list of {inner_type.__name__}")
                    if converted:
                        params[param] = converted

            # 2. Handle Booleans
            elif expected_type == bool:
                raw_value = data.get(param)
                # NEW: Ignore if missing, empty, or the string "null"
                if raw_value is None or raw_value == "" or raw_value.lower() == "null":
                    continue
                
                val = str(raw_value).strip().lower()
                if val in ['true', '1', 'yes']: params[param] = True
                elif val in ['false', '0', 'no']: params[param] = False
                else: raise ValueError(f"Parameter '{param}' must be a boolean")

            # 3. Handle Scalars (int, str, float, etc.)
            else:
                raw_values = data.getlist(param)
                if len(raw_values) > 1:
                    raise ValueError(f"Parameter '{param}' should not be repeated")

                raw_value = raw_values[0] if raw_values else None
                
                # NEW: Gatekeeper - if it's None, empty, or "null", we THROW IT OUT (continue)
                if raw_value is None or raw_value == "" or raw_value.lower() == "null":
                    continue

                # Now it's safe to cast because we know it's not empty or "null"
                params[param] = expected_type(raw_value)

        except (ValueError, TypeError) as e:
            return None, {
                "status": "error",
                "message": str(e) or f"Parameter '{param}' must be of type {expected_type}"
            }

    return params, None
