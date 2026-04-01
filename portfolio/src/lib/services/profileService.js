import api from "@/lib/api";

const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

const toAbsoluteUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${baseUrl}${url}`;
};

const buildFormData = (data) => {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File) {
      form.append(key, value);
      return;
    }
    form.append(key, String(value));
  });
  return form;
};

export const profileService = {
  async getProfile() {
    const { data } = await api.get("/api/profile");
    if (!data.profile) return null;
    return {
      ...data.profile,
      profile_photo_url: toAbsoluteUrl(data.profile.profile_photo_url),
    };
  },
  async updateProfile(payload) {
    const form = buildFormData(payload);
    const { data } = await api.put("/api/profile", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.profile;
  },
};
