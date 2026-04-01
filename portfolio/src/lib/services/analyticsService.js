import api from "@/lib/api";

export const analyticsService = {
  async trackVisit(payload) {
    await api.post("/api/analytics/track", payload);
  },
  async getSummary() {
    const { data } = await api.get("/api/analytics/summary");
    return data;
  },
};
