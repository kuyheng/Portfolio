"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import baseData from "@/data/data.json";
import { projectService } from "@/lib/services/projectService";
import { skillService } from "@/lib/services/skillService";
import { profileService } from "@/lib/services/profileService";
import { cvService } from "@/lib/services/cvService";

const mapProject = (project) => ({
  id: String(project.id),
  title: project.title,
  category: project.category || "Web",
  description: project.description || "",
  tech: project.tech_stack || [],
  github: project.github_url || "",
  demo: project.live_url || "",
  image: project.thumbnail_url || "/projects/nebula.svg",
});

const mapSkills = (skills) =>
  Object.fromEntries(
    Object.entries(skills || {}).map(([category, list]) => [
      category,
      list.map((skill) => ({
        name: skill.name,
        icon: skill.icon_url || "devicon-code-plain",
      })),
    ])
  );

export function usePortfolioData() {
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: profileService.getProfile,
  });
  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: projectService.getProjects,
  });
  const skillsQuery = useQuery({
    queryKey: ["skills"],
    queryFn: skillService.getSkills,
  });
  const cvQuery = useQuery({
    queryKey: ["cv"],
    queryFn: cvService.getCVInfo,
  });

  const data = useMemo(() => {
    const profile = profileQuery.data;
    const mappedProfile = {
      name: profile?.name ?? baseData.profile.name,
      role: profile?.job_title ?? baseData.profile.role,
      location: baseData.profile.location,
      bio: profile?.bio ?? baseData.profile.bio,
      email: profile?.email ?? baseData.profile.email,
      photo: profile?.profile_photo_url ?? baseData.profile.photo,
      socials: {
        github: profile?.github_url ?? baseData.profile.socials.github,
        linkedin: profile?.linkedin_url ?? baseData.profile.socials.linkedin,
        telegram: profile?.twitter_url ?? baseData.profile.socials.telegram,
        email: baseData.profile.socials.email,
      },
    };

    const projects = (projectsQuery.data || baseData.projects).map(mapProject);
    const skills = mapSkills(skillsQuery.data || baseData.skills);
    const cvFileUrl = cvQuery.data?.file_url || baseData.cvUrl;
    const cvUrl = cvQuery.data?.file_url ? cvService.downloadCVUrl() : cvFileUrl;

    return {
      profile: mappedProfile,
      hero: baseData.hero,
      about: baseData.about,
      stats: baseData.stats,
      projects,
      news: baseData.news,
      skills,
      cvUrl,
      cvFileUrl,
    };
  }, [profileQuery.data, projectsQuery.data, skillsQuery.data, cvQuery.data]);

  const isLoading =
    profileQuery.isLoading ||
    projectsQuery.isLoading ||
    skillsQuery.isLoading ||
    cvQuery.isLoading;

  return { data, isLoading };
}
