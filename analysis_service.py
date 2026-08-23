from datetime import datetime, timezone
import pandas as pd

from backend.services.data_quality import calculate as calculate_quality
from backend.services.risk_engine import calculate as calculate_risk
from backend.services.confidence import calculate as calculate_confidence
from backend.services.explanation import explain, changes
from backend.services.actions import recommend


def previous_score(row):
    try:
        return int(float(row.get("previous_score", 0)))
    except (TypeError, ValueError):
        return 0


def analyze_assets(dataframe: pd.DataFrame):
    results = []

    for _, row in dataframe.iterrows():
        quality = calculate_quality(row)
        score, level, evidence = calculate_risk(row)

        critical_fields = sum(
            1 for field in [
                "failure_count",
                "maintenance_delay_days",
                "temperature",
                "inspection_issue",
                "incident_count"
            ]
            if field in row.index and not pd.isna(row.get(field))
        )

        confidence = calculate_confidence(
            quality["score"],
            len(evidence),
            critical_fields
        )

        old_score = previous_score(row)
        asset_name = str(row.get("asset_name", row.get("asset_id", "")))

        results.append({
            "asset_id": str(row.get("asset_id", "")),
            "asset_name": asset_name,
            "asset_type": str(row.get("asset_type", "")),
            "location": str(row.get("location", "")),
            "risk_score": score,
            "risk_level": level,
            "confidence": confidence,
            "data_quality": quality["score"],
            "data_quality_rating": quality["rating"],
            "data_quality_warning": quality["warning"],
            "previous_score": old_score,
            "risk_change": score - old_score,
            "trend": [old_score, score] if old_score else [score],
            "evidence": evidence,
            "explanation": explain(asset_name, level, evidence),
            "changes": changes(row, old_score, score),
            "actions": recommend(row, level, quality["score"]),
            "created_at": datetime.now(timezone.utc).isoformat(timespec="seconds")
        })

    results.sort(
        key=lambda item: (item["risk_score"], item["confidence"]),
        reverse=True
    )

    for index, result in enumerate(results, 1):
        result["priority_rank"] = index

    return results
