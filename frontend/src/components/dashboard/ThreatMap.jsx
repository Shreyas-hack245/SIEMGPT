import { motion } from "framer-motion";

const regionForIp = (ip) => {
  if (ip.startsWith("10.") || ip.startsWith("192.168.") || ip.startsWith("172.")) return "Private Network";
  if (ip.startsWith("203.")) return "APAC";
  if (ip.startsWith("198.") || ip.startsWith("20.") || ip.startsWith("23.")) return "North America";
  if (ip.startsWith("51.") || ip.startsWith("195.") || ip.startsWith("185.")) return "EMEA";
  return "Global"
};

export default function ThreatMap({ topSources = [], techniqueBreakdown = [], loading = false }) {
  const topSourceList = topSources.slice(0, 4);
  const hasSources = topSourceList.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12 }}
      className="bg-slate-950/95 border border-cyan-500/20 rounded-3xl p-6 shadow-[0_0_40px_rgba(0,255,255,0.08)]"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">World Threat Map</p>
          <p className="text-sm font-semibold text-white">Attack sources across the globe</p>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/10 bg-slate-950/80 p-4">
        <div className="relative h-72 w-full rounded-3xl bg-slate-900">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.25),_transparent_30%)]" />
          {loading && <div className="absolute inset-0 flex items-center justify-center text-slate-500">Loading map…</div>}
          <div className="absolute top-1/4 left-3/4 rounded-full border border-white/10 bg-red-500/90 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-white shadow-lg shadow-slate-950/40">
            APAC
          </div>
          <div className="absolute top-2/5 left-1/2 rounded-full border border-white/10 bg-rose-500/90 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-white shadow-lg shadow-slate-950/40">
            EMEA
          </div>
          <div className="absolute top-1/5 left-1/4 rounded-full border border-white/10 bg-amber-500/90 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-white shadow-lg shadow-slate-950/40">
            NA
          </div>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        <div className="rounded-3xl border border-cyan-500/10 bg-black/60 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Top attack sources</p>
          {hasSources ? (
            <div className="mt-3 space-y-3">
              {topSourceList.map((source) => (
                <div key={source.source_ip} className="rounded-3xl bg-slate-950/80 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{source.source_ip}</p>
                      <p className="text-xs text-slate-500">{regionForIp(source.source_ip)} • {source.last_seen}</p>
                    </div>
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-cyan-200">{source.count} alerts</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-400">No live source data available yet.</p>
          )}
        </div>
        {techniqueBreakdown.length > 0 && (
          <div className="rounded-3xl border border-cyan-500/10 bg-black/60 p-4">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Top techniques</p>
            <div className="mt-3 grid gap-3">
              {techniqueBreakdown.slice(0, 3).map((technique) => (
                <div key={technique.technique} className="rounded-3xl bg-slate-950/80 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{technique.technique}</p>
                      <p className="text-xs text-slate-500">{technique.mitre_id || "MITRE"}</p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-400">{technique.count} events</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
