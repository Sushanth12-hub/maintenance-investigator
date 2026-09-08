import os
import numpy as np
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

# Issue 9 Fix: Script-relative absolute path
BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.abspath(os.path.join(BASE_DIR, "../demo-data"))
os.makedirs(DATA_DIR, exist_ok=True)

def generate_csv(filename, peak_vib=9.1, slope=0.62):
    timestamps = pd.date_range("2026-03-01 00:00", periods=12, freq="2h")
    vibrations = np.linspace(2.1, peak_vib, 12)
    temperatures = 55.0 + slope * (np.arange(12) * 2.0)
    df = pd.DataFrame({
        "timestamp": timestamps.strftime("%Y-%m-%d %H:%M"),
        "velocity_mm_s": np.round(vibrations, 2),
        "bearing_temp_c": np.round(temperatures, 1)
    })
    df.to_csv(os.path.join(DATA_DIR, filename), index=False)

def generate_pdf(filename, title, content_lines):
    path = os.path.join(DATA_DIR, filename)
    c = canvas.Canvas(path, pagesize=letter)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, 750, title)
    c.setFont("Helvetica", 10)
    y = 720
    for line in content_lines:
        c.drawString(50, y, line)
        y -= 18
    c.save()

if __name__ == "__main__":
    generate_csv("P204_sensor_24h.csv", peak_vib=9.1, slope=0.62)
    generate_csv("P101_sensor_24h.csv", peak_vib=7.8, slope=0.07)

    generate_pdf(
        "WO-204-8821_shiftlog.pdf",
        "P-204 Daily Shift Turnover Log",
        [
            "Asset: Boiler Feedwater Pump P-204",
            "Operator: Tech-412 (Shift B)",
            "Visual check normal; zero operational anomalies detected during walkdown.",
            "Seal flush steady at 1.2 barg.",
            "Status: Satisfactory for continued continuous duty."
        ]
    )

    generate_pdf(
        "OEM_P204_limits.pdf",
        "OEM Specification Sheet - P-204",
        [
            "Equipment: API 610 Multistage Centrifugal Pump",
            "ISO-10816-3 Velocity Vibration Boundary Zone C/D: 7.1 mm/s",
            "Maximum continuous bearing temperature: 80.0 C",
            "Mounting: Rigid Foundation (Group 1)"
        ]
    )
    print(f"Data generated successfully in {DATA_DIR}")
