def generate_html_report(data: dict) -> str:
    top_hyp = data["hypotheses"][0]
    metric_items = "".join([
        f"<div class='metric-row'><span>{m['name']}</span><b>{m['value']} {m['unit']} (Limit: {m['threshold']} {m['unit']})</b></div>"
        for m in data["metrics"].values()
    ])
    safety_items = "".join([
        f"<li><b>{s['priority']}: {s['title']}</b><br><span style='color:#666;'>Controls: {', '.join(s['safety_controls'])}</span></li>"
        for s in data["inspection_plan"]
    ])
    contra_items = "".join([
        f"<div class='conflict-box'><b>Discrepancy:</b> {c['human_claim']}<br><b>Sensor Fact:</b> {c['objective_claim']}<br><b>Action:</b> {c['recommended_verification']}</div>"
        for c in data["contradictions"]
    ])

    return f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Investigation Audit - {data['equipment_tag']}</title>
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0F172A; max-width: 800px; margin: auto; }}
  .header {{ border-bottom: 2px solid #0F172A; padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }}
  .badge {{ background: #FFE4E6; color: #E11D48; padding: 4px 8px; font-weight: bold; border-radius: 4px; font-size: 12px; }}
  .section {{ margin-bottom: 24px; }}
  .section-title {{ font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; font-weight: bold; margin-bottom: 8px; }}
  .metric-row {{ display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E2E8F0; font-family: monospace; font-size: 13px; }}
  .conflict-box {{ background: #FEF2F2; border-left: 4px solid #EF4444; padding: 12px; font-size: 13px; line-height: 1.5; border-radius: 0 4px 4px 0; margin-bottom: 8px; }}
  .print-btn {{ background: #0B192C; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-bottom: 20px; }}
  @media print {{ .print-btn {{ display: none; }} body {{ padding: 0; }} }}
  .disclaimer {{ border-top: 1px solid #E2E8F0; padding-top: 12px; font-size: 11px; color: #94A3B8; margin-top: 40px; }}
</style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  
  <div class="header">
    <div>
      <h2 style="margin: 0 0 4px 0;">FORENSIC ROOT CAUSE AUDIT</h2>
      <div style="font-size: 12px; color: #64748B;">Audit ID: {data['investigation_id']} | Asset: {data['equipment_tag']}</div>
    </div>
    <span class="badge">BREACH DETECTED</span>
  </div>

  <div class="section">
    <div class="section-title">Primary Diagnosis</div>
    <div style="font-size: 18px; font-weight: bold; color: #0F172A;">
      {top_hyp['title']} ({int(top_hyp['confidence']*100)}% Confidence)
    </div>
    <ul style="font-size: 13px; color: #334155; margin-top: 8px;">
      {"".join([f"<li>{r}</li>" for r in top_hyp['reasons']])}
    </ul>
  </div>

  <div class="section">
    <div class="section-title">Deterministic Telemetry Verification</div>
    {metric_items}
  </div>

  <div class="section">
    <div class="section-title">Evidence Discrepancy Analysis</div>
    {contra_items}
  </div>

  <div class="section">
    <div class="section-title">Mandatory Safety Controls (Pre-Intervention)</div>
    <ul style="font-size: 13px; line-height: 1.6;">
      {safety_items}
    </ul>
  </div>

  <div class="disclaimer">
    PROTOTYPE DECISION SUPPORT ONLY. Qualified engineer review, site safety procedures, and permit-to-work systems remain mandatory. Zero autonomous machinery triggers executed.
  </div>
</body>
</html>"""
