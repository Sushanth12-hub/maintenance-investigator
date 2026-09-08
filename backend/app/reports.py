def generate_statutory_audit_html(data: dict) -> str:
    investigation_id = data.get("investigation_id", "INV-2026-UNKNOWN")
    equipment_tag = data.get("equipment_tag", "UNKNOWN ASSET")
    disclaimer = data.get("disclaimer", "DECISION SUPPORT SYSTEM — REQUIRES HUMAN RELIABILITY ENGINEER APPROVAL")
    chain = data.get("chain_of_custody", {})
    metrics = data.get("metrics", {})
    contradictions = data.get("contradictions", [])
    hypotheses = data.get("hypotheses", [])
    plan = data.get("inspection_plan", [])

    peak_vib = metrics.get("peak_vibration", {})
    temp_rate = metrics.get("temperature_rate_of_rise", {})
    violation_dur = metrics.get("violation_duration", {})

    dur_val = violation_dur.get("value", 0)
    dur_breached = violation_dur.get("breached", False)

    contradictions_html = ""
    for c in contradictions:
        contradictions_html += f"""
        <div style="background:#FFF1F2; border-left:4px solid #E11D48; padding:12px; margin-bottom:10px; border-radius:4px;">
            <div style="font-weight:bold; color:#9F1239; font-size:12px; margin-bottom:6px;">DISCREPANCY #{c.get('id', 'C1')}</div>
            <div style="font-size:13px; color:#1E293B; margin-bottom:4px;"><strong>Operator Claim:</strong> {c.get('human_claim', 'N/A')}</div>
            <div style="font-size:13px; color:#BE123C;"><strong>Sensor Reality:</strong> {c.get('objective_claim', 'N/A')}</div>
            <div style="font-size:11px; color:#64748B; margin-top:4px;">Sources: {', '.join(c.get('sources', []))}</div>
        </div>
        """

    if not contradictions_html:
        contradictions_html = "<p style='color:#059669; font-weight:600;'>No hard human-vs-sensor contradictions detected.</p>"

    # Issue 8 Fix: Distinct styling based on explicit status key
    hypotheses_html = ""
    for idx, h in enumerate(hypotheses):
        reasons_html = "".join([f"<li>{r}</li>" for r in h.get("reasons", [])])
        status_val = h.get("status", "CONFIRMED CRITICAL" if idx == 0 else "SECONDARY CONSIDERATION")
        is_primary = idx == 0 or "CRITICAL" in status_val.upper() or "CONFIRMED" in status_val.upper()
        badge_bg = "#FFE4E6" if is_primary else "#E0F2FE"
        badge_text = "#BE123C" if is_primary else "#0369A1"
        border_color = "#FDA4AF" if is_primary else "#CBD5E1"

        hypotheses_html += f"""
        <div style="border:1px solid {border_color}; border-radius:6px; padding:14px; margin-bottom:12px; background:#F8FAFC;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong style="color:#003366; font-size:14px;">{h.get('title', 'Unknown')}</strong>
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="background:{badge_bg}; color:{badge_text}; font-weight:bold; padding:2px 8px; border-radius:4px; font-size:11px; font-family:monospace;">{status_val}</span>
                    <span style="background:#E0F2FE; color:#0369A1; font-weight:bold; padding:2px 8px; border-radius:4px; font-size:12px; font-family:monospace;">{h.get('score', 0)}% MATCH</span>
                </div>
            </div>
            <ul style="margin:8px 0 0 16px; color:#475569; font-size:12px; line-height:1.5;">{reasons_html}</ul>
        </div>
        """

    loto_html = ""
    for item in plan:
        controls_html = "".join([f"<li>{ctrl}</li>" for ctrl in item.get("safety_controls", [])])
        loto_html += f"""
        <div style="border:1px solid #FCD34D; background:#FFFBEB; border-radius:6px; padding:12px; margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <strong style="color:#92400E; font-size:13px;">{item.get('title', 'Isolation')}</strong>
                <span style="color:#B45309; font-size:11px; font-weight:bold;">{item.get('permit_type', 'PTW Class A')}</span>
            </div>
            <p style="font-size:12px; color:#78350F; margin:0 0 6px 0;">{item.get('description', '')}</p>
            <ul style="margin:0 0 0 16px; font-size:12px; color:#92400E;">{controls_html}</ul>
        </div>
        """

    # Issue 7 Fix: Consistent 0.40 °C/h criteria in HTML
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Statutory Investigation Report - {investigation_id}</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background: #F1F5F9; color: #0F172A; margin: 0; padding: 24px; }}
        .paper {{ max-width: 880px; margin: 0 auto; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }}
        .header {{ border-bottom: 2px solid #003366; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }}
        .badge {{ background: #003366; color: white; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; }}
        .kpi-grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }}
        .kpi-card {{ border: 1px solid #CBD5E1; border-radius: 6px; padding: 14px; background: #F8FAFC; }}
        .kpi-val {{ font-size: 24px; font-weight: 800; color: #BE123C; margin: 4px 0; }}
        .kpi-val.ok {{ color: #059669; }}
        .print-btn {{ background: #003366; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; cursor: pointer; float: right; margin-bottom: 16px; }}
        @media print {{
            body {{ padding: 0; background: white; }}
            .paper {{ border: none; box-shadow: none; max-width: 100%; padding: 20px; }}
            .print-btn {{ display: none; }}
        }}
    </style>
</head>
<body>
    <div style="max-width:880px; margin: 0 auto;">
        <button class="print-btn" onclick="window.print()">Print / Export PDF</button>
    </div>
    <div class="paper">
        <div class="header">
            <div>
                <span class="badge">Official ISO 10816 Audit Record</span>
                <h1 style="margin: 8px 0 0 0; color: #003366; font-size: 22px;">Autonomous Incident Forensic Report</h1>
                <div style="font-size: 12px; color: #64748B; margin-top: 4px;">Dossier ID: {investigation_id} | Asset: {equipment_tag}</div>
            </div>
            <div style="text-align: right; font-size: 11px; color: #64748B; font-family: monospace;">
                <div>CHAIN ID: {chain.get('chain_id', 'N/A')}</div>
                <div>SCADA HASH: {str(chain.get('telemetry_sha256', ''))[:12]}...</div>
            </div>
        </div>

        <div style="background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 6px; padding: 10px 14px; font-size: 11px; color: #92400E; font-weight: bold; margin-bottom: 24px;">
            ⚠️ {disclaimer}
        </div>

        <h3 style="color:#003366; border-bottom:1px solid #E2E8F0; padding-bottom:6px; font-size:14px; text-transform:uppercase;">1. Deterministic Physical Metrics</h3>
        <div class="kpi-grid">
            <div class="kpi-card">
                <div style="font-size: 11px; color: #64748B; font-weight: bold;">PEAK VIBRATION VELOCITY</div>
                <div class="kpi-val {'ok' if not peak_vib.get('breached') else ''}">{peak_vib.get('value', 'N/A')} {peak_vib.get('unit', 'mm/s')}</div>
                <div style="font-size: 11px; color: #64748B;">Alarm Limit: {peak_vib.get('threshold', 'N/A')} mm/s | max(v_t)</div>
            </div>
            <div class="kpi-card">
                <div style="font-size: 11px; color: #64748B; font-weight: bold;">THERMAL RATE OF RISE</div>
                <div class="kpi-val {'ok' if not temp_rate.get('breached') else ''}">+{temp_rate.get('value', 'N/A')} {temp_rate.get('unit', '°C/h')}</div>
                <div style="font-size: 11px; color: #64748B;">Alarm Limit: 0.40 °C/h | polyfit(1)</div>
            </div>
            <div class="kpi-card">
                <div style="font-size: 11px; color: #64748B; font-weight: bold;">VIOLATION DURATION</div>
                <div class="kpi-val {'ok' if not dur_breached else ''}">{dur_val} mins</div>
                <div style="font-size: 11px; color: #64748B;">Continuous Breach Time</div>
            </div>
        </div>

        <h3 style="color:#003366; border-bottom:1px solid #E2E8F0; padding-bottom:6px; font-size:14px; text-transform:uppercase;">2. Discrepancy & Contradiction Audit</h3>
        {contradictions_html}

        <h3 style="color:#003366; border-bottom:1px solid #E2E8F0; padding-bottom:6px; font-size:14px; text-transform:uppercase; margin-top:24px;">3. Ranked Fault Hypotheses</h3>
        {hypotheses_html}

        <h3 style="color:#003366; border-bottom:1px solid #E2E8F0; padding-bottom:6px; font-size:14px; text-transform:uppercase; margin-top:24px;">4. Statutory LOTO & Isolation Requirements</h3>
        {loto_html}

        <div style="margin-top: 40px; padding-top: 24px; border-top: 2px solid #E2E8F0; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
            <div>
                <div style="border-bottom: 1px solid #94A3B8; height: 40px;"></div>
                <div style="font-size: 11px; color: #64748B; margin-top: 6px;">Certified Reliability Forensics Engineer Sign-off</div>
            </div>
            <div>
                <div style="border-bottom: 1px solid #94A3B8; height: 40px;"></div>
                <div style="font-size: 11px; color: #64748B; margin-top: 6px;">Plant Operations Lead / PTW Approver</div>
            </div>
        </div>
    </div>
</body>
</html>
"""

generate_html_report = generate_statutory_audit_html
generate_report_html = generate_statutory_audit_html
