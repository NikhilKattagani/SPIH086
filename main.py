from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.analyze import router as analyze_router
from backend.api.dashboard import router as dashboard_router
from backend.db.database import initialize_database

app = FastAPI(
    title="RiskRadar API",
    version="1.0.0",
    description="Explainable industrial safety risk analysis"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

initialize_database()

app.include_router(analyze_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")


@app.get("/")
def root():
    return {
        "application": "RiskRadar",
        "status": "online",
        "version": "1.0.0"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}