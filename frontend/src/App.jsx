import { useState } from "react";
import axios from "axios";

function App() {

  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {

    try {

      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/chat",
        {
          message: message
        }
      );

      setResponse(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}

      <div className="border-b border-slate-800 bg-slate-900 px-8 py-5 flex justify-between items-center">

        <div>

          <h1 className="text-4xl font-bold text-cyan-400">
            SIEMGPT
          </h1>

          <p className="text-slate-400 mt-1">
            AI-Powered Cybersecurity Investigation Platform
          </p>

        </div>

        <div className="bg-cyan-500/10 border border-cyan-500 px-4 py-2 rounded-xl">

          <p className="text-cyan-400 font-semibold">
            SOC Status: Active
          </p>

        </div>

      </div>

      <div className="p-8">

        {/* Analytics Cards */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-slate-900 border border-red-500/20 p-6 rounded-2xl shadow-lg">

            <p className="text-slate-400">
              Malware Alerts
            </p>

            <h2 className="text-4xl font-bold text-red-400 mt-2">
              25
            </h2>

          </div>

          <div className="bg-slate-900 border border-yellow-500/20 p-6 rounded-2xl shadow-lg">

            <p className="text-slate-400">
              Failed Logins
            </p>

            <h2 className="text-4xl font-bold text-yellow-400 mt-2">
              14
            </h2>

          </div>

          <div className="bg-slate-900 border border-cyan-500/20 p-6 rounded-2xl shadow-lg">

            <p className="text-slate-400">
              Critical Threats
            </p>

            <h2 className="text-4xl font-bold text-cyan-400 mt-2">
              6
            </h2>

          </div>

        </div>

        {/* Investigation Panel */}

        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800">

          <h2 className="text-2xl font-semibold mb-4">
            Threat Investigation
          </h2>

          <textarea
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
            rows="5"
            placeholder="Ask about malware, phishing, suspicious VPN traffic, failed logins..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            onClick={sendMessage}
            className="mt-5 bg-cyan-500 hover:bg-cyan-600 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            {loading ? "Analyzing Threats..." : "Investigate"}
          </button>

        </div>

        {/* Results */}

        {response && (

          <div className="mt-8">

            {/* Educational Explanation */}

            {response.mode === "education" && (

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">

                <h2 className="text-2xl font-bold text-cyan-400 mb-6">
                  🛡 Cybersecurity Analysis
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

                  <div className="bg-red-500/10 border border-red-500 p-4 rounded-xl">

                    <p className="text-red-400 font-semibold">
                      Threat Level
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      HIGH
                    </h3>

                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500 p-4 rounded-xl">

                    <p className="text-yellow-400 font-semibold">
                      Attack Category
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      Malware
                    </h3>

                  </div>

                  <div className="bg-cyan-500/10 border border-cyan-500 p-4 rounded-xl">

                    <p className="text-cyan-400 font-semibold">
                      Recommended Action
                    </p>

                    <h3 className="text-lg font-bold mt-2">
                      Immediate Monitoring
                    </h3>

                  </div>

                </div>

                <div className="bg-slate-800 p-6 rounded-xl">

                  <p className="text-slate-200 leading-8 whitespace-pre-line text-lg">
                    {response.explanation}
                  </p>

                </div>

              </div>
            )}

            {/* Investigation Response */}

            {response.mode === "investigation" && (

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Query Panel */}

                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">

                  <h2 className="text-xl font-semibold text-cyan-400 mb-4">
                    Generated Elasticsearch Query
                  </h2>

                  <pre className="bg-slate-800 p-4 rounded-xl overflow-auto text-sm">
                    {JSON.stringify(response.generated_query, null, 2)}
                  </pre>

                </div>

                {/* Threat Report */}

                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">

                  <h2 className="text-xl font-semibold text-cyan-400 mb-4">
                    Threat Report
                  </h2>

                  <div className="space-y-4">

                    <div className="bg-slate-800 p-4 rounded-xl">

                      <p className="text-slate-400">
                        Report Title
                      </p>

                      <p className="text-lg font-semibold">
                        {response.report.report_title}
                      </p>

                    </div>

                    <div className="bg-slate-800 p-4 rounded-xl">

                      <p className="text-slate-400">
                        Summary
                      </p>

                      <p>
                        {response.report.summary}
                      </p>

                    </div>

                    <div className="bg-slate-800 p-4 rounded-xl">

                      <p className="text-slate-400">
                        Recommendation
                      </p>

                      <p>
                        {response.report.recommendation}
                      </p>

                    </div>

                    <div className="bg-slate-800 p-4 rounded-xl">

                      <p className="text-slate-400">
                        SIEM Analytics
                      </p>

                      <p>
                        Total Hits: {response.analytics?.total_hits ?? 25}
                      </p>

                    </div>

                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default App;