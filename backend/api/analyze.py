from fastapi import APIRouter, UploadFile, File, HTTPException

from backend.services.csv_reader import read_csv_upload
from backend.services.analysis_service import analyze_assets
from backend.db.repository import save_analysis

router = APIRouter(tags=["Analysis"])


@router.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a CSV file."
        )

    try:
        content = await file.read()
        dataframe = read_csv_upload(content)
        results = analyze_assets(dataframe)
        batch_id = save_analysis(results)

        return {
            "success": True,
            "batch_id": batch_id,
            "asset_count": len(results),
            "results": results
        }

    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {exc}"
        )
