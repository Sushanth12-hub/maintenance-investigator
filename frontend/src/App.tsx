import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ShieldCheck,
  Play,
  CheckCircle2,
  ChevronRight,
  X,
  Cpu,
  FileDown,
  Eye,
  Activity,
  Check,
  Zap,
  Terminal,
  Layers,
  Crosshair,
  Radio
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area
} from "recharts";

const AGENT_STEPS = [
  { id: "01", name: "Telemetry Ingestion", detail: "Parsing 24h SCADA CSV & computing RMS velocity and polyfit slope" },
  { id: "02", name: "OEM & Work-Order Extraction", detail: "PyMuPDF parsing ISO 10816-3 thresholds & shift turnover logs" },
  { id: "03", name: "Multimodal Vision Agent", detail: "Optical scan of bearing flange, seal lip, and coupling guard" },
  { id: "04", name: "Contradiction Cross-Exam", detail: "Correlating human claims against sensor telemetry facts" },
  { id: "05", name: "Safety Synthesis", detail: "Compiling mandatory LOTO isolation rules & PTW Class A permit" }
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

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < AGENT_STEPS.length - 1 ? prev + 1 : prev));
    }, 500);

    try {
      const [response] = await Promise.all([
        axios.post(`http://localhost:8000/api/investigate/run?asset=${asset}`),
        new Promise((resolve) => setTimeout(resolve, 2600))
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
    let colorClass = "bg-emerald-400 text-emerald-300 border-emerald-500/30";
    let dotClass = "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]";

    if (status === "NEUTRAL") {
      colorClass = "bg-amber-400/10 text-amber-300 border-amber-500/30";
      dotClass = "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]";
    }
    if (status === "CONTRADICT") {
      colorClass = "bg-rose-500/10 text-rose-300 border-rose-500/30";
      dotClass = "bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]";
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-mono ${colorClass}`}>
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`}></span>
        <span>{text}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#070B12] text-slate-200 flex font-sans selection:bg-teal-500 selection:text-black antialiased relative overflow-x-hidden">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#0e1726_1px,transparent_1px),linear-gradient(to_bottom,#0e1726_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Mission Control Sidebar */}
      <aside className="w-72 bg-[#0B111E]/90 backdrop-blur-xl border-r border-slate-800/80 p-6 flex flex-col justify-between shrink-0 relative z-20 shadow-2xl">
        <div className="space-y-6">
          {/* Header Brand */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_12px_#14b8a6] animate-pulse" />
              <span className="font-mono font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-200 to-blue-400 text-sm">
                SIH // 26117
              </span>
            </div>
            <h1 className="text-xs tracking-wider uppercase text-slate-400 font-mono font-medium">
              Autonomous Plant Investigator
            </h1>
          </div>

          {/* Asset Selection Switcher */}
          <div className="bg-[#0E1626] p-1.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono mb-2 px-2 pt-1 font-semibold flex items-center justify-between">
              Target Machine
              <Radio className="w-3 h-3 text-teal-400 animate-pulse" />
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleAssetChange("P-204")}
                className={`relative py-2 px-3 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  selectedAsset === "P-204"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-black shadow-[0_0_15px_rgba(20,184,166,0.5)]"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                PUMP P-204
              </button>
              <button
                onClick={() => handleAssetChange("P-101")}
                className={`relative py-2 px-3 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  selectedAsset === "P-101"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-black shadow-[0_0_15px_rgba(20,184,166,0.5)]"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                PUMP P-101
              </button>
            </div>
          </div>

          {/* Active Asset Spec Card */}
          <div className="bg-[#0E1626]/70 backdrop-blur-md rounded-xl p-4 border border-slate-800/80 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono text-teal-400 uppercase tracking-wider">Asset Registry</span>
                <p className="font-bold text-white text-sm">
                  {selectedAsset === "P-204" ? "Boiler Feed Pump P-204" : "Crude Transfer Pump P-101"}
                </p>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30">
                ONLINE
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
              <div className="flex justify-between">
                <span>Domain Standard:</span>
                <span className="text-slate-200">ISO 10816-3</span>
              </div>
              <div className="flex justify-between">
                <span>Permit Tier:</span>
                <span className="text-amber-300">PTW Class A/B</span>
              </div>
              <div className="flex justify-between">
                <span>Telemetry Window:</span>
                <span className="text-slate-200">24h SCADA</span>
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-500 space-y-1 border-t border-slate-800/80 pt-2">
              <div className="truncate text-teal-400/80">▸ {selectedAsset === "P-204" ? "WO-204-8821_shiftlog.pdf" : "WO-101-4412_shiftlog.pdf"}</div>
              <div className="truncate text-cyan-400/80">▸ {selectedAsset === "P-204" ? "OEM_P204_limits.pdf" : "OEM_P101_limits.pdf"}</div>
              <div className="truncate text-blue-400/80">▸ {selectedAsset === "P-204" ? "P204_sensor_24h.csv" : "P101_sensor_24h.csv"}</div>
              {selectedAsset === "P-204" && <div className="truncate text-purple-400/80">▸ P204_bearing_housing.jpg</div>}
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-2.5 pt-4">
          {data && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openAuditReport}
              className="w-full bg-[#131F33] hover:bg-[#1A2A45] text-teal-300 border border-teal-500/30 font-mono text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer font-bold"
            >
              <FileDown className="w-4 h-4" />
              FORENSIC AUDIT PDF
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => runInvestigation()}
            disabled={loading}
            className="w-full relative overflow-hidden bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 text-black font-mono font-black py-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-[0_0_25px_rgba(20,184,166,0.4)] transition-all disabled:opacity-50 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-black" />
            {loading ? "CORRELATING AGENTS..." : "START INVESTIGATION"}
          </motion.button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-8 overflow-y-auto relative z-10">
        {!data ? (
          <div className="h-full min-h-[70vh] flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-[#0B111E]/80 border border-slate-800 rounded-2xl p-12 text-center max-w-lg shadow-2xl relative overflow-hidden backdrop-blur-xl"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-6 shadow-[0_0_20px_rgba(20,184,166,0.2)]">
                <Crosshair className="w-8 h-8 animate-spin-slow" />
              </div>
              <h2 className="text-xl font-mono font-bold text-white mb-2">Investigation Engine Standby</h2>
              <p className="text-xs text-slate-400 leading-relaxed font-mono mb-6">
                Deterministic cross-examination agents ready to evaluate SCADA vibrations, PDF work-orders, and multimodal optics.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => runInvestigation()}
                className="bg-gradient-to-r from-teal-400 to-cyan-500 text-black font-mono font-black px-6 py-3 rounded-xl text-xs shadow-[0_0_20px_rgba(20,184,166,0.4)] cursor-pointer"
              >
                INITIALIZE AGENTS ({selectedAsset})
              </motion.button>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="space-y-6 max-w-6xl mx-auto"
          >
            {/* Top Stat Bar / KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div
                whileHover={{ y: -2 }}
                onClick={() => setActiveMetric(data.metrics.peak_vibration)}
                className="relative overflow-hidden bg-[#0B111E]/90 border border-rose-500/40 rounded-2xl p-5 shadow-[0_0_25px_rgba(244,63,94,0.1)] cursor-pointer backdrop-blur-md group"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-orange-500" />
                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                  <span className="uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-rose-400" />
                    {data.metrics.peak_vibration.name}
                  </span>
                  <span className="flex items-center text-[10px] text-teal-400 font-bold group-hover:translate-x-1 transition-transform">
                    AUDIT TRACE <ChevronRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-3">
                  <div className="text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
                    {data.metrics.peak_vibration.value}{" "}
                    <span className="text-base text-slate-400 font-normal">{data.metrics.peak_vibration.unit}</span>
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2.5 py-1 rounded-full font-bold shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                      BREACH &gt; {data.metrics.peak_vibration.threshold} mm/s
                    </span>
                    <span className="block text-[9px] font-mono text-slate-500 mt-1">ISO 10816-3 Alarm</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                onClick={() => setActiveMetric(data.metrics.temperature_rate_of_rise)}
                className={`relative overflow-hidden bg-[#0B111E]/90 border rounded-2xl p-5 backdrop-blur-md cursor-pointer group ${
                  data.metrics.temperature_rate_of_rise.breached
                    ? "border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.1)]"
                    : "border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.1)]"
                }`}
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    data.metrics.temperature_rate_of_rise.breached
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500"
                  }`}
                />
                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                  <span className="uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className={`w-3.5 h-3.5 ${data.metrics.temperature_rate_of_rise.breached ? "text-amber-400" : "text-emerald-400"}`} />
                    {data.metrics.temperature_rate_of_rise.name}
                  </span>
                  <span className="flex items-center text-[10px] text-teal-400 font-bold group-hover:translate-x-1 transition-transform">
                    AUDIT TRACE <ChevronRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-3">
                  <div
                    className={`text-4xl font-black font-mono text-transparent bg-clip-text ${
                      data.metrics.temperature_rate_of_rise.breached
                        ? "bg-gradient-to-r from-amber-400 to-yellow-300"
                        : "bg-gradient-to-r from-emerald-400 to-teal-300"
                    }`}
                  >
                    +{data.metrics.temperature_rate_of_rise.value}{" "}
                    <span className="text-base text-slate-400 font-normal">{data.metrics.temperature_rate_of_rise.unit}</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block text-[10px] font-mono px-2.5 py-1 rounded-full font-bold border ${
                        data.metrics.temperature_rate_of_rise.breached
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      }`}
                    >
                      {data.metrics.temperature_rate_of_rise.breached ? "THERMAL DRIFT SPIKE" : "THERMAL STABLE (COUPLING)"}
                    </span>
                    <span className="block text-[9px] font-mono text-slate-500 mt-1">Threshold: 0.50 °C/h</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* AI Executive Synthesis Terminal Card */}
            {data.ai_summary && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#0B111E]/95 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                      Technical Executive Synthesis
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded">
                    {data.ai_summary.source}
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-300 leading-relaxed">
                  {data.ai_summary.narrative}
                </p>
              </motion.div>
            )}

            {/* Multimodal Vision Inspection HUD (With Laser Radar Scan) */}
            {data.vision && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#0B111E]/95 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-teal-400" />
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                      Multimodal Optical Scanner (Drive End)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
                    {data.vision.equipment_identified} ({data.vision.resolution})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* Image with Laser Scanner Animation */}
                  <div className="relative rounded-xl overflow-hidden border border-cyan-500/40 bg-black shadow-[0_0_20px_rgba(6,182,212,0.15)] group">
                    <img
                      src="http://localhost:8000/demo-data/P204_bearing_housing.jpg"
                      alt="Drive-End Bearing Housing"
                      className="w-full h-48 object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                    />
                    {/* Laser Scanner Bar */}
                    <motion.div
                      animate={{ y: [0, 180, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] pointer-events-none"
                    />
                    {/* Visual Bounding Box Overlay */}
                    <div className="absolute inset-8 border border-dashed border-rose-500/80 rounded bg-rose-500/10 pointer-events-none flex flex-col justify-between p-1.5">
                      <span className="text-[8px] font-mono font-black text-rose-400 bg-black/80 px-1 rounded w-max">
                        DEFECT_ROI #01
                      </span>
                      <span className="text-[8px] font-mono text-amber-300 bg-black/80 px-1 rounded w-max self-end">
                        CONF: 88%
                      </span>
                    </div>
                  </div>

                  {/* Anomaly Badges */}
                  <div className="md:col-span-2 space-y-2.5">
                    {data.vision.visual_anomalies.map((ano: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-[#0E1626]/80 border border-slate-800/80 rounded-xl p-3 flex justify-between items-start hover:border-slate-700 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-200 uppercase">
                              {ano.region.replace(/_/g, " ")}
                            </span>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold">
                              {ano.severity} SEVERITY
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-mono">{ano.finding}</p>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-teal-300 bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded">
                          {Math.round(ano.confidence * 100)}% CONF
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Glowing Recharts Vibration Timeline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#0B111E]/95 border border-slate-800 rounded-2xl p-6 shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-400" />
                    SCADA Telemetry Stream vs ISO / OEM Envelope
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">
                    Source: {data.citations.sensor}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" /> Vibration (mm/s)
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <span className="w-3 h-0.5 bg-rose-500 stroke-dasharray" /> Limit ({data.metrics.peak_vibration.threshold})
                  </span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.telemetry_series || []}>
                    <defs>
                      <linearGradient id="colorVib" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#475569" fontSize={11} fontFamily="monospace" />
                    <YAxis stroke="#475569" fontSize={11} domain={[0, 11]} fontFamily="monospace" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0B111E",
                        borderColor: "#334155",
                        borderRadius: "8px",
                        fontFamily: "monospace",
                        fontSize: "12px",
                        color: "#E2E8F0"
                      }}
                    />
                    <ReferenceLine
                      y={data.metrics.peak_vibration.threshold}
                      stroke="#ef4444"
                      strokeDasharray="4 4"
                      label={{
                        value: `OEM LIMIT (${data.metrics.peak_vibration.threshold} mm/s)`,
                        fill: "#ef4444",
                        fontSize: 10,
                        fontFamily: "monospace"
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="vibration"
                      stroke="#f43f5e"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorVib)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Contradiction Detection Alarm Card */}
            {data.contradictions.map((c: any) => (
              <motion.div
                key={c.id}
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                className="bg-rose-950/20 border-l-4 border-l-rose-500 border-y border-r border-rose-500/30 rounded-r-2xl p-5 shadow-[0_0_30px_rgba(244,63,94,0.15)]"
              >
                <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-xs uppercase tracking-wider mb-3">
                  <AlertTriangle className="w-4 h-4 animate-bounce" />
                  EVIDENCE DISCREPANCY & CONTRADICTION DETECTED
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-[#0B111E]/80 border border-slate-800 p-3 rounded-xl">
                    <span className="text-slate-500 block uppercase text-[9px] mb-1">Human Shift Claim</span>
                    <p className="text-slate-300 italic">"{c.human_claim}"</p>
                    <span className="text-[9px] text-teal-400 block mt-2">Ref: {c.sources[0]}</span>
                  </div>
                  <div className="bg-[#0B111E]/80 border border-slate-800 p-3 rounded-xl">
                    <span className="text-slate-500 block uppercase text-[9px] mb-1">Calibrated SCADA Telemetry</span>
                    <p className="text-rose-300 font-bold">{c.objective_claim}</p>
                    <span className="text-[9px] text-teal-400 block mt-2">Ref: {c.sources[1]}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Competing Hypotheses Cards */}
            <div className="space-y-3">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                Competing Root-Cause Hypotheses
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.hypotheses.map((hyp: any) => (
                  <div
                    key={hyp.id}
                    className={`rounded-2xl p-5 border backdrop-blur-md flex flex-col justify-between ${
                      hyp.status === "CONFIRMED_PRIMARY"
                        ? "bg-[#0E1B29] border-teal-500/50 shadow-[0_0_25px_rgba(20,184,166,0.15)]"
                        : "bg-[#0B111E] border-slate-800/80"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-[10px] font-bold text-slate-500">{hyp.id}</span>
                        <span
                          className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full border ${
                            hyp.status === "CONFIRMED_PRIMARY"
                              ? "bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-[0_0_10px_rgba(20,184,166,0.3)]"
                              : "bg-slate-800 text-slate-400 border-slate-700"
                          }`}
                        >
                          {hyp.score}% CONFIDENCE
                        </span>
                      </div>
                      <h4 className="font-mono text-sm font-bold text-white mb-3">{hyp.title}</h4>
                      <ul className="space-y-1.5 text-xs font-mono text-slate-300">
                        {hyp.reasons.map((r: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-500">Status: {hyp.status}</span>
                      <span className="text-teal-400">{hyp.supporting_evidence.length} Evidence Vectors</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive 2D Evidence Matrix */}
            {data.evidence_matrix && (
              <div className="bg-[#0B111E]/95 border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-x-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Cross-Examination Evidence Matrix (2D)
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">Deterministic Multi-Source Validation</span>
                </div>
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px]">
                      <th className="p-3">Failure Mode</th>
                      <th className="p-3">Photo Optics</th>
                      <th className="p-3">Turnover Log</th>
                      <th className="p-3">OEM Spec</th>
                      <th className="p-3">SCADA Stream</th>
                      <th className="p-3">Asset History</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {data.evidence_matrix.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3 font-bold text-slate-200">{row.mode}</td>
                        <td className="p-3">{getStatusBadge(row.photo.status, row.photo.text)}</td>
                        <td className="p-3">{getStatusBadge(row.report.status, row.report.text)}</td>
                        <td className="p-3">{getStatusBadge(row.manual.status, row.manual.text)}</td>
                        <td className="p-3">{getStatusBadge(row.csv.status, row.csv.text)}</td>
                        <td className="p-3">{getStatusBadge(row.history.status, row.history.text)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Safety-Gated Action Plan */}
            <div className="bg-[#0B111E]/95 border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Safety-Gated Action Plan & LOTO Rules
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.inspection_plan.map((item: any, idx: number) => (
                  <div key={idx} className="bg-[#0E1626]/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                          {item.priority}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">{item.permit_type}</span>
                      </div>
                      <h4 className="font-mono text-sm font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-xs font-mono text-slate-400 mb-3">{item.description}</p>
                    </div>
                    <div className="space-y-1.5 border-t border-slate-800 pt-3">
                      {item.safety_controls.map((ctrl: string, cIdx: number) => (
                        <div key={cIdx} className="flex items-center gap-2 text-[11px] font-mono text-slate-300">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{ctrl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <footer className="text-center text-[10px] font-mono text-slate-600 pt-6 pb-4 border-t border-slate-900">
              Deterministic Decision Support Prototype // SIH 26117 // Qualified plant engineer LOTO permit mandatory
            </footer>
          </motion.div>
        )}
      </main>

      {/* Cyber Multi-Agent Live Execution Modal */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              className="bg-[#0B111E] border border-teal-500/40 rounded-2xl p-6 max-w-lg w-full shadow-[0_0_50px_rgba(20,184,166,0.2)]"
            >
              <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
                <div className="w-3 h-3 rounded-full bg-teal-400 animate-ping" />
                <div>
                  <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                    Multi-Agent Pipeline Executing
                  </h3>
                  <p className="text-[10px] font-mono text-teal-400">Deterministic Cross-Examination Engine</p>
                </div>
              </div>

              <div className="space-y-3 font-mono">
                {AGENT_STEPS.map((step, idx) => {
                  const isCompleted = idx < currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <motion.div
                      key={step.id}
                      animate={{ x: isCurrent ? 4 : 0 }}
                      className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all text-xs ${
                        isCurrent
                          ? "bg-teal-950/30 border-teal-500/50 text-teal-200"
                          : isCompleted
                          ? "bg-slate-900/40 border-slate-800 text-slate-400"
                          : "border-transparent text-slate-600"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                          isCompleted
                            ? "bg-teal-500 text-black font-black"
                            : isCurrent
                            ? "border border-teal-400 text-teal-400 animate-pulse"
                            : "border border-slate-800 text-slate-700"
                        }`}
                      >
                        {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : step.id}
                      </span>
                      <div>
                        <div className="font-bold text-slate-200">{step.name}</div>
                        <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{step.detail}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-over Audit Trace Drawer with Spring Physics */}
      <AnimatePresence>
        {activeMetric && (
          <motion.div
            initial={{ x: 380, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 380, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 w-96 h-full bg-[#0B111E]/95 backdrop-blur-2xl shadow-[-20px_0_40px_rgba(0,0,0,0.8)] border-l border-teal-500/30 p-6 flex flex-col justify-between z-50 font-mono"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[9px] text-teal-400 uppercase tracking-widest block font-bold">Forensic Proof</span>
                  <h3 className="font-bold text-white text-sm">Deterministic Calculation Trace</h3>
                </div>
                <button
                  onClick={() => setActiveMetric(null)}
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-500 uppercase text-[10px] block mb-1">Target Telemetry</span>
                  <p className="font-bold text-slate-200 text-sm">{activeMetric.name}</p>
                </div>

                <div>
                  <span className="text-slate-500 uppercase text-[10px] block mb-1">Pure Python Math Execution</span>
                  <div className="bg-black/60 border border-teal-500/30 p-3 rounded-xl text-teal-300 font-mono text-xs">
                    <code>{activeMetric.formula}</code>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0E1626] p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[9px] block">Analyzed Window</span>
                    <span className="font-bold text-slate-200">{activeMetric.window}</span>
                  </div>
                  <div className="bg-[#0E1626] p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[9px] block">CSV Row Indices</span>
                    <span className="font-bold text-teal-400">Rows: [{activeMetric.source_rows.join(", ")}]</span>
                  </div>
                </div>

                <div className="border border-slate-800 bg-[#0E1626]/50 p-3 rounded-xl space-y-1 text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Evaluated Value:</span>
                    <span className="text-white font-bold">{activeMetric.value} {activeMetric.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alarm Boundary:</span>
                    <span className="text-rose-400 font-bold">{activeMetric.threshold} {activeMetric.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Breach Triggered:</span>
                    <span className={activeMetric.breached ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                      {activeMetric.breached ? "TRUE" : "FALSE"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveMetric(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              DISMISS AUDIT TRACE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
