# RiskRadar Complete Backend — MVP

## Pipeline

CSV → Validation → Data Quality → Risk Engine → Confidence → Explanation
→ Recommendation → Priority Ranking → Audit Log → FastAPI

## Run

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open:
http://127.0.0.1:8000/docs

Test:
POST /analyze with data/sample_industrial_data.csv

Then:
GET /rankings
GET /audit
GET /assets

## Important

Risk thresholds, weights, confidence calculation and data-quality thresholds are
hackathon prototype logic. They are NOT industrial safety standards, certified
safety limits, or guarantees of accident prevention.

Before production, thresholds must be validated with domain safety experts and
historical incident data.
