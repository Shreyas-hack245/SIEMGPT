import { motion } from "framer-motion";

export default function ThreatIntelCard({ title, status, summary, score }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-cyan-500/20 bg-slate-950/90 p-5 shadow-[0_0_40px_rgba(0,255,255,0.08)]"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">{title}</p>
          <p className="mt-2 text-sm font-semibold text-white">{status}</p>
        </div>
        <div className="rounded-full bg-cyan-500/10 px-3 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200">{score}</div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-400">{summary}</p>
    </motion.div>
  );
}
