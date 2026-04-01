import api from "@/lib/api";

const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

const toAbsoluteUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${baseUrl}${url}`;
};

export const cvService = {
  async getCVInfo() {
    try {
      const { data } = await api.get("/api/cv");
      if (!data.cv) return null;
      return {
        ...data.cv,
        file_url: toAbsoluteUrl(data.cv.file_url),
      };
    } catch (error) {
      if (error?.response?.status === 404) return null;
      throw error;
    }
  },
  downloadCVUrl() {
    return `${baseUrl}/api/cv/download`;
  },
  async uploadCV(file) {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post("/api/cv/upload", form);
    return data.cv;
  },
};
