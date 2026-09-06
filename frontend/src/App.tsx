import React, { useState, useRef } from "react";
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
  UploadCloud,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  ArrowLeft,
  Sparkles
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
  { id: "S3", title: "Multimodal Vision", desc: "Optical scan of bearing flange & coupling gaps" },
  { id: "S4", title: "Contradiction Engine", desc: "Cross-correlating human claims vs sensor telemetry" },
  { id: "S5", title: "Ollama Edge Synthesis", desc: "Compiling mandatory LOTO isolation rules" }
];

export default function App() {
  const [view, setView] = useState<"upload" | "dashboard">("upload");
  const [equipmentTag, setEquipmentTag] = useState("PUMP P-204");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [activeMetric, setActiveMetric] = useState<any>(null);

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [shiftFile, setShiftFile] = useState<File | null>(null);
  const [oemFile, setOemFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);

  const csvInputRef = useRef<HTMLInputElement>(null);
  const shiftInputRef = useRef<HTMLInputElement>(null);
  const oemInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      setLocalImagePreview(URL.createObjectURL(file));
    } else {
      setLocalImagePreview(null);
    }
  };

  const runDynamicUpload = async () => {
    if (!csvFile || !shiftFile || !oemFile) {
      alert("Please attach at least SCADA CSV, Shift Log PDF, and OEM Limits PDF.");
      return;
    }

    setLoading(true);
    setPipelineProgress(1);
    const timer = setInterval(() => {
      setPipelineProgress((p) => (p < PIPELINE_STAGES.length ? p + 1 : p));
    }, 450);

    const formData = new FormData();
    formData.append("equipment_tag", equipmentTag);
    formData.append("csv_file", csvFile);
    formData.append("shift_file", shiftFile);
    formData.append("oem_file", oemFile);
    if (imageFile) formData.append("image_file", imageFile);

    try {
      const [res] = await Promise.all([
        axios.post("http://localhost:8000/api/investigate/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        }),
        new Promise((resolve) => setTimeout(resolve, 2300))
      ]);
      setData(res.data);
      setView("dashboard");
    } catch (err) {
      alert("Error executing dynamic upload. Ensure backend is running.");
    } finally {
      clearInterval(timer);
      setLoading(false);
      setPipelineProgress(0);
    }
  };

  const loadSamplePreset = async (presetId: string) => {
    setLoading(true);
    setLocalImagePreview(null);
    setPipelineProgress(1);
    const timer = setInterval(() => {
      setPipelineProgress((p) => (p < PIPELINE_STAGES.length ? p + 1 : p));
    }, 450);

    try {
      const [res] = await Promise.all([
        axios.post(`http://localhost:8000/api/investigate/run?asset=${presetId}`),
        new Promise((resolve) => setTimeout(resolve, 2300))
      ]);
      setData(res.data);
      setEquipmentTag(`PUMP ${presetId}`);
      setView("dashboard");
    } catch (err) {
      alert("Error loading demo preset.");
    } finally {
      clearInterval(timer);
      setLoading(false);
      setPipelineProgress(0);
    }
  };

  const openAuditReport = () => {
    window.open(`http://localhost:8000/api/investigate/report?asset=${equipmentTag.includes("101") ? "P-101" : "P-204"}`, "_blank");
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
    <div className="min-h-screen bg-[#07090E] text-slate-200 flex flex-col antialiased selection:bg-cyan-500 selection:text-black font-sans">
      {/* Top Header */}
      <header className="h-14 bg-[#0B0E14] border-b border-[#1A2234] px-6 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-sm bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
            <span className="font-mono text-xs font-bold tracking-widest text-slate-100">
              SIH-26117 <span className="text-slate-500">/</span> INDUSTRIAL INCIDENT INVESTIGATOR
            </span>
          </div>

          <div className="h-4 w-px bg-[#1A2234]" />

          {view === "dashboard" && (
            <button
              onClick={() => setView("upload")}
              className="px-2.5 py-1 text-xs font-mono rounded bg-[#111622] hover:bg-[#182030] text-slate-300 border border-[#1A2234] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
              UPLOAD NEW DOSSIER
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-400 bg-[#111622] border border-[#1A2234] px-2.5 py-1 rounded flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-cyan-400" />
            OLLAMA EDGE MODEL: ACTIVE
          </span>

          {data && view === "dashboard" && (
            <button
              onClick={openAuditReport}
              className="h-8 px-3 rounded bg-[#111622] hover:bg-[#182030] text-slate-200 border border-[#1A2234] text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-cyan-400" />
              LEGAL AUDIT PDF
            </button>
          )}
        </div>
      </header>

      {/* Progress Ribbon */}
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

      {/* VIEW 1: INGESTION INTAKE PORTAL WITH HERO BANNER */}
      {view === "upload" && (
        <main className="flex-1 p-8 max-w-5xl w-full mx-auto space-y-6">
          {/* Hero Scenery Banner */}
          <div className="relative rounded-xl overflow-hidden border border-[#1A2234] bg-[#0B0E14] h-48 flex flex-col justify-end p-6 shadow-2xl">
            <img
              src="/refinery-bay.jpg"
              alt="Refinery Bay"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="absolute inset-0 w-full h-full object-cover opacity-25 filter grayscale contrast-125 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-[#07090E]/60 to-transparent pointer-events-none" />

            <div className="relative z-10 flex justify-between items-end">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                  Industrial Evidence Ingestion Terminal
                </span>
                <h1 className="text-xl font-mono font-bold text-white mt-1">
                  Cross-Examination & Root-Cause Forensic Core
                </h1>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => loadSamplePreset("P-204")}
                  disabled={loading}
                  className="px-3 py-1.5 rounded bg-[#111622]/90 backdrop-blur-md hover:bg-[#182030] border border-[#1A2234] text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  PRELOAD P-204 (BEARING)
                </button>
                <button
                  onClick={() => loadSamplePreset("P-101")}
                  disabled={loading}
                  className="px-3 py-1.5 rounded bg-[#111622]/90 backdrop-blur-md hover:bg-[#182030] border border-[#1A2234] text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  PRELOAD P-101 (ALIGNMENT)
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                Target Asset Tag / Identifier
              </label>
              <input
                type="text"
                value={equipmentTag}
                onChange={(e) => setEquipmentTag(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#1A2234] rounded px-3 py-2 text-xs font-mono text-slate-200 focus:border-cyan-500 outline-none"
                placeholder="e.g., PUMP P-204 (BOILER FEED)"
              />
            </div>

            {/* Upload Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => csvInputRef.current?.click()}
                className={`border rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  csvFile ? "bg-[#0E1624] border-cyan-500/50" : "bg-[#0B0E14] border-[#1A2234] hover:border-[#2A3650]"
                }`}
              >
                <input
                  type="file"
                  ref={csvInputRef}
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                />
                <FileSpreadsheet className={`w-8 h-8 mb-2 ${csvFile ? "text-cyan-400" : "text-slate-500"}`} />
                <span className="font-mono text-xs font-bold text-slate-200 uppercase">
                  1. SCADA Telemetry Stream (CSV)
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-1">
                  {csvFile ? `Attached: ${csvFile.name}` : "Attach sensor CSV (vibration, bearing_temp, timestamp)"}
                </span>
              </div>

              <div
                onClick={() => shiftInputRef.current?.click()}
                className={`border rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  shiftFile ? "bg-[#0E1624] border-cyan-500/50" : "bg-[#0B0E14] border-[#1A2234] hover:border-[#2A3650]"
                }`}
              >
                <input
                  type="file"
                  ref={shiftInputRef}
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setShiftFile(e.target.files?.[0] || null)}
                />
                <FileText className={`w-8 h-8 mb-2 ${shiftFile ? "text-cyan-400" : "text-slate-500"}`} />
                <span className="font-mono text-xs font-bold text-slate-200 uppercase">
                  2. Shift Turnover Work Order (PDF)
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-1">
                  {shiftFile ? `Attached: ${shiftFile.name}` : "Attach operator shift handover notes"}
                </span>
              </div>

              <div
                onClick={() => oemInputRef.current?.click()}
                className={`border rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  oemFile ? "bg-[#0E1624] border-cyan-500/50" : "bg-[#0B0E14] border-[#1A2234] hover:border-[#2A3650]"
                }`}
              >
                <input
                  type="file"
                  ref={oemInputRef}
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setOemFile(e.target.files?.[0] || null)}
                />
                <FileText className={`w-8 h-8 mb-2 ${oemFile ? "text-cyan-400" : "text-slate-500"}`} />
                <span className="font-mono text-xs font-bold text-slate-200 uppercase">
                  3. OEM Specification Limits (PDF)
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-1">
                  {oemFile ? `Attached: ${oemFile.name}` : "Attach OEM / ISO 10816 limits document"}
                </span>
              </div>

              <div
                onClick={() => imgInputRef.current?.click()}
                className={`border rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  imageFile ? "bg-[#0E1624] border-cyan-500/50" : "bg-[#0B0E14] border-[#1A2234] hover:border-[#2A3650]"
                }`}
              >
                <input
                  type="file"
                  ref={imgInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                />
                <ImageIcon className={`w-8 h-8 mb-2 ${imageFile ? "text-cyan-400" : "text-slate-500"}`} />
                <span className="font-mono text-xs font-bold text-slate-200 uppercase">
                  4. Housing NDT Optical Photo (Optional)
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-1">
                  {imageFile ? `Attached: ${imageFile.name}` : "Attach bearing/coupling defect inspection photo"}
                </span>
              </div>
            </div>

            <button
              onClick={runDynamicUpload}
              disabled={loading || !csvFile || !shiftFile || !oemFile}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-mono font-bold py-3 rounded text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-40 cursor-pointer shadow-lg"
            >
              <UploadCloud className="w-4 h-4" />
              {loading ? "CORRELATING MULTI-AGENT DOSSIER..." : "EXECUTE FORENSIC INVESTIGATION"}
            </button>
          </div>
        </main>
      )}

      {/* VIEW 2: FORENSIC INVESTIGATION DOSSIER */}
      {view === "dashboard" && data && (
        <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto space-y-6">
          {/* Top Status Cards */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            </div>

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
            </div>

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

            <div className="bg-[#0B0E14] border border-[#1A2234] rounded p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Isolation Requirement
                </span>
                <div className="font-bold text-sm text-amber-400 mt-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
                  LOTO Breaker Lockout
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono border-t border-[#141A28] pt-1.5 mt-2">
                <span className="text-slate-500">Permit Class:</span>
                <span className="text-slate-200 font-bold">{data.inspection_plan[0]?.permit_type}</span>
              </div>
            </div>
          </section>

          {/* AI Executive Synthesis */}
          {data.ai_summary && (
            <section className="bg-[#0B0E14] border-l-2 border-l-cyan-500 border-y border-r border-[#1A2234] rounded-r p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                    Technical Executive Synthesis
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                  {data.ai_summary.source}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {data.ai_summary.narrative}
              </p>
            </section>
          )}

          {/* Dual Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-6">
              {/* NDT Optical Card */}
              {data.vision && (
                <section className="bg-[#0B0E14] border border-[#1A2234] rounded p-5">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1A2234]">
                    <div className="flex items-center gap-2">
                      <Maximize2 className="w-4 h-4 text-cyan-400" />
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                        Non-Destructive Optical Defect Inspection
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-[#111622] px-2.5 py-1 rounded border border-[#1A2234]">
                      {data.vision.equipment_identified}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    <div className="md:col-span-5 relative rounded overflow-hidden border border-[#1E2638] bg-black">
                      <img
                        src={localImagePreview || data.vision.image_url}
                        alt="NDT Inspection Capture"
                        className="w-full h-44 object-cover opacity-90"
                      />
                      <div className="absolute inset-4 border border-rose-500/70 border-dashed rounded flex flex-col justify-between p-1.5 pointer-events-none">
                        <span className="text-[8px] font-mono bg-black/90 text-rose-300 px-1 py-0.5 rounded w-max border border-rose-500/40">
                          {data.vision.visual_anomalies[0]?.box_label || "DEFECT ROI"}
                        </span>
                        <span className="text-[8px] font-mono bg-black/90 text-slate-300 px-1 py-0.5 rounded w-max self-end border border-slate-700">
                          COORD: {data.vision.visual_anomalies[0]?.coords || "[150, 100, 450, 300]"}
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-7 space-y-2.5">
                      {data.vision.visual_anomalies.map((ano: any, idx: number) => (
                        <div key={idx} className="p-3 bg-[#0E121B] rounded border border-[#1A2234] text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-mono font-bold text-slate-200 uppercase">{ano.region}</span>
                            <span className="text-rose-400 font-mono text-[10px] font-bold">{ano.severity} SEVERITY</span>
                          </div>
                          <p className="text-slate-400">{ano.finding}</p>
                          <div className="mt-2 pt-1.5 border-t border-[#161D2C] flex justify-between text-[10px] font-mono text-slate-500">
                            <span>Optical Confidence:</span>
                            <span className="text-cyan-400 font-bold">{Math.round(ano.confidence * 100)}% Match</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Dynamic SCADA Graph */}
              <section className="bg-[#0B0E14] border border-[#1A2234] rounded p-5">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1A2234]">
                  <div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                        SCADA Telemetry Vibration Stream
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      Signal Stream: {data.citations.sensor}
                    </span>
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
                        Cross-Examination Evidence Matrix
                      </span>
                    </div>
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

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-6">
              {data.contradictions.map((c: any) => (
                <div key={c.id} className="bg-[#120B0D] border-l-4 border-l-rose-500 border-y border-r border-rose-900/40 rounded-r p-4">
                  <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-xs uppercase tracking-wider mb-2">
                    <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0" />
                    EVIDENCE DISCREPANCY DETECTED
                  </div>
                  <div className="space-y-3 text-xs font-mono">
                    <div className="bg-[#0B0E14] border border-rose-950/60 p-2.5 rounded">
                      <span className="text-slate-500 uppercase text-[9px] block">Operator Written Log</span>
                      <p className="text-slate-300 italic mt-0.5">"{c.human_claim}"</p>
                    </div>
                    <div className="bg-[#0B0E14] border border-rose-950/60 p-2.5 rounded">
                      <span className="text-slate-500 uppercase text-[9px] block">Deterministic Telemetry</span>
                      <p className="text-rose-300 font-bold mt-0.5">{c.objective_claim}</p>
                    </div>
                  </div>
                </div>
              ))}

              <section className="bg-[#0B0E14] border border-[#1A2234] rounded p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#1A2234]">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                    Ranked Root Causes
                  </span>
                </div>
                <div className="space-y-3">
                  {data.hypotheses.map((hyp: any) => (
                    <div key={hyp.id} className="p-3 rounded border bg-[#0E1624] border-cyan-500/50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-slate-200">{hyp.title}</span>
                        <span className="text-cyan-400 font-mono text-[10px] font-bold">{hyp.score}% MATCH</span>
                      </div>
                      <ul className="text-[11px] text-slate-400 space-y-1 mt-2">
                        {hyp.reasons.map((r: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-[#0B0E14] border border-[#1A2234] rounded p-4 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#1A2234]">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                    Mandatory LOTO Controls
                  </span>
                </div>
                <div className="space-y-3">
                  {data.inspection_plan.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 bg-[#0E121B] border border-[#1A2234] rounded space-y-2">
                      <div className="font-bold text-xs text-slate-200">{item.title}</div>
                      <div className="space-y-1">
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
        </main>
      )}

      {/* Audit Drawer */}
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
                  <span className="text-[9px] text-cyan-400 uppercase tracking-widest block font-bold">Audit Verification</span>
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
                  <span className="text-slate-500 uppercase text-[10px] block mb-1">Observed Metric</span>
                  <p className="font-bold text-slate-200">{activeMetric.name}</p>
                </div>

                <div>
                  <span className="text-slate-500 uppercase text-[10px] block mb-1">Pure Python Formula</span>
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
