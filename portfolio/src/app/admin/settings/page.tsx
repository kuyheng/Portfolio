"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { profileService } from "@/lib/services/profileService";

type ProfileForm = {
  name: string;
  job_title: string;
  bio: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  profile_photo_url: string;
  photoFile: File | null;
};

type ProfileResponse = Partial<Omit<ProfileForm, "photoFile">>;

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery<ProfileResponse>({
    queryKey: ["profile"],
    queryFn: profileService.getProfile,
  });
  const [draft, setDraft] = useState<Partial<ProfileForm>>({});

  const form: ProfileForm = {
    name: draft.name ?? profile?.name ?? "",
    job_title: draft.job_title ?? profile?.job_title ?? "",
    bio: draft.bio ?? profile?.bio ?? "",
    email: draft.email ?? profile?.email ?? "",
    github_url: draft.github_url ?? profile?.github_url ?? "",
    linkedin_url: draft.linkedin_url ?? profile?.linkedin_url ?? "",
    twitter_url: draft.twitter_url ?? profile?.twitter_url ?? "",
    profile_photo_url: draft.profile_photo_url ?? profile?.profile_photo_url ?? "",
    photoFile: draft.photoFile ?? null,
  };

  const updateMutation = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated");
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setDraft((prev) => ({
      ...prev,
      photoFile: file,
      profile_photo_url: URL.createObjectURL(file),
    }));
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        name: form.name,
        job_title: form.job_title,
        bio: form.bio,
        email: form.email,
        github_url: form.github_url,
        linkedin_url: form.linkedin_url,
        twitter_url: form.twitter_url,
        profile_photo_url: form.profile_photo_url,
        photo: form.photoFile || undefined,
      });
      setDraft({});
    } catch {
      // handled by mutation onError
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white">Profile Settings</h2>
        {isLoading ? (
          <div className="mt-6 space-y-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-12 rounded-xl bg-slate-900/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border border-slate-800 bg-slate-900/60">
                {form.profile_photo_url ? (
                  <Image
                    src={form.profile_photo_url}
                    alt="Profile preview"
                    fill
                    sizes="96px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                    No Photo
                  </div>
                )}
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-300">
                Upload Photo
                <Input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Name"
                value={form.name}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, name: event.target.value }))
                }
              />
              <Input
                placeholder="Job Title"
                value={form.job_title}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, job_title: event.target.value }))
                }
              />
            </div>
            <Textarea
              placeholder="About text"
              value={form.bio}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, bio: event.target.value }))
              }
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Email"
                value={form.email}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, email: event.target.value }))
                }
              />
              <Input
                placeholder="GitHub URL"
                value={form.github_url}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, github_url: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="LinkedIn URL"
                value={form.linkedin_url}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, linkedin_url: event.target.value }))
                }
              />
              <Input
                placeholder="Telegram URL"
                value={form.twitter_url}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, twitter_url: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-3">
              <Input
                placeholder="Profile photo URL"
                value={form.profile_photo_url}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    profile_photo_url: event.target.value,
                  }))
                }
              />
            </div>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              Save Profile
            </Button>
            <Button variant="outline" asChild>
              <a href="/" target="_blank" rel="noreferrer">
                Preview Portfolio
              </a>
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
