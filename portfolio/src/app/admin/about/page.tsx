"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { aboutData, type AboutCta, type AboutData } from "@/data/aboutData";
import { mergeAboutData } from "@/lib/aboutUtils";
import { aboutService } from "@/lib/services/aboutService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const iconOptions = [
  { value: "check", label: "Check" },
  { value: "sparkles", label: "Sparkles" },
  { value: "layers", label: "Layers" },
  { value: "compass", label: "Compass" },
  { value: "star", label: "Star" },
  { value: "zap", label: "Zap" },
];

const ctaVariants = ["default", "secondary", "outline", "ghost"] as const;

const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;

const moveItem = <T,>(items: T[], index: number, direction: number) => {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(index, 1);
  next.splice(nextIndex, 0, item);
  return next;
};

export default function AdminAboutPage() {
  const queryClient = useQueryClient();
  const { data: aboutApi, isLoading } = useQuery({
    queryKey: ["about"],
    queryFn: aboutService.getAbout,
  });
  const [draft, setDraft] = useState<AboutData>(aboutData);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(mergeAboutData(aboutData, aboutApi || undefined));
    setAvatarFile(null);
  }, [aboutApi]);

  const updateMutation = useMutation({
    mutationFn: () => aboutService.updateAbout(draft, avatarFile || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] });
      toast.success("About section updated");
    },
    onError: () => toast.error("Failed to update About section"),
  });

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setDraft((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        avatar: {
          ...prev.hero.avatar,
          src: URL.createObjectURL(file),
        },
      },
    }));
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync();
    } catch {
      // handled by mutation onError
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">About Section</h2>
          <p className="text-sm text-slate-400">
            Control every part of the About section without touching code.
          </p>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending || isLoading}>
          Save Changes
        </Button>
      </div>
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-white">Section Heading</h3>
            <p className="text-sm text-slate-400">Eyebrow, headline, and subheading.</p>
          </div>
          <Button
            type="button"
            variant={draft.section.enabled ? "secondary" : "outline"}
            onClick={() =>
              setDraft((prev) => ({
                ...prev,
                section: { ...prev.section, enabled: !prev.section.enabled },
              }))
            }
          >
            {draft.section.enabled ? "Enabled" : "Disabled"}
          </Button>
        </div>
        {isLoading ? (
          <div className="mt-6 space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-12 rounded-xl bg-slate-900/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid gap-4">
            <Input
              placeholder="Eyebrow label"
              value={draft.section.eyebrow}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  section: { ...prev.section, eyebrow: event.target.value },
                }))
              }
            />
            <Input
              placeholder="Main heading"
              value={draft.section.title}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  section: { ...prev.section, title: event.target.value },
                }))
              }
            />
            <Textarea
              placeholder="Subheading"
              value={draft.section.subtitle}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  section: { ...prev.section, subtitle: event.target.value },
                }))
              }
            />
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-white">Availability Badge</h3>
            <p className="text-sm text-slate-400">Show/hide the availability pill.</p>
          </div>
          <Button
            type="button"
            variant={draft.availability.enabled ? "secondary" : "outline"}
            onClick={() =>
              setDraft((prev) => ({
                ...prev,
                availability: {
                  ...prev.availability,
                  enabled: !prev.availability.enabled,
                },
              }))
            }
          >
            {draft.availability.enabled ? "Enabled" : "Disabled"}
          </Button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Badge label"
            value={draft.availability.label}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                availability: { ...prev.availability, label: event.target.value },
              }))
            }
          />
          <Input
            placeholder="Badge detail"
            value={draft.availability.detail || ""}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                availability: { ...prev.availability, detail: event.target.value },
              }))
            }
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-base font-semibold text-white">Hero Content</h3>
        <div className="mt-4 grid gap-6">
          <Textarea
            placeholder="Hero description"
            value={draft.hero.description}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                hero: { ...prev.hero, description: event.target.value },
              }))
            }
          />
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-slate-800 bg-slate-900/60">
              {draft.hero.avatar.src ? (
                <Image
                  src={draft.hero.avatar.src}
                  alt="Avatar preview"
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                  No Photo
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Input
                placeholder="Avatar URL"
                value={draft.hero.avatar.src}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      avatar: { ...prev.hero.avatar, src: event.target.value },
                    },
                  }))
                }
              />
              <label className="flex cursor-pointer items-center gap-3 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-300">
                Upload Photo
                <Input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
            </div>
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-white">CTA Buttons</h3>
            <p className="text-sm text-slate-400">Primary actions under the hero content.</p>
          </div>
          <Button
            type="button"
            onClick={() =>
              setDraft((prev) => ({
                ...prev,
                hero: {
                  ...prev.hero,
                  ctas: [
                    ...prev.hero.ctas,
                    {
                      id: createId("cta"),
                      label: "New CTA",
                      href: "#",
                      variant: "outline",
                      enabled: true,
                    },
                  ],
                },
              }))
            }
          >
            <Plus className="h-4 w-4" />
            Add CTA
          </Button>
        </div>
        <div className="mt-4 grid gap-4">
          {draft.hero.ctas.map((cta, index) => (
            <div key={cta.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="grid gap-3 md:grid-cols-[1.2fr_1.2fr_0.8fr]">
                <Input
                  placeholder="Label"
                  value={cta.label}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        ctas: prev.hero.ctas.map((item) =>
                          item.id === cta.id
                            ? { ...item, label: event.target.value }
                            : item
                        ),
                      },
                    }))
                  }
                />
                <Input
                  placeholder="Link"
                  value={cta.href}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        ctas: prev.hero.ctas.map((item) =>
                          item.id === cta.id ? { ...item, href: event.target.value } : item
                        ),
                      },
                    }))
                  }
                />
                <Select
                  value={cta.variant || "default"}
                  onValueChange={(value) =>
                    setDraft((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        ctas: prev.hero.ctas.map((item) =>
                          item.id === cta.id
                            ? { ...item, variant: value as AboutCta["variant"] }
                            : item
                        ),
                      },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {ctaVariants.map((variant) => (
                      <SelectItem key={variant} value={variant}>
                        {variant}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <Button
                  type="button"
                  variant={cta.enabled !== false ? "secondary" : "outline"}
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        ctas: prev.hero.ctas.map((item) =>
                          item.id === cta.id ? { ...item, enabled: item.enabled === false } : item
                        ),
                      },
                    }))
                  }
                >
                  {cta.enabled !== false ? "Enabled" : "Disabled"}
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      setDraft((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          ctas: moveItem(prev.hero.ctas, index, -1),
                        },
                      }))
                    }
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      setDraft((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          ctas: moveItem(prev.hero.ctas, index, 1),
                        },
                      }))
                    }
                    disabled={index === draft.hero.ctas.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      setDraft((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          ctas: prev.hero.ctas.filter((item) => item.id !== cta.id),
                        },
                      }))
                    }
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-white">Highlights</h3>
            <p className="text-sm text-slate-400">Bullet points under the hero description.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant={draft.highlights.enabled ? "secondary" : "outline"}
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  highlights: { ...prev.highlights, enabled: !prev.highlights.enabled },
                }))
              }
            >
              {draft.highlights.enabled ? "Enabled" : "Disabled"}
            </Button>
            <Button
              type="button"
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  highlights: {
                    ...prev.highlights,
                    items: [
                      ...prev.highlights.items,
                      { id: createId("highlight"), text: "", icon: "check" },
                    ],
                  },
                }))
              }
            >
              <Plus className="h-4 w-4" />
              Add Highlight
            </Button>
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          {draft.highlights.items.map((item, index) => (
            <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="grid gap-3 md:grid-cols-[1.6fr_0.6fr]">
                <Input
                  placeholder="Highlight text"
                  value={item.text}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      highlights: {
                        ...prev.highlights,
                        items: prev.highlights.items.map((entry) =>
                          entry.id === item.id ? { ...entry, text: event.target.value } : entry
                        ),
                      },
                    }))
                  }
                />
                <Select
                  value={item.icon || "check"}
                  onValueChange={(value) =>
                    setDraft((prev) => ({
                      ...prev,
                      highlights: {
                        ...prev.highlights,
                        items: prev.highlights.items.map((entry) =>
                          entry.id === item.id ? { ...entry, icon: value } : entry
                        ),
                      },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon.value} value={icon.value}>
                        {icon.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      highlights: {
                        ...prev.highlights,
                        items: moveItem(prev.highlights.items, index, -1),
                      },
                    }))
                  }
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      highlights: {
                        ...prev.highlights,
                        items: moveItem(prev.highlights.items, index, 1),
                      },
                    }))
                  }
                  disabled={index === draft.highlights.items.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      highlights: {
                        ...prev.highlights,
                        items: prev.highlights.items.filter((entry) => entry.id !== item.id),
                      },
                    }))
                  }
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-white">Stats Cards</h3>
            <p className="text-sm text-slate-400">Numbers shown next to the hero content.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant={draft.stats.enabled ? "secondary" : "outline"}
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  stats: { ...prev.stats, enabled: !prev.stats.enabled },
                }))
              }
            >
              {draft.stats.enabled ? "Enabled" : "Disabled"}
            </Button>
            <Button
              type="button"
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  stats: {
                    ...prev.stats,
                    items: [
                      ...prev.stats.items,
                      { id: createId("stat"), label: "New Stat", value: 0, suffix: "+" },
                    ],
                  },
                }))
              }
            >
              <Plus className="h-4 w-4" />
              Add Stat
            </Button>
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          {draft.stats.items.map((item, index) => (
            <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="grid gap-3 md:grid-cols-[1.2fr_0.6fr_0.4fr]">
                <Input
                  placeholder="Label"
                  value={item.label}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      stats: {
                        ...prev.stats,
                        items: prev.stats.items.map((entry) =>
                          entry.id === item.id ? { ...entry, label: event.target.value } : entry
                        ),
                      },
                    }))
                  }
                />
                <Input
                  type="number"
                  placeholder="Value"
                  value={item.value}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      stats: {
                        ...prev.stats,
                        items: prev.stats.items.map((entry) =>
                          entry.id === item.id
                            ? { ...entry, value: Number(event.target.value) }
                            : entry
                        ),
                      },
                    }))
                  }
                />
                <Input
                  placeholder="Suffix"
                  value={item.suffix || ""}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      stats: {
                        ...prev.stats,
                        items: prev.stats.items.map((entry) =>
                          entry.id === item.id ? { ...entry, suffix: event.target.value } : entry
                        ),
                      },
                    }))
                  }
                />
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      stats: { ...prev.stats, items: moveItem(prev.stats.items, index, -1) },
                    }))
                  }
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      stats: { ...prev.stats, items: moveItem(prev.stats.items, index, 1) },
                    }))
                  }
                  disabled={index === draft.stats.items.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      stats: {
                        ...prev.stats,
                        items: prev.stats.items.filter((entry) => entry.id !== item.id),
                      },
                    }))
                  }
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>


      <Button
        className="self-start"
        onClick={handleSave}
        disabled={updateMutation.isPending || isLoading}
      >
        Save Changes
      </Button>
    </div>
  );
}
