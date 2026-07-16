import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  Database,
  Terminal,
} from "lucide-react";
import MetricCard from "./components/dashboard/MetricCard";
import AlertFeed from "./components/dashboard/AlertFeed";
import InvestigationConsole from "./components/dashboard/InvestigationConsole";
import AttackTimeline from "./components/dashboard/AttackTimeline";
import ThreatMap from "./components/dashboard/ThreatMap";
import ThreatIntelCard from "./components/dashboard/ThreatIntelCard";
import HistorySidebar from "./components/dashboard/HistorySidebar";
import { fetchDashboardSummary, fetchRecentAlerts, fetchInvestigationHistory } from "./lib/api";

const API_BASE = import.meta.env.VITE_API_URL || "/api/v1";
const CHAT_URL = `${API_BASE.replace(/\/$/, "")}/chat`;
const WEBSOCKET_URL = import.meta.env.VITE_WS_URL || `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/api/alerts/live`;

function App() {
  const [summary, setSummary] = useState(null);
  const [alertsData, setAlertsData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [query, setQuery] = useState("");
  const [consoleLoading, setConsoleLoading] = useState(false);
  const [consoleResponse, setConsoleResponse] = useState(null);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const socketRef = useRef(null);

  useEffect(() => {
    loadDashboard();
    const socket = startLiveAlerts();

    return () => {
      socket?.close();
      socketRef.current = null;
    };
  }, []);

  const loadDashboard = async () => {
    try {
      const [summaryResult, alertResult, historyResult] = await Promise.all([
        fetchDashboardSummary(),
        fetchRecentAlerts(),
        fetchInvestigationHistory(),
      ]);
      setSummary(summaryResult);
      setAlertsData(alertResult);
      setHistoryData(historyResult);
    } catch (fetchError) {
      console.error(fetchError);
      setError("Unable to load the enterprise SOC dashboard. Verify backend connectivity.");
    }
  };

  const startLiveAlerts = () => {
    try {
      const socket = new WebSocket(WEBSOCKET_URL);
      socketRef.current = socket;
      socket.addEventListener("message", (event) => {
        const liveAlert = JSON.parse(event.data);
        setAlertsData((current) => [liveAlert, ...current].slice(0, 12));
        setNotifications((current) => [liveAlert, ...current].slice(0, 3));
      });
      socket.addEventListener("error", (event) => {
        console.warn("Live alert websocket error", event);
      });
      return socket;
    } catch (wsError) {
      console.warn("Live alert stream is unavailable", wsError);
      return null;
    }
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;
    setConsoleLoading(true);
    setError(null);

    try {
      const response = await axios.post(CHAT_URL, { message: query });
      setConsoleResponse(response.data);
      setHistoryData((current) => [
        {
          id: Date.now(),
          query,
          result_summary: response.data.report?.summary || response.data.explanation || "No summary available.",
          severity: response.data.report?.severity || "Medium",
          technique: response.data.report?.report_title || "Investigation",
          created_at: new Date().toISOString(),
        },
        ...current,
      ].slice(0, 10));
      setQuery("");
    } catch (submitError) {
      console.error(submitError);
      setError("Threat investigation failed. Confirm the backend is running and accessible.");
    } finally {
      setConsoleLoading(false);
    }
  };

  const panels = summary
    ? [
        { title: "Total Alerts", value: summary.total_alerts, detail: "Active incidents in the SOC queue.", badge: "Critical", intensity: 78 },
        { title: "Open Investigations", value: summary.open_investigations, detail: "Ongoing hunt and remediation tasks.", badge: "High", intensity: 64 },
        { title: "Analyst Confidence", value: `${summary.analyst_confidence}%`, detail: "Confidence in detection and recommendations.", badge: "Medium", intensity: summary.analyst_confidence },
        { title: "Severity Coverage", value: summary.severity_distribution.reduce((acc, item) => acc + item.count, 0), detail: "Threat classes mapped to MITRE ATT&CK.", badge: "Low", intensity: 52 },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_45%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-[radial-gradient(circle_at_bottom,_rgba(16,185,129,0.12),_transparent_45%)]" />

        <div className="mx-auto max-w-[1600px] px-6 py-6 lg:px-10">
          <header className="mb-8 rounded-[2rem] border border-cyan-500/10 bg-slate-900/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.55)] backdrop-blur-xl lg:flex lg:items-center lg:justify-between lg:gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 rounded-full bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-200 shadow-inner shadow-cyan-500/10">
                <Shield className="h-4 w-4 text-cyan-300" />
                Enterprise SOC Live
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">SIEMGPT Enterprise SOC Dashboard</h1>
                <p className="mt-3 max-w-2xl text-slate-400">Real-time threat analytics, live alert streaming, MITRE ATT&CK correlation, and investigation workflows designed for modern security operations.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-3xl border border-cyan-500/15 bg-slate-950/80 px-5 py-4 text-center shadow-[0_0_30px_rgba(6,182,212,0.12)]">
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">Threat Score</p>
                <p className="mt-3 text-3xl font-semibold text-white">72</p>
              </div>
              <div className="rounded-3xl border border-cyan-500/15 bg-slate-950/80 px-5 py-4 text-center shadow-[0_0_30px_rgba(16,185,129,0.12)]">
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">MITRE Coverage</p>
                <p className="mt-3 text-3xl font-semibold text-white">93%</p>
              </div>
              <div className="rounded-3xl border border-cyan-500/15 bg-slate-950/80 px-5 py-4 text-center shadow-[0_0_30px_rgba(59,130,246,0.12)]">
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">Live Alerts</p>
                <p className="mt-3 text-3xl font-semibold text-white">{alertsData.length}</p>
              </div>
            </div>
          </header>

          <div className="grid gap-6 xl:grid-cols-[minmax(320px,340px)_1fr]">
            <HistorySidebar history={historyData.length ? historyData : []} />

            <main className="space-y-6">
              <section className="grid gap-6 xl:grid-cols-2">
                {panels.map((panel) => (
                  <MetricCard key={panel.title} {...panel} />
                ))}
              </section>

              <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                <AttackTimeline data={summary?.timeline || []} loading={summary === null} />
                <AlertFeed alerts={alertsData} loading={summary === null} />
              </section>

              <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <ThreatMap topSources={summary?.top_sources || []} techniqueBreakdown={summary?.technique_breakdown || []} loading={summary === null} />
                <div className="space-y-6">
                  <InvestigationConsole
                    query={query}
                    setQuery={setQuery}
                    onSubmit={handleSubmit}
                    onInputKeyDown={handleInputKeyDown}
                    loading={consoleLoading}
                    history={historyData}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    {summary?.threat_intel?.map((intel, index) => (
                      <ThreatIntelCard key={index} {...intel} />
                    ))}
                  </div>
                </div>
              </section>

              {consoleResponse && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[2rem] border border-cyan-500/15 bg-slate-900/90 p-6 shadow-[0_0_40px_rgba(15,23,42,0.45)]"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
                      <Database className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Investigation Output</p>
                      <h2 className="text-lg font-semibold text-white">Current Analysis</h2>
                    </div>
                  </div>
                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="rounded-3xl border border-cyan-500/15 bg-black/70 p-5">
                      <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Summary</p>
                      <p className="mt-3 whitespace-pre-line text-slate-300">{consoleResponse.explanation || consoleResponse.report?.summary}</p>
                    </div>
                    <div className="rounded-3xl border border-cyan-500/15 bg-black/70 p-5">
                      <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Threat Detection</p>
                      <p className="mt-3 text-slate-300">{consoleResponse.report?.report_title || "Investigation completed."}</p>
                    </div>
                  </div>
                </motion.section>
              )}
            </main>
          </div>
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 w-[320px] space-y-3">
          {notifications.map((note, index) => (
            <motion.div
              key={`${note.source_ip}-${index}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-3xl border border-cyan-500/20 bg-slate-950/95 p-4 shadow-[0_0_40px_rgba(15,23,42,0.45)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{note.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{note.source_ip} • {note.severity}</p>
                </div>
                <span className="inline-flex h-8 items-center rounded-full bg-cyan-500/10 px-3 text-xs uppercase tracking-[0.3em] text-cyan-200">Live</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {error && (
        <div className="fixed bottom-6 left-6 z-50 rounded-3xl border border-red-500/30 bg-red-950/95 p-4 text-red-200 shadow-[0_0_40px_rgba(239,68,68,0.25)]">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
