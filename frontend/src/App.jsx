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

      <h1 className="text-4xl font-bold text-cyan-400 mb-8">
        SIEMGPT
      </h1>

      <div className="bg-slate-900 p-6 rounded-xl shadow-lg">

        <h2 className="text-2xl mb-4">
          Conversational SIEM Assistant
        </h2>

        <textarea
          className="w-full p-4 rounded-lg bg-slate-800 text-white border border-slate-700"
          rows="4"
          placeholder="Ask SIEMGPT about threats..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="mt-4 bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg font-semibold"
        >
          {loading ? "Analyzing..." : "Investigate"}
        </button>

      </div>

      {response && (

        <div className="mt-8 bg-slate-900 p-6 rounded-xl shadow-lg">

          <h2 className="text-2xl text-cyan-400 mb-4">
            Threat Report
          </h2>

          <pre className="bg-slate-800 p-4 rounded-lg overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>

        </div>
      )}

    </div>
  );
}

export default App;