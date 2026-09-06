import { useState } from "react";
import axios from "axios";
import { AlertTriangle, ShieldCheck, Play, CheckCircle2, ChevronRight, X, Cpu, FileDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const chartData = [
  { time: "08:00", vibration: 4.2, temp: 71.0 },
  { time: "10:00", vibration: 4.8, temp: 72.1 },
  { time: "12:00", vibration: 5.6, temp: 73.5 },
  { time: "14:00", vibration: 6.4, temp: 75.0 },
  { time: "16:00", vibration: 7.4, temp: 77.2 },
  { time: "18:00", vibration: 8.3, temp: 79.8 },
  { time: "20:00", vibration: 9.1, temp: 82.4 },
];

export default function App() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeMetric, setActiveMetric] = useState<any>(null);

  const runInvestigation = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/investigate/run");
      setData(response.data);
    } catch (err) {
      alert("Error reaching backend at http://localhost:8000. Ensure uvicorn is running.");
    } finally {
      setLoading(false);
    }
  };

  const openAuditReport = () => {
    window.open("http://localhost:8000/api/investigate/report", "_blank");
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Left Sidebar */}
      <aside className="w-64 bg-refinery-900 text-white p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="font-bold text-lg tracking-wider text-teal-400">SIH 26117</div>
          <div className="text-xs text-slate-400 mt-1">Maintenance Investigator</div>

          <div className="mt-8 space-y-4 text-sm text-slate-300">
            <div className="bg-refinery-800 p-3 rounded border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase block font-mono">Target Machine</span>
              <p className="font-semibold text-white">Pump P-204</p>
              <span className="text-[10px] text-teal-400">Demo Synthetic Data</span>
            </div>
            
            <div className="text-xs text-slate-400 space-y-1">
              <div>• WO-204-8821_shiftlog.pdf</div>
              <div>• OEM_P204_limits.pdf</div>
              <div>• P204_sensor_24h.csv</div>
              <div>• P204_bearing_housing.jpg</div>
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
            onClick={runInvestigation}
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-medium py-2.5 rounded flex items-center justify-center gap-2 text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-4 h-4" />
            {loading ? "Analyzing Evidence..." : "Run Investigation"}
          </button>
        </div>
      </aside>

      {/* Main Investigation Workspace */}
      <main className="flex-1 p-8 overflow-y-auto">
        {!data ? (
          <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-12 text-center bg-white">
            <p className="text-slate-600 font-medium mb-1">Investigation Pipeline Idle</p>
            <p className="text-xs text-slate-400 max-w-sm mb-4">Click below to run the deterministic evaluation pipeline on Pump P-204 evidence.</p>
            <button
              onClick={runInvestigation}
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
                  <h3 className="text-2xl font-bold text-amber-600 font-mono">
                    +{data.metrics.temperature_rate_of_rise.value} {data.metrics.temperature_rate_of_rise.unit}
                  </h3>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-mono">
                    Thermal Drift
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

            {/* Chart */}
            <div className="bg-white p-5 rounded-lg border border-industrial-border shadow-sm">
              <h4 className="font-semibold text-slate-800 text-sm mb-4">24h Vibration Trend vs OEM Envelope</h4>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="time" fontSize={11} stroke="#64748B" />
                    <YAxis fontSize={11} stroke="#64748B" domain={[0, 11]} />
                    <Tooltip contentStyle={{ fontSize: '12px' }} />
                    <ReferenceLine y={7.1} stroke="#DC2626" strokeDasharray="3 3" label={{ value: "OEM Limit (7.1)", fill: "#DC2626", fontSize: 10 }} />
                    <Line type="monotone" dataKey="vibration" stroke="#DC2626" strokeWidth={2} />
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

            {/* Diagnosis & Safety */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-lg border border-industrial-border shadow-sm">
                <h4 className="font-semibold text-slate-800 text-sm mb-3">Ranked Root Cause</h4>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-800 text-sm">{data.hypotheses[0].title}</span>
                    <span className="text-xs font-mono font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                      {data.hypotheses[0].score}% Confidence
                    </span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {data.hypotheses[0].reasons.map((r: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-industrial-border shadow-sm">
                <h4 className="font-semibold text-slate-800 text-sm mb-3">Safety-Gated Action Plan</h4>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-2">
                  <div className="font-bold text-slate-800">{data.inspection_plan[0].priority}: {data.inspection_plan[0].title}</div>
                  <div className="space-y-1">
                    {data.inspection_plan[0].safety_controls.map((control: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-1.5 text-amber-900 bg-amber-50 p-1.5 rounded border border-amber-200 font-mono text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        {control}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-[11px] text-slate-400 pt-4 border-t border-slate-200">
              Prototype Decision Support Only. Qualified engineer review, site procedures, and LOTO permit systems remain mandatory.
            </div>
          </div>
        )}
      </main>

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
