import api from "@/lib/api";

const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

const toAbsoluteUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${baseUrl}${url}`;
};

const normalizeProject = (project) => ({
  ...project,
  thumbnail_url: toAbsoluteUrl(project.thumbnail_url),
});

const buildFormData = (data) => {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === "tech_stack" && Array.isArray(value)) {
      form.append(key, value.join(","));
      return;
    }
    if (value instanceof File) {
      form.append(key, value);
      return;
    }
    form.append(key, String(value));
  });
  return form;
};

export const projectService = {
  async getProjects() {
    const { data } = await api.get("/api/projects");
    return (data.projects || []).map(normalizeProject);
  },
  async getProject(id) {
    const { data } = await api.get(`/api/projects/${id}`);
    return normalizeProject(data.project);
  },
  async createProject(payload) {
    const form = buildFormData(payload);
    const { data } = await api.post("/api/projects", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeProject(data.project);
  },
  async updateProject(id, payload) {
    const form = buildFormData(payload);
    const { data } = await api.put(`/api/projects/${id}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeProject(data.project);
  },
  async deleteProject(id) {
    const { data } = await api.delete(`/api/projects/${id}`);
    return data;
  },
  async reorderProjects(order) {
    const { data } = await api.patch("/api/projects/reorder", order);
    return data;
  },
};
