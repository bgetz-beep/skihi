import heroHomepage from "./raw/262ad9_b389e3fe030f46198a4fafb428a57c64~mv2.jpg";
import programBronc from "./raw/262ad9_a7ef6a2f35d84e03abf10cdf70ec0b94~mv2.jpg";
import stampedeLogo from "./raw/262ad9_05d49d906edf4a9295a512d58cc219f6~mv2.png";
import siteLogoWhite from "./raw/262ad9_5bbbac7560d14f359bf96e99955c03ab~mv2.png";
import usa250Strip from "./raw/262ad9_f1998efadf72483ba72377fe1d38e0b3~mv2.png";

export const images = {
  heroHomepage,
  programBronc,
  stampedeLogo,
  siteLogoWhite,
  usa250Strip,
} as const;

export type ImageKey = keyof typeof images;
