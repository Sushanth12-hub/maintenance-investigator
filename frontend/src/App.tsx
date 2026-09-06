import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertOctagon,
  ShieldAlert,
  Play,
  CheckCircle2,
  ChevronRight,
  X,
  FileDown,
  Activity,
  Maximize2,
  Lock,
  Layers,
  Cpu,
  RefreshCw,
  Compass
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid
} from "recharts";

const PIPELINE_STAGES = [
  { id: "S1", title: "SCADA Telemetry", desc: "Pure NumPy velocity & polyfit thermal slope" },
  { id: "S2", title: "PyMuPDF Extraction", desc: "ISO 10816-3 limits & technician shift logs" },
  { id: "S3", title: "Multimodal Vision", desc: "Housing optical anomalies & weepage detection" },
  { id: "S4", title: "Contradiction Engine", desc: "Cross-correlating human vs sensor facts" },
  { id: "S5", title: "Safety Synthesis", desc: "Mandatory LOTO & PTW Class A isolation gating" }
];

export default function App() {
  const [selectedAsset, setSelectedAsset] = useState<string>("P-204");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [activeMetric, setActiveMetric] = useState<any>(null);
  const [activeVisualDefect, setActiveVisualDefect] = useState<number | null>(null);

  const runInvestigation = async (asset = selectedAsset) => {
    setLoading(true);
    setPipelineProgress(1);

    const timer = setInterval(() => {
      setPipelineProgress((p) => (p < PIPELINE_STAGES.length ? p + 1 : p));
    }, 450);

    try {
      const [response] = await Promise.all([
        axios.post(`http://localhost:8000/api/investigate/run?asset=${asset}`),
        new Promise((resolve) => setTimeout(resolve, 2300))
      ]);
      setData(response.data);
    } catch (err) {
      alert("Unable to reach backend at http://localhost:8000. Ensure uvicorn is running.");
    } finally {
      clearInterval(timer);
      setLoading(false);
      setPipelineProgress(0);
    }
  };

  const handleAssetSelect = (assetId: string) => {
    setSelectedAsset(assetId);
    runInvestigation(assetId);
  };

  const openAuditReport = () => {
    window.open(`http://localhost:8000/api/investigate/report?asset=${selectedAsset}`, "_blank");
  };

  const renderStatusCell = (status: string, label: string) => {
    let style = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    let icon = "●";

    if (status === "NEUTRAL") {
      style = "bg-amber-500/10 text-amber-400 border-amber-500/30";
      icon = "▲";
    } else if (status === "CONTRADICT") {
      style = "bg-rose-500/10 text-rose-400 border-rose-500/30";
      icon = "■";
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-mono tracking-tight ${style}`}>
        <span className="text-[7px]">{icon}</span>
        <span className="truncate max-w-[130px]">{label}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-200 flex flex-col antialiased selection:bg-cyan-500 selection:text-black">
      {/* Industrial Top Navigation Bar */}
      <header className="h-14 bg-[#0B0E14] border-b border-[#1A2234] px-6 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-sm bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
            <span className="font-mono text-xs font-bold tracking-widest text-slate-100">
              SIH-26117 <span className="text-slate-500">/</span> INDUSTRIAL INCIDENT INVESTIGATOR
            </span>
          </div>

          <div className="h-4 w-px bg-[#1A2234]" />

          {/* Asset Selector Tabs */}
          <div className="flex items-center bg-[#111622] p-0.5 rounded border border-[#1A2234]">
            <button
              onClick={() => handleAssetSelect("P-204")}
              className={`px-3 py-1 text-xs font-mono rounded transition-all cursor-pointer ${
                selectedAsset === "P-204"
                  ? "bg-[#1E2638] text-cyan-300 font-bold border border-cyan-500/30 shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              PUMP P-204 (FEEDWATER)
            </button>
            <button
              onClick={() => handleAssetSelect("P-101")}
              className={`px-3 py-1 text-xs font-mono rounded transition-all cursor-pointer ${
                selectedAsset === "P-101"
                  ? "bg-[#1E2638] text-cyan-300 font-bold border border-cyan-500/30 shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              PUMP P-101 (CRUDE TRANSFER)
            </button>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-400 bg-[#111622] border border-[#1A2234] px-2.5 py-1 rounded flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-amber-400" />
            LOTO ISOLATION: PENDING VERIFICATION
          </span>

          {data && (
            <button
              onClick={openAuditReport}
              className="h-8 px-3 rounded bg-[#111622] hover:bg-[#182030] text-slate-200 border border-[#1A2234] text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-cyan-400" />
              LEGAL AUDIT PDF
            </button>
          )}

          <button
            onClick={() => runInvestigation()}
            disabled={loading}
            className="h-8 px-4 rounded bg-cyan-600 hover:bg-cyan-500 text-black font-mono font-bold text-xs flex items-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-black" />}
            {loading ? "CORRELATING..." : "RUN INVESTIGATION"}
          </button>
        </div>
      </header>

      {/* Inline Telemetry Pipeline Progress Banner */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#0D121C] border-b border-cyan-500/30 px-6 py-2.5 flex items-center justify-between font-mono text-xs overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span className="text-cyan-300 font-bold uppercase tracking-wider">
                Multi-Agent Synthesis Pipeline Running:
              </span>
              <span className="text-slate-300">
                {PIPELINE_STAGES[pipelineProgress - 1]?.desc || "Initializing agents..."}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {PIPELINE_STAGES.map((s, idx) => (
                <div
                  key={s.id}
                  className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                    idx + 1 < pipelineProgress
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      : idx + 1 === pipelineProgress
                      ? "bg-cyan-400 text-black font-bold border-cyan-300"
                      : "bg-[#111622] text-slate-500 border-[#1A2234]"
                  }`}
                >
                  {s.id}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Workspace Layout */}
      <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto space-y-6">
        {!data ? (
          <div className="h-[75vh] rounded border border-dashed border-[#1A2234] flex flex-col items-center justify-center p-8 text-center bg-[#0B0E14]/40">
            <div className="w-12 h-12 rounded bg-[#111622] border border-[#1A2234] flex items-center justify-center text-slate-400 mb-4">
              <Compass className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-mono text-sm font-bold text-slate-200 uppercase tracking-wider mb-1">
              Industrial Forensic Pipeline Standby
            </h3>
            <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
              Synthesize SCADA telemetry, operator shift turnovers, ISO alarm limits, and multimodal imaging for {selectedAsset}.
            </p>
            <button
              onClick={() => runInvestigation()}
              className="bg-cyan-600 hover:bg-cyan-500 text-black font-mono font-bold px-5 py-2.5 rounded text-xs transition-colors cursor-pointer"
            >
              EXECUTE PIPELINE [{selectedAsset}]
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Operational Status Bar */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Metric 1: Peak Vibration */}
              <div
                onClick={() => setActiveMetric(data.metrics.peak_vibration)}
                className="bg-[#0B0E14] border border-[#1A2234] hover:border-rose-500/50 rounded p-4 cursor-pointer transition-all group"
              >
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  <span>{data.metrics.peak_vibration.name}</span>
                  <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center">
                    TRACE <ChevronRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-2">
                  <div className="text-3xl font-mono font-bold text-rose-400">
                    {data.metrics.peak_vibration.value}{" "}
                    <span className="text-xs text-slate-400 font-normal">{data.metrics.peak_vibration.unit}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    LIMIT: {data.metrics.peak_vibration.threshold} mm/s
                  </span>
                </div>
                <div className="mt-2 text-[10px] font-mono text-slate-500 border-t border-[#141A28] pt-1.5 flex justify-between">
                  <span>ISO 10816-3 Zone:</span>
                  <span className="text-rose-400 font-bold">Zone D (Unacceptable)</span>
                </div>
              </div>

              {/* Metric 2: Thermal Rate of Rise */}
              <div
                onClick={() => setActiveMetric(data.metrics.temperature_rate_of_rise)}
                className="bg-[#0B0E14] border border-[#1A2234] hover:border-amber-500/50 rounded p-4 cursor-pointer transition-all group"
              >
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  <span>{data.metrics.temperature_rate_of_rise.name}</span>
                  <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center">
                    TRACE <ChevronRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-2">
                  <div className={`text-3xl font-mono font-bold ${data.metrics.temperature_rate_of_rise.breached ? "text-amber-400" : "text-emerald-400"}`}>
                    +{data.metrics.temperature_rate_of_rise.value}{" "}
                    <span className="text-xs text-slate-400 font-normal">{data.metrics.temperature_rate_of_rise.unit}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    data.metrics.temperature_rate_of_rise.breached
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  }`}>
                    {data.metrics.temperature_rate_of_rise.breached ? "THERMAL DRIFT" : "STABLE"}
                  </span>
                </div>
                <div className="mt-2 text-[10px] font-mono text-slate-500 border-t border-[#141A28] pt-1.5 flex justify-between">
                  <span>Threshold Criterion:</span>
                  <span className="text-slate-300">0.50 °C/h</span>
                </div>
              </div>

              {/* Metric 3: Diagnosed Cause */}
              <div className="bg-[#0B0E14] border border-[#1A2234] rounded p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Confirmed Diagnosis
                  </span>
                  <div className="font-bold text-sm text-slate-100 mt-1 line-clamp-1">
                    {data.hypotheses[0]?.title}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono border-t border-[#141A28] pt-1.5 mt-2">
                  <span className="text-slate-500">Confidence Score:</span>
                  <span className="text-cyan-400 font-bold">{data.hypotheses[0]?.score}% LIKELIHOOD</span>
                </div>
              </div>

              {/* Metric 4: Mandated Isolation */}
              <div className="bg-[#0B0E14] border border-[#1A2234] rounded p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Isolation Requirement
                  </span>
                  <div className="font-bold text-sm text-amber-400 mt-1 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
                    LOTO MCC Breaker Lock
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono border-t border-[#141A28] pt-1.5 mt-2">
                  <span className="text-slate-500">Permit Class:</span>
                  <span className="text-slate-200 font-bold">{data.inspection_plan[0]?.permit_type}</span>
                </div>
              </div>
            </section>

            {/* Technical Executive Brief */}
            {data.ai_summary && (
              <section className="bg-[#0B0E14] border-l-2 border-l-cyan-500 border-y border-r border-[#1A2234] rounded-r p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                      Technical Executive Synthesis
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-[#111622] px-2 py-0.5 rounded border border-[#1A2234]">
                    Engine: {data.ai_summary.source}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {data.ai_summary.narrative}
                </p>
              </section>
            )}

            {/* Main Investigation Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (8 of 12) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Visual NDT Inspection */}
                {data.vision && (
                  <section className="bg-[#0B0E14] border border-[#1A2234] rounded p-5">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1A2234]">
                      <div className="flex items-center gap-2">
                        <Maximize2 className="w-4 h-4 text-cyan-400" />
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                          Non-Destructive Optical Inspection (Drive End)
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-[#111622] px-2.5 py-1 rounded border border-[#1A2234]">
                        {data.vision.equipment_identified} ({data.vision.resolution})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-5 relative rounded overflow-hidden border border-[#1E2638] bg-black">
                        <img
                          src="http://localhost:8000/demo-data/P204_bearing_housing.jpg"
                          alt="Drive-End Bearing Housing Inspection"
                          className="w-full h-44 object-cover opacity-90"
                        />
                        <div className="absolute inset-4 border border-rose-500/70 border-dashed rounded flex flex-col justify-between p-1.5 pointer-events-none">
                          <span className="text-[8px] font-mono bg-black/90 text-rose-300 px-1 py-0.5 rounded w-max border border-rose-500/40">
                            ROI_DEFECT: FLANGE_SEAL
                          </span>
                          <span className="text-[8px] font-mono bg-black/90 text-slate-300 px-1 py-0.5 rounded w-max self-end border border-slate-700">
                            COORD: [150, 100, 450, 300]
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-2.5">
                        {data.vision.visual_anomalies.map((ano: any, idx: number) => (
                          <div
                            key={idx}
                            onClick={() => setActiveVisualDefect(idx)}
                            className={`p-3 rounded border text-xs cursor-pointer transition-all ${
                              activeVisualDefect === idx
                                ? "bg-[#111827] border-cyan-500 text-slate-100"
                                : "bg-[#0E121B] border-[#1A2234] text-slate-300 hover:border-[#2A3650]"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-mono font-bold text-slate-200 capitalize text-[11px]">
                                {ano.region.replace(/_/g, " ")}
                              </span>
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                                ano.severity === "HIGH"
                                  ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              }`}>
                                {ano.severity} SEVERITY
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{ano.finding}</p>
                            <div className="mt-2 pt-1.5 border-t border-[#161D2C] flex justify-between items-center text-[10px] font-mono text-slate-500">
                              <span>Confidence Metric:</span>
                              <span className="text-cyan-400 font-bold">{Math.round(ano.confidence * 100)}% Match</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* Calibrated SCADA Vibration Profile */}
                <section className="bg-[#0B0E14] border border-[#1A2234] rounded p-5">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1A2234]">
                    <div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                          24-Hour Calibrated SCADA Vibration Profile
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        Signal Stream: {data.citations.sensor}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] font-mono">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" /> Velocity (mm/s)
                      </div>
                      <div className="flex items-center gap-1.5 text-rose-400">
                        <span className="w-3 h-0.5 bg-rose-500" /> OEM Trip Threshold ({data.metrics.peak_vibration.threshold})
                      </div>
                    </div>
                  </div>

                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.telemetry_series || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#161D2C" />
                        <XAxis dataKey="time" stroke="#475569" fontSize={10} fontFamily="monospace" tickLine={false} />
                        <YAxis stroke="#475569" fontSize={10} domain={[0, 11]} fontFamily="monospace" tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0B0E14",
                            borderColor: "#2A3650",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontFamily: "monospace",
                            color: "#F1F5F9"
                          }}
                        />
                        <ReferenceLine
                          y={data.metrics.peak_vibration.threshold}
                          stroke="#EF4444"
                          strokeDasharray="4 4"
                          label={{
                            value: `TRIP: ${data.metrics.peak_vibration.threshold} mm/s`,
                            fill: "#EF4444",
                            fontSize: 10,
                            fontFamily: "monospace",
                            position: "insideTopLeft"
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="vibration"
                          stroke="#0EA5E9"
                          strokeWidth={2}
                          dot={{ r: 3, fill: "#0EA5E9" }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                {/* 2D Evidence Matrix */}
                {data.evidence_matrix && (
                  <section className="bg-[#0B0E14] border border-[#1A2234] rounded p-5 overflow-x-auto">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1A2234]">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyan-400" />
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                          Cross-Examination Evidence Matrix (Multi-Source Verification)
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        ISO 10816-3 & Human Log Plausibility
                      </span>
                    </div>

                    <table className="w-full text-left text-xs font-mono border-collapse">
                      <thead>
                        <tr className="border-b border-[#1A2234] text-slate-400 uppercase text-[10px]">
                          <th className="py-2.5 px-3">Failure Mode Modeled</th>
                          <th className="py-2.5 px-3">Photo Optics</th>
                          <th className="py-2.5 px-3">Shift Log</th>
                          <th className="py-2.5 px-3">OEM Spec</th>
                          <th className="py-2.5 px-3">CSV Stream</th>
                          <th className="py-2.5 px-3">Turnover History</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#141A28]">
                        {data.evidence_matrix.map((row: any, i: number) => (
                          <tr key={i} className="hover:bg-[#111622]/60 transition-colors">
                            <td className="py-3 px-3 font-bold text-slate-200">{row.mode}</td>
                            <td className="py-3 px-3">{renderStatusCell(row.photo.status, row.photo.text)}</td>
                            <td className="py-3 px-3">{renderStatusCell(row.report.status, row.report.text)}</td>
                            <td className="py-3 px-3">{renderStatusCell(row.manual.status, row.manual.text)}</td>
                            <td className="py-3 px-3">{renderStatusCell(row.csv.status, row.csv.text)}</td>
                            <td className="py-3 px-3">{renderStatusCell(row.history.status, row.history.text)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>
                )}
              </div>

              {/* Right Column (4 of 12) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Contradiction Alert Card */}
                {data.contradictions.map((c: any) => (
                  <div
                    key={c.id}
                    className="bg-[#120B0D] border-l-4 border-l-rose-500 border-y border-r border-rose-900/40 rounded-r p-4"
                  >
                    <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-xs uppercase tracking-wider mb-2">
                      <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0" />
                      EVIDENCE DISCREPANCY DETECTED
                    </div>

                    <div className="space-y-3 text-xs font-mono">
                      <div className="bg-[#0B0E14] border border-rose-950/60 p-2.5 rounded">
                        <span className="text-slate-500 uppercase text-[9px] block">Operator Written Log</span>
                        <p className="text-slate-300 italic mt-0.5">"{c.human_claim}"</p>
                        <span className="text-[9px] text-cyan-400 block mt-1.5">Source: {c.sources[0]}</span>
                      </div>

                      <div className="bg-[#0B0E14] border border-rose-950/60 p-2.5 rounded">
                        <span className="text-slate-500 uppercase text-[9px] block">Deterministic Telemetry</span>
                        <p className="text-rose-300 font-bold mt-0.5">{c.objective_claim}</p>
                        <span className="text-[9px] text-cyan-400 block mt-1.5">Source: {c.sources[1]}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Ranked Competing Hypotheses */}
                <section className="bg-[#0B0E14] border border-[#1A2234] rounded p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1A2234]">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                      Ranked Root Causes
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Bayesian Ranking</span>
                  </div>

                  <div className="space-y-3">
                    {data.hypotheses.map((hyp: any) => (
                      <div
                        key={hyp.id}
                        className={`p-3 rounded border transition-all ${
                          hyp.status === "CONFIRMED_PRIMARY"
                            ? "bg-[#0E1624] border-cyan-500/50"
                            : "bg-[#0B0E14] border-[#1A2234]"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-mono text-[10px] text-slate-400 font-bold">{hyp.id}</span>
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                            hyp.status === "CONFIRMED_PRIMARY"
                              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                              : "bg-slate-800 text-slate-400 border-slate-700"
                          }`}>
                            {hyp.score}% CONFIDENCE
                          </span>
                        </div>

                        <h4 className="font-bold text-xs text-slate-200 mb-2">{hyp.title}</h4>

                        <ul className="space-y-1.5 text-[11px] text-slate-400 font-sans">
                          {hyp.reasons.map((r: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-3 pt-2 border-t border-[#161D2C] flex justify-between text-[10px] font-mono text-slate-500">
                          <span>Status: {hyp.status}</span>
                          <span>{hyp.supporting_evidence.length} Corroborating Vectors</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Safety-Gated Action Plan */}
                <section className="bg-[#0B0E14] border border-[#1A2234] rounded p-4 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#1A2234]">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                      Mandatory LOTO & Safety Controls
                    </span>
                  </div>

                  <div className="space-y-3">
                    {data.inspection_plan.map((item: any, idx: number) => (
                      <div key={idx} className="p-3 bg-[#0E121B] border border-[#1A2234] rounded space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                            {item.priority}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{item.permit_type}</span>
                        </div>

                        <h5 className="font-bold text-xs text-slate-200">{item.title}</h5>
                        <p className="text-[11px] text-slate-400 font-sans">{item.description}</p>

                        <div className="pt-2 border-t border-[#161D2C] space-y-1">
                          {item.safety_controls.map((ctrl: string, cIdx: number) => (
                            <div key={cIdx} className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300">
                              <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                              <span>{ctrl}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <footer className="text-center text-[10px] font-mono text-slate-500 pt-6 pb-2 border-t border-[#1A2234]">
              PROTOTYPE DECISION SUPPORT ONLY // CERTIFIED PLANT ENGINEER REVIEW & LOTO PERMIT ISSUANCE MANDATORY
            </footer>
          </div>
        )}
      </main>

      {/* Engineer Calculation Trace Drawer */}
      <AnimatePresence>
        {activeMetric && (
          <motion.div
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="fixed right-0 top-0 w-96 h-full bg-[#0B0E14] border-l border-[#1E2638] shadow-2xl p-6 flex flex-col justify-between z-50 font-mono"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#1A2234]">
                <div>
                  <span className="text-[9px] text-cyan-400 uppercase tracking-widest block font-bold">
                    Audit Verification
                  </span>
                  <h3 className="font-bold text-slate-100 text-sm">Deterministic Mathematical Trace</h3>
                </div>
                <button
                  onClick={() => setActiveMetric(null)}
                  className="w-7 h-7 rounded bg-[#111622] border border-[#1A2234] flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-500 uppercase text-[10px] block mb-1">Observed Telemetry Property</span>
                  <p className="font-bold text-slate-200">{activeMetric.name}</p>
                </div>

                <div>
                  <span className="text-slate-500 uppercase text-[10px] block mb-1">Pure Python Deterministic Formula</span>
                  <div className="bg-[#05070A] border border-[#1A2234] p-3 rounded text-cyan-300 font-mono text-xs">
                    <code>{activeMetric.formula}</code>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-[#111622] p-2.5 rounded border border-[#1A2234]">
                    <span className="text-slate-500 text-[9px] block">Temporal Window</span>
                    <span className="font-bold text-slate-200">{activeMetric.window}</span>
                  </div>
                  <div className="bg-[#111622] p-2.5 rounded border border-[#1A2234]">
                    <span className="text-slate-500 text-[9px] block">Source CSV Rows</span>
                    <span className="font-bold text-cyan-400">Rows: [{activeMetric.source_rows.join(", ")}]</span>
                  </div>
                </div>

                <div className="border border-[#1A2234] bg-[#111622]/50 p-3 rounded space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Calculated Value:</span>
                    <span className="text-slate-100 font-bold">{activeMetric.value} {activeMetric.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Alarm Boundary:</span>
                    <span className="text-rose-400 font-bold">{activeMetric.threshold} {activeMetric.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status Trigger:</span>
                    <span className={activeMetric.breached ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                      {activeMetric.breached ? "CRITICAL BREACH" : "NOMINAL"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveMetric(null)}
              className="w-full bg-[#111622] hover:bg-[#182030] border border-[#1A2234] text-slate-300 py-2.5 rounded text-xs font-bold transition-all cursor-pointer"
            >
              DISMISS CALCULATION TRACE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
