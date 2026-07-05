import { homepageFr } from "./homepage.fr";

export const siteName = "The Unreliable Engineer";
export const productionSiteUrl = "https://theunreliable.engineer";
export const authorName = "Amine Amanzou";
export const brandName = "The Unreliable Engineer";
export const defaultSocialImage = "/brand/web/characters/thinking.png";

export const publicSocialUrls = homepageFr.socialSignal.links.map(({ label, href }) => ({
  label,
  href,
}));
