import { motion } from "framer-motion";

const accentStyles = {
  Critical: "from-red-500 to-red-700",
  High: "from-orange-500 to-orange-700",
  Medium: "from-yellow-500 to-amber-700",
  Low: "from-emerald-500 to-green-600",
};

export default function MetricCard({ title, value, detail, badge, intensity }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-slate-950/90 border border-cyan-500/20 rounded-3xl p-6 shadow-[0_0_40px_rgba(0,255,255,0.08)]"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
        </div>
        <span className={`inline-flex items-center rounded-full bg-gradient-to-r ${accentStyles[badge] || "from-slate-600 to-slate-800"} px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-slate-100 shadow-lg shadow-slate-900/40`}> {badge} </span>
      </div>
      {detail && <p className="mt-4 text-sm leading-relaxed text-slate-400">{detail}</p>}
      {intensity && <div className="mt-5 h-2 rounded-full bg-cyan-500/10 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-500" style={{ width: `${intensity}%` }} /></div>}
    </motion.div>
  );
}
