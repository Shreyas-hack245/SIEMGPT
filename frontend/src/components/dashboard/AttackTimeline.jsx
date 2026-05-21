import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

const severityMap = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

export default function AttackTimeline({ data }) {
  const chartData = data.map((item) => ({
    label: item.timestamp.split("T")[1].slice(0, 5),
    intensity: severityMap[item.severity] || 1,
    stage: item.stage,
  }));

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
            <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(56, 189, 248, 0.25)", color: "#fff" }} />
            <Area type="monotone" dataKey="intensity" stroke="#22c55e" strokeWidth={3} fill="url(#timelineGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
