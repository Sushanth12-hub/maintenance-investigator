import os
import pandas as pd
from PIL import Image, ImageDraw
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

os.makedirs("demo-data", exist_ok=True)

# 1. Telemetry CSV
csv_text = """timestamp,vibration_mm_s,bearing_temp_c
2026-09-05 08:00,4.2,71.0
2026-09-05 10:00,4.8,72.1
2026-09-05 12:00,5.6,73.5
2026-09-05 14:00,6.4,75.0
2026-09-05 16:00,7.4,77.2
2026-09-05 18:00,8.3,79.8
2026-09-05 20:00,9.1,82.4"""
with open("demo-data/P204_sensor_24h.csv", "w") as f:
    f.write(csv_text.strip())

# 2. Shift Log PDF
c = canvas.Canvas("demo-data/WO-204-8821_shiftlog.pdf", pagesize=letter)
c.setFont("Helvetica-Bold", 14)
c.drawString(50, 750, "MAINTENANCE WORK ORDER & OPERATOR SHIFT LOG")
c.setFont("Helvetica", 10)
c.drawString(50, 730, "EQUIPMENT TAG: P-204 (Boiler Feed Pump) | DATE: 2026-09-05")
c.drawString(50, 715, "OPERATOR: D. Sharma | SHIFT: Day Shift (08:00 - 16:00)")
c.line(50, 705, 550, 705)
c.setFont("Helvetica-Bold", 11)
c.drawString(50, 680, "Shift Observations:")
c.setFont("Helvetica", 10)
c.drawString(60, 660, "- 09:15: Standard rounds conducted. Pump operating smoothly.")
c.drawString(60, 640, "- 11:30: Visual check normal; zero operational anomalies detected.")
c.drawString(60, 620, "- 14:00: Routine oil level topped up. No surface leakage observed.")
c.setFont("Helvetica-Bold", 11)
c.drawString(50, 580, "Intervention History:")
c.setFont("Helvetica", 10)
c.drawString(60, 560, "- Prior intervention: Drive-end bearing replaced 45 days ago under PM-109.")
c.save()

# 3. OEM Specification Limits PDF
c2 = canvas.Canvas("demo-data/OEM_P204_limits.pdf", pagesize=letter)
c2.setFont("Helvetica-Bold", 14)
c2.drawString(50, 750, "PUMP P-204 OEM OPERATIONAL SPECIFICATIONS")
c2.setFont("Helvetica", 10)
c2.drawString(50, 730, "MANUFACTURER ENVELOPE & TOLERANCES - ISO 10816-3 CLASS II")
c2.line(50, 720, 550, 720)
c2.setFont("Helvetica-Bold", 11)
c2.drawString(50, 690, "Vibration Thresholds:")
c2.setFont("Helvetica", 10)
c2.drawString(60, 670, "- Permissible Operating Envelope: <= 4.5 mm/s RMS")
c2.drawString(60, 650, "- Critical Alarm Limit: 7.1 mm/s RMS Peak")
c2.drawString(60, 630, "- Mandatory Plant Trip Threshold: 9.0 mm/s")
c2.setFont("Helvetica-Bold", 11)
c2.drawString(50, 590, "Thermal & Lubrication Limits:")
c2.setFont("Helvetica", 10)
c2.drawString(60, 570, "- Maximum Steady State Temperature: 80.0 C")
c2.drawString(60, 550, "- Relubrication Interval: 720 Operating Hours")
c2.save()

# 4. Housing Photo Asset
img = Image.new("RGB", (600, 400), color=(40, 50, 65))
d = ImageDraw.Draw(img)
d.text((30, 30), "P-204 Drive-End Housing Visual Inspection", fill=(255, 255, 255))
d.rectangle([150, 100, 450, 300], outline=(225, 29, 72), width=3)
d.text((160, 310), "Micro-fretting around seal lip", fill=(254, 202, 202))
img.save("demo-data/P204_bearing_housing.jpg")

print("Generated all demonstration assets in /demo-data.")
