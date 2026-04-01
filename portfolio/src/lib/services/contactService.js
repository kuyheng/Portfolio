import api from "@/lib/api";

export const contactService = {
  async sendMessage(payload) {
    const { data } = await api.post("/api/contact", payload);
    return data.contact;
  },
  async getMessages() {
    const { data } = await api.get("/api/contact");
    return data.contacts || [];
  },
  async markAsRead(id) {
    const { data } = await api.patch(`/api/contact/${id}/read`);
    return data.contact;
  },
  async deleteMessage(id) {
    const { data } = await api.delete(`/api/contact/${id}`);
    return data;
  },
};
