import io
import pandas as pd
from app.analysis import analyze_dynamic_investigation

def generate_mock_csv(peak_vib: float, temp_rise: float) -> bytes:
    times = [f"2026-09-06 {i:02d}:00:00" for i in range(12)]
    vibs = [1.2] * 11 + [peak_vib]
    temps = [40.0 + (i * temp_rise) for i in range(12)]
    df = pd.DataFrame({"timestamp": times, "vibration_velocity": vibs, "bearing_temperature": temps})
    buf = io.BytesIO()
    df.to_csv(buf, index=False)
    return buf.getvalue()

MOCK_OEM_PDF = b"%PDF-1.4 Mock ISO 10816-3 velocity limit: 7.1 mm/s. Rigid foundation Class II."
MOCK_SHIFT_NORMAL_PDF = b"%PDF-1.4 Technician Shift Turnover: Visual check normal; zero operational anomalies detected."

def test_bearing_degradation_identification():
    csv_bytes = generate_mock_csv(peak_vib=9.1, temp_rise=1.2)
    res = analyze_dynamic_investigation(csv_bytes, MOCK_SHIFT_NORMAL_PDF, MOCK_OEM_PDF, equipment_tag="ASSET-01")
    assert "Bearing" in res["hypotheses"][0]["title"]
    assert res["metrics"]["peak_vibration"]["breached"] is True
    assert res["metrics"]["temperature_rate_of_rise"]["breached"] is True
    assert len(res["contradictions"]) == 1

def test_misalignment_identification():
    csv_bytes = generate_mock_csv(peak_vib=7.8, temp_rise=0.02)
    res = analyze_dynamic_investigation(csv_bytes, MOCK_SHIFT_NORMAL_PDF, MOCK_OEM_PDF, equipment_tag="ASSET-02")
    assert "Misalignment" in res["hypotheses"][0]["title"]
    assert res["metrics"]["peak_vibration"]["breached"] is True
    assert res["metrics"]["temperature_rate_of_rise"]["breached"] is False

def test_nominal_baseline():
    csv_bytes = generate_mock_csv(peak_vib=2.1, temp_rise=0.01)
    res = analyze_dynamic_investigation(csv_bytes, MOCK_SHIFT_NORMAL_PDF, MOCK_OEM_PDF, equipment_tag="ASSET-03")
    assert "Nominal" in res["hypotheses"][0]["title"]
    assert res["metrics"]["peak_vibration"]["breached"] is False
    assert len(res["contradictions"]) == 0
