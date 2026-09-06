from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from app.analysis import run_investigation
from app.reports import generate_html_report

app = FastAPI(title="SIH 26117 Maintenance Core")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/investigate/run")
def run():
    return run_investigation()

@app.get("/api/investigate/report", response_class=HTMLResponse)
def get_report():
    data = run_investigation()
    return generate_html_report(data)
