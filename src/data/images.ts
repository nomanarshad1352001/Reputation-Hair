/// <reference types="vite/client" />
// Brand imagery registry. Founders photo = the client's own photo (brightened); everything else was
// generated for this build. On Shopify these map to image pickers served from the CDN with srcset.
import logoBlack from "@/assets/img/logo-black.png";
import logoWhite from "@/assets/img/logo-white.png";

export const LOGO = { black: logoBlack, white: logoWhite };

const KEYS = [
  "heroA", "heroAMobile", "heroB", "heroBMobile", "heroBrunette", "founders", "community",
  "shPlatinum", "shCreamy", "shHoney", "shRooted", "shDirty", "shBronde", "shChocolate", "shEspresso",
  "mTape", "mKtip", "mClipin", "mLaced",
  "bkPlatinum", "bkBronde", "bkBrunette", "bkGolden",
  "lsBlonde", "lsBrunette", "lsClipin", "lsSun", "lsJet",
  "ugIcy", "ugSalon", "ugHoney", "ugBrunette", "ugChestnut",
  "baBlondeBefore", "baBlondeAfter", "baBrunetteBefore", "baBrunetteAfter",
  "acOil", "acBrush", "acScrunchie", "acClips", "acPliers", "acSnapClips", "acGrippers", "acThread", "acKit",
  "edSalon", "edBox", "edCare", "edStreet",
] as const;

export type ImgKey = (typeof KEYS)[number];

const files = import.meta.glob("/src/assets/img/*.webp", { eager: true, import: "default" }) as Record<string, string>;

export const IMG = Object.fromEntries(KEYS.map((k) => [k, files[`/src/assets/img/${k}.webp`]])) as Record<ImgKey, string>;

const pack = (shade: string) => `${shade} hybrid weft hair extension laid flat on a blush surface`;
const back = (shade: string) => `Back view of long, thick ${shade} hair extensions in soft waves`;

export const ALT: Record<ImgKey, string> = {
  heroA: "Model with waist-length dimensional blonde balayage extensions in bouncy waves against a blush backdrop",
  heroAMobile: "Model with waist-length dimensional blonde balayage extensions looking over her shoulder",
  heroB: "Two women with long platinum blonde and chocolate brunette hair laughing and holding black gift boxes tied with pink ribbon",
  heroBMobile: "Two women with long blonde and brunette hair holding black gift boxes with pink ribbons",
  heroBrunette: "Model with long glossy dark brown waves looking over her shoulder",
  founders: "Reputation founders Liv and Kathy standing together in their studio",
  community: "Three women with different hair colors laughing together on a sofa",
  shPlatinum: pack("Platinum blonde"),
  shCreamy: pack("Bright creamy blonde"),
  shHoney: pack("Warm honey and neutral blonde"),
  shRooted: pack("Rooted beige blonde"),
  shDirty: pack("Dimensional dirty blonde"),
  shBronde: pack("Bronde with caramel highlights"),
  shChocolate: pack("Rich chocolate brown"),
  shEspresso: pack("Darkest espresso brown"),
  mTape: "Row of blonde tape-in hair extensions with clear tape tabs",
  mKtip: "Bundle of blonde keratin-tip hair extensions",
  mClipin: "Set of bronde seamless clip-in hair extensions with snap clips",
  mLaced: "Rooted beige blonde laced clip-in weft with soft waves",
  bkPlatinum: back("platinum blonde"),
  bkBronde: back("dimensional bronde balayage"),
  bkBrunette: back("chocolate brunette"),
  bkGolden: back("rooted golden blonde"),
  lsBlonde: "Woman with a voluminous long creamy blonde blowout smiling softly",
  lsBrunette: "Woman in profile with long, sleek, glassy espresso brunette hair",
  lsClipin: "Woman laughing as she clips a hair extension weft into her bronde curls at a vanity",
  lsSun: "Woman with long dimensional blonde hair moving in a breeze at golden hour",
  lsJet: "Woman in a car with long, sleek, jet black hair",
  ugIcy: "Customer selfie in her car showing long icy blonde waves",
  ugSalon: "Customer selfie in a salon chair with fresh long bronde extensions",
  ugHoney: "Customer mirror selfie with long honey blonde waves",
  ugBrunette: "Customer laughing outdoors at golden hour with long brunette waves",
  ugChestnut: "Customer in a café with a long layered chestnut blowout",
  baBlondeBefore: "Before: thin, shoulder-length blonde hair, seen from behind",
  baBlondeAfter: "After: long, full dimensional blonde extensions on the same client",
  baBrunetteBefore: "Before: thin, shoulder-length brunette hair, seen from behind",
  baBrunetteAfter: "After: long, thick chocolate brunette extensions on the same client",
  acOil: "Hot Girl Hair Oil in a frosted glass pump bottle",
  acBrush: "Nude paddle detangling hairbrush",
  acScrunchie: "Black and white satin scrunchies",
  acClips: "Four chrome creaseless hair clips",
  acPliers: "Hair extension pliers with a white grip",
  acSnapClips: "Row of ten black extension clips",
  acGrippers: "Two black hair gripper clips",
  acThread: "Four spools of cotton thread in blonde and brown shades",
  acKit: "Open black tool kit with pliers, sectioning clips and a tail comb",
  edSalon: "Stylist hand-sewing a weft into a client's hair",
  edBox: "Hair bundle tied with black ribbon in a black gift box with blush tissue",
  edCare: "Comb, bristle brush, silk scrunchie and serum on blush silk",
  edStreet: "Woman with long wavy brown hair walking down a sunny city street",
};
