import { useState } from "react";
import axios from "axios";
import { AlertTriangle, ShieldCheck, Play, CheckCircle2, ChevronRight, X, Cpu, FileDown, Eye, Activity, Check, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const AGENT_STEPS = [
  "Agent 1: Ingesting SCADA telemetry & computing RMS/polyfit slope...",
  "Agent 2: Extracting OEM thresholds & shift logs via PyMuPDF...",
  "Agent 3: Running Multimodal Vision Scanner on housing seal lip...",
  "Agent 4: Cross-examining operator claims vs sensor telemetry...",
  "Agent 5: Synthesizing safety-gated LOTO & PTW isolation plan..."
];

export default function App() {
  const [selectedAsset, setSelectedAsset] = useState<string>("P-204");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeMetric, setActiveMetric] = useState<any>(null);

  const runInvestigation = async (asset = selectedAsset) => {
    setLoading(true);
    setCurrentStep(0);

    // 2.5-second multi-agent progress simulation
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < AGENT_STEPS.length - 1 ? prev + 1 : prev));
    }, 500);

    try {
      const [response] = await Promise.all([
        axios.post(`http://localhost:8000/api/investigate/run?asset=${asset}`),
        new Promise((resolve) => setTimeout(resolve, 2500))
      ]);
      setData(response.data);
    } catch (err) {
      alert("Error reaching backend at http://localhost:8000. Ensure uvicorn is running.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleAssetChange = (assetId: string) => {
    setSelectedAsset(assetId);
    runInvestigation(assetId);
  };

  const openAuditReport = () => {
    window.open(`http://localhost:8000/api/investigate/report?asset=${selectedAsset}`, "_blank");
  };

  const getStatusBadge = (status: string, text: string) => {
    let colorClass = "bg-emerald-500";
    if (status === "NEUTRAL") colorClass = "bg-amber-500";
    if (status === "CONTRADICT") colorClass = "bg-red-500";

    return (
      <span className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full shrink-0 ${colorClass}`}></span>
        <span>{text}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Left Sidebar */}
      <aside className="w-64 bg-refinery-900 text-white p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="font-bold text-lg tracking-wider text-teal-400">SIH 26117</div>
          <div className="text-xs text-slate-400 mt-1">Maintenance Investigator</div>

          {/* Asset Selection Tabs */}
          <div className="mt-6">
            <span className="text-[10px] text-slate-400 uppercase block font-mono mb-2">Select Target Asset</span>
            <div className="grid grid-cols-2 gap-1.5 bg-refinery-800 p-1 rounded border border-slate-700">
              <button
                onClick={() => handleAssetChange("P-204")}
                className={`py-1.5 text-xs font-medium rounded transition-all cursor-pointer ${selectedAsset === "P-204" ? "bg-teal-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
              >
                Pump P-204
              </button>
              <button
                onClick={() => handleAssetChange("P-101")}
                className={`py-1.5 text-xs font-medium rounded transition-all cursor-pointer ${selectedAsset === "P-101" ? "bg-teal-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
              >
                Pump P-101
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-4 text-sm text-slate-300">
            <div className="bg-refinery-800 p-3 rounded border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase block font-mono">Active Target Machine</span>
              <p className="font-semibold text-white">
                {selectedAsset === "P-204" ? "Pump P-204 (Boiler Feed)" : "Pump P-101 (Crude Transfer)"}
              </p>
              <span className="text-[10px] text-teal-400">ISO 10816-3 Class II</span>
            </div>
            
            <div className="text-xs text-slate-400 space-y-1 font-mono text-[11px]">
              {selectedAsset === "P-204" ? (
                <>
                  <div>• WO-204-8821_shiftlog.pdf</div>
                  <div>• OEM_P204_limits.pdf</div>
                  <div>• P204_sensor_24h.csv</div>
                  <div>• P204_bearing_housing.jpg</div>
                </>
              ) : (
                <>
                  <div>• WO-101-4412_shiftlog.pdf</div>
                  <div>• OEM_P101_limits.pdf</div>
                  <div>• P101_sensor_24h.csv</div>
                  <div className="text-slate-500">• (Photo inspection offline)</div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {data && (
            <button
              onClick={openAuditReport}
              className="w-full bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 font-medium py-2 rounded flex items-center justify-center gap-2 text-xs shadow transition-all cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              Export Audit Report
            </button>
          )}

          <button
            onClick={() => runInvestigation()}
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-medium py-2.5 rounded flex items-center justify-center gap-2 text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-4 h-4" />
            {loading ? "Synthesizing Pipeline..." : "Run Investigation"}
          </button>
        </div>
      </aside>

      {/* Main Investigation Workspace */}
      <main className="flex-1 p-8 overflow-y-auto">
        {!data ? (
          <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-12 text-center bg-white">
            <p className="text-slate-600 font-medium mb-1">Investigation Pipeline Idle</p>
            <p className="text-xs text-slate-400 max-w-sm mb-4">Click below to run the multi-agent synthesis engine on {selectedAsset} multimodal evidence.</p>
            <button
              onClick={() => runInvestigation()}
              className="bg-refinery-900 text-white px-5 py-2 text-xs rounded font-medium shadow hover:bg-slate-800 transition-all cursor-pointer"
            >
              Start Investigation
            </button>
          </div>
        ) : (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => setActiveMetric(data.metrics.peak_vibration)}
                className="bg-white p-4 rounded-lg border border-industrial-border shadow-sm cursor-pointer hover:border-red-400 transition-colors"
              >
                <div className="flex justify-between items-center text-xs text-slate-500 uppercase font-mono">
                  <span>{data.metrics.peak_vibration.name}</span>
                  <span className="flex items-center text-[10px] text-teal-600 font-semibold">Audit Trace <ChevronRight className="w-3 h-3" /></span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <h3 className="text-2xl font-bold text-red-600 font-mono">
                    {data.metrics.peak_vibration.value} {data.metrics.peak_vibration.unit}
                  </h3>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono">
                    Limit: {data.metrics.peak_vibration.threshold} mm/s
                  </span>
                </div>
              </div>

              <div 
                onClick={() => setActiveMetric(data.metrics.temperature_rate_of_rise)}
                className="bg-white p-4 rounded-lg border border-industrial-border shadow-sm cursor-pointer hover:border-amber-400 transition-colors"
              >
                <div className="flex justify-between items-center text-xs text-slate-500 uppercase font-mono">
                  <span>{data.metrics.temperature_rate_of_rise.name}</span>
                  <span className="flex items-center text-[10px] text-teal-600 font-semibold">Audit Trace <ChevronRight className="w-3 h-3" /></span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <h3 className={`text-2xl font-bold font-mono ${data.metrics.temperature_rate_of_rise.breached ? "text-amber-600" : "text-emerald-600"}`}>
                    +{data.metrics.temperature_rate_of_rise.value} {data.metrics.temperature_rate_of_rise.unit}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded font-mono ${data.metrics.temperature_rate_of_rise.breached ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {data.metrics.temperature_rate_of_rise.breached ? "Thermal Drift" : "Thermal Stable"}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Narrative Synthesis Card */}
            {data.ai_summary && (
              <div className="bg-white border border-industrial-border rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2 border-b border-industrial-border pb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-teal-600" />
                    <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">
                      Technical Executive Synthesis
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                    {data.ai_summary.source}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  {data.ai_summary.narrative}
                </p>
              </div>
            )}

            {/* Multimodal Vision Card */}
            {data.vision && (
              <div className="bg-white border border-industrial-border rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3 border-b border-industrial-border pb-2">
                  <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Eye className="w-4 h-4 text-teal-600" />
                    Multimodal Visual Defect Inspection
                  </h4>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono border border-slate-200">
                    {data.vision.equipment_identified} ({data.vision.resolution})
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="relative rounded overflow-hidden border border-slate-300 bg-slate-900 flex flex-col items-center">
                    <img
                      src="http://localhost:8000/demo-data/P204_bearing_housing.jpg"
                      alt="P-204 Drive-End Bearing Housing"
                      className="w-full h-36 object-cover"
                    />
                    <div className="w-full bg-slate-800/90 p-1.5 text-center">
                      <span className="text-[10px] text-red-400 font-mono font-bold tracking-wide">
                        ANOMALY: SEAL LIP WEEPING
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2 text-xs">
                    {data.vision.visual_anomalies.map((ano: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between items-start">
                        <div>
                          <span className="font-semibold text-slate-800 capitalize font-mono text-[11px] block">
                            {ano.region.replace(/_/g, " ")}
                          </span>
                          <p className="text-slate-600 text-[11px] mt-0.5">{ano.finding}</p>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0 ${ano.severity === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                          {Math.round(ano.confidence * 100)}% Conf
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Recharts Chart */}
            <div className="bg-white p-5 rounded-lg border border-industrial-border shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600" />
                  Dynamic 24h Vibration Trend vs OEM Limit ({data.metrics.peak_vibration.threshold} mm/s)
                </h4>
                <span className="text-[10px] font-mono text-slate-400">Streamed from {data.citations.sensor}</span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.telemetry_series || []}>
                    <XAxis dataKey="time" fontSize={11} stroke="#64748B" />
                    <YAxis fontSize={11} stroke="#64748B" domain={[0, 11]} />
                    <Tooltip contentStyle={{ fontSize: '12px' }} />
                    <ReferenceLine y={data.metrics.peak_vibration.threshold} stroke="#DC2626" strokeDasharray="3 3" label={{ value: `Limit (${data.metrics.peak_vibration.threshold})`, fill: "#DC2626", fontSize: 10 }} />
                    <Line type="monotone" dataKey="vibration" stroke="#DC2626" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Contradiction Alert */}
            {data.contradictions.map((c: any) => (
              <div key={c.id} className="bg-white border-l-4 border-red-600 p-4 rounded-r-lg border-y border-r border-industrial-border shadow-sm">
                <div className="flex items-center gap-2 text-red-600 font-semibold text-sm mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  EVIDENCE CONFLICT DETECTED
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded">
                  <div>
                    <span className="text-slate-400 block uppercase font-mono">Human Log Claim</span>
                    <p className="text-slate-800 italic mt-0.5">"{c.human_claim}"</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Source: {c.sources[0]}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase font-mono">Calibrated Telemetry Claim</span>
                    <p className="text-slate-800 font-mono mt-0.5">{c.objective_claim}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Source: {c.sources[1]}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Competing Hypotheses Ranking */}
            <div className="bg-white p-5 rounded-lg border border-industrial-border shadow-sm">
              <h4 className="font-semibold text-slate-800 text-sm mb-3">Multi-Hypothesis Cross-Examination</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.hypotheses.map((hyp: any) => (
                  <div 
                    key={hyp.id} 
                    className={`p-3.5 rounded border text-xs flex flex-col justify-between ${hyp.status === 'CONFIRMED_PRIMARY' ? 'bg-teal-50/60 border-teal-300' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-mono text-[10px] text-slate-500 font-bold">{hyp.id}</span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${hyp.status === 'CONFIRMED_PRIMARY' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                          {hyp.score}% Conf
                        </span>
                      </div>
                      <p className="font-bold text-slate-800 mb-2">{hyp.title}</p>
                      <ul className="space-y-1 text-slate-600 text-[11px]">
                        {hyp.reasons.map((r: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span className="mt-3 text-[10px] font-mono text-slate-400 block border-t pt-2">
                      Status: {hyp.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2D Interactive Evidence Matrix */}
            {data.evidence_matrix && (
              <div className="bg-white p-5 rounded-lg border border-industrial-border shadow-sm overflow-x-auto">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-slate-800 text-sm">Interactive 2D Evidence Matrix</h4>
                  <span className="text-[10px] text-slate-400 font-mono">Cross-Examination Verification Grid</span>
                </div>
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-mono">
                    <tr>
                      <th className="p-2.5 border">Failure Mode</th>
                      <th className="p-2.5 border">Photo Analysis</th>
                      <th className="p-2.5 border">Work Order Log</th>
                      <th className="p-2.5 border">OEM Limits</th>
                      <th className="p-2.5 border">Telemetry Stream</th>
                      <th className="p-2.5 border">Asset History</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {data.evidence_matrix.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-800 border bg-slate-50">{row.mode}</td>
                        <td className="p-2.5 border text-[11px]">{getStatusBadge(row.photo.status, row.photo.text)}</td>
                        <td className="p-2.5 border text-[11px]">{getStatusBadge(row.report.status, row.report.text)}</td>
                        <td className="p-2.5 border text-[11px]">{getStatusBadge(row.manual.status, row.manual.text)}</td>
                        <td className="p-2.5 border text-[11px]">{getStatusBadge(row.csv.status, row.csv.text)}</td>
                        <td className="p-2.5 border text-[11px]">{getStatusBadge(row.history.status, row.history.text)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Safety-Gated Action Plan */}
            <div className="bg-white p-5 rounded-lg border border-industrial-border shadow-sm">
              <h4 className="font-semibold text-slate-800 text-sm mb-3">Safety-Gated Action Plan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.inspection_plan.map((item: any, idx: number) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded border border-slate-200 text-xs space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">{item.priority}</span>
                        <span className="text-[10px] font-mono text-slate-500">{item.permit_type}</span>
                      </div>
                      <div className="font-bold text-slate-800 mb-1">{item.title}</div>
                      <p className="text-[11px] text-slate-600 mb-2">{item.description}</p>
                    </div>
                    <div className="space-y-1 border-t pt-2">
                      {item.safety_controls.map((ctrl: string, cIdx: number) => (
                        <div key={cIdx} className="flex items-center gap-1.5 text-slate-700 text-[10px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{ctrl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center text-[11px] text-slate-400 pt-4 border-t border-slate-200">
              Prototype Decision Support Only. Qualified engineer review, site procedures, and LOTO permit systems remain mandatory.
            </div>
          </div>
        )}
      </main>

      {/* Multi-Agent Live Execution Stepper Modal */}
      {loading && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <Loader2 className="w-5 h-5 text-teal-600 animate-spin" />
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Multi-Agent Investigation Active</h3>
                <p className="text-slate-400 text-xs font-mono">Running deterministic verification pipeline</p>
              </div>
            </div>

            <div className="space-y-3">
              {AGENT_STEPS.map((step, idx) => {
                const isCompleted = idx < currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 text-xs p-2 rounded transition-all ${
                      isCurrent ? "bg-teal-50 text-teal-900 font-medium" : isCompleted ? "text-slate-700" : "text-slate-300"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                        isCompleted
                          ? "bg-teal-600 text-white"
                          : isCurrent
                          ? "border border-teal-600 text-teal-600 animate-pulse"
                          : "border border-slate-300 text-slate-300"
                      }`}
                    >
                      {isCompleted ? <Check className="w-2.5 h-2.5" /> : idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Audit Drawer */}
      {activeMetric && (
        <div className="absolute right-0 top-0 w-80 h-full bg-white shadow-2xl border-l border-industrial-border p-6 flex flex-col justify-between z-50">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-slate-800 text-sm">Deterministic Calculation Trace</h4>
              <button onClick={() => setActiveMetric(null)} className="cursor-pointer"><X className="w-4 h-4 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block font-mono">Measurement</span>
                <p className="font-medium text-slate-800">{activeMetric.name}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-mono">Pure Python Math</span>
                <p className="font-mono bg-slate-100 p-2 rounded text-slate-700">{activeMetric.formula}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-mono">Window Analyzed</span>
                <p className="text-slate-800">{activeMetric.window}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-mono">Sensor CSV Row Indices</span>
                <p className="font-mono text-teal-700">Rows: {activeMetric.source_rows.join(", ")}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setActiveMetric(null)} 
            className="w-full bg-slate-100 text-slate-700 py-2 rounded text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Close Audit View
          </button>
        </div>
      )}
    </div>
  );
}
