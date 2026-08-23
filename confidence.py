def calculate(data_quality, evidence_count, critical_fields):
    evidence_strength = min(100, evidence_count * 20)
    field_coverage = min(100, critical_fields * 20)

    confidence = round(
        data_quality * 0.60
        + evidence_strength * 0.25
        + field_coverage * 0.15
    )

    return max(0, min(100, confidence))
