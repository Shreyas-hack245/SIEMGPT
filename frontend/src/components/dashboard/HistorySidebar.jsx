import { motion } from "framer-motion";

export default function HistorySidebar({ history, loading = false }) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className="hidden xl:block xl:w-80"
    >
      <div className="sticky top-6 space-y-4 rounded-3xl border border-cyan-500/20 bg-slate-950/95 p-5 shadow-[0_0_40px_rgba(0,255,255,0.06)]">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Investigation History</p>
          <h2 className="mt-3 text-lg font-semibold text-white">Recent sessions</h2>
        </div>
        <div className="space-y-3">
          {loading ? (
            [...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-slate-900/40 animate-pulse" />)
          ) : !history || history.length === 0 ? (
            <div className="text-slate-400">No previous investigations — run the Investigation Console to create a record.</div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="rounded-3xl border border-cyan-500/10 bg-black/60 p-4 text-sm text-slate-300">
                <p className="font-semibold text-white truncate">{item.query}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-slate-500">{item.severity}</p>
                <p className="mt-2 text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.aside>
  );
}
