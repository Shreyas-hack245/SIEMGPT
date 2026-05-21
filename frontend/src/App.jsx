import { useState } from "react";
import axios from "axios";
import { 
  Terminal, Shield, Search, Loader2, Database, AlertCircle, FileText, BarChart, Cpu
} from "lucide-react";

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      setLoading(true);
      setResponse(null);
      setError(null);

      const res = await axios.post("http://127.0.0.1:8000/api/v1/chat", {
        message: message
      });

      setResponse(res.data);
    } catch (err) {
      console.error(err);
      setError("CRITICAL ERROR: Failed to establish uplink with SIEM mainframe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-cyan-400 font-mono relative z-10 flex flex-col">
      {/* Header */}
      <header className="border-b border-cyan-500/30 bg-black/80 px-6 py-4 flex justify-between items-center backdrop-blur-sm box-shadow-neon-cyan">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-cyan-400 animate-pulse" />
          <h1 className="text-2xl font-bold text-cyan-400 tracking-widest text-shadow-neon-cyan uppercase">
            SIEM-GPT // NEURAL_LINK
          </h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-black/60 cyber-border">
          <div className="w-2.5 h-2.5 rounded-none bg-green-500 animate-ping"></div>
          <span className="text-xs font-bold text-green-400 uppercase tracking-widest text-shadow-neon-green">Sys_Online</span>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto p-6 mt-4 w-full">
        {/* Input Section */}
        <section className="bg-black/60 cyber-border p-6 mb-8 backdrop-blur-md box-shadow-neon-cyan">
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="w-6 h-6 text-cyan-400" />
            <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-widest border-b border-cyan-500/30 pb-1 flex-grow">
              Threat_Query_Interface
            </h2>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-cyan-500/10 blur-md group-hover:bg-cyan-400/20 transition-all duration-300 pointer-events-none"></div>
            <textarea
              className="w-full p-4 bg-black/80 border border-cyan-500/50 text-green-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none font-mono text-sm placeholder:text-green-900/50 relative z-10 box-shadow-neon-cyan"
              rows="4"
              placeholder="> ENTER QUERY PARAMETERS [e.g., analyze recent failed logins from external IPs]..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
          </div>

          <div className="mt-6 flex justify-between items-center">
            <p className="text-xs text-cyan-600/70 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              [ENTER] = Execute | [SHIFT+ENTER] = New Line
            </p>
            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              className={`flex items-center gap-2 px-8 py-3 font-bold uppercase tracking-widest transition-all duration-300 cyber-border ${
                loading || !message.trim()
                  ? "bg-black/50 text-cyan-800 border-cyan-900/30 cursor-not-allowed"
                  : "bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 hover:text-cyan-100 box-shadow-neon-cyan hover:shadow-[0_0_20px_#0ff]"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                  Processing...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Init_Sequence
                </>
              )}
            </button>
          </div>
        </section>

        {/* Error State */}
        {error && (
          <div className="bg-red-950/40 border border-red-500 rounded-none p-4 flex items-center gap-4 text-red-400 mb-8 box-shadow-neon-red animate-pulse">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <p className="text-sm font-bold uppercase tracking-wider text-shadow-neon-red">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {response && (
          <section className="space-y-8 transition-all duration-500 ease-in-out opacity-100 translate-y-0">
            
            {/* Assistant / Educational Mode */}
            {response.mode === "assistant" && (
              <div className="bg-black/60 cyber-border overflow-hidden backdrop-blur-md box-shadow-neon-cyan">
                <div className="bg-cyan-950/40 border-b border-cyan-500/50 px-6 py-4 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-widest text-shadow-neon-cyan">Neural_Analysis</h3>
                </div>
                <div className="p-6 bg-black/80 relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/30"></div>
                  <p className="text-green-400 leading-relaxed whitespace-pre-line text-sm pl-4 font-mono">
                    <span className="text-cyan-500 mr-2">{">"}</span>
                    {response.explanation}
                  </p>
                </div>
              </div>
            )}

            {/* Investigation Mode */}
            {response.mode === "investigation" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* ElasticSearch Query */}
                <div className="bg-black/60 cyber-border overflow-hidden flex flex-col backdrop-blur-md box-shadow-neon-cyan">
                  <div className="bg-cyan-950/40 border-b border-cyan-500/50 px-5 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-widest text-shadow-neon-cyan">Query_Payload</h3>
                    </div>
                    <span className="text-xs font-bold text-green-400 bg-black/80 px-3 py-1 border border-green-500/30 uppercase tracking-wider">JSON_Blob</span>
                  </div>
                  <div className="p-5 bg-black/80 flex-grow relative">
                     <div className="absolute top-0 right-0 w-full h-1 bg-cyan-500/20"></div>
                    <pre className="text-xs font-mono text-cyan-200 overflow-auto h-full max-h-[400px] p-4 bg-black/50 border border-cyan-900/50 scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-black">
                      <code>{JSON.stringify(response.generated_query, null, 2)}</code>
                    </pre>
                  </div>
                </div>

                {/* Threat Report Details */}
                <div className="bg-black/60 cyber-border overflow-hidden backdrop-blur-md box-shadow-neon-cyan flex flex-col">
                  <div className="bg-cyan-950/40 border-b border-cyan-500/50 px-5 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <BarChart className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-widest text-shadow-neon-cyan">Tactical_Report</h3>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6 flex-grow bg-black/80">
                    <div className="relative pl-4 border-l-2 border-cyan-500/50">
                      <h4 className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-2">Operation_Title</h4>
                      <p className="text-sm font-bold text-cyan-200">
                        {response.report?.report_title || "Unknown_Operation"}
                      </p>
                    </div>

                    <div className="relative pl-4 border-l-2 border-green-500/50">
                      <h4 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2">Exec_Summary</h4>
                      <p className="text-sm text-green-400 leading-relaxed bg-black/60 p-4 border border-green-900/40">
                        {response.report?.summary || "No data extracted."}
                      </p>
                    </div>

                    <div className="relative pl-4 border-l-2 border-red-500/50">
                      <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">Countermeasures</h4>
                      <p className="text-sm text-red-400 leading-relaxed bg-black/60 p-4 border border-red-900/40">
                        {response.report?.recommendation || "No immediate actions suggested."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-cyan-500/30 pt-6 mt-auto">
                      <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest">Total_Anomalies</span>
                      <span className="text-sm font-bold bg-cyan-950 text-cyan-300 px-4 py-1.5 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,255,255,0.2)]">
                        {response.analytics?.total_hits ?? 0}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </section>
        )}
      </main>
      
      {/* Footer deco */}
      <footer className="border-t border-cyan-900/50 p-4 text-center">
        <p className="text-[10px] text-cyan-800 uppercase tracking-[0.3em]">SECURE_CONNECTION // {new Date().getFullYear()} // SIEM_GPT_V1.0</p>
      </footer>
    </div>
  );
}

export default App;