import os
from fastapi import FastAPI, Query
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.analysis import run_investigation
from app.reports import generate_html_report

app = FastAPI(title="SIH 26117 Maintenance Core")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

demo_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../demo-data"))
if os.path.exists(demo_dir):
    app.mount("/demo-data", StaticFiles(directory=demo_dir), name="demo-data")

@app.post("/api/investigate/run")
def run(asset: str = Query("P-204")):
    return run_investigation(asset_id=asset)

@app.get("/api/investigate/report", response_class=HTMLResponse)
def get_report(asset: str = Query("P-204")):
    data = run_investigation(asset_id=asset)
    return generate_html_report(data)
