def generate_html_report(data: dict) -> str:
    investigation_id = data.get("investigation_id", "INV-2026-UNKNOWN")
    equipment_tag = data.get("equipment_tag", "UNKNOWN ASSET")
    timestamp = data.get("timestamp", "2026-09-06T12:00:00Z")
    metrics = data.get("metrics", {})
    hypotheses = data.get("hypotheses", [])
    contradictions = data.get("contradictions", [])
    inspection_plan = data.get("inspection_plan", [])
    ai_summary = data.get("ai_summary", {})

    peak_vib = metrics.get("peak_vibration", {}).get("value", "N/A")
    peak_thresh = metrics.get("peak_vibration", {}).get("threshold", "7.1")
    peak_breached = metrics.get("peak_vibration", {}).get("breached", False)

    temp_slope = metrics.get("temperature_rate_of_rise", {}).get("value", "N/A")
    temp_breached = metrics.get("temperature_rate_of_rise", {}).get("breached", False)

    top_hyp = hypotheses[0] if hypotheses else {"title": "Under Investigation", "score": 0, "confidence": 0.0}
    top_score = top_hyp.get("score")
    if top_score is None:
        top_score = int(top_hyp.get("confidence", 0.85) * 100)

    hypotheses_html = ""
    for h in hypotheses:
        status_color = "#047857" if "PRIMARY" in h.get("status", "") else "#475569"
        score = h.get("score")
        if score is None:
            score = int(h.get("confidence", 0.0) * 100)
        reasons_li = "".join([f"<li>{r}</li>" for r in h.get("reasons", [])])
        hypotheses_html += f"""
        <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px; margin-bottom: 10px; background: #f8fafc;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 6px;">
                <span style="color: {status_color};">{h.get('id', 'H')}: {h.get('title')}</span>
                <span style="background: #e2e8f0; padding: 2px 8px; border-radius: 4px; font-family: monospace;">{score}% Match</span>
            </div>
            <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #334155;">
                {reasons_li}
            </ul>
        </div>
        """

    contradictions_html = ""
    for c in contradictions:
        contradictions_html += f"""
        <div style="border-left: 4px solid #dc2626; background: #fef2f2; padding: 12px; margin-bottom: 12px; border-radius: 0 6px 6px 0;">
            <div style="color: #991b1b; font-weight: bold; font-size: 12px; margin-bottom: 6px;">EVIDENCE CONFLICT DETECTED</div>
            <div style="font-size: 12px; color: #450a0a; margin-bottom: 4px;"><strong>Human Claim:</strong> {c.get('human_claim')}</div>
            <div style="font-size: 12px; color: #450a0a;"><strong>Telemetry Claim:</strong> {c.get('objective_claim')}</div>
        </div>
        """

    safety_html = ""
    for item in inspection_plan:
        controls_li = "".join([f"<li>{ctrl}</li>" for ctrl in item.get("safety_controls", [])])
        safety_html += f"""
        <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; margin-bottom: 8px; background: #fafafa;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; margin-bottom: 4px;">
                <span>{item.get('priority')}: {item.get('title')}</span>
                <span style="font-size: 10px; background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px;">{item.get('permit_type')}</span>
            </div>
            <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748b;">{item.get('description')}</p>
            <ul style="margin: 0; padding-left: 18px; font-size: 11px; color: #b45309;">
                {controls_li}
            </ul>
        </div>
        """

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Forensic Audit Report - {equipment_tag}</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            margin: 0;
            padding: 40px;
            color: #0f172a;
            background: #ffffff;
            font-size: 13px;
        }}
        .header {{
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 16px;
            margin-bottom: 24px;
        }}
        .badge {{
            font-family: monospace;
            font-size: 11px;
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            padding: 4px 8px;
            border-radius: 4px;
        }}
        .kpi-grid {{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-bottom: 24px;
        }}
        .kpi-card {{
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            background: #f8fafc;
        }}
        .section-title {{
            font-size: 13px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #475569;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 6px;
            margin-top: 24px;
            margin-bottom: 12px;
        }}
        .print-bar {{
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #0f172a;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            cursor: pointer;
            font-weight: bold;
            font-size: 13px;
            border: none;
        }}
        @media print {{
            .print-bar {{ display: none; }}
            body {{ padding: 0; }}
        }}
    </style>
</head>
<body>
    <button class="print-bar" onclick="window.print()">Print / Save as PDF</button>

    <div class="header">
        <div>
            <h1 style="margin: 0; font-size: 20px; font-weight: 800;">STATUTORY INDUSTRIAL FORENSIC AUDIT</h1>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px;">ISO 10816-3 Condition Monitoring & LOTO Compliance Certification</p>
        </div>
        <div style="text-align: right;">
            <div class="badge">DOSSIER: {investigation_id}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">TIMESTAMP: {timestamp}</div>
        </div>
    </div>

    <div class="kpi-grid">
        <div class="kpi-card">
            <div style="font-size: 11px; color: #64748b; font-weight: bold;">PEAK VIBRATION VELOCITY</div>
            <div style="font-size: 28px; font-weight: 900; color: {'#dc2626' if peak_breached else '#16a34a'}; margin: 4px 0;">
                {peak_vib} mm/s
            </div>
            <div style="font-size: 11px; color: #64748b;">Alarm Threshold: {peak_thresh} mm/s | Formula: max(v_t)</div>
        </div>
        <div class="kpi-card">
            <div style="font-size: 11px; color: #64748b; font-weight: bold;">THERMAL RATE OF RISE</div>
            <div style="font-size: 28px; font-weight: 900; color: {'#d97706' if temp_breached else '#16a34a'}; margin: 4px 0;">
                +{temp_slope} &deg;C/h
            </div>
            <div style="font-size: 11px; color: #64748b;">Slope Criteria: 0.50 &deg;C/h | Formula: polyfit(hours, temp, 1)[0]</div>
        </div>
    </div>

    <div class="section-title">Primary Forensic Assessment</div>
    <div style="font-size: 14px; font-weight: bold; color: #0f172a; margin-bottom: 6px;">
        {top_hyp.get('title')} ({top_score}% Confidence)
    </div>

    <div class="section-title">Technical Executive Synthesis</div>
    <div style="background: #f1f5f9; border-left: 3px solid #0284c7; padding: 12px; font-size: 12px; line-height: 1.6; margin-bottom: 20px;">
        {ai_summary.get('narrative', 'Forensic cross-examination completed.')}
        <div style="font-size: 10px; color: #64748b; margin-top: 6px; font-family: monospace;">Source Engine: {ai_summary.get('source', 'Hybrid Deterministic Engine')}</div>
    </div>

    {f'<div class="section-title">Contradiction Cross-Examination</div>{contradictions_html}' if contradictions_html else ''}

    <div class="section-title">Ranked Root-Cause Hypotheses</div>
    {hypotheses_html}

    <div class="section-title">Mandatory Safety Isolation & LOTO Protocols</div>
    {safety_html}

    <div style="margin-top: 32px; border-top: 1px solid #cbd5e1; padding-top: 12px; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; font-family: monospace;">
        <span>Generated by SIH 26117 Maintenance Core</span>
        <span>MANDATORY ENGINEER REVIEW PRIOR TO PTW SIGN-OFF</span>
    </div>
</body>
</html>
"""
