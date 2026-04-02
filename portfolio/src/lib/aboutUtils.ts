import type { AboutData } from "@/data/aboutData";

export function mergeAboutData(
  base: AboutData,
  override?: Partial<AboutData> | null,
  profilePhoto?: string,
  profileName?: string
): AboutData {
  const merged: AboutData = {
    ...base,
    ...override,
    section: { ...base.section, ...override?.section },
    availability: { ...base.availability, ...override?.availability },
    hero: {
      ...base.hero,
      ...override?.hero,
      avatar: { ...base.hero.avatar, ...override?.hero?.avatar },
      ctas: override?.hero?.ctas ?? base.hero.ctas,
    },
    highlights: {
      ...base.highlights,
      ...override?.highlights,
      items: override?.highlights?.items ?? base.highlights.items,
    },
    stats: {
      ...base.stats,
      ...override?.stats,
      items: override?.stats?.items ?? base.stats.items,
    },
    features: {
      ...base.features,
      ...override?.features,
      items: override?.features?.items ?? base.features.items,
    },
    journey: {
      ...base.journey,
      ...override?.journey,
      items: override?.journey?.items ?? base.journey.items,
    },
    toolbox: {
      ...base.toolbox,
      ...override?.toolbox,
      items: override?.toolbox?.items ?? base.toolbox.items,
    },
  };

  const avatarSrc =
    merged.hero.avatar.src || profilePhoto || base.hero.avatar.src;
  const avatarAlt =
    merged.hero.avatar.alt ||
    (profileName ? `${profileName} profile` : base.hero.avatar.alt);

  return {
    ...merged,
    hero: {
      ...merged.hero,
      avatar: { ...merged.hero.avatar, src: avatarSrc, alt: avatarAlt },
    },
  };
}
