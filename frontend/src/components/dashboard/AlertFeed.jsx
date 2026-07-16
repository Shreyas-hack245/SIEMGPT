import { motion } from "framer-motion";
import { BellRing, Activity, ShieldAlert } from "lucide-react";

const severityMap = {
  Critical: "bg-red-600 text-red-100",
  High: "bg-orange-600 text-orange-100",
  Medium: "bg-amber-600 text-amber-100",
  Low: "bg-emerald-600 text-emerald-100",
};

export default function AlertFeed({ alerts, loading = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-slate-950/95 border border-cyan-500/20 rounded-3xl p-6 shadow-[0_0_40px_rgba(0,255,255,0.08)]"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300 shadow-inner shadow-cyan-500/10">
            <BellRing className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Live Alert Feed</p>
            <p className="text-sm font-semibold text-white">Active incident stream</p>
          </div>
        </div>
        <span className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Real-time</span>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-slate-900/40 animate-pulse" />
            ))}
          </div>
        ) : !alerts || alerts.length === 0 ? (
          <div className="text-slate-400">No live alerts available — check SIEM ingestion or run a health check.</div>
        ) : (
          alerts.map((alert, index) => (
            <div key={`${alert.source_ip}-${index}`} className="rounded-3xl border border-cyan-500/20 bg-black/70 p-4 shadow-[0_0_20px_rgba(0,255,255,0.08)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{alert.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{alert.description || alert.technique || "Threat detected in network telemetry."}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.3em] ${severityMap[alert.severity] || severityMap.Low}`}>{alert.severity}</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <div className="inline-flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{alert.source_ip}</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <ShieldAlert className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{new Date(alert.created_at || Date.now()).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
