import math
import pandas as pd


def number(value, default=0.0):
    try:
        if value is None or pd.isna(value):
            return default
        return float(value)
    except (TypeError, ValueError):
        return default


def is_yes(value):
    return str(value).strip().lower() in {
        "yes", "true", "1", "y", "issue", "abnormal"
    }


def calculate(row):
    evidence = []

    failures = max(0, number(row.get("failure_count")))
    delay = max(0, number(row.get("maintenance_delay_days")))
    temperature = number(row.get("temperature"), math.nan)
    incidents = max(0, number(row.get("incident_count")))

    if failures > 0:
        points = min(25, round(failures * 6.25))
        evidence.append({
            "factor": "Failure history",
            "contribution": points,
            "severity": "CRITICAL" if failures >= 4 else "HIGH",
            "explanation": f"{int(failures)} previous failure(s) recorded."
        })

    if delay > 0:
        points = min(20, round(delay / 30 * 20))
        evidence.append({
            "factor": "Maintenance delay",
            "contribution": points,
            "severity": "HIGH" if delay >= 30 else "MEDIUM",
            "explanation": f"Maintenance is delayed by {int(delay)} day(s)."
        })

    if not math.isnan(temperature):
        if temperature > 90:
            points = 20
            severity = "HIGH"
            explanation = f"Temperature is {temperature:g}°C, above the abnormal threshold."
        elif temperature > 80:
            points = 10
            severity = "MEDIUM"
            explanation = f"Temperature is elevated at {temperature:g}°C."
        else:
            points = 0

        if points:
            evidence.append({
                "factor": "Temperature anomaly",
                "contribution": points,
                "severity": severity,
                "explanation": explanation
            })

    if is_yes(row.get("inspection_issue")):
        evidence.append({
            "factor": "Inspection concern",
            "contribution": 15,
            "severity": "HIGH",
            "explanation": "An inspection concern has been recorded."
        })

    if incidents > 0:
        points = min(20, round(incidents * 10))
        evidence.append({
            "factor": "Incident history",
            "contribution": points,
            "severity": "HIGH",
            "explanation": f"{int(incidents)} incident(s) recorded."
        })

    score = min(100, sum(item["contribution"] for item in evidence))

    level = "HIGH" if score >= 70 else "MEDIUM" if score >= 40 else "LOW"

    return score, level, evidence
