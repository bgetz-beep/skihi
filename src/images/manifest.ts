import heroHomepage from "./raw/262ad9_b389e3fe030f46198a4fafb428a57c64~mv2.jpg";
import programBronc from "./raw/262ad9_a7ef6a2f35d84e03abf10cdf70ec0b94~mv2.jpg";
import stampedeLogo from "./raw/262ad9_05d49d906edf4a9295a512d58cc219f6~mv2.png";
import siteLogoWhite from "./raw/262ad9_5bbbac7560d14f359bf96e99955c03ab~mv2.png";
import usa250Strip from "./raw/262ad9_f1998efadf72483ba72377fe1d38e0b3~mv2.png";

import greg from "./raw/262ad9_7d003b92b1f74413bfd994bd84865f8c~mv2.jpg";
import brandon from "./raw/262ad9_b414dffe2e6a40c9b192800bcaddaa24~mv2.jpg";
import nick from "./raw/262ad9_c47d7e2fe02c4da4acd358aadfc9c064~mv2.jpg";
import eric from "./raw/262ad9_a47753cfa86e4e1f86e733e3bc6431c2~mv2.jpg";
import charlie from "./raw/262ad9_449255ce6c084e6e86a76b9f21174d9a~mv2.jpg";
import ce from "./raw/262ad9_d5f78e7cbd6c4fc49af7aeb3364fb5d3~mv2.jpg";
import keith from "./raw/262ad9_dfd3bf9804c24fab8bd7b9a6c5855f14~mv2.jpg";
import mark from "./raw/262ad9_f4d95e9688034e9d8b545a02ca6a9185~mv2.jpg";
import karla from "./raw/262ad9_be660e020f65456f90ca0e6a64ffe7d7~mv2.jpg";
import derek from "./raw/262ad9_a6d399c7252740329d2db3c782a06deb~mv2.jpg";
import rocky from "./raw/262ad9_8be6647119134ef2928560800ef307d0~mv2.jpg";
import kelsey from "./raw/262ad9_1242ed33a7a04d34988d16cc63fb36ff~mv2.jpg";
import helen from "./raw/262ad9_1fca2adcf27d40e48e0f2b3726f2f990~mv2.jpg";
import ryan from "./raw/262ad9_ef3db0b08b4440e4b11e452b513088f4~mv2.jpg";

export const images = {
  heroHomepage,
  programBronc,
  stampedeLogo,
  siteLogoWhite,
  usa250Strip,
  committee: {
    greg, brandon, nick, eric, charlie, ce, keith, mark,
    karla, derek, rocky, kelsey, helen, ryan,
  },
} as const;

export type ImageKey = keyof typeof images;
