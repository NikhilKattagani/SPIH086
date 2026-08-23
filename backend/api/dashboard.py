from fastapi import APIRouter

from backend.db.repository import latest_rankings, audit_history, latest_summary

router = APIRouter(tags=["Dashboard"])


@router.get("/rankings")
def rankings():
    return {"results": latest_rankings()}


@router.get("/audit")
def audit():
    return {"results": audit_history()}


@router.get("/summary")
def summary():
    return latest_summary()
