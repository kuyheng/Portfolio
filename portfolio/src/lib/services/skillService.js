import api from "@/lib/api";

export const skillService = {
  async getSkills() {
    const { data } = await api.get("/api/skills");
    return data.skills || {};
  },
  async createSkill(payload) {
    const { data } = await api.post("/api/skills", payload);
    return data.skill;
  },
  async updateSkill(id, payload) {
    const { data } = await api.put(`/api/skills/${id}`, payload);
    return data.skill;
  },
  async deleteSkill(id) {
    const { data } = await api.delete(`/api/skills/${id}`);
    return data;
  },
};
