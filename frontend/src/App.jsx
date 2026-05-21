import { useState } from "react";
import axios from "axios";
import { 
  Terminal, Shield, Search, Loader2, Database, AlertCircle, FileText, BarChart
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

      const res = await axios.post("http://127.0.0.1:8000/chat", {
        message: message
      });

      setResponse(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to communicate with the SIEM engine. Please check the backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-500" />
          <h1 className="text-xl font-semibold text-slate-100 tracking-tight">
            SIEMGPT Engine
          </h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 border border-slate-700 rounded-md">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">System Operational</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 mt-4">
        {/* Input Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-5 h-5 text-slate-400" />
            <h2 className="text-sm font-medium text-slate-300 uppercase tracking-wider">
              Threat Query Interface
            </h2>
          </div>
          
          <div className="relative">
            <textarea
              className="w-full p-4 rounded-md bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none font-mono text-sm placeholder:text-slate-600"
              rows="4"
              placeholder="Enter search parameters or investigation query (e.g., analyze recent failed logins from external IPs)"
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

          <div className="mt-4 flex justify-between items-center">
            <p className="text-xs text-slate-500">
              Press Enter to submit query. Shift+Enter for new line.
            </p>
            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-colors ${
                loading || !message.trim()
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Execute Query
                </>
              )}
            </button>
          </div>
        </section>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-center gap-3 text-red-400 mb-6">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {response && (
          <section className="space-y-6 transition-opacity duration-300">
            
            {/* Assistant / Educational Mode */}
            {response.mode === "assistant" && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-slate-800/50 border-b border-slate-800 px-6 py-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-medium text-slate-200">Analysis & Explanation</h3>
                </div>
                <div className="p-6 bg-slate-950">
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm">
                    {response.explanation}
                  </p>
                </div>
              </div>
            )}

            {/* Investigation Mode */}
            {response.mode === "investigation" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* ElasticSearch Query */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm flex flex-col">
                  <div className="bg-slate-800/50 border-b border-slate-800 px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-slate-400" />
                      <h3 className="text-sm font-medium text-slate-200">Generated Query</h3>
                    </div>
                    <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded">JSON</span>
                  </div>
                  <div className="p-4 bg-slate-950 flex-grow">
                    <pre className="text-xs font-mono text-blue-300 overflow-auto h-full max-h-[400px]">
                      <code>{JSON.stringify(response.generated_query, null, 2)}</code>
                    </pre>
                  </div>
                </div>

                {/* Threat Report Details */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-slate-800/50 border-b border-slate-800 px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <BarChart className="w-4 h-4 text-slate-400" />
                      <h3 className="text-sm font-medium text-slate-200">Investigation Report</h3>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div>
                      <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Report Title</h4>
                      <p className="text-sm font-medium text-slate-200 border-l-2 border-blue-500 pl-3">
                        {response.report?.report_title || "Investigation Findings"}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Summary</h4>
                      <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-3 rounded border border-slate-800">
                        {response.report?.summary || "No summary provided."}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Recommended Actions</h4>
                      <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-3 rounded border border-slate-800">
                        {response.report?.recommendation || "No recommendations provided."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Hits</span>
                      <span className="text-xs font-mono bg-blue-900/30 text-blue-400 px-2 py-1 rounded border border-blue-800/50">
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
    </div>
  );
}

export default App;