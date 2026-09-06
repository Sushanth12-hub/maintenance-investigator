# SIH-26117: Autonomous Industrial Incident Forensic Investigator

[![Python 3.11](https://img.shields.io/badge/Python-3.11-3776AB.svg?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB.svg?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwindcss)](https://tailwindcss.com)
[![Ollama](https://img.shields.io/badge/Edge_LLM-Llama_3.2-white.svg)](https://ollama.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Core Thesis:** Plants do not lack sensor data; they lack cross-examination. This platform is an **offline, evidence-cited incident investigation copilot** that detects contradictions between raw SCADA telemetry, operator shift handovers, OEM operating envelopes, and optical inspection photos to construct human-verifiable forensic dossiers in under 5 seconds.

---

## 1. Problem Statement & Industrial Context

Heavy process plants (power generation, petrochemical refineries, chemical processing) suffer catastrophic mechanical trip events and unplanned outages due to critical information silos:

1. **Subjective Human Reporting:** Field technicians on shift walkdowns routinely record superficial checkouts (*"Visual check normal; zero operational anomalies detected"*), failing to perceive internal bearing friction or early spall propagation.
2. **Siloed Telemetry:** Calibrated SCADA vibration velocity transmitters and bearing RTDs log signals continuously without cross-referencing written turnover logs.
3. **Static Engineering Limits:** OEM vibration standards (ISO 10816-3 Zone Boundaries) remain buried in manufacturer specification PDFs rather than actively policing data streams.
4. **Non-Technical Communication Gap:** Post-incident investigations demand days of manual correlation between CSV logs, PDF work orders, and NDT photos. Non-technical leadership and regulatory inspectors struggle to parse raw time-series kinematics.

---

## 2. System Architecture

\                                 [Air-Gapped Local Environment]
                                                 │
       ┌────────────────────────┬────────────────┼────────────────────────┐
       ▼                        ▼                ▼                        ▼
[SCADA Telemetry]       [Shift Turnover]    [OEM Manual]           [NDT Photos]
   (.csv stream)          (PDF Work Order)   (ISO Limits PDF)       (JPG / PNG)
       │                        │                │                        │
       ▼                        ▼                ▼                        ▼
┌──────────────┐        ┌──────────────┐  ┌──────────────┐         ┌──────────────┐
│ NumPy Engine │        │ PyMuPDFFitz  │  │ Regex Parser │         │ PIL / NumPy  │
│  - max(v_t)  │        │ - p.1 worker │  │ - ISO 10816  │         │ - Edge mask  │
│  - polyfit() │        │   statements │  │   threshold  │         │ - Fluid seep │
└──────┬───────┘        └──────┬───────┘  └──────┬───────┘         └──────┬───────┘
       │                       │                 │                        │
       └───────────────────────┼─────────────────┴────────────────────────┘
                               ▼
            ┌────────────────────────────────────────┐
            │  DETERMINISTIC CONTRADICTION ENGINE   │
            │  Cross-checks physical math vs claims  │
            └──────────────────┬─────────────────────┘
                               │
            ┌──────────────────┴─────────────────────┐
            ▼                                        ▼
┌─────────────────────────┐              ┌─────────────────────────┐
│ Edge LLM Synthesis      │              │ Forensic Blueprint UI   │
│ - Local Ollama llama3.2 │              │ - Recharts time-series  │
│ - Plain-English summary │              │ - Calculation trace HUD │
│ - Human approval notice │              │ - Statutory PDF auditor │
└─────────────────────────┘              └─────────────────────────┘
\
---

## 3. Key Technical Innovations

* **Deterministic Kinematic Decision Tree:** Evaluates faults purely on calculated physical invariants:
  * **Bearing Degradation:** Peak velocity exceeds threshold and thermal gradient dT/dt > 0.40°C/h.
  * **Shaft Misalignment:** Peak velocity exceeds threshold with flat thermal gradient (dT/dt <= 0.40°C/h).
  * **Nominal Baseline:** All metrics within ISO 10816 boundaries.
* **Computer Vision Contrast Profiler:** Identifies fluid weepage or structural anomalies on uploaded NDT imagery using adaptive variance thresholding without cloud inference dependencies.
* **Structural Citation Indexing:** Every conclusion cites exact evidence sources: raw CSV row index, exact timestamp, PDF page numbers, and ISO threshold clauses.
* **Local Edge LLM Inference:** Uses on-device \llama3.2\ via Ollama to translate technical findings into layman terms for cross-functional stakeholders with 100% deterministic fallback guarantees.
* **Safety & Responsibility Disclaimer:** Designed strictly as **read-only decision support**. All Lockout/Tagout (LOTO) protocols and Permit-to-Work (PTW) classifications mandate verified human engineer approval.

---

## 4. Repository Structure

\maintenance-investigator/
├── backend/
│   ├── app/
│   │   ├── analysis.py       # Kinematic physics, CV profiler & Ollama pipeline
│   │   ├── main.py           # FastAPI multipart upload & preset endpoints
│   │   └── reports.py        # Statutory ISO compliance audit HTML/PDF engine
│   ├── tests/
│   │   └── test_investigation.py  # Pytest suite for kinematics & edge-cases
│   └── requirements.txt      # FastAPI, PyMuPDF, Pandas, NumPy, Pillow
├── frontend/
│   ├── public/               # Industrial visual assets (Refinery bay, NDT captures)
│   ├── src/
│   │   ├── App.tsx           # Technical Blueprint cockpit & trace drawer
│   │   ├── index.css         # High-contrast Blueprint palette (#F1F5F9 canvas)
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── demo-data/                # Verified field assets (P-204 & P-101 dossiers)
└── README.md
\
---

## 5. Quickstart Installation

### Prerequisites
* Python 3.11+
* Node.js 18+ and npm
* Ollama (Optional for live LLM translation; deterministic fallbacks active if offline)

### 1. Backend Setup
\\ash
cd backend
python -m venv venv

# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
pytest tests/ -v
uvicorn app.main:app --reload --port 8000
\
### 2. Frontend Setup
\\ash
cd frontend
npm install
npm run dev
\Open browser at \http://localhost:5173\.

### 3. Local Edge LLM (Optional)
\\ash
ollama run llama3.2
\
---

## 6. Automated Test Suite

Run the unit test matrix across kinematic regimes:
\\ash
pytest backend/tests/test_investigation.py -v
\Expected output:
\tests/test_investigation.py::test_bearing_degradation_identification PASSED
tests/test_investigation.py::test_misalignment_identification PASSED
tests/test_investigation.py::test_nominal_baseline PASSED
\
---

## 7. Demo Dossiers

| Asset ID | Machine Type | Ingested Evidence | Physics Findings | Contradiction Detected |
| :--- | :--- | :--- | :--- | :--- |
| **P-204** | Boiler Feedwater Pump | CSV Telemetry, Shift Work Order, OEM Limits, NDT Photo | Peak vib = 9.1 mm/s (Limit: 7.1 mm/s), dT/dt = +0.62°C/h | Operator logged "normal status"; sensor proves active bearing spalling & seal weepage. |
| **P-101** | Crude Transfer Pump | CSV Telemetry, Shift Work Order, OEM Limits, Coupling Photo | Peak vib = 7.8 mm/s (Limit: 4.5 mm/s), dT/dt = +0.07°C/h | Operator missed angular coupling runout; zero thermal friction proves pure misalignment. |

---

## 8. Disclaimer
*This platform is an offline decision-support tool. LOTO isolation procedures, PTW releases, and statutory compliance certifications require formal verification and sign-off by a certified reliability engineer before mechanical disassembly or plant action.*
