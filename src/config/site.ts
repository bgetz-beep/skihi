export const site = {
  indexable: false,
  baseUrl: "https://skihi-pitch.up.railway.app",
  pitchBannerText:
    "Pitch preview. Items marked [CONFIRM] are placeholder content pending Ski-Hi review.",
} as const;

export type Site = typeof site;
