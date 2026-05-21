import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchDashboardSummary = async () => {
  const response = await apiClient.get("/dashboard/summary");
  return response.data;
};

export const fetchRecentAlerts = async () => {
  const response = await apiClient.get("/alerts/recent");
  return response.data;
};

export const fetchAttackTimeline = async () => {
  const response = await apiClient.get("/dashboard/timeline");
  return response.data;
};

export const fetchInvestigationHistory = async () => {
  const response = await apiClient.get("/dashboard/history");
  return response.data;
};
