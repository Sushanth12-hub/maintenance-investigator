import os
from fastapi import FastAPI, UploadFile, File, Form, Query
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.analysis import analyze_dynamic_investigation, run_investigation
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

@app.post("/api/investigate/upload")
async def upload_investigation(
    equipment_tag: str = Form("PUMP P-204"),
    csv_file: UploadFile = File(...),
    shift_file: UploadFile = File(...),
    oem_file: UploadFile = File(...),
    image_file: UploadFile = File(None)
):
    csv_bytes = await csv_file.read()
    shift_bytes = await shift_file.read()
    oem_bytes = await oem_file.read()
    img_bytes = await image_file.read() if image_file else None

    return analyze_dynamic_investigation(
        csv_bytes=csv_bytes,
        shift_bytes=shift_bytes,
        oem_bytes=oem_bytes,
        image_bytes=img_bytes,
        equipment_tag=equipment_tag
    )

@app.post("/api/investigate/run")
def run_preset(asset: str = Query("P-204")):
    return run_investigation(asset_id=asset)

@app.get("/api/investigate/report", response_class=HTMLResponse)
def get_report(asset: str = Query("P-204")):
    data = run_investigation(asset_id=asset)
    return generate_html_report(data)
