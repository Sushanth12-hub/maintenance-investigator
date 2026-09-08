import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  AlertOctagon,
  ShieldAlert,
  ChevronRight,
  X,
  FileDown,
  Activity,
  Maximize2,
  Lock,
  Unlock,
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
  CheckCircle2,
  Scan,
  UserCheck,
  ShieldCheck,
  LogOut,
    Award,
  Volume2,
  VolumeX,
  Target,
  Flame,
  Binary
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

// --- AIR-GAPPED TACTILE AUDIO SYNTHESIZER (Pure Web Audio API) ---
class SoundController {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playBlip(freq = 880, duration = 0.04) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {}
  }

  playAlarm() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {}
  }
}

const sound = new SoundController();

// --- CLASSIC INDUSTRIAL PRECISION CURSOR ---
function ForensicCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      const isInput = target.closest("input, textarea, select");
      const interactive = target.closest("button, a, [role='button'], .cursor-pointer");
      
      setIsHovered(!!interactive && !isInput);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block overflow-hidden">
      {/* Classic Hairline Precision Ring */}
      <div
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`,
          transition: "width 0.12s ease-out, height 0.12s ease-out, border-color 0.12s ease-out, background-color 0.12s ease-out",
        }}
        className={`absolute rounded-full border pointer-events-none ${
          isHovered
            ? "w-7 h-7 border-[#003366] bg-[#003366]/10"
            : "w-4 h-4 border-[#64748B]/60 bg-transparent"
        }`}
      />

      {/* Instant Center Target Dot */}
      <div
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`,
        }}
        className={`absolute rounded-full pointer-events-none transition-transform duration-75 ${
          isHovered ? "w-1.5 h-1.5 bg-[#003366]" : "w-1 h-1 bg-[#334155]"
        }`}
      />
    </div>
  );
}

// --- ISO 10816-3 DYNAMIC RADIAL ARC GAUGE ---
function IsoArcGauge({ value, threshold }: { value: number; threshold: number }) {
  const maxScale = 12.0;
  const clampedVal = Math.min(Math.max(value, 0), maxScale);
  const angle = (clampedVal / maxScale) * 180 - 180; // -180 to 0 degrees

  let zone = "Zone A (Nominal)";
  let zoneColor = "#059669";
  if (value > 2.3 && value <= 4.5) {
    zone = "Zone B (Unrestricted)";
    zoneColor = "#16A34A";
  } else if (value > 4.5 && value <= threshold) {
    zone = "Zone C (Restricted)";
    zoneColor = "#D97706";
  } else if (value > threshold) {
    zone = "Zone D (Critical Breach)";
    zoneColor = "#BE123C";
  }

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl relative overflow-hidden">
      <div className="w-full flex justify-between items-center text-[10px] font-mono text-[#64748B] mb-1">
        <span className="font-bold text-[#003366] uppercase">ISO 10816-3 Dynamic Envelope</span>
        <span style={{ color: zoneColor }} className="font-bold">{zone}</span>
      </div>

      <div className="relative w-44 h-24 flex items-end justify-center">
        <svg viewBox="0 0 160 90" className="w-full h-full overflow-visible">
          {/* Background Arc: Zone A (0 to 2.3) */}
          <path d="M 15 80 A 65 65 0 0 1 38 34" fill="none" stroke="#059669" strokeWidth="12" opacity="0.85" />
          {/* Zone B (2.3 to 4.5) */}
          <path d="M 38 34 A 65 65 0 0 1 80 15" fill="none" stroke="#65A30D" strokeWidth="12" opacity="0.85" />
          {/* Zone C (4.5 to 7.1) */}
          <path d="M 80 15 A 65 65 0 0 1 122 34" fill="none" stroke="#D97706" strokeWidth="12" opacity="0.85" />
          {/* Zone D (> 7.1) */}
          <path d="M 122 34 A 65 65 0 0 1 145 80" fill="none" stroke="#BE123C" strokeWidth="12" opacity="0.85" />

          {/* Needle Pivot Center */}
          <circle cx="80" cy="80" r="5" fill="#003366" />
        </svg>

        {/* Dynamic Needle */}
        <motion.div
          initial={{ rotate: -180 }}
          animate={{ rotate: angle }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          style={{ transformOrigin: "bottom center" }}
          className="absolute bottom-2 w-1 h-16 bg-[#003366] rounded-t shadow-md z-10"
        >
          <div className="w-2.5 h-2.5 -ml-0.75 -mt-1 rounded-full bg-[#BE123C] shadow-sm" />
        </motion.div>
      </div>

      <div className="mt-2 text-center">
        <span className="text-2xl font-display font-extrabold text-[#003366] tracking-tight">{value.toFixed(2)}</span>
        <span className="text-xs text-[#64748B] font-mono ml-1">mm/s</span>
      </div>
    </div>
  );
}

const PIPELINE_STAGES = [
  { id: "S1", title: "SCADA Telemetry", desc: "NumPy velocity peak & polyfit thermal slope" },
  { id: "S2", title: "PyMuPDF Extraction", desc: "ISO 10816-3 limits & shift turnover logs" },
  { id: "S3", title: "Multimodal Vision", desc: "Correlating visual fretting & oil weepage" },
  { id: "S4", title: "Contradiction Engine", desc: "Cross-checking human claims against sensors" },
  { id: "S5", title: "Ollama Translation", desc: "Synthesizing non-field plain English dossier" }
];

const FORENSIC_FRAMES = [
  {
    id: "F1",
    src: "/refinery-bay.jpg",
    tag: "SECTOR 04-A // PUMP BAY",
    subtitle: "High-Pressure Feedwater Skid System",
    badge: "SCADA INGESTION ACTIVE"
  },
  {
    id: "F2",
    src: "/P204_bearing_housing.jpg",
    tag: "NDT ROI // BEARING HOUSING",
    subtitle: "Drive-End Flange & Seal Lip Inspection",
    badge: "OPTICAL ANOMALY DETECTED"
  },
  {
    id: "F3",
    src: "/P101_coupling_alignment.jpg",
    tag: "KINEMATICS // GRID COUPLING",
    subtitle: "Angular Runout & Clearance Gap Verification",
    badge: "LASER ALIGNMENT CHECK"
  },
  {
    id: "F4",
    src: "/sensor-probe.jpg",
    tag: "TELEMETRY // PIEZO PROBE",
    subtitle: "Calibrated ISO 10816-3 Dynamic Accelerometer",
    badge: "24-BIT DIGITAL STREAM"
  }
];

export default function App() {
  // Kinetic Scroll Tracker
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  // Sound State
  const [audioActive, setAudioActive] = useState(true);

  // Authentication & Clearance
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem("forensic_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [loginBadge, setLoginBadge] = useState("ENG-9042");
  const [loginName, setLoginName] = useState("S. S. Reddy");
  const [loginRole, setLoginRole] = useState("Certified Reliability Forensics Engineer");
  const [loginClearance, setLoginClearance] = useState("Level 2 (Intrusive PTW)");

  // Progression & View
  const [view, setView] = useState<"auth" | "guide" | "upload" | "dashboard">(() => {
    const savedUser = localStorage.getItem("forensic_user");
    const passedGuide = localStorage.getItem("forensic_guide_completed");
    if (!savedUser) return "auth";
    if (!passedGuide) return "guide";
    return "upload";
  });

  const [unlockedCases, setUnlockedCases] = useState<string[]>(() => {
    const saved = localStorage.getItem("unlocked_dossiers");
    return saved ? JSON.parse(saved) : ["P-204"];
  });

  const [equipmentTag, setEquipmentTag] = useState("PUMP P-204");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [activeMetric, setActiveMetric] = useState<any>(null);
  const [activeFrameIdx, setActiveFrameIdx] = useState(0);

  // Multi-Spectral Optical Filter Mode
  const [spectralFilter, setSpectralFilter] = useState<"visible" | "thermal" | "contour" | "defect">("visible");

  // File Upload State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [shiftFile, setShiftFile] = useState<File | null>(null);
  const [oemFile, setOemFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);

  const csvInputRef = useRef<HTMLInputElement>(null);
  const shiftInputRef = useRef<HTMLInputElement>(null);
  const oemInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const frameTimer = setInterval(() => {
      setActiveFrameIdx((prev) => (prev + 1) % FORENSIC_FRAMES.length);
    }, 5000);
    return () => clearInterval(frameTimer);
  }, []);

  const toggleSound = () => {
    const next = !audioActive;
    setAudioActive(next);
    sound.enabled = next;
    if (next) sound.playBlip(1200);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playBlip(980);
    const user = {
      badge: loginBadge,
      name: loginName,
      role: loginRole,
      clearance: loginClearance,
      terminalId: "SEC-04-AIRGAP-TERM-01"
    };
    setCurrentUser(user);
    localStorage.setItem("forensic_user", JSON.stringify(user));

    const passedGuide = localStorage.getItem("forensic_guide_completed");
    setView(passedGuide ? "upload" : "guide");
  };

  const handleFastDemoLogin = () => {
    sound.playBlip(1100);
    const demoUser = {
      badge: "DEMO-LEAD-26117",
      name: "Sai Sushanth Reddy",
      role: "Lead Reliability Forensics Examiner",
      clearance: "Level 3 (Statutory Sign-Off)",
      terminalId: "AIRGAP-SEC-04"
    };
    setCurrentUser(demoUser);
    localStorage.setItem("forensic_user", JSON.stringify(demoUser));
    const passedGuide = localStorage.getItem("forensic_guide_completed");
    setView(passedGuide ? "upload" : "guide");
  };

  const handleLogout = () => {
    sound.playBlip(600);
    localStorage.removeItem("forensic_user");
    setCurrentUser(null);
    setData(null);
    setView("auth");
  };

  const handleCompleteGuide = () => {
    sound.playBlip(1050);
    localStorage.setItem("forensic_guide_completed", "true");
    setView("upload");
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setLocalImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const unlockNextCase = (assetId: string) => {
    if (!unlockedCases.includes(assetId)) {
      const updated = [...unlockedCases, assetId];
      setUnlockedCases(updated);
      localStorage.setItem("unlocked_dossiers", JSON.stringify(updated));
    }
  };

  const runDynamicUpload = async () => {
    if (!csvFile || !shiftFile || !oemFile) {
      alert("Please attach at least SCADA CSV, Shift Log PDF, and OEM Limits PDF.");
      return;
    }

    sound.playBlip(750);
    setLoading(true);
    setPipelineProgress(1);
    const timer = setInterval(() => {
      setPipelineProgress((p) => {
        sound.playBlip(800 + p * 120);
        return p < PIPELINE_STAGES.length ? p + 1 : p;
      });
    }, 450);

    const formData = new FormData();
    formData.append("equipment_tag", equipmentTag);
    formData.append("csv_file", csvFile);
    formData.append("shift_file", shiftFile);
    formData.append("oem_file", oemFile);
    if (imageFile) formData.append("image_file", imageFile);

    try {
      const [res] = await Promise.all([
        axios.post("/api/investigate/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        }),
        new Promise((resolve) => setTimeout(resolve, 2300))
      ]);
      setData(res.data);
      sound.playAlarm();
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
    if (!unlockedCases.includes(presetId) && currentUser?.clearance !== "Level 3 (Statutory Sign-Off)") {
      alert(`Dossier ${presetId} is classified. Complete Dossier P-204 initial triage to unlock.`);
      return;
    }

    sound.playBlip(750);
    setLoading(true);
    setLocalImagePreview(null);
    setPipelineProgress(1);
    const timer = setInterval(() => {
      setPipelineProgress((p) => {
        sound.playBlip(800 + p * 120);
        return p < PIPELINE_STAGES.length ? p + 1 : p;
      });
    }, 450);

    try {
      const [res] = await Promise.all([
        axios.post(`/api/investigate/run?asset=${presetId}`),
        new Promise((resolve) => setTimeout(resolve, 2300))
      ]);
      setData(res.data);
      setEquipmentTag(`PUMP ${presetId}`);
      if (presetId === "P-204") unlockNextCase("P-101");
      sound.playAlarm();
      setView("dashboard");
    } catch (err) {
      alert("Error loading demo preset.");
    } finally {
      clearInterval(timer);
      setLoading(false);
      setPipelineProgress(0);
    }
  };

  const openAuditReport = async () => {
    sound.playBlip(1200);
    if (!data) return;
    try {
      const response = await axios.post("/api/investigate/report-dynamic", data, {
        headers: { "Content-Type": "application/json" }
      });
      const reportWindow = window.open("", "_blank");
      if (reportWindow) {
        reportWindow.document.open();
        reportWindow.document.write(response.data);
        reportWindow.document.close();
      }
    } catch {
      window.open(`/api/investigate/report?asset=${equipmentTag.includes("101") ? "P-101" : "P-204"}`, "_blank");
    }
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
    <div className="min-h-screen bg-[#F1F5F9] text-[#0F172A] flex flex-col antialiased selection:bg-[#0284C7] selection:text-white relative">
      {/* Precision Forensic Crosshair Cursor */}
      <ForensicCursor />

      {/* Kinetic Neon Scroll Indicator */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0284C7] via-cyan-400 to-[#BE123C] origin-left z-50 shadow-[0_0_10px_#0284c7]"
      />

      {/* Top Precision Navigation Bar */}
      <header className="h-16 bg-[#FFFFFF] border-b border-[#CBD5E1] px-6 flex items-center justify-between z-40 sticky top-0 shadow-xs">
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
              onClick={() => {
                sound.playBlip(700);
                setView("upload");
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#0F172A] border border-[#CBD5E1] flex items-center gap-2 cursor-pointer transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-[#0284C7]" />
              BACK TO INGESTION PORTAL
            </motion.button>
          )}

          {view === "upload" && (
            <button
              onClick={() => {
                sound.playBlip(800);
                setView("guide");
              }}
              className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#0284C7] hover:underline cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" /> REVISIT CAPABILITY GUIDE
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            title={audioActive ? "Mute Control Room Audio" : "Enable Control Room Audio"}
            className="p-2 rounded-md border border-[#CBD5E1] bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#003366] transition-colors cursor-pointer"
          >
            {audioActive ? <Volume2 className="w-4 h-4 text-[#0284C7]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <span className="hidden md:flex text-xs font-mono text-[#003366] bg-[#F1F5F9] border border-[#CBD5E1] px-3 py-1.5 rounded-md items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#0284C7]" />
            OLLAMA LLAMA3.2: ACTIVE
          </span>

          {currentUser && (
            <div className="flex items-center gap-2 text-xs font-mono bg-[#FFFFFF] border border-[#CBD5E1] px-3 py-1 rounded-md">
              <UserCheck className="w-3.5 h-3.5 text-[#059669]" />
              <div className="hidden lg:block text-left leading-tight">
                <span className="font-bold text-[#003366] block">{currentUser.name}</span>
                <span className="text-[10px] text-[#64748B]">{currentUser.badge}</span>
              </div>
              <button
                onClick={handleLogout}
                title="Log out of air-gapped terminal"
                className="ml-2 text-[#64748B] hover:text-[#BE123C] p-1 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

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

      {/* Dynamic Multi-Agent Progress Ribbon */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#FFFFFF] border-b border-[#0284C7] px-6 py-3 flex items-center justify-between font-mono text-xs overflow-hidden shadow-xs z-30"
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

      {/* VIEW 0: AUTHENTICATION TERMINAL */}
      {view === "auth" && (
        <main className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-[#0F172A] p-6 text-white text-center relative">
              <div className="w-10 h-10 rounded-full bg-[#0284C7]/20 border border-[#0284C7] flex items-center justify-center mx-auto mb-3">
                <Lock className="w-5 h-5 text-cyan-300" />
              </div>
              <h2 className="font-display text-lg font-bold tracking-tight">
                Refinery Air-Gapped Terminal Sign-In
              </h2>
              <p className="text-xs text-slate-300 font-mono mt-1">
                SIH-26117 Forensic Incident Investigator // ISO 10816-3
              </p>

              <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-[11px] font-mono text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                TERMINAL: SEC-04A-LOCAL-STANDALONE
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
              <div className="flex border-b border-[#E2E8F0] pb-2 text-xs font-mono justify-center gap-6">
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className={`pb-1 font-bold ${authMode === "login" ? "text-[#003366] border-b-2 border-[#0284C7]" : "text-[#64748B]"}`}
                >
                  PERSONNEL SIGN-IN
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                  className={`pb-1 font-bold ${authMode === "signup" ? "text-[#003366] border-b-2 border-[#0284C7]" : "text-[#64748B]"}`}
                >
                  NEW INSPECTOR ENROLLMENT
                </button>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#64748B] uppercase mb-1">
                  Plant Personnel Name
                </label>
                <input
                  type="text"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  required
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3.5 py-2 text-xs font-mono text-[#0F172A] focus:border-[#0284C7] outline-none"
                  placeholder="e.g. S. S. Reddy"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#64748B] uppercase mb-1">
                  Inspector Badge ID
                </label>
                <input
                  type="text"
                  value={loginBadge}
                  onChange={(e) => setLoginBadge(e.target.value)}
                  required
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3.5 py-2 text-xs font-mono text-[#003366] font-bold focus:border-[#0284C7] outline-none"
                  placeholder="e.g. ENG-9042"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold text-[#64748B] uppercase mb-1">
                    Operational Role
                  </label>
                  <select
                    value={loginRole}
                    onChange={(e) => setLoginRole(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-2 text-[11px] font-mono text-[#0F172A] focus:border-[#0284C7] outline-none"
                  >
                    <option>Certified Reliability Forensics Engineer</option>
                    <option>ISO 10816 Statutory Lead Auditor</option>
                    <option>Plant Shift Operations Supervisor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-[#64748B] uppercase mb-1">
                    Security Clearance
                  </label>
                  <select
                    value={loginClearance}
                    onChange={(e) => setLoginClearance(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-2 text-[11px] font-mono text-[#0F172A] focus:border-[#0284C7] outline-none"
                  >
                    <option>Level 2 (Intrusive PTW)</option>
                    <option>Level 3 (Statutory Sign-Off)</option>
                    <option>Level 1 (Field Triage Only)</option>
                  </select>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full mt-2 bg-[#003366] hover:bg-[#00264d] text-white py-3 rounded-lg text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-300" />
                {authMode === "login" ? "AUTHENTICATE AIR-GAPPED SESSION" : "REGISTER INSPECTOR CREDENTIALS"}
              </motion.button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#E2E8F0]" />
                <span className="flex-shrink mx-3 text-[10px] font-mono text-[#64748B] uppercase">OR DEMO SHORTCUT</span>
                <div className="flex-grow border-t border-[#E2E8F0]" />
              </div>

              <button
                type="button"
                onClick={handleFastDemoLogin}
                className="w-full py-2.5 rounded-lg border border-[#0284C7] bg-cyan-50/50 hover:bg-cyan-50 text-[#0284C7] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                1-CLICK EVALUATOR / JUDGE DEMO LOGIN
              </button>
            </form>
          </motion.div>
        </main>
      )}

      {/* VIEW 0.5: CAPABILITY BRIEFING SOP */}
      {view === "guide" && (
        <main className="flex-1 p-6 md:p-8 max-w-[1200px] w-full mx-auto space-y-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-6 md:p-8 shadow-sm space-y-6"
          >
            <div className="border-b border-[#CBD5E1] pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#0284C7] font-bold">
                  SOP Walkthrough // New Session Initialization
                </span>
                <h2 className="text-2xl font-display font-extrabold text-[#003366] mt-1">
                  What This Autonomous Incident Forensic Core Does
                </h2>
                <p className="text-xs md:text-sm text-[#64748B] mt-1 font-sans max-w-2xl leading-relaxed">
                  Heavy plants suffer catastrophic outages not from a lack of sensor data, but from siloing between field human reports, SCADA telemetry, and OEM boundaries.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#CBD5E1] px-3 py-1.5 rounded-lg text-xs font-mono text-[#003366]">
                <Award className="w-4 h-4 text-[#0284C7]" />
                Clearance: {currentUser?.clearance || "Level 2"}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] space-y-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-100 border border-cyan-300 flex items-center justify-center text-[#0284C7]">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-sm text-[#003366] uppercase">
                  1. Deterministic Invariant Physics
                </h3>
                <p className="text-xs text-[#64748B] font-sans leading-relaxed">
                  We <strong>never use LLMs to guess physics</strong>. A pure NumPy engine calculates peak velocity v_peak and 1st-order thermal drift dT/dt to definitively isolate bearing friction from shaft misalignment.
                </p>
                <div className="text-[11px] font-mono text-[#0284C7] bg-white border border-cyan-200 p-2 rounded">
                  Rule: Peak &gt; Limit + Drift &gt; 0.40°C/h = Bearing Spall
                </div>
              </div>

              <div className="p-5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] space-y-3">
                <div className="w-9 h-9 rounded-lg bg-rose-100 border border-rose-300 flex items-center justify-center text-[#BE123C]">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-sm text-[#003366] uppercase">
                  2. Discrepancy & Contradiction Radar
                </h3>
                <p className="text-xs text-[#64748B] font-sans leading-relaxed">
                  Field shift handovers often claim <em>"equipment satisfactory; zero anomalies."</em> Our engine cross-examines PDF worker statements against exact CSV rows to flag institutional blindspots immediately.
                </p>
                <div className="text-[11px] font-mono text-[#BE123C] bg-white border border-rose-200 p-2 rounded">
                  Flags operator oversights with raw timestamp citations
                </div>
              </div>

              <div className="p-5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] space-y-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-[#059669]">
                  <Maximize2 className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-sm text-[#003366] uppercase">
                  3. Edge Multimodal NDT Vision
                </h3>
                <p className="text-xs text-[#64748B] font-sans leading-relaxed">
                  Uploaded inspection photos undergo dynamic pixel-variance thresholding to spot dark lubricant weepage and coupling gap runouts, producing auditable ROI coordinate boxes.
                </p>
                <div className="text-[11px] font-mono text-[#059669] bg-white border border-emerald-200 p-2 rounded">
                  Local PIL / NumPy contrast analysis without cloud transmission
                </div>
              </div>

              <div className="p-5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] space-y-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 border border-blue-300 flex items-center justify-center text-[#1E40AF]">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-sm text-[#003366] uppercase">
                  4. Read-Only LOTO Governance
                </h3>
                <p className="text-xs text-[#64748B] font-sans leading-relaxed">
                  The system enforces strict industrial boundaries: it operates as an <strong>offline decision support copilot</strong>. Breaker LOTO and PTW releases always mandate human engineer sign-off.
                </p>
                <div className="text-[11px] font-mono text-[#1E40AF] bg-white border border-blue-200 p-2 rounded">
                  Immutable SHA-256 evidence chain of custody attached
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleCompleteGuide}
              className="w-full bg-[#003366] hover:bg-[#00264d] text-white py-3.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              ACKNOWLEDGE SOP PROTOCOL & ENTER INGESTION PORTAL
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </main>
      )}

      {/* VIEW 1: COCKPIT INGESTION PORTAL */}
      {view === "upload" && (
        <main className="flex-1 p-6 md:p-8 max-w-[1500px] w-full mx-auto space-y-8">
          {/* Animated Ken-Burns Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden border border-[#CBD5E1] bg-[#0A0E1A] shadow-lg h-80 flex flex-col justify-between p-6 md:p-8"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFrameIdx}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1.08 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={FORENSIC_FRAMES[activeFrameIdx].src}
                  alt={FORENSIC_FRAMES[activeFrameIdx].tag}
                  className="w-full h-full object-cover object-center filter brightness-90 contrast-110"
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/50 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-transparent to-[#0F172A]/70 pointer-events-none" />

            <motion.div
              animate={{ y: ["0%", "300%", "0%"] }}
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0284C7] to-transparent shadow-[0_0_12px_#0284C7] opacity-75 pointer-events-none"
            />

            <div className="relative z-10 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-3">
                <span className="bg-[#0F172A]/80 backdrop-blur-md text-cyan-300 border border-cyan-500/40 px-3 py-1.5 rounded-full flex items-center gap-2 font-bold shadow-xs">
                  <Radio className="w-3.5 h-3.5 text-[#0284C7] animate-pulse" />
                  {FORENSIC_FRAMES[activeFrameIdx].tag}
                </span>
                <span className="hidden sm:flex items-center gap-1.5 bg-[#0F172A]/70 backdrop-blur-md text-slate-300 border border-slate-700 px-3 py-1.5 rounded-full">
                  <Scan className="w-3.5 h-3.5 text-[#0284C7]" />
                  {FORENSIC_FRAMES[activeFrameIdx].badge}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-[#0F172A]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700">
                {FORENSIC_FRAMES.map((f, idx) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      sound.playBlip(900);
                      setActiveFrameIdx(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === activeFrameIdx ? "w-6 bg-[#0284C7]" : "w-1.5 bg-slate-600 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
              <div className="max-w-2xl">
                <span className="text-xs font-mono uppercase tracking-widest text-[#0284C7] font-bold block mb-1">
                  Air-Gapped Multi-Modal Engine // ISO 10816-3 Compliant
                </span>
                <h1 className="text-2xl md:text-3xl font-display font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                  Autonomous Plant Incident Forensic Core
                </h1>
                <p className="text-xs md:text-sm text-slate-200 mt-1 font-sans leading-relaxed drop-shadow-sm">
                  {FORENSIC_FRAMES[activeFrameIdx].subtitle} — cross-referencing telemetry, shift handover claims, and OEM boundaries.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => loadSamplePreset("P-204")}
                  disabled={loading}
                  className="px-3.5 py-2 rounded-lg bg-[#0F172A]/90 hover:bg-[#1E293B] backdrop-blur-md border border-cyan-500/40 text-xs font-mono font-bold text-cyan-300 flex items-center gap-2 transition-all shadow-md hover:border-cyan-400 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  CASE: P-204 (BEARING)
                </button>
                <button
                  onClick={() => loadSamplePreset("P-101")}
                  disabled={loading || (!unlockedCases.includes("P-101") && currentUser?.clearance !== "Level 3 (Statutory Sign-Off)")}
                  className={`px-3.5 py-2 rounded-lg backdrop-blur-md text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md ${
                    unlockedCases.includes("P-101") || currentUser?.clearance === "Level 3 (Statutory Sign-Off)"
                      ? "bg-[#0F172A]/90 hover:bg-[#1E293B] border border-cyan-500/40 text-cyan-300 hover:border-cyan-400 cursor-pointer"
                      : "bg-[#0F172A]/50 border border-slate-700 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {unlockedCases.includes("P-101") || currentUser?.clearance === "Level 3 (Statutory Sign-Off)" ? (
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                  )}
                  CASE: P-101 (ALIGNMENT)
                </button>
              </div>
            </div>
          </motion.div>

          {/* Dossiers Grid with Reveal Transition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-display uppercase tracking-wider text-[#003366] font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0284C7]" />
                Incident Investigation Clearance Cases
              </span>
              <span className="text-xs font-mono text-[#0284C7] font-bold">
                Clearance Tier: {currentUser?.clearance}
              </span>
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
                  <span className="absolute top-1.5 left-1.5 bg-emerald-100 text-[#059669] border border-emerald-300 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Unlock className="w-3 h-3" /> UNLOCKED
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
                whileHover={{ y: unlockedCases.includes("P-101") ? -2 : 0 }}
                onClick={() => loadSamplePreset("P-101")}
                className={`border rounded-xl p-5 transition-all flex items-center gap-5 group shadow-xs ${
                  unlockedCases.includes("P-101") || currentUser?.clearance === "Level 3 (Statutory Sign-Off)"
                    ? "bg-[#FFFFFF] hover:bg-[#F8FAFC] border-[#CBD5E1] hover:border-[#0284C7] cursor-pointer"
                    : "bg-[#F8FAFC] border-[#E2E8F0] opacity-80 cursor-not-allowed"
                }`}
              >
                <div className="relative w-40 h-32 rounded-lg overflow-hidden shrink-0 border border-[#CBD5E1] bg-slate-100">
                  <img
                    src="/P101_coupling_alignment.jpg"
                    alt="Pump P-101 Flexible Coupling"
                    className={`w-full h-full object-cover transition-transform ${
                      unlockedCases.includes("P-101") ? "group-hover:scale-105" : "filter grayscale contrast-75"
                    }`}
                  />
                  <span className="absolute bottom-1.5 right-1.5 bg-amber-100 text-amber-800 border border-amber-300 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                    GAP RUNOUT
                  </span>
                  <span className={`absolute top-1.5 left-1.5 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 border ${
                    unlockedCases.includes("P-101") || currentUser?.clearance === "Level 3 (Statutory Sign-Off)"
                      ? "bg-emerald-100 text-[#059669] border-emerald-300"
                      : "bg-amber-100 text-amber-800 border-amber-300"
                  }`}>
                    {unlockedCases.includes("P-101") || currentUser?.clearance === "Level 3 (Statutory Sign-Off)" ? (
                      <><Unlock className="w-3 h-3" /> UNLOCKED</>
                    ) : (
                      <><Lock className="w-3 h-3" /> LOCKED</>
                    )}
                  </span>
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-display font-bold text-[#003366] group-hover:text-[#0284C7] transition-colors">
                      DOSSIER 02: PUMP P-101 (CRUDE TRANSFER)
                    </span>
                    <span className="text-xs font-mono bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-bold">
                      7.8 mm/s RUNOUT
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed font-sans">
                    Flexible grid coupling angular misalignment with flat thermal gradient (+0.07 °C/h) ruling out bearing failure.
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs font-mono border-t border-[#F1F5F9]">
                    <span className="text-[#64748B]">Mode: Shaft Misalignment</span>
                    {unlockedCases.includes("P-101") || currentUser?.clearance === "Level 3 (Statutory Sign-Off)" ? (
                      <span className="text-[#0284C7] flex items-center font-bold">
                        RUN INVESTIGATION <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    ) : (
                      <span className="text-amber-700 flex items-center font-bold text-[11px]">
                        <Lock className="w-3 h-3 mr-1" /> COMPLETE DOSSIER 01 TO UNLOCK
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Ingestion Bay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-6 md:p-8 space-y-5 shadow-xs"
          >
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
                  onChange={(e) => {
                    sound.playBlip(950);
                    setCsvFile(e.target.files?.[0] || null);
                  }}
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
                  onChange={(e) => {
                    sound.playBlip(950);
                    setShiftFile(e.target.files?.[0] || null);
                  }}
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
                  onChange={(e) => {
                    sound.playBlip(950);
                    setOemFile(e.target.files?.[0] || null);
                  }}
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
                  onChange={(e) => {
                    sound.playBlip(950);
                    handleImageChange(e.target.files?.[0] || null);
                  }}
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
          </motion.div>
        </main>
      )}

      {/* VIEW 2: FORENSIC INVESTIGATION DOSSIER */}
      {view === "dashboard" && data && (
        <main className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-7">
          {/* Top Status Metric Tiles & ISO Radial Arc Gauge */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {/* Tile 1: Dynamic ISO Arc Gauge & Peak Velocity */}
            <div
              onClick={() => {
                sound.playBlip(1000);
                setActiveMetric(data.metrics.peak_vibration);
              }}
              className="bg-[#FFFFFF] border border-[#CBD5E1] hover:border-[#BE123C] rounded-xl p-4 cursor-pointer transition-all group shadow-xs flex flex-col justify-between"
            >
              <IsoArcGauge
                value={data.metrics.peak_vibration.value}
                threshold={data.metrics.peak_vibration.threshold}
              />
              <div className="mt-2 text-xs font-mono text-[#64748B] border-t border-[#F1F5F9] pt-2 flex justify-between">
                <span>Trip Threshold:</span>
                <span className="text-[#BE123C] font-bold">{data.metrics.peak_vibration.threshold} mm/s</span>
              </div>
            </div>

            {/* Tile 2: Thermal Rate of Rise */}
            <div
              onClick={() => {
                sound.playBlip(1000);
                setActiveMetric(data.metrics.temperature_rate_of_rise);
              }}
              className="bg-[#FFFFFF] border border-[#CBD5E1] hover:border-amber-500 rounded-xl p-5 cursor-pointer transition-all group shadow-xs flex flex-col justify-between"
            >
              <div>
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
              </div>
              <div className="mt-2 text-xs font-mono text-[#64748B] border-t border-[#F1F5F9] pt-2 flex justify-between">
                <span>Alarm Limit:</span>
                <span className="text-[#0F172A] font-bold">0.40 °C/h</span>
              </div>
            </div>

            {/* Tile 3: Confirmed Failure Mode */}
            <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-5 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider block mb-1">
                  Confirmed Diagnosis
                </span>
                <div className="font-display font-bold text-sm text-[#003366] mt-1 line-clamp-2">
                  {data.hypotheses[0]?.title}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-mono border-t border-[#F1F5F9] pt-2 mt-2">
                <span className="text-[#64748B]">Match Confidence:</span>
                <span className="text-[#0284C7] font-bold text-sm">{data.hypotheses[0]?.score}%</span>
              </div>
            </div>

            {/* Tile 4: Violation Duration */}
            <div
              onClick={() => {
                if (data.metrics.violation_duration) {
                  sound.playBlip(1000);
                  setActiveMetric(data.metrics.violation_duration);
                }
              }}
              className="bg-[#FFFFFF] border border-[#CBD5E1] hover:border-[#BE123C] rounded-xl p-5 flex flex-col justify-between shadow-xs cursor-pointer group transition-all"
            >
              <div>
                <div className="flex justify-between items-center text-xs font-mono text-[#64748B] uppercase tracking-wider mb-1">
                  <span>Continuous Breach Time</span>
                  <span className="text-[#0284C7] group-hover:translate-x-1 transition-transform flex items-center font-bold">
                    TRACE <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
                <div className="text-3xl font-display font-extrabold text-[#BE123C] mt-2">
                  {data.metrics.violation_duration ? data.metrics.violation_duration.value : 47}{" "}
                  <span className="text-sm text-[#64748B] font-normal">mins</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-mono border-t border-[#F1F5F9] pt-2 mt-2">
                <span className="text-[#64748B]">Permit Requirement:</span>
                <span className="text-amber-700 font-bold">PTW Class A (LOTO)</span>
              </div>
            </div>
          </motion.section>

          {/* Cryptographic Chain-of-Custody Verification */}
          {data.chain_of_custody && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono shadow-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#059669] shadow-[0_0_6px_#059669]" />
                <span className="font-bold text-[#003366]">EVIDENCE CHAIN-OF-CUSTODY IMMUTABLE HASH:</span>
                <span className="bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#CBD5E1] text-[#0284C7] font-bold">
                  {data.chain_of_custody.chain_id}
                </span>
              </div>
              <div className="text-[#64748B] flex items-center gap-4">
                <span>SCADA SHA-256: {data.chain_of_custody.telemetry_sha256?.substring(0, 12)}...</span>
                <span>DOCS SHA-256: {data.chain_of_custody.shiftlog_sha256?.substring(0, 12)}...</span>
                <span className="text-[#059669] font-bold">SHA-256 VERIFIED</span>
              </div>
            </motion.div>
          )}

          {/* Plain-English Translator For Evaluators */}
          {data.plain_english_summary && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4 }}
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
              {/* Interactive Multi-Spectral Optical Inspection Card */}
              {data.vision && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4 }}
                  className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#CBD5E1]">
                    <div className="flex items-center gap-2.5">
                      <Maximize2 className="w-4 h-4 text-[#0284C7]" />
                      <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#003366]">
                        Multi-Spectral Optical Defect Inspection
                      </h3>
                    </div>

                    {/* Spectral Filter Switcher */}
                    <div className="flex items-center gap-1 bg-[#F1F5F9] border border-[#CBD5E1] p-1 rounded-lg text-xs font-mono">
                      <button
                        onClick={() => {
                          sound.playBlip(900);
                          setSpectralFilter("visible");
                        }}
                        className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                          spectralFilter === "visible" ? "bg-[#003366] text-white font-bold" : "text-[#64748B] hover:text-[#0F172A]"
                        }`}
                      >
                        VISIBLE
                      </button>
                      <button
                        onClick={() => {
                          sound.playBlip(1100);
                          setSpectralFilter("thermal");
                        }}
                        className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 cursor-pointer ${
                          spectralFilter === "thermal" ? "bg-amber-600 text-white font-bold" : "text-[#64748B] hover:text-[#0F172A]"
                        }`}
                      >
                        <Flame className="w-3 h-3 text-amber-300" />
                        THERMAL
                      </button>
                      <button
                        onClick={() => {
                          sound.playBlip(1300);
                          setSpectralFilter("contour");
                        }}
                        className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 cursor-pointer ${
                          spectralFilter === "contour" ? "bg-cyan-700 text-white font-bold" : "text-[#64748B] hover:text-[#0F172A]"
                        }`}
                      >
                        <Binary className="w-3 h-3 text-cyan-300" />
                        CONTOUR
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-6 relative rounded-lg overflow-hidden border border-[#CBD5E1] bg-slate-950 shadow-xs group">
                      <img
                        src={localImagePreview || (equipmentTag.includes("101") ? "/P101_coupling_alignment.jpg" : "/P204_bearing_housing.jpg")}
                        alt="NDT Inspection Capture"
                        style={{
                          filter:
                            spectralFilter === "thermal"
                              ? "contrast(220%) hue-rotate(180deg) saturate(300%)"
                              : spectralFilter === "contour"
                              ? "grayscale(100%) contrast(350%) invert(100%)"
                              : "none"
                        }}
                        className="w-full h-56 object-cover transition-all duration-300"
                      />

                      {/* AI Bounding Box Reticle */}
                      <div className="absolute inset-4 border-2 border-[#BE123C] border-dashed rounded flex flex-col justify-between p-2 pointer-events-none">
                        <span className="text-[10px] font-mono bg-white/95 text-[#BE123C] px-1.5 py-0.5 rounded font-bold w-max border border-rose-300 shadow-xs flex items-center gap-1">
                          <Target className="w-3 h-3 text-[#BE123C]" />
                          {data.vision.visual_anomalies[0]?.box_label || "DEFECT ROI"}
                        </span>
                        <span className="text-[10px] font-mono bg-white/95 text-[#0F172A] px-1.5 py-0.5 rounded w-max self-end border border-[#CBD5E1] shadow-xs font-semibold">
                          COORD: {data.vision.visual_anomalies[0]?.coords || "[150, 100, 450, 300]"}
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-6 space-y-3">
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
                </motion.section>
              )}

              {/* Dynamic SCADA Graph with Scroll Reveal */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4 }}
                className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-6 shadow-xs space-y-4"
              >
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
              </motion.section>

              {/* Evidence Matrix */}
              {data.evidence_matrix && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4 }}
                  className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-6 shadow-xs overflow-x-auto space-y-4"
                >
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
                </motion.section>
              )}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-6">
              {/* Contradiction Flag Ribbon */}
              {data.contradictions.map((c: any) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-[#FEF2F2] border-l-4 border-l-[#DC2626] border-y border-r border-rose-200 rounded-r-xl p-5 shadow-xs space-y-3"
                >
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
                </motion.div>
              ))}

              {/* Competing Hypotheses */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-5 shadow-xs space-y-4"
              >
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
              </motion.section>

              {/* Mandatory LOTO Action Plan */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-5 shadow-xs space-y-4"
              >
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
              </motion.section>
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
                  onClick={() => {
                    sound.playBlip(700);
                    setActiveMetric(null);
                  }}
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
                    <span
  className="font-bold text-[#0284C7] truncate block text-[11px]"
  title={Array.isArray(activeMetric?.source_rows) ? activeMetric.source_rows.join(", ") : ""}
>
  Rows: [
    {Array.isArray(activeMetric?.source_rows)
      ? activeMetric.source_rows.length > 6
        ? `${activeMetric.source_rows.slice(0, 4).join(", ")} ... (${activeMetric.source_rows.length} rows total)`
        : activeMetric.source_rows.join(", ")
      : String(activeMetric?.source_rows ?? "N/A")}
  ]
</span>
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
              onClick={() => {
                sound.playBlip(700);
                setActiveMetric(null);
              }}
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
