import { motion } from "framer-motion";
import { Terminal, ChevronRight } from "lucide-react";

export default function InvestigationConsole({ query, setQuery, onSubmit, loading, history }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="bg-slate-950/95 border border-cyan-500/20 rounded-3xl p-6 shadow-[0_0_40px_rgba(0,255,255,0.08)]"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
          <Terminal className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Investigation Console</p>
          <p className="text-sm font-semibold text-white">Command & response workflow</p>
        </div>
      </div>

      <div className="rounded-3xl bg-black/80 p-4 border border-cyan-500/10">
        <textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          rows={4}
          className="w-full resize-none bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
          placeholder="Enter threat investigation query..."
        />
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <button
          onClick={onSubmit}
          disabled={loading || !query.trim()}
          className="inline-flex items-center gap-2 rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-cyan-700/70"
        >
          {loading ? "Executing..." : "Run Query"}
          <ChevronRight className="h-4 w-4" />
        </button>
        <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Shift+Enter for new line</span>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {history.slice(0, 4).map((item) => (
          <div key={item.id} className="rounded-3xl border border-cyan-500/20 bg-slate-900/80 p-4 text-sm text-slate-300">
            <p className="font-semibold text-white">{item.query}</p>
            <p className="mt-2 text-xs text-slate-500">{item.result_summary}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
