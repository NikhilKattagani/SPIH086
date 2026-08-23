def explain(asset_name, risk_level, evidence):
    if not evidence:
        return (
            f"{asset_name} is classified as {risk_level} risk "
            "based on the available records."
        )

    strongest = sorted(
        evidence,
        key=lambda item: item["contribution"],
        reverse=True
    )[:4]

    reasons = " ".join(item["explanation"] for item in strongest)

    return (
        f"{asset_name} is classified as {risk_level} risk. "
        f"Main contributing evidence: {reasons}"
    )


def changes(row, previous_score, current_score):
    items = []

    try:
        delay = float(row.get("maintenance_delay_days") or 0)
    except (TypeError, ValueError):
        delay = 0

    try:
        temperature = float(row.get("temperature") or 0)
    except (TypeError, ValueError):
        temperature = 0

    try:
        failures = float(row.get("failure_count") or 0)
    except (TypeError, ValueError):
        failures = 0

    if delay >= 30:
        items.append({
            "points": 12,
            "text": "Maintenance became overdue"
        })

    if temperature > 90:
        items.append({
            "points": 10,
            "text": "Temperature crossed the abnormal threshold"
        })

    if failures >= 3:
        items.append({
            "points": 11,
            "text": "Repeated failures increased the risk"
        })

    return {
        "previous_score": previous_score,
        "current_score": current_score,
        "change": current_score - previous_score,
        "items": items
    }
