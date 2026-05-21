import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, Terminal, Lock, Skull, Activity, Search, 
  AlertTriangle, ShieldCheck, Zap, Cpu, FileSearch, Database,
  Radar, Crosshair, ChevronRight, Fingerprint
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const scanSteps = [
    "Initializing neural threat analysis...",
    "Correlating global threat intelligence...",
    "Inspecting packet headers & payloads...",
    "Querying Elasticsearch indices...",
    "Synthesizing threat profile..."
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setScanStep((prev) => (prev + 1) % scanSteps.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      setLoading(true);
      setResponse(null);
      setScanStep(0);

      const res = await axios.post("http://127.0.0.1:8000/chat", {
        message: message
      });

      setResponse(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white selection:bg-cyan-500/30 font-sans overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900 via-[#0a0f1c] to-[#0a0f1c]"></div>
      
      {/* Navbar */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 border-b border-cyan-900/30 bg-[#0d1425]/80 backdrop-blur-md px-8 py-5 flex justify-between items-center sticky top-0"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Radar className="w-10 h-10 text-cyan-400 animate-spin-slow" />
            <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full"></div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
              SIEMGPT
            </h1>
            <p className="text-cyan-500/60 text-sm font-medium tracking-wide">
              NEXUS THREAT INTELLIGENCE
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.1)]">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <p className="text-green-400 text-sm font-bold tracking-wider">
              SOC ACTIVE
            </p>
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        {/* Analytics Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10"
        >
          {[
            { title: "Malware Alerts", value: "25", icon: Skull, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
            { title: "Failed Logins", value: "14", icon: Lock, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
            { title: "Network Anomalies", value: "89", icon: Activity, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
            { title: "Critical Threats", value: "6", icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.02, translateY: -5 }}
              className={`bg-[#111827] border ${stat.border} p-6 rounded-2xl shadow-lg relative overflow-hidden group`}
            >
              <div className={`absolute -right-6 -top-6 w-24 h-24 ${stat.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <p className="text-slate-400 font-medium text-sm uppercase tracking-wider">{stat.title}</p>
                <stat.icon className={`w-5 h-5 ${stat.color} opacity-70`} />
              </div>
              <h2 className={`text-5xl font-bold ${stat.color} relative z-10 tracking-tighter`}>{stat.value}</h2>
            </motion.div>
          ))}
        </motion.div>

        {/* Investigation Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-b from-[#111827] to-[#0a0f1c] p-1 rounded-3xl shadow-2xl mb-10 border border-cyan-900/40 relative group"
        >
          <div className="absolute inset-0 bg-cyan-500/5 blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          <div className="bg-[#111827] rounded-3xl p-6 md:p-8 relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Crosshair className="text-cyan-400 w-6 h-6" />
              <h2 className="text-2xl font-bold text-white tracking-wide">
                Targeted Threat Investigation
              </h2>
            </div>
            
            <div className="relative">
              <div className="absolute top-4 left-4 text-cyan-500/50">
                <Terminal className="w-5 h-5" />
              </div>
              <textarea
                className="w-full pl-12 p-4 rounded-2xl bg-[#0d1425] border border-cyan-900/50 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300 resize-none font-mono text-sm placeholder:text-slate-600 shadow-inner"
                rows="4"
                placeholder="Initialize query: e.g. Analyze recent failed logins from external IPs and check for lateral movement..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={sendMessage}
                disabled={loading || !message.trim()}
                className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold tracking-wide transition-all duration-300 ${
                  loading || !message.trim()
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:-translate-y-1"
                }`}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Zap className="w-5 h-5" />
                    </motion.div>
                    ANALYZING...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    INITIATE SCAN
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Loading State & Results */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0, filter: "blur(10px)" }}
              className="mb-10 bg-[#111827] border border-cyan-900/50 rounded-3xl p-10 flex flex-col items-center justify-center min-h-[300px] shadow-2xl relative overflow-hidden"
            >
              {/* Animated grid background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
              
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="relative mb-8 z-10"
              >
                <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full blur-sm"></div>
                <div className="absolute inset-0 border-t-4 border-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee]"></div>
                <div className="w-20 h-20 flex items-center justify-center">
                  <Fingerprint className="w-10 h-10 text-cyan-500" />
                </div>
              </motion.div>

              <div className="h-6 overflow-hidden relative z-10 w-full max-w-md text-center">
                <AnimatePresence mode="popLayout">
                  <motion.p
                    key={scanStep}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-cyan-400 font-mono text-sm tracking-widest uppercase"
                  >
                    {scanSteps[scanStep]}
                  </motion.p>
                </AnimatePresence>
              </div>
              
              <div className="w-64 h-1 bg-slate-800 rounded-full mt-6 overflow-hidden z-10 relative">
                <motion.div 
                  className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          )}

          {!loading && response && (
            <motion.div
              key="results"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-8"
            >
              {/* Education Mode */}
              {response.mode === "education" && (
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#111827] to-[#0a0f1c] border border-cyan-500/30 rounded-3xl p-1 relative overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.1)]">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full"></div>
                  
                  <div className="bg-[#111827]/90 backdrop-blur-xl rounded-[23px] p-8 relative z-10">
                    <div className="flex items-center gap-4 mb-8 border-b border-cyan-900/30 pb-6">
                      <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                        <ShieldCheck className="w-8 h-8 text-cyan-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200">
                        Threat Analysis Report
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                      <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/30 p-5 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-20"><ShieldAlert className="w-12 h-12 text-red-500" /></div>
                        <p className="text-red-400 font-semibold uppercase text-xs tracking-widest mb-1">Severity Level</p>
                        <h3 className="text-3xl font-black text-white">HIGH</h3>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30 p-5 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-20"><Cpu className="w-12 h-12 text-purple-500" /></div>
                        <p className="text-purple-400 font-semibold uppercase text-xs tracking-widest mb-1">Vector Type</p>
                        <h3 className="text-2xl font-bold text-white mt-1">Malware / Exploit</h3>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30 p-5 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-20"><Activity className="w-12 h-12 text-green-500" /></div>
                        <p className="text-green-400 font-semibold uppercase text-xs tracking-widest mb-1">Suggested Action</p>
                        <h3 className="text-xl font-bold text-white mt-2">Quarantine & Audit</h3>
                      </motion.div>
                    </div>

                    <div className="bg-[#0d1425] border border-slate-800 p-8 rounded-2xl shadow-inner relative">
                      <div className="absolute -left-3 top-8 w-1 h-12 bg-cyan-500 rounded-r-full shadow-[0_0_10px_#22d3ee]"></div>
                      <h4 className="text-cyan-400 font-mono text-sm mb-4 flex items-center gap-2 uppercase tracking-widest">
                        <FileSearch className="w-4 h-4" /> Detail Analysis
                      </h4>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-line text-[1.05rem]">
                        {response.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Investigation Mode */}
              {response.mode === "investigation" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Query Panel */}
                  <motion.div variants={itemVariants} className="bg-[#111827] p-1 rounded-3xl border border-cyan-900/40 shadow-xl group hover:border-cyan-500/50 transition-colors duration-500">
                    <div className="bg-[#111827] rounded-3xl h-full p-6 md:p-8">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-3 text-white">
                          <Database className="w-5 h-5 text-cyan-400" />
                          Generated ES Query
                        </h2>
                        <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-mono border border-cyan-500/20">JSON</span>
                      </div>
                      
                      <div className="bg-[#0d1425] rounded-2xl p-5 border border-slate-800 shadow-inner relative overflow-hidden group-hover:border-cyan-900/50 transition-colors">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
                        <pre className="text-sm font-mono text-cyan-300/80 overflow-auto h-[400px] scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
                          <code>{JSON.stringify(response.generated_query, null, 2)}</code>
                        </pre>
                      </div>
                    </div>
                  </motion.div>

                  {/* Threat Report */}
                  <motion.div variants={itemVariants} className="bg-gradient-to-b from-[#111827] to-[#1a1f35] p-1 rounded-3xl border border-indigo-900/40 shadow-xl shadow-indigo-900/10">
                    <div className="bg-[#111827] rounded-[23px] h-full p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-800">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                          <ShieldAlert className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-wide">
                          Actionable Intelligence
                        </h2>
                      </div>

                      <div className="space-y-6">
                        <motion.div 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="group"
                        >
                          <h4 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -ml-6 absolute" />
                            Report Title
                          </h4>
                          <p className="text-xl font-bold text-white pl-2 border-l-2 border-indigo-500/30">
                            {response.report.report_title}
                          </p>
                        </motion.div>

                        <motion.div 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="bg-[#0d1425] p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-colors"
                        >
                          <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Executive Summary</h4>
                          <p className="text-slate-300 leading-relaxed">
                            {response.report.summary}
                          </p>
                        </motion.div>

                        <motion.div 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="bg-indigo-900/10 p-5 rounded-2xl border border-indigo-500/20 relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                          <h4 className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-3 relative z-10">Remediation Plan</h4>
                          <p className="text-indigo-100 leading-relaxed relative z-10">
                            {response.report.recommendation}
                          </p>
                        </motion.div>

                        <motion.div 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.7 }}
                          className="flex items-center justify-between bg-cyan-900/10 p-4 rounded-xl border border-cyan-500/20"
                        >
                          <h4 className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Telemetry Hits</h4>
                          <div className="flex items-center gap-2 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-500/30">
                            <Activity className="w-4 h-4 text-cyan-300" />
                            <span className="font-mono text-cyan-100 font-bold">
                              {response.analytics?.total_hits ?? 25} matches
                            </span>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;