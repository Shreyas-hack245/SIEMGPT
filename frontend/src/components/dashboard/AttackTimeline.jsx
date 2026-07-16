import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

const severityMap = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const event = payload[0].payload;

  return (
    <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/95 p-3 text-sm text-slate-100 shadow-lg shadow-cyan-500/10">
      <p className="font-semibold text-white">{event.stage}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.3em] text-cyan-300">{event.technique_id}</p>
      <p className="mt-2 leading-relaxed text-slate-300">{event.description}</p>
      <p className="mt-3 text-xs text-slate-500">Severity: {event.severity}</p>
    </div>
  );
};

export default function AttackTimeline({ data, loading = false, error = null }) {
  const chartData = data.map((item) => ({
    label: item.timestamp.split("T")[1].slice(0, 5),
    intensity: severityMap[item.severity] || 1,
    stage: item.stage,
    description: item.description,
    technique_id: item.technique_id,
    severity: item.severity,
  }));

  const recentStages = data.slice(-3).reverse();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-slate-950/95 border border-cyan-500/20 rounded-3xl p-6 shadow-[0_0_40px_rgba(0,255,255,0.08)]"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Attack Timeline</p>
          <p className="text-sm font-semibold text-white">Adversary progression stages</p>
        </div>
      </div>
      <div className="h-64">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-pulse text-slate-500">Loading timeline…</div>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-slate-400">No timeline data available for the selected range.</div>
          </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="timelineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#0f766e" stopOpacity={0.15} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
            <XAxis dataKey="label" tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="intensity" stroke="#22c55e" strokeWidth={3} fill="url(#timelineGradient)" />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>

      <div className="mt-6 grid gap-3">
        {recentStages.map((event) => (
          <div key={event.timestamp} className="rounded-3xl border border-cyan-500/10 bg-black/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-white">{event.stage}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">{event.technique_id}</p>
              </div>
              <span className="rounded-full bg-slate-800/80 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-300">{event.severity}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{event.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
