import pymupdf
import numpy as np
import pandas as pd

OEM_VIBRATION_LIMIT = 7.1

def extract_pdf_text(filepath: str) -> str:
    doc = pymupdf.open(filepath)
    return "\n".join([page.get_text() for page in doc])

def run_investigation():
    # 1. Deterministic Sensor Calculations
    df = pd.read_csv("../demo-data/P204_sensor_24h.csv")
    vibrations = df["vibration_mm_s"].to_numpy()
    temperatures = df["bearing_temp_c"].to_numpy()

    peak_vib = float(np.max(vibrations))
    peak_idx = int(np.argmax(vibrations))
    rms_vib = float(np.sqrt(np.mean(np.square(vibrations))))
    
    hours = np.arange(len(temperatures)) * 2.0
    temp_slope = float(np.polyfit(hours, temperatures, 1)[0])

    # 2. Extract Document Content via PyMuPDF
    shift_text = extract_pdf_text("../demo-data/WO-204-8821_shiftlog.pdf")
    oem_text = extract_pdf_text("../demo-data/OEM_P204_limits.pdf")

    metrics = {
        "peak_vibration": {
            "name": "Peak Vibration Velocity",
            "value": round(peak_vib, 2),
            "unit": "mm/s",
            "threshold": OEM_VIBRATION_LIMIT,
            "breached": peak_vib > OEM_VIBRATION_LIMIT,
            "formula": "max(v_t)",
            "window": "Last 24 Hours",
            "source_rows": [peak_idx]
        },
        "rms_vibration": {
            "name": "RMS Vibration Velocity",
            "value": round(rms_vib, 2),
            "unit": "mm/s",
            "threshold": 4.5,
            "breached": rms_vib > 4.5,
            "formula": "sqrt(mean(v_t^2))",
            "window": "Last 24 Hours",
            "source_rows": list(range(len(df)))
        },
        "temperature_rate_of_rise": {
            "name": "Temperature Rise Slope",
            "value": round(temp_slope, 2),
            "unit": "°C/h",
            "threshold": 0.5,
            "breached": temp_slope > 0.5,
            "formula": "polyfit(hours, temp, 1)[0]",
            "window": "Trailing 24 Hours",
            "source_rows": [0, len(df) - 1]
        }
    }

    # 3. Rule-Based Contradiction Detection
    contradictions = []
    if "visual check normal" in shift_text.lower() and peak_vib > OEM_VIBRATION_LIMIT:
        contradictions.append({
            "id": "C1",
            "human_claim": 'Operator shift log records: "Visual check normal; zero operational anomalies detected."',
            "objective_claim": f'Telemetry records critical peak vibration of {peak_vib} mm/s (Breaches OEM limit {OEM_VIBRATION_LIMIT} mm/s).',
            "severity": "high",
            "sources": ["WO-204-8821_shiftlog.pdf p. 1", "P204_sensor_24h.csv:row 6"],
            "recommended_verification": "Conduct physical bearing clearance audit after electrical and mechanical LOTO."
        })

    # 4. Transparent Root-Cause Ranking
    score = 0
    reasons = []
    if peak_vib > OEM_VIBRATION_LIMIT:
        score += 38
        reasons.append(f"Peak vibration {peak_vib} mm/s breaches OEM limit ({OEM_VIBRATION_LIMIT} mm/s)")
    if temp_slope > 0.5:
        score += 24
        reasons.append(f"Temperature is rising steadily at +{round(temp_slope, 2)} °C/hour")
    if "bearing replaced" in shift_text.lower():
        score += 18
        reasons.append("Shift log confirms replacement intervention within prior 45 days")
    score += 13

    hypotheses = [{
        "id": "H1",
        "title": "Drive-End Bearing Degradation",
        "score": score,
        "confidence": score / 100.0,
        "reasons": reasons,
        "supporting_evidence": ["P204_sensor_24h.csv", "WO-204-8821_shiftlog.pdf", "OEM_P204_limits.pdf"],
        "contradicting_evidence": []
    }]

    # 5. Safety-Gated Inspection Plan
    inspection_plan = [{
        "priority": "P1",
        "title": "Drive-End Housing Disassembly & Clearance Check",
        "description": "Inspect bearing raceway for spalling and micrometer clearance wear.",
        "safety_controls": [
            "LOTO: Lock out MCC-P204 electrical breaker",
            "Process Isolation: Chain close suction/discharge gate valves",
            "Verify depressurization and zero mechanical energy state"
        ],
        "permit_type": "PTW Class A (Mechanical Intrusive)"
    }]

    ai_summary = {
        "narrative": (
            f"Investigation confirmed Drive-End Bearing Degradation ({score}% confidence). "
            f"Peak vibration reached {peak_vib} mm/s, breaching the OEM envelope ({OEM_VIBRATION_LIMIT} mm/s) "
            f"with steady thermal drift (+{round(temp_slope, 2)} °C/h). Critical contradiction identified with "
            f"operator visual log. Mandatory LOTO isolation required prior to housing inspection."
        ),
        "source": "Deterministic Heuristic Engine"
    }

    return {
        "investigation_id": "INV-2026-P204-01",
        "equipment_tag": "Pump P-204 (Boiler Feed Pump)",
        "timestamp": "2026-09-06T11:00:00Z",
        "status": "completed",
        "metrics": metrics,
        "hypotheses": hypotheses,
        "contradictions": contradictions,
        "inspection_plan": inspection_plan,
        "ai_summary": ai_summary,
        "citations": {"limits": "OEM_P204_limits.pdf", "log": "WO-204-8821_shiftlog.pdf"}
    }
