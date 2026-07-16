import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Response interceptor to normalize errors
apiClient.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const payload = {
      ok: false,
      status: error?.response?.status || 0,
      message: error?.response?.data?.detail || error?.message || "Network error",
    };
    return Promise.reject(payload);
  }
);

export const fetchDashboardSummary = async () => {
  try {
    const response = await apiClient.get("/dashboard/summary");
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const fetchRecentAlerts = async () => {
  try {
    const response = await apiClient.get("/alerts/recent");
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const fetchAttackTimeline = async () => {
  try {
    const response = await apiClient.get("/dashboard/timeline");
    // Normalize timeline buckets to the frontend's expected event list
    const buckets = response.data || [];
    const events = buckets.map((b) => {
      // pick top technique if present
      const top = (b.techniques && b.techniques[0]) || {};
      // determine a representative severity string by picking highest-count key
      const sevCounts = b.severity_counts || {};
      const sev = Object.keys(sevCounts).reduce((best, k) => {
        if (!best) return k;
        return sevCounts[k] > (sevCounts[best] || 0) ? k : best;
      }, null) || "Low";

      return {
        timestamp: b.timestamp,
        stage: top.technique || top.stage || "No activity",
        technique_id: top.technique || "",
        description: top.description || "",
        severity: sev,
      };
    });
    return events;
  } catch (err) {
    throw err;
  }
};

export const fetchInvestigationHistory = async () => {
  try {
    const response = await apiClient.get("/dashboard/history");
    return response.data;
  } catch (err) {
    throw err;
  }
};
