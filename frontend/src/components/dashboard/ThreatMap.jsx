import { motion } from "framer-motion";

const markers = [
  { label: "APAC", top: "24%", left: "72%", severity: "High" },
  { label: "EMEA", top: "38%", left: "50%", severity: "Critical" },
  { label: "NA", top: "18%", left: "28%", severity: "Medium" },
];

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
        <div className="relative h-72 w-full rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.15),_transparent_35%),linear-gradient(to_bottom,_rgba(15,23,42,0.9),_rgba(15,23,42,0.9))]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 40\"><path stroke=\"rgba(34,197,94,0.08)\" stroke-width=\"1\" d=\"M0 10h40M0 20h40M0 30h40M10 0v40M20 0v40M30 0v40\"/></svg>')] opacity-80" />
          {markers.map((marker) => (
            <div key={marker.label} className="absolute" style={{ top: marker.top, left: marker.left }}>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/90 px-3 py-2 text-xs text-white shadow-lg shadow-slate-950/40">
                <span className="h-3.5 w-3.5 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"></span>
                <span>{marker.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
