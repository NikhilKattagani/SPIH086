import pandas as pd

REQUIRED_FIELDS = [
    "asset_id", "asset_name", "asset_type",
    "failure_count", "maintenance_delay_days",
    "inspection_issue", "temperature", "incident_count"
]

NUMERIC_FIELDS = {
    "failure_count", "maintenance_delay_days",
    "temperature", "incident_count"
}


def calculate(row):
    present = 0
    valid = 0

    for field in REQUIRED_FIELDS:
        value = row.get(field)

        if value is not None and not pd.isna(value) and str(value).strip():
            present += 1

            if field in NUMERIC_FIELDS:
                try:
                    float(value)
                    valid += 1
                except (TypeError, ValueError):
                    pass
            else:
                valid += 1

    completeness = present / len(REQUIRED_FIELDS) * 100
    validity = valid / len(REQUIRED_FIELDS) * 100
    score = round(completeness * 0.60 + validity * 0.40)

    rating = "GOOD" if score >= 90 else "FAIR" if score >= 70 else "LIMITED"

    return {
        "score": score,
        "rating": rating,
        "warning": (
            "Some records are incomplete or invalid; assessment reliability may be reduced."
            if score < 70 else None
        )
    }
