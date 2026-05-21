import { motion } from "framer-motion";

export default function ThreatMap() {
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
    </motion.div>
  );
}
