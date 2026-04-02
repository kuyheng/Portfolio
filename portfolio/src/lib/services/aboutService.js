import api from "@/lib/api";

const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

const toAbsoluteUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${baseUrl}${url}`;
};

export const aboutService = {
  async getAbout() {
    const { data } = await api.get("/api/about");
    if (!data.about) return null;
    const about = data.about;
    if (about?.hero?.avatar?.src) {
      about.hero.avatar.src = toAbsoluteUrl(about.hero.avatar.src);
    }
    return about;
  },
  async updateAbout(payload, avatar) {
    const form = new FormData();
    form.append("data", JSON.stringify(payload));
    if (avatar) {
      form.append("avatar", avatar);
    }
    const { data } = await api.put("/api/about", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.about;
  },
};
