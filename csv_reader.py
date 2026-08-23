from io import BytesIO
import pandas as pd

REQUIRED_COLUMNS = {
    "asset_id",
    "asset_name",
    "asset_type",
    "failure_count",
    "maintenance_delay_days",
    "inspection_issue",
    "temperature",
    "incident_count"
}


def read_csv_upload(content: bytes):
    try:
        dataframe = pd.read_csv(BytesIO(content))
    except Exception as exc:
        raise ValueError(f"Invalid CSV: {exc}")

    if dataframe.empty:
        raise ValueError("CSV contains no records.")

    missing = sorted(REQUIRED_COLUMNS - set(dataframe.columns))

    if missing:
        raise ValueError(
            "Missing required columns: " + ", ".join(missing)
        )

    return dataframe
