def recommend(row, risk_level, data_quality):
    def number(name):
        try:
            return float(row.get(name) or 0)
        except (TypeError, ValueError):
            return 0

    actions = []

    if risk_level == "HIGH":
        actions.append({
            "priority": "IMMEDIATE",
            "action": "Inspect the asset before normal operation continues."
        })

    if number("maintenance_delay_days") >= 30:
        actions.append({
            "priority": "HIGH",
            "action": "Schedule the overdue maintenance."
        })

    if number("temperature") > 90:
        actions.append({
            "priority": "HIGH",
            "action": "Investigate abnormal temperature and verify the sensor."
        })

    if str(row.get("inspection_issue")).strip().lower() in {
        "yes", "true", "1", "y", "issue", "abnormal"
    }:
        actions.append({
            "priority": "HIGH",
            "action": "Review the latest inspection findings."
        })

    if data_quality < 70:
        actions.append({
            "priority": "HIGH",
            "action": "Verify incomplete or invalid data before relying on the assessment."
        })

    if not actions:
        actions.append({
            "priority": "LOW",
            "action": "Continue routine monitoring."
        })

    return actions
