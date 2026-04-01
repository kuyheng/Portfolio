import api from "@/lib/api";

export const statsService = {
  async getDashboardStats() {
    const { data } = await api.get("/api/stats");
    return data;
  },
};
