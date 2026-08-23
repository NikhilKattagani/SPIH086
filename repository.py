from datetime import datetime, timezone

from backend.db.database import get_connection


def now():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def save_analysis(results):
    connection = get_connection()
    cursor = connection.cursor()
    timestamp = now()

    cursor.execute(
        "INSERT INTO analysis_batches(created_at, asset_count) VALUES (?, ?)",
        (timestamp, len(results))
    )

    batch_id = cursor.lastrowid

    for result in results:
        cursor.execute("""
            INSERT INTO assets(asset_id, asset_name, asset_type, location)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(asset_id) DO UPDATE SET
                asset_name=excluded.asset_name,
                asset_type=excluded.asset_type,
                location=excluded.location
        """, (
            result["asset_id"],
            result["asset_name"],
            result["asset_type"],
            result.get("location", "")
        ))

        cursor.execute("""
            INSERT INTO assessments(
                batch_id, asset_id, risk_score, risk_level,
                confidence, data_quality, previous_score,
                risk_change, explanation, created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            batch_id,
            result["asset_id"],
            result["risk_score"],
            result["risk_level"],
            result["confidence"],
            result["data_quality"],
            result["previous_score"],
            result["risk_change"],
            result["explanation"],
            timestamp
        ))

        assessment_id = cursor.lastrowid

        for item in result["evidence"]:
            cursor.execute("""
                INSERT INTO evidence(
                    assessment_id, factor, contribution,
                    severity, explanation
                )
                VALUES (?, ?, ?, ?, ?)
            """, (
                assessment_id,
                item["factor"],
                item["contribution"],
                item["severity"],
                item["explanation"]
            ))

        for item in result["actions"]:
            cursor.execute("""
                INSERT INTO actions(assessment_id, priority, action)
                VALUES (?, ?, ?)
            """, (
                assessment_id,
                item["priority"],
                item["action"]
            ))

    cursor.execute("""
        INSERT INTO audit_events(
            batch_id, event_type, message, created_at
        )
        VALUES (?, ?, ?, ?)
    """, (
        batch_id,
        "ANALYSIS_COMPLETED",
        f"Risk analysis completed for {len(results)} assets.",
        timestamp
    ))

    connection.commit()
    connection.close()

    return batch_id


def latest_rankings():
    connection = get_connection()

    rows = connection.execute("""
        SELECT
            a.asset_id,
            a.asset_name,
            a.asset_type,
            a.location,
            r.risk_score,
            r.risk_level,
            r.confidence,
            r.data_quality,
            r.previous_score,
            r.risk_change,
            r.explanation,
            r.created_at
        FROM assessments r
        JOIN assets a ON a.asset_id = r.asset_id
        WHERE r.id IN (
            SELECT MAX(id)
            FROM assessments
            GROUP BY asset_id
        )
        ORDER BY r.risk_score DESC, r.confidence DESC
    """).fetchall()

    connection.close()

    result = [dict(row) for row in rows]

    for index, item in enumerate(result, 1):
        item["priority_rank"] = index

    return result


def audit_history():
    connection = get_connection()

    rows = connection.execute("""
        SELECT *
        FROM audit_events
        ORDER BY id DESC
        LIMIT 100
    """).fetchall()

    connection.close()

    return [dict(row) for row in rows]


def latest_summary():
    connection = get_connection()

    row = connection.execute("""
        SELECT
            COUNT(*) AS total_assets,
            SUM(CASE WHEN risk_level='HIGH' THEN 1 ELSE 0 END) AS high_risk,
            SUM(CASE WHEN risk_level='MEDIUM' THEN 1 ELSE 0 END) AS medium_risk,
            SUM(CASE WHEN risk_level='LOW' THEN 1 ELSE 0 END) AS low_risk,
            ROUND(AVG(confidence), 0) AS avg_confidence,
            ROUND(AVG(data_quality), 0) AS avg_data_quality
        FROM assessments
        WHERE id IN (
            SELECT MAX(id)
            FROM assessments
            GROUP BY asset_id
        )
    """).fetchone()

    connection.close()

    return dict(row) if row else {}
