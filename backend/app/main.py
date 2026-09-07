import os
from fastapi import FastAPI, UploadFile, File, Form, Query, Body
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.analysis import run_investigation, analyze_dynamic_investigation
from app.reports import generate_statutory_audit_html, generate_html_report
from app.historian import historian_client

app = FastAPI(title="SIH-26117 Autonomous Forensic Core")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

demo_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../demo-data"))
if os.path.exists(demo_dir):
    app.mount("/demo-data", StaticFiles(directory=demo_dir), name="demo-data")

@app.get("/api/health")
def health_check():
    return {"status": "HEALTHY", "node": "FORENSIC-CORE-01"}

@app.post("/api/investigate/run")
def run_preset(asset: str = Query("P-204")):
    return run_investigation(asset_id=asset)

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

@app.get("/api/investigate/report", response_class=HTMLResponse)
def get_report(asset: str = Query("P-204")):
    data = run_investigation(asset_id=asset)
    return generate_statutory_audit_html(data)

@app.post("/api/investigate/report-dynamic", response_class=HTMLResponse)
def get_dynamic_report(data: dict = Body(...)):
    return generate_statutory_audit_html(data)

@app.get("/api/historian/status")
async def get_historian_status():
    return {
        "connected": historian_client.connected,
        "endpoint": historian_client.endpoint_url,
        "protocol": "OPC-UA / IEC 62541",
        "buffered_samples": len(historian_client.buffer),
        "buffer_limit": historian_client.buffer_limit
    }

@app.post("/api/historian/connect")
async def connect_historian():
    return await historian_client.connect()

@app.post("/api/historian/stream")
def ingest_live_sample(
    tag: str = Query("PUMP P-204"),
    vibration: float = Query(7.5),
    temperature: float = Query(78.5)
):
    return historian_client.ingest_live_sample(tag, vibration, temperature)

@app.post("/api/historian/investigate")
def investigate_from_historian(asset: str = Query("P-204")):
    csv_bytes = historian_client.export_buffer_as_csv_bytes()
    data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../demo-data"))
    shift_name = "WO-204-8821_shiftlog.pdf" if "204" in asset else "WO-101-4412_shiftlog.pdf"
    oem_name = "OEM_P204_limits.pdf" if "204" in asset else "OEM_P101_limits.pdf"

    with open(os.path.join(data_dir, shift_name), "rb") as f:
        shift_b = f.read()
    with open(os.path.join(data_dir, oem_name), "rb") as f:
        oem_b = f.read()

    return analyze_dynamic_investigation(
        csv_bytes=csv_bytes,
        shift_bytes=shift_b,
        oem_bytes=oem_b,
        equipment_tag=f"PUMP {asset} (LIVE SCADA)"
    )

dist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend/dist"))
if os.path.exists(dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_path, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_target = os.path.join(dist_path, full_path)
        if full_path and os.path.exists(file_target) and os.path.isfile(file_target):
            return FileResponse(file_target)
        return FileResponse(os.path.join(dist_path, "index.html"))
