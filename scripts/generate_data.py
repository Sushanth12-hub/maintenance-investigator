import os
import pandas as pd
import numpy as np
import pymupdf
from PIL import Image, ImageDraw

demo_dir = os.path.abspath("demo-data")
os.makedirs(demo_dir, exist_ok=True)

# -------------------------------------------------------------
# Case 1: Pump P-204 (Boiler Feed Pump - Bearing Degradation)
# -------------------------------------------------------------
p204_times = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]
p204_df = pd.DataFrame({
    "timestamp": [f"2026-09-06 {t}" for t in p204_times],
    "vibration_mm_s": [4.2, 4.8, 5.6, 6.4, 7.4, 8.3, 9.1],
    "bearing_temp_c": [71.0, 72.1, 73.5, 75.0, 77.2, 79.8, 82.4]
})
p204_df.to_csv(os.path.join(demo_dir, "P204_sensor_24h.csv"), index=False)

# P-204 Work Order PDF
doc = pymupdf.open()
page = doc.new_page()
text_p204 = """WORK ORDER & SHIFT TURNOVER LOG
Asset: P-204 Boiler Feed Pump
Date: 2026-09-06 | Shift: B
Maintenance History: Drive-End Bearing replaced 45 days ago (SKF 6312 C3).
Operator Notes: Visual check normal; zero operational anomalies detected during walkdown.
Lubrication: 250ml Mobil SHC 626 added during routine round."""
page.insert_text((50, 72), text_p204, fontsize=11)
doc.save(os.path.join(demo_dir, "WO-204-8821_shiftlog.pdf"))
doc.close()

# P-204 OEM PDF
doc = pymupdf.open()
page = doc.new_page()
text_p204_oem = """OEM SPECIFICATION & ALARM LIMITS: MODEL BFP-204
Manufacturer: Sulzer Industrial Pumps
Standards: ISO 10816-3 Class II (Rigid Mount Heavy Duty)
Vibration Velocity Alarm Threshold: 7.1 mm/s RMS
Bearing Temperature Max Continuous: 80.0 C
Standard Regreasing Interval: 720 Operating Hours"""
page.insert_text((50, 72), text_p204_oem, fontsize=11)
doc.save(os.path.join(demo_dir, "OEM_P204_limits.pdf"))
doc.close()

# -------------------------------------------------------------
# Case 2: Pump P-101 (Crude Transfer Pump - Shaft Misalignment)
# -------------------------------------------------------------
p101_times = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]
p101_df = pd.DataFrame({
    "timestamp": [f"2026-09-06 {t}" for t in p101_times],
    "vibration_mm_s": [6.8, 7.0, 7.2, 7.3, 7.5, 7.6, 7.8],  # Moderate persistent breach at 2X shaft rate
    "bearing_temp_c": [65.2, 65.5, 65.8, 66.0, 66.2, 66.4, 66.5] # Thermal slope is flat!
})
p101_df.to_csv(os.path.join(demo_dir, "P101_sensor_24h.csv"), index=False)

# P-101 Work Order PDF
doc = pymupdf.open()
page = doc.new_page()
text_p101 = """WORK ORDER & SHIFT TURNOVER LOG
Asset: P-101 Heavy Crude Transfer Pump
Date: 2026-09-06 | Shift: B
Maintenance History: Drive motor replaced during turnaround 3 days ago. No laser alignment log found.
Operator Notes: High audible hum observed near flexible disc coupling.
Lubrication: Reservoir level optimal. Oil clean and clear."""
page.insert_text((50, 72), text_p101, fontsize=11)
doc.save(os.path.join(demo_dir, "WO-101-4412_shiftlog.pdf"))
doc.close()

# P-101 OEM PDF
doc = pymupdf.open()
page = doc.new_page()
text_p101_oem = """OEM SPECIFICATION & ALARM LIMITS: MODEL CTP-101
Standards: ISO 10816-3 Class II (Rigid Mount Heavy Duty)
Vibration Velocity Alarm Threshold: 4.5 mm/s RMS (Continuous Alert at 7.1 mm/s)
Maximum Allowable Angular Misalignment: 0.05 mm across coupling faces
Maximum Allowable Radial Offset: 0.03 mm TIR"""
page.insert_text((50, 72), text_p101_oem, fontsize=11)
doc.save(os.path.join(demo_dir, "OEM_P101_limits.pdf"))
doc.close()

print("Synthetic refinery telemetry and OEM specifications generated for P-204 and P-101.")
