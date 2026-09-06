import React, { useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertOctagon,
  ShieldAlert,
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
  Sparkles,
  Radio,
  HelpCircle,
  Stethoscope,
  Eye,
  BookOpen,
  CheckCircle2
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
  { id: "S1", title: "SCADA Telemetry", desc: "NumPy velocity peak & polyfit thermal slope" },
  { id: "S2", title: "PyMuPDF Extraction", desc: "ISO 10816-3 limits & shift turnover logs" },
  { id: "S3", title: "Multimodal Vision", desc: "Correlating visual fretting & oil weepage" },
  { id: "S4", title: "Contradiction Engine", desc: "Cross-checking human claims against sensors" },
  { id: "S5", title: "Ollama Translation", desc: "Synthesizing non-field plain English dossier" }
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
    setLocalImagePreview(file ? URL.createObjectURL(file) : null);
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
      alert("Error processing upload dossier. Verify backend terminal.");
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
    let style = "bg-emerald-50 text-[#059669] border-emerald-200 font-semibold";
    let icon = "●";

    if (status === "NEUTRAL") {
      style = "bg-amber-50 text-amber-700 border-amber-200 font-semibold";
      icon = "▲";
    } else if (status === "CONTRADICT") {
      style = "bg-rose-50 text-[#BE123C] border-rose-200 font-bold";
      icon = "■";
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono tracking-tight ${style}`}>
        <span className="text-[8px]">{icon}</span>
        <span className="truncate max-w-[140px]">{label}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#0F172A] flex flex-col antialiased selection:bg-[#0284C7] selection:text-white">
      {/* Precision Top Navigation */}
      <header className="h-16 bg-[#FFFFFF] border-b border-[#CBD5E1] px-6 flex items-center justify-between z-30 sticky top-0 shadow-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0284C7] shadow-[0_0_10px_#0284c7]" />
            <span className="font-display text-sm font-bold tracking-wider text-[#003366]">
              SIH-26117 <span className="text-[#0284C7]">/</span> AUTONOMOUS FORENSICS
            </span>
          </div>

          <div className="h-5 w-px bg-[#CBD5E1]" />

          {view === "dashboard" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setView("upload")}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#0F172A] border border-[#CBD5E1] flex items-center gap-2 cursor-pointer transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-[#0284C7]" />
              BACK TO INGESTION PORTAL
            </motion.button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#003366] bg-[#F1F5F9] border border-[#CBD5E1] px-3 py-1.5 rounded-md flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#0284C7]" />
            OLLAMA LLAMA3.2: ACTIVE
          </span>

          {data && view === "dashboard" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openAuditReport}
              className="h-9 px-4 rounded-md bg-[#003366] hover:bg-[#00264d] text-white font-display font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <FileDown className="w-4 h-4 stroke-[2.5]" />
              EXPORT STATUTORY REPORT (PDF)
            </motion.button>
          )}
        </div>
      </header>

      {/* Dynamic Pipeline Progress Ribbon */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#FFFFFF] border-b border-[#0284C7] px-6 py-3 flex items-center justify-between font-mono text-xs overflow-hidden shadow-xs"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-[#0284C7] animate-spin" />
              <span className="text-[#003366] font-bold uppercase tracking-wider">
                Multi-Agent Investigation Running:
              </span>
              <span className="text-[#64748B] font-sans">
                {PIPELINE_STAGES[pipelineProgress - 1]?.desc || "Initializing agents..."}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {PIPELINE_STAGES.map((s, idx) => (
                <div
                  key={s.id}
                  className={`px-2.5 py-1 rounded text-xs border transition-all ${
                    idx + 1 < pipelineProgress
                      ? "bg-cyan-50 text-[#0284C7] border-[#0284C7]/40"
                      : idx + 1 === pipelineProgress
                      ? "bg-[#003366] text-white font-bold border-[#003366]"
                      : "bg-[#F8FAFC] text-[#64748B] border-[#CBD5E1]"
                  }`}
                >
                  {s.id}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW 1: COCKPIT INGESTION PORTAL */}
      {view === "upload" && (
        <main className="flex-1 p-6 md:p-8 max-w-[1500px] w-full mx-auto space-y-8">
          {/* Main Blueprint Hero Banner */}
          <div className="relative rounded-xl overflow-hidden border border-[#CBD5E1] bg-[#FFFFFF] shadow-sm">
            <div className="h-72 relative w-full overflow-hidden">
              <img
                src="/refinery-bay.jpg"
                alt="Refinery Machinery Hall"
                className="w-full h-full object-cover object-center filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF] via-[#FFFFFF]/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF] via-transparent to-[#FFFFFF]/60" />

              <div className="absolute top-5 left-6 flex items-center gap-3 font-mono text-xs">
                <span className="bg-[#FFFFFF]/90 backdrop-blur-md text-[#003366] border border-[#CBD5E1] px-3 py-1.5 rounded-full flex items-center gap-2 font-bold shadow-xs">
                  <Radio className="w-3.5 h-3.5 text-[#0284C7] animate-pulse" />
                  REFINERY SKID // PUMP BAY 04-A
                </span>
                <span className="bg-[#FFFFFF]/90 text-[#64748B] border border-[#CBD5E1] px-3 py-1.5 rounded-full font-medium">
                  ISO 10816-3 CONDITION MONITORING & FORENSICS
                </span>
              </div>

              <div className="absolute bottom-6 left-6 max-w-3xl">
                <span className="text-xs font-mono uppercase tracking-widest text-[#0284C7] font-bold block mb-1">
                  Deterministic Physics + Edge AI
                </span>
                <h1 className="text-3xl font-display font-extrabold text-[#003366] tracking-tight leading-tight">
                  Autonomous Plant Incident Forensic Core
                </h1>
                <p className="text-sm text-[#0F172A] mt-1.5 leading-relaxed font-sans max-w-2xl font-medium">
                  Cross-correlating SCADA telemetry, shift turnovers, and optical defect imagery to expose mechanical failure before catastrophic blowout.
                </p>
              </div>

              <div className="absolute bottom-6 right-6 hidden lg:flex items-center gap-3.5 bg-[#FFFFFF]/95 backdrop-blur-md border border-[#CBD5E1] p-3 rounded-lg shadow-sm">
                <img
                  src="/sensor-probe.jpg"
                  alt="Accelerometer Probe Rig"
                  className="w-16 h-16 rounded-md object-cover border border-[#CBD5E1]"
                />
                <div className="text-xs font-mono space-y-0.5">
                  <div className="text-[#003366] font-bold">PIEZO ACCELEROMETER #02</div>
                  <div className="text-[#64748B] font-sans">Calibration: ISO 10816 Certified</div>
                  <div className="text-[#059669] font-bold flex items-center gap-1.5 mt-1 font-mono text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-[#059669]" />
                    ACTIVE SCADA FEED
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Dossier Cases */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-display uppercase tracking-wider text-[#003366] font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0284C7]" />
                Select Verified Incident Dossier or Ingest Custom Plant Files
              </span>
              <span className="text-xs font-mono text-[#0284C7] font-bold">1-Click Full Cross-Examination</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div
                whileHover={{ y: -2 }}
                onClick={() => loadSamplePreset("P-204")}
                className="bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] hover:border-[#0284C7] rounded-xl p-5 cursor-pointer transition-all flex items-center gap-5 group shadow-xs"
              >
                <div className="relative w-40 h-32 rounded-lg overflow-hidden shrink-0 border border-[#CBD5E1] bg-slate-100">
                  <img
                    src="/P204_bearing_housing.jpg"
                    alt="Pump P-204 Bearing Housing"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1.5 right-1.5 bg-rose-100 text-[#BE123C] border border-rose-300 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                    OIL WEEPAGE
                  </span>
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-display font-bold text-[#003366] group-hover:text-[#0284C7] transition-colors">
                      DOSSIER 01: PUMP P-204 (FEEDWATER)
                    </span>
                    <span className="text-xs font-mono bg-rose-50 text-[#BE123C] border border-rose-200 px-2 py-0.5 rounded font-bold">
                      9.1 mm/s SPIKE
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed font-sans">
                    Drive-end raceway spalling and weeping seal lip directly contradicted by technician shift turnover claims.
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs font-mono border-t border-[#F1F5F9]">
                    <span className="text-[#64748B]">Mode: Bearing Spalling</span>
                    <span className="text-[#0284C7] flex items-center font-bold">
                      RUN INVESTIGATION <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                onClick={() => loadSamplePreset("P-101")}
                className="bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] hover:border-[#0284C7] rounded-xl p-5 cursor-pointer transition-all flex items-center gap-5 group shadow-xs"
              >
                <div className="relative w-40 h-32 rounded-lg overflow-hidden shrink-0 border border-[#CBD5E1] bg-slate-100">
                  <img
                    src="/P101_coupling_alignment.jpg"
                    alt="Pump P-101 Flexible Coupling"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1.5 right-1.5 bg-amber-100 text-amber-800 border border-amber-300 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                    GAP RUNOUT
                  </span>
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-display font-bold text-[#003366] group-hover:text-[#0284C7] transition-colors">
                      DOSSIER 02: PUMP P-101 (CRUDE TRANSFER)
                    </span>
                    <span className="text-xs font-mono bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-bold">
                      8.8 mm/s RUNOUT
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed font-sans">
                    Flexible grid coupling angular misalignment with flat thermal gradient (+0.07 °C/h) ruling out bearing failure.
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs font-mono border-t border-[#F1F5F9]">
                    <span className="text-[#64748B]">Mode: Shaft Misalignment</span>
                    <span className="text-[#0284C7] flex items-center font-bold">
                      RUN INVESTIGATION <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Ingestion Bay */}
          <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-6 md:p-8 space-y-5 shadow-xs">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#CBD5E1]">
              <div>
                <h3 className="font-display text-base font-bold uppercase tracking-wider text-[#003366]">
                  Custom Evidence Dossier Ingestion Bay
                </h3>
                <p className="text-xs text-[#64748B] mt-1 font-sans">
                  Upload arbitrary sensor streams and shift paperwork to trigger multi-agent cross-examination.
                </p>
              </div>

              <div className="w-full md:w-80">
                <input
                  type="text"
                  value={equipmentTag}
                  onChange={(e) => setEquipmentTag(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3.5 py-2 text-xs font-mono text-[#003366] font-bold focus:border-[#0284C7] outline-none"
                  placeholder="Target Machine Tag (e.g., PUMP P-204)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => csvInputRef.current?.click()}
                className={`border rounded-lg p-5 flex flex-col justify-between cursor-pointer transition-all min-h-[160px] ${
                  csvFile ? "bg-cyan-50/50 border-[#0284C7]" : "bg-[#F8FAFC] border-[#CBD5E1] hover:border-[#94A3B8]"
                }`}
              >
                <input
                  type="file"
                  ref={csvInputRef}
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                />
                <div className="flex justify-between items-start">
                  <FileSpreadsheet className={`w-7 h-7 ${csvFile ? "text-[#0284C7]" : "text-[#64748B]"}`} />
                  <span className="text-[10px] font-mono text-[#BE123C] bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-bold">REQUIRED</span>
                </div>
                <div>
                  <div className="font-display text-xs font-bold text-[#003366] uppercase">1. SCADA CSV</div>
                  <p className="text-xs text-[#64748B] mt-1 font-sans truncate">
                    {csvFile ? csvFile.name : "Vibration & Temp telemetry stream"}
                  </p>
                </div>
                <span className="text-xs font-mono text-[#0284C7] font-bold">
                  {csvFile ? "✓ FILE ATTACHED" : "+ SELECT CSV FILE"}
                </span>
              </div>

              <div
                onClick={() => shiftInputRef.current?.click()}
                className={`border rounded-lg p-5 flex flex-col justify-between cursor-pointer transition-all min-h-[160px] ${
                  shiftFile ? "bg-cyan-50/50 border-[#0284C7]" : "bg-[#F8FAFC] border-[#CBD5E1] hover:border-[#94A3B8]"
                }`}
              >
                <input
                  type="file"
                  ref={shiftInputRef}
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setShiftFile(e.target.files?.[0] || null)}
                />
                <div className="flex justify-between items-start">
                  <FileText className={`w-7 h-7 ${shiftFile ? "text-[#0284C7]" : "text-[#64748B]"}`} />
                  <span className="text-[10px] font-mono text-[#BE123C] bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-bold">REQUIRED</span>
                </div>
                <div>
                  <div className="font-display text-xs font-bold text-[#003366] uppercase">2. SHIFT LOG PDF</div>
                  <p className="text-xs text-[#64748B] mt-1 font-sans truncate">
                    {shiftFile ? shiftFile.name : "Operator shift handover notes"}
                  </p>
                </div>
                <span className="text-xs font-mono text-[#0284C7] font-bold">
                  {shiftFile ? "✓ FILE ATTACHED" : "+ SELECT PDF FILE"}
                </span>
              </div>

              <div
                onClick={() => oemInputRef.current?.click()}
                className={`border rounded-lg p-5 flex flex-col justify-between cursor-pointer transition-all min-h-[160px] ${
                  oemFile ? "bg-cyan-50/50 border-[#0284C7]" : "bg-[#F8FAFC] border-[#CBD5E1] hover:border-[#94A3B8]"
                }`}
              >
                <input
                  type="file"
                  ref={oemInputRef}
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setOemFile(e.target.files?.[0] || null)}
                />
                <div className="flex justify-between items-start">
                  <FileText className={`w-7 h-7 ${oemFile ? "text-[#0284C7]" : "text-[#64748B]"}`} />
                  <span className="text-[10px] font-mono text-[#BE123C] bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-bold">REQUIRED</span>
                </div>
                <div>
                  <div className="font-display text-xs font-bold text-[#003366] uppercase">3. OEM LIMITS PDF</div>
                  <p className="text-xs text-[#64748B] mt-1 font-sans truncate">
                    {oemFile ? oemFile.name : "ISO 10816 alarm thresholds"}
                  </p>
                </div>
                <span className="text-xs font-mono text-[#0284C7] font-bold">
                  {oemFile ? "✓ FILE ATTACHED" : "+ SELECT PDF FILE"}
                </span>
              </div>

              <div
                onClick={() => imgInputRef.current?.click()}
                className={`border rounded-lg p-5 flex flex-col justify-between cursor-pointer transition-all min-h-[160px] relative overflow-hidden ${
                  imageFile || localImagePreview ? "bg-cyan-50/50 border-[#0284C7]" : "bg-[#F8FAFC] border-[#CBD5E1] hover:border-[#94A3B8]"
                }`}
              >
                <input
                  type="file"
                  ref={imgInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                />
                {localImagePreview && (
                  <img
                    src={localImagePreview}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                  />
                )}
                <div className="flex justify-between items-start relative z-10">
                  <ImageIcon className={`w-7 h-7 ${imageFile ? "text-[#0284C7]" : "text-[#64748B]"}`} />
                  <span className="text-[10px] font-mono text-[#059669] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">OPTIONAL</span>
                </div>
                <div className="relative z-10">
                  <div className="font-display text-xs font-bold text-[#003366] uppercase">4. NDT DEFECT PHOTO</div>
                  <p className="text-xs text-[#64748B] mt-1 font-sans truncate">
                    {imageFile ? imageFile.name : "Bearing or coupling inspection"}
                  </p>
                </div>
                <span className="text-xs font-mono text-[#0284C7] font-bold relative z-10">
                  {imageFile ? "✓ IMAGE LOADED" : "+ ATTACH PHOTO"}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={runDynamicUpload}
              disabled={loading || !csvFile || !shiftFile || !oemFile}
              className="w-full bg-[#003366] hover:bg-[#00264d] text-white font-display font-bold py-3.5 rounded-lg text-sm flex items-center justify-center gap-2.5 transition-all disabled:opacity-40 cursor-pointer shadow-sm"
            >
              <UploadCloud className="w-5 h-5 stroke-[2.5]" />
              {loading ? "EXECUTING MULTI-AGENT CORRELATION..." : "EXECUTE FORENSIC INVESTIGATION ON UPLOADED DOSSIER"}
            </motion.button>
          </div>
        </main>
      )}

      {/* VIEW 2: FORENSIC INVESTIGATION DOSSIER */}
      {view === "dashboard" && data && (
        <main className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-7">
          {/* Top Status Metric Tiles */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => setActiveMetric(data.metrics.peak_vibration)}
              className="bg-[#FFFFFF] border border-[#CBD5E1] hover:border-[#BE123C] rounded-xl p-5 cursor-pointer transition-all group shadow-xs"
            >
              <div className="flex justify-between items-center text-xs font-mono text-[#64748B] uppercase tracking-wider mb-1">
                <span>{data.metrics.peak_vibration.name}</span>
                <span className="text-[#0284C7] group-hover:translate-x-1 transition-transform flex items-center font-bold">
                  TRACE <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div className="text-3xl font-display font-extrabold text-[#BE123C]">
                  {data.metrics.peak_vibration.value}{" "}
                  <span className="text-sm text-[#64748B] font-normal">{data.metrics.peak_vibration.unit}</span>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-rose-50 text-[#BE123C] border border-rose-200 font-bold">
                  LIMIT: {data.metrics.peak_vibration.threshold} mm/s
                </span>
              </div>
              <div className="mt-2 text-xs font-mono text-[#64748B] border-t border-[#F1F5F9] pt-2 flex justify-between">
                <span>ISO 10816 Envelope:</span>
                <span className="text-[#BE123C] font-bold">Zone D (Critical Breach)</span>
              </div>
            </div>

            <div
              onClick={() => setActiveMetric(data.metrics.temperature_rate_of_rise)}
              className="bg-[#FFFFFF] border border-[#CBD5E1] hover:border-amber-500 rounded-xl p-5 cursor-pointer transition-all group shadow-xs"
            >
              <div className="flex justify-between items-center text-xs font-mono text-[#64748B] uppercase tracking-wider mb-1">
                <span>{data.metrics.temperature_rate_of_rise.name}</span>
                <span className="text-[#0284C7] group-hover:translate-x-1 transition-transform flex items-center font-bold">
                  TRACE <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div className={`text-3xl font-display font-extrabold ${data.metrics.temperature_rate_of_rise.breached ? "text-amber-600" : "text-[#059669]"}`}>
                  +{data.metrics.temperature_rate_of_rise.value}{" "}
                  <span className="text-sm text-[#64748B] font-normal">{data.metrics.temperature_rate_of_rise.unit}</span>
                </div>
                <span className={`text-xs font-mono px-2.5 py-1 rounded border font-bold ${
                  data.metrics.temperature_rate_of_rise.breached
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-emerald-50 text-[#059669] border-emerald-200"
                }`}>
                  {data.metrics.temperature_rate_of_rise.breached ? "THERMAL DRIFT" : "NOMINAL"}
                </span>
              </div>
              <div className="mt-2 text-xs font-mono text-[#64748B] border-t border-[#F1F5F9] pt-2 flex justify-between">
                <span>Thermal Limit:</span>
                <span className="text-[#0F172A] font-bold">0.50 °C/h</span>
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-5 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider block mb-1">
                  Confirmed Diagnosis
                </span>
                <div className="font-display font-bold text-sm text-[#003366] mt-1 line-clamp-1">
                  {data.hypotheses[0]?.title}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-mono border-t border-[#F1F5F9] pt-2 mt-2">
                <span className="text-[#64748B]">Match Confidence:</span>
                <span className="text-[#0284C7] font-bold text-sm">{data.hypotheses[0]?.score}%</span>
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-5 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider block mb-1">
                  Safety Isolation Protocol
                </span>
                <div className="font-display font-bold text-sm text-amber-700 mt-1 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
                  Mandatory Breaker LOTO
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-mono border-t border-[#F1F5F9] pt-2 mt-2">
                <span className="text-[#64748B]">Permit Tier:</span>
                <span className="text-[#0F172A] font-bold">{data.inspection_plan[0]?.permit_type}</span>
              </div>
            </div>
          </section>

          {/* PLAIN-ENGLISH TRANSLATOR FOR JUDGES */}
          {data.plain_english_summary && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FFFFFF] border border-[#0284C7]/50 rounded-xl p-6 md:p-7 shadow-sm space-y-5"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-[#CBD5E1] pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-cyan-50 text-[#0284C7] border border-cyan-200">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#0284C7] font-bold">
                      Non-Technical Evaluator Guide // Ollama Live Translation
                    </span>
                    <h2 className="text-lg font-display font-bold text-[#003366]">
                      What do these 3 files actually tell us in plain English?
                    </h2>
                  </div>
                </div>

                <span className="text-xs font-mono bg-cyan-50 text-[#003366] border border-cyan-200 px-3 py-1 rounded-full font-bold">
                  PLAIN-ENGLISH SYNTHESIS
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-[#0284C7] font-display font-bold text-xs">
                    <Stethoscope className="w-4 h-4 text-[#0284C7]" />
                    FILE 1: SCADA TELEMETRY (CSV)
                  </div>
                  <div className="text-xs font-mono font-bold text-[#0F172A]">
                    "The Machine's Heartbeat"
                  </div>
                  <p className="text-xs text-[#64748B] font-sans leading-relaxed">
                    {data.plain_english_summary.files_explained[0]?.what_it_says}
                  </p>
                  <div className="pt-2 border-t border-[#E2E8F0] flex justify-between items-center text-[11px] font-mono">
                    <span className="text-[#64748B]">Physical Reality:</span>
                    <span className="text-[#BE123C] font-bold">CRITICAL SPIKE</span>
                  </div>
                </div>

                <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-600 font-display font-bold text-xs">
                    <Eye className="w-4 h-4 text-amber-600" />
                    FILE 2: SHIFT TURNOVER (PDF)
                  </div>
                  <div className="text-xs font-mono font-bold text-[#0F172A]">
                    "The Human Inspection"
                  </div>
                  <p className="text-xs text-[#64748B] font-sans leading-relaxed">
                    {data.plain_english_summary.files_explained[1]?.what_it_says}
                  </p>
                  <div className="pt-2 border-t border-[#E2E8F0] flex justify-between items-center text-[11px] font-mono">
                    <span className="text-[#64748B]">Human Finding:</span>
                    <span className="text-[#DC2626] font-bold">CONTRADICTED</span>
                  </div>
                </div>

                <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-[#003366] font-display font-bold text-xs">
                    <BookOpen className="w-4 h-4 text-[#003366]" />
                    FILE 3: OEM MANUAL (PDF)
                  </div>
                  <div className="text-xs font-mono font-bold text-[#0F172A]">
                    "The Factory Speed Limit"
                  </div>
                  <p className="text-xs text-[#64748B] font-sans leading-relaxed">
                    {data.plain_english_summary.files_explained[2]?.what_it_says}
                  </p>
                  <div className="pt-2 border-t border-[#E2E8F0] flex justify-between items-center text-[11px] font-mono">
                    <span className="text-[#64748B]">Standard Limit:</span>
                    <span className="text-[#BE123C] font-bold">BREACHED</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0284C7]" />
                  <span className="text-xs font-mono font-bold text-[#003366] uppercase">
                    Bottom-Line Synthesis for Stakeholders:
                  </span>
                </div>
                <p className="text-sm text-[#0F172A] font-sans leading-relaxed font-medium">
                  {data.plain_english_summary.narrative}
                </p>
              </div>
            </motion.section>
          )}

          {/* Dual Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            <div className="lg:col-span-8 space-y-7">
              {/* NDT Optical Card */}
              {data.vision && (
                <section className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#CBD5E1]">
                    <div className="flex items-center gap-2.5">
                      <Maximize2 className="w-4 h-4 text-[#0284C7]" />
                      <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#003366]">
                        Non-Destructive Optical Defect Inspection
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-[#003366] bg-[#F1F5F9] border border-[#CBD5E1] px-3 py-1 rounded-full font-bold">
                      {data.vision.equipment_identified}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-5 relative rounded-lg overflow-hidden border border-[#CBD5E1] bg-slate-900 shadow-xs">
                      <img
                        src={localImagePreview || (equipmentTag.includes("101") ? "/P101_coupling_alignment.jpg" : "/P204_bearing_housing.jpg")}
                        alt="NDT Inspection Capture"
                        className="w-full h-52 object-cover"
                      />
                      <div className="absolute inset-4 border-2 border-[#BE123C] border-dashed rounded flex flex-col justify-between p-2 pointer-events-none">
                        <span className="text-[10px] font-mono bg-white/95 text-[#BE123C] px-1.5 py-0.5 rounded font-bold w-max border border-rose-300 shadow-xs">
                          {data.vision.visual_anomalies[0]?.box_label || "DEFECT ROI"}
                        </span>
                        <span className="text-[10px] font-mono bg-white/95 text-[#0F172A] px-1.5 py-0.5 rounded w-max self-end border border-[#CBD5E1] shadow-xs font-semibold">
                          COORD: {data.vision.visual_anomalies[0]?.coords || "[150, 100, 450, 300]"}
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-7 space-y-3">
                      {data.vision.visual_anomalies.map((ano: any, idx: number) => (
                        <div key={idx} className="p-4 bg-[#F8FAFC] rounded-lg border border-[#CBD5E1] text-xs space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="font-display font-bold text-sm text-[#003366] uppercase tracking-tight">
                              {ano.region.replace(/_/g, " ")}
                            </span>
                            <span className="text-[#BE123C] font-mono text-xs font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                              {ano.severity} SEVERITY
                            </span>
                          </div>
                          <p className="text-xs text-[#64748B] font-sans leading-relaxed">{ano.finding}</p>
                          <div className="mt-2 pt-2 border-t border-[#E2E8F0] flex justify-between text-xs font-mono text-[#64748B]">
                            <span>Optical Corroboration:</span>
                            <span className="text-[#0284C7] font-bold">{Math.round(ano.confidence * 100)}% Match</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Dynamic SCADA Graph */}
              <section className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#CBD5E1]">
                  <div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#0284C7]" />
                      <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#003366]">
                        24-Hour Calibrated SCADA Vibration Profile
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-[#64748B]">
                      Signal Stream: {data.citations.sensor}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="flex items-center gap-2 text-[#1E40AF] font-bold">
                      <span className="w-3 h-3 rounded bg-[#1E40AF]" /> Velocity (mm/s)
                    </div>
                    <div className="flex items-center gap-2 text-[#BE123C] font-bold">
                      <span className="w-4 h-0.5 bg-[#BE123C]" /> OEM Trip ({data.metrics.peak_vibration.threshold} mm/s)
                    </div>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.telemetry_series || []} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="time" stroke="#64748B" fontSize={11} fontFamily="monospace" tickLine={false} />
                      <YAxis stroke="#64748B" fontSize={11} domain={[0, 11]} fontFamily="monospace" tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#CBD5E1",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontFamily: "monospace",
                          color: "#0F172A",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
                        }}
                      />
                      <ReferenceLine
                        y={data.metrics.peak_vibration.threshold}
                        stroke="#BE123C"
                        strokeDasharray="4 4"
                        label={{
                          value: `TRIP: ${data.metrics.peak_vibration.threshold} mm/s`,
                          fill: "#BE123C",
                          fontSize: 11,
                          fontFamily: "monospace",
                          position: "insideTopLeft"
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="vibration"
                        stroke="#1E40AF"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: "#1E40AF" }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Evidence Cross-Examination Matrix with Deep Iron Navy Header */}
              {data.evidence_matrix && (
                <section className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-6 shadow-xs overflow-x-auto space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#CBD5E1]">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#0284C7]" />
                      <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#003366]">
                        Cross-Examination Evidence Matrix (Deterministic Verification)
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-[#64748B]">
                      Multi-Vector Corroboration
                    </span>
                  </div>

                  <table className="w-full text-left text-xs font-mono border-collapse rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-[#0F172A] text-white uppercase text-[11px]">
                        <th className="py-3 px-3.5">Failure Mode Modeled</th>
                        <th className="py-3 px-3">Photo Optics</th>
                        <th className="py-3 px-3">Shift Log</th>
                        <th className="py-3 px-3">OEM Spec</th>
                        <th className="py-3 px-3">CSV Stream</th>
                        <th className="py-3 px-3">Turnover History</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {data.evidence_matrix.map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-3.5 px-3.5 font-display font-bold text-[#003366] text-sm">{row.mode}</td>
                          <td className="py-3.5 px-3">{renderStatusCell(row.photo.status, row.photo.text)}</td>
                          <td className="py-3.5 px-3">{renderStatusCell(row.report.status, row.report.text)}</td>
                          <td className="py-3.5 px-3">{renderStatusCell(row.manual.status, row.manual.text)}</td>
                          <td className="py-3.5 px-3">{renderStatusCell(row.csv.status, row.csv.text)}</td>
                          <td className="py-3.5 px-3">{renderStatusCell(row.history.status, row.history.text)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              )}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-6">
              {/* Contradiction Flag Ribbon */}
              {data.contradictions.map((c: any) => (
                <div key={c.id} className="bg-[#FEF2F2] border-l-4 border-l-[#DC2626] border-y border-r border-rose-200 rounded-r-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-[#DC2626] font-display font-bold text-xs uppercase tracking-wider">
                    <AlertOctagon className="w-5 h-5 text-[#DC2626] shrink-0" />
                    AUDIT EVIDENCE DISCREPANCY DETECTED
                  </div>
                  <div className="space-y-3 text-xs font-mono">
                    <div className="bg-[#FFFFFF] border border-rose-200 p-3 rounded-md">
                      <span className="text-[#64748B] uppercase text-[10px] block font-bold mb-1">Human Operator Written Claim</span>
                      <p className="text-[#0F172A] italic font-sans leading-relaxed font-medium">"{c.human_claim}"</p>
                    </div>
                    <div className="bg-[#FFFFFF] border border-rose-200 p-3 rounded-md">
                      <span className="text-[#64748B] uppercase text-[10px] block font-bold mb-1">Calibrated Sensor Reality</span>
                      <p className="text-[#BE123C] font-bold font-mono leading-relaxed">{c.objective_claim}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Competing Hypotheses */}
              <section className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#CBD5E1]">
                  <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#003366]">
                    Ranked Competing Hypotheses
                  </h4>
                  <span className="text-xs font-mono text-[#0284C7] font-bold">Bayesian Matrix</span>
                </div>
                <div className="space-y-3">
                  {data.hypotheses.map((hyp: any) => (
                    <div key={hyp.id} className="p-4 rounded-lg border bg-cyan-50/30 border-[#0284C7]/40 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-display font-bold text-sm text-[#003366]">{hyp.title}</span>
                        <span className="text-[#0284C7] font-mono text-xs font-bold bg-[#FFFFFF] border border-[#0284C7]/40 px-2 py-0.5 rounded shadow-xs">
                          {hyp.score}% MATCH
                        </span>
                      </div>
                      <ul className="text-xs text-[#64748B] space-y-1.5 font-sans">
                        {hyp.reasons.map((r: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                            <span className="text-[#0F172A]">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Mandatory LOTO Action Plan */}
              <section className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#CBD5E1]">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#003366]">
                    Mandatory Safety LOTO Plan
                  </h4>
                </div>
                <div className="space-y-3">
                  {data.inspection_plan.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                          {item.priority}
                        </span>
                        <span className="text-xs font-mono text-[#64748B]">{item.permit_type}</span>
                      </div>
                      <div className="font-display font-bold text-sm text-[#003366]">{item.title}</div>
                      <p className="text-xs text-[#64748B] font-sans leading-relaxed">{item.description}</p>
                      <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0]">
                        {item.safety_controls.map((ctrl: string, cIdx: number) => (
                          <div key={cIdx} className="flex items-center gap-2 text-xs font-mono text-[#0F172A]">
                            <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
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

      {/* Slide-Over Engineer Calculation Trace Drawer */}
      <AnimatePresence>
        {activeMetric && (
          <motion.div
            initial={{ x: 440, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 440, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="fixed right-0 top-0 w-full sm:w-[420px] h-full bg-[#FFFFFF] border-l border-[#CBD5E1] shadow-2xl p-6 flex flex-col justify-between z-50 font-mono"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#CBD5E1]">
                <div>
                  <span className="text-[10px] text-[#0284C7] uppercase tracking-widest block font-bold">
                    Statutory Proof
                  </span>
                  <h3 className="font-display font-bold text-[#003366] text-base">Deterministic Calculation Trace</h3>
                </div>
                <button
                  onClick={() => setActiveMetric(null)}
                  className="w-8 h-8 rounded-md bg-[#F1F5F9] border border-[#CBD5E1] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[#64748B] uppercase text-[10px] block mb-1 font-bold">Observed Telemetry Property</span>
                  <p className="font-display font-bold text-[#003366] text-sm">{activeMetric.name}</p>
                </div>

                <div>
                  <span className="text-[#64748B] uppercase text-[10px] block mb-1 font-bold">Pure Python Deterministic Formula</span>
                  <div className="bg-[#F8FAFC] border border-[#CBD5E1] p-3 rounded-md text-[#1E40AF] font-mono text-xs font-semibold">
                    <code>{activeMetric.formula}</code>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#F8FAFC] p-3 rounded-md border border-[#CBD5E1]">
                    <span className="text-[#64748B] text-[10px] block font-bold">Temporal Window</span>
                    <span className="font-bold text-[#0F172A]">{activeMetric.window}</span>
                  </div>
                  <div className="bg-[#F8FAFC] p-3 rounded-md border border-[#CBD5E1]">
                    <span className="text-[#64748B] text-[10px] block font-bold">Source CSV Rows</span>
                    <span className="font-bold text-[#0284C7]">Rows: [{activeMetric.source_rows.join(", ")}]</span>
                  </div>
                </div>

                <div className="border border-[#CBD5E1] bg-[#F8FAFC] p-4 rounded-lg space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Evaluated Value:</span>
                    <span className="text-[#0F172A] font-bold">{activeMetric.value} {activeMetric.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Alarm Boundary:</span>
                    <span className="text-[#BE123C] font-bold">{activeMetric.threshold} {activeMetric.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Breach State:</span>
                    <span className={activeMetric.breached ? "text-[#BE123C] font-bold" : "text-[#059669] font-bold"}>
                      {activeMetric.breached ? "CRITICAL BREACH (TRUE)" : "NOMINAL (FALSE)"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveMetric(null)}
              className="w-full bg-[#003366] hover:bg-[#00264d] text-white py-3 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              DISMISS CALCULATION TRACE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
