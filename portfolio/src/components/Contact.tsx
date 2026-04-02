"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import SectionHeading from "@/components/SectionHeading";
import { contactService } from "@/lib/services/contactService";

type ContactProps = {
  profile: {
    email: string;
    socials: {
      github: string;
      linkedin: string;
      telegram: string;
      email: string;
    };
  };
};

export default function Contact({ profile }: ContactProps) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const sendMutation = useMutation({
    mutationFn: contactService.sendMessage,
    onSuccess: () => {
      toast.success("Message sent!");
      setSent(true);
      setForm({ name: "", email: "", message: "" });
      window.setTimeout(() => setSent(false), 2200);
    },
    onError: () => toast.error("Failed to send message."),
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMutation.mutate(form);
  };

  return (
    <section id="contact" className="py-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something together"
          subtitle="Tell me about your product vision, timeline, and team. I reply within 24 hours."
        />

        <div className="relative">
          <div className="glass-card rounded-3xl p-8">
            <form className="grid gap-6" onSubmit={handleSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  Name
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-400/70"
                    placeholder="Your name"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  Email
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-400/70"
                    placeholder="you@email.com"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-2 text-sm text-slate-300">
                Message
                <textarea
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-400/70"
                  placeholder="Tell me about your project..."
                />
              </label>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  type="submit"
                  className="accent-gradient rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/40"
                  disabled={sendMutation.isPending}
                >
                  {sendMutation.isPending ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>

          <AnimatePresence>
            {sent ? (
              <motion.div
                className="absolute -top-6 right-6 rounded-full border border-green-400/30 bg-green-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-green-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                Message Sent
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-300">
          <a
            className="glass-card flex items-center gap-2 rounded-full px-4 py-2"
            href={profile.socials.github}
            target="_blank"
            rel="noreferrer"
          >
            <span className="h-6 w-6 rounded-full border border-white/10 bg-white/5 text-center text-xs leading-6">
              GH
            </span>
            GitHub
          </a>
          <a
            className="glass-card flex items-center gap-2 rounded-full px-4 py-2"
            href={profile.socials.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            <span className="h-6 w-6 rounded-full border border-white/10 bg-white/5 text-center text-xs leading-6">
              IN
            </span>
            LinkedIn
          </a>
          <a
            className="glass-card flex items-center gap-2 rounded-full px-4 py-2"
            href={profile.socials.telegram}
            target="_blank"
            rel="noreferrer"
          >
            <span className="h-6 w-6 rounded-full border border-white/10 bg-white/5 text-center text-xs leading-6">
              TG
            </span>
            Telegram
          </a>
          <a className="glass-card flex items-center gap-2 rounded-full px-4 py-2" href={profile.socials.email}>
            <span className="h-6 w-6 rounded-full border border-white/10 bg-white/5 text-center text-xs leading-6">
              EM
            </span>
            Email
          </a>
        </div>
      </div>
    </section>
  );
}
