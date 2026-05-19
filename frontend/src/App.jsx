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

    <div className="min-h-screen bg-slate-950 text-white p-8">

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-5xl font-bold text-cyan-400">
          SIEMGPT
        </h1>

        <p className="text-slate-400 mt-2">
          Conversational SIEM Investigation Platform
        </p>

      </div>

      {/* Investigation Panel */}

      <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800">

        <h2 className="text-2xl font-semibold mb-4">
          Threat Investigation
        </h2>

        <textarea
          className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white"
          rows="5"
          placeholder="Ask SIEMGPT about malware, VPN attacks, suspicious logins..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="mt-5 bg-cyan-500 hover:bg-cyan-600 px-8 py-3 rounded-xl font-semibold transition"
        >
          {loading ? "Analyzing Threats..." : "Investigate"}
        </button>

      </div>

      {/* Threat Report */}

      {response && (

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* AI Generated Query */}

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

            <h2 className="text-xl font-semibold text-cyan-400 mb-4">
              Generated Elasticsearch Query
            </h2>

            <pre className="bg-slate-800 p-4 rounded-xl overflow-auto text-sm">
              {JSON.stringify(response.generated_query, null, 2)}
            </pre>

          </div>

          {/* Threat Report */}

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

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

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default App;