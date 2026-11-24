// Real Reputation catalog (titles, handles, options, prices, compare-at and availability) captured from
// reputationextensions.com/products.json. Ratings, review counts and low-stock counts are DEMO values.
import catalogJson from "./catalog.json";
import shadesJson from "./shades.json";
import type { ImgKey } from "./images";
import { settings } from "@/theme/settings";

export type Line = "hybrid" | "ktip" | "tape" | "seamless" | "laced" | "original" | "accessory" | "tool" | "course";
export type Family = "platinum" | "creamy" | "honey" | "rooted" | "dirty" | "bronde" | "chocolate" | "espresso";
export type Group = "Blondes" | "Brondes" | "Brunettes";

interface RawVariant {
  id: string;
  o: string[];
  p: number;
  c: number;
  a: boolean;
}
interface RawProduct {
  handle: string;
  title: string;
  line: string;
  shade: string | null;
  family: string | null;
  img: string | null;
  note: string | null;
  desc: string;
  options: { name: string; values: string[] }[];
  variants: RawVariant[];
  created: string;
}

export interface Variant {
  id: string;
  options: string[];
  price: number;
  compareAt: number;
  available: boolean;
  stock: number;
}
export interface Option {
  name: string;
  values: string[];
}
export interface Product {
  handle: string;
  title: string;
  line: Line;
  shade: string | null;
  family: Family | null;
  note: string | null;
  description: string;
  options: Option[];
  variants: Variant[];
  images: ImgKey[];
  createdAt: string;
  rating: number;
  reviewCount: number;
  bestSeller: boolean;
  isNew: boolean;
  salesRank: number;
}

export const LINE_INFO: Record<Line, { label: string; eyebrow: string; hair: boolean; collection: string }> = {
  hybrid: { label: "Luxury Hybrid Wefts", eyebrow: "Deluxe Density Hybrid Weft", hair: true, collection: "luxury-hybrid-wefts" },
  ktip: { label: "Keratin Tips", eyebrow: "Deluxe Density Keratin Tips", hair: true, collection: "reputation-keratin-tips" },
  tape: { label: "Tape In Wefts", eyebrow: "Tape In Weft · 33″ cut-anywhere weft", hair: true, collection: "tape-in-extensions" },
  seamless: { label: "Clip In Extensions", eyebrow: "Seamless Clip In Extensions", hair: true, collection: "clip-in-extensions" },
  laced: { label: "The Weekend Collection", eyebrow: "Laced Clip In · The Weekend Collection", hair: true, collection: "the-weekend-collection" },
  original: { label: "Original Hybrids", eyebrow: "Last Chance · Original Hybrid Pack", hair: true, collection: "last-chance-original-hybrids" },
  accessory: { label: "Haircare & Accessories", eyebrow: "Reputation Essentials", hair: false, collection: "accessories" },
  tool: { label: "Pro Tools", eyebrow: "Reputation Pro Tools", hair: false, collection: "pro-tools" },
  course: { label: "Reputation Courses", eyebrow: "Reputation Education", hair: false, collection: "education" },
};

export const METHOD_FILTERS: { id: string; label: string; lines: Line[] }[] = [
  { id: "hybrid", label: "Hybrid Wefts", lines: ["hybrid", "original"] },
  { id: "ktip", label: "Keratin Tips", lines: ["ktip"] },
  { id: "tape", label: "Tape In Wefts", lines: ["tape"] },
  { id: "clipin", label: "Clip In’s", lines: ["seamless", "laced"] },
  { id: "essentials", label: "Accessories & Tools", lines: ["accessory", "tool"] },
];

export const FAMILY: Record<Family, { label: string; group: Group; swatch: string; pack: ImgKey; back: ImgKey; model: ImgKey }> = {
  platinum: { label: "Platinum", group: "Blondes", swatch: "linear-gradient(135deg,#f6f1e7,#e0d4bd)", pack: "shPlatinum", back: "bkPlatinum", model: "ugIcy" },
  creamy: { label: "Bright Blonde", group: "Blondes", swatch: "linear-gradient(135deg,#f0e2c3,#d6bc8c)", pack: "shCreamy", back: "bkPlatinum", model: "lsBlonde" },
  honey: { label: "Warm Blonde", group: "Blondes", swatch: "linear-gradient(135deg,#e6c48d,#c3955a)", pack: "shHoney", back: "bkGolden", model: "heroAMobile" },
  rooted: { label: "Rooted Blonde", group: "Blondes", swatch: "linear-gradient(180deg,#6a5442 0%,#87705a 32%,#dcc8a3 72%)", pack: "shRooted", back: "bkGolden", model: "lsSun" },
  dirty: { label: "Dimensional Blonde", group: "Brondes", swatch: "linear-gradient(135deg,#c9aa80,#8b6b4b)", pack: "shDirty", back: "bkBronde", model: "ugSalon" },
  bronde: { label: "Bronde", group: "Brondes", swatch: "linear-gradient(135deg,#a47e58,#5b3f2e)", pack: "shBronde", back: "bkBronde", model: "ugSalon" },
  chocolate: { label: "Chocolate Brunette", group: "Brunettes", swatch: "linear-gradient(135deg,#5c3e2c,#36241a)", pack: "shChocolate", back: "bkBrunette", model: "ugBrunette" },
  espresso: { label: "Darkest Brunette", group: "Brunettes", swatch: "linear-gradient(135deg,#30251f,#100c0b)", pack: "shEspresso", back: "bkBrunette", model: "lsBrunette" },
};

export const SHADES = shadesJson as Record<string, { note: string | null; family: Family }>;

const OPTION_SWATCH: Record<string, string> = {
  Greige: "#cfc5b9",
  Nude: "#e6cbb5",
  Black: "#111111",
  "New Black": "linear-gradient(135deg,#2c2c2c,#080808)",
  White: "#ffffff",
  "Light Blonde": "#eadbb8",
  "Dark Blonde": "#b99860",
  Brown: "#6b4a33",
  "Dark Brown": "#3b291e",
};

export function swatchFor(value: string): string | null {
  const s = SHADES[value];
  if (s) return FAMILY[s.family].swatch;
  return OPTION_SWATCH[value] ?? null;
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const BEST = [
  "CEO Deluxe Density Hybrid Weft Extensions",
  "Bossy Blonde Deluxe Density Hybrid Weft Extensions",
  "Reputation Seamless Clip In Extensions",
  "It Girl Blonde Deluxe Density Hybrid Weft Extensions",
  "CEO Tape In Weft",
  "Trophy Wife Cool Deluxe Density Hybrid Weft Extensions",
  "Dirty Blonde Deluxe Density Hybrid Weft Extensions",
  "Bad B Brunette Deluxe Density Hybrid Weft Extensions",
  'Icy Blonde 22" Laced Clip In Extensions',
  "Bossy Blonde Deluxe Density Keratin Tips",
  "Hot Girl Hair Oil",
  "Bad B Brunette Tape In Weft",
];

const IMAGE_FALLBACK: Partial<Record<string, ImgKey[]>> = {
  acOil: ["acOil", "edCare"],
  acBrush: ["acBrush", "edCare"],
  acSnapClips: ["acSnapClips", "edSalon"],
  acPliers: ["acPliers", "edSalon"],
  acThread: ["acThread", "edSalon"],
  acKit: ["acKit", "edSalon"],
  edSalon: ["edSalon", "founders"],
  founders: ["founders", "edSalon"],
  ugSalon: ["ugSalon", "founders"],
};

function imagesFor(r: RawProduct, line: Line, fam: Family | null, colors: string[]): ImgKey[] {
  const F = fam ? FAMILY[fam] : null;
  switch (line) {
    case "hybrid":
      return F ? [F.pack, F.back, F.model, "edSalon"] : ["edSalon"];
    case "ktip":
      return F ? ["mKtip", F.pack, F.back, F.model] : ["mKtip"];
    case "tape":
      return F ? ["mTape", F.pack, F.back, F.model] : ["mTape"];
    case "laced":
      return F ? ["mLaced", F.back, "lsClipin", F.pack] : ["mLaced"];
    case "original":
      return F ? [F.pack, F.back] : ["edSalon"];
    case "seamless": {
      const packs = [...new Set(colors.map((c) => FAMILY[SHADES[c]?.family ?? "creamy"].pack))];
      return ["mClipin", "lsClipin", ...packs];
    }
    default: {
      const k = (r.img ?? "edCare") as ImgKey;
      return IMAGE_FALLBACK[k] ?? [k];
    }
  }
}

export const products: Product[] = (catalogJson as RawProduct[]).map((r, i) => {
  const line = r.line as Line;
  const family = (r.family as Family | null) ?? null;
  const options = r.options;
  const colorIdx = options.findIndex((o) => o.name === "Color");
  const colors = colorIdx >= 0 ? options[colorIdx].values : [];
  const h = hash(r.handle);
  const rank = BEST.indexOf(r.title);
  return {
    handle: r.handle,
    title: r.title,
    line,
    shade: r.shade,
    family,
    note: r.note,
    description: r.desc,
    options,
    variants: r.variants.map((v) => {
      const vh = hash(v.id) % 11;
      return {
        id: v.id,
        options: v.o,
        price: v.p,
        compareAt: v.c,
        available: v.a,
        stock: !v.a ? 0 : vh === 0 ? 2 : vh === 1 ? 3 : 24, // DEMO: replace with variant.inventory_quantity
      };
    }),
    images: imagesFor(r, line, family, colors),
    createdAt: r.created,
    rating: line === "course" ? 0 : 4.7 + (h % 4) / 10,
    reviewCount: line === "course" ? 0 : 14 + (h % 170),
    bestSeller: rank >= 0,
    isNew: r.created >= "2026-07-01",
    salesRank: rank >= 0 ? rank : 100 + i,
  };
});

/* ── Lookups & variant helpers ───────────────────────────────────────────── */
export const getProduct = (handle?: string) => products.find((p) => p.handle === handle);
export const getByTitle = (title: string) => products.find((p) => p.title === title);
export const isHair = (p: Product) => LINE_INFO[p.line].hair;

export const variantById = (p: Product, id?: string) => p.variants.find((v) => v.id === id);
export const findVariant = (p: Product, opts: string[]) => p.variants.find((v) => v.options.every((o, i) => o === opts[i]));
export const firstAvailable = (p: Product) => p.variants.find((v) => v.available) ?? p.variants[0];
export const isSoldOut = (p: Product) => p.variants.every((v) => !v.available);

export function fromPrice(p: Product) {
  const pool = p.variants.filter((v) => v.available);
  const list = pool.length ? pool : p.variants;
  const v = list.reduce((a, b) => (b.price < a.price ? b : a));
  return { price: v.price, compareAt: v.compareAt, varies: new Set(p.variants.map((x) => x.price)).size > 1 };
}

export const maxSaving = (p: Product) => Math.max(0, ...p.variants.map((v) => (v.compareAt > v.price ? v.compareAt - v.price : 0)));
export const maxPercent = (p: Product) =>
  Math.max(0, ...p.variants.map((v) => (v.compareAt > v.price ? Math.round(((v.compareAt - v.price) / v.compareAt) * 100) : 0)));
export const onSale = (p: Product) => maxSaving(p) > 0;

export function shadeOf(p: Product, v?: Variant): string | null {
  const ci = p.options.findIndex((o) => o.name === "Color");
  if (p.line === "seamless" && ci >= 0 && v) return v.options[ci];
  return p.shade;
}

export function familyOf(p: Product, v?: Variant): Family | null {
  const s = shadeOf(p, v);
  if (p.line === "seamless" && s) return SHADES[s]?.family ?? null;
  return p.family;
}

export function imageFor(p: Product, v?: Variant): ImgKey {
  if (p.line === "seamless" && v) {
    const f = familyOf(p, v);
    if (f) return FAMILY[f].pack;
  }
  return p.images[0];
}

export function noteFor(p: Product, v?: Variant): string | null {
  if (p.line === "seamless" && v) {
    const s = shadeOf(p, v);
    return s ? SHADES[s]?.note ?? null : null;
  }
  return p.note;
}

export const describeVariant = (p: Product, v: Variant) => (p.options.length ? v.options.join(" · ") : p.shade ?? "");

export const groupsOf = (p: Product): Group[] => {
  if (p.line === "seamless") {
    const ci = p.options.findIndex((o) => o.name === "Color");
    return [...new Set(p.options[ci].values.map((c) => FAMILY[SHADES[c]?.family ?? "creamy"].group))];
  }
  return p.family ? [FAMILY[p.family].group] : [];
};

export const lengthsOf = (p: Product): number[] => {
  const li = p.options.findIndex((o) => o.name === "Length");
  const fromTitle = p.title.match(/(\d{2})"/);
  const vals = li >= 0 ? p.options[li].values : fromTitle ? [fromTitle[1]] : [];
  return [...new Set(vals.flatMap((v) => (v.match(/\d{2}/g) ?? []).map(Number)))];
};

/* ── Campaign helpers ────────────────────────────────────────────────────── */
export function activeCampaign(now: number) {
  return settings.campaigns.find((c) => now >= Date.parse(c.starts) && now < Date.parse(c.ends)) ?? null;
}

export function campaignPercent(p: Product, now: number) {
  const c = activeCampaign(now);
  if (!c) return null;
  const d = c.autoDiscounts.find((a) => a.lines.includes(p.line));
  return d ? { percent: d.percent, label: d.label, campaign: c } : null;
}

/* ── Collections (handles mirror reputationextensions.com) ───────────────── */
export interface Collection {
  handle: string;
  title: string;
  eyebrow: string;
  intro: string;
  image: ImgKey;
  seo: string;
  match: (p: Product) => boolean;
}

const titles = (list: string[]) => (p: Product) => list.includes(p.title);
const lines = (...l: Line[]) => (p: Product) => l.includes(p.line);
const bfLines = settings.campaigns.find((c) => c.id === "black-friday")?.autoDiscounts.flatMap((d) => d.lines) ?? [];

const C = (handle: string, title: string, eyebrow: string, intro: string, image: ImgKey, match: (p: Product) => boolean): Collection => ({
  handle,
  title,
  eyebrow,
  intro,
  image,
  match,
  seo: `${title} — ${intro}`.slice(0, 155),
});

export const collections: Record<string, Collection> = Object.fromEntries(
  [
    C("all", "Shop All", "Shop Hair Collections", "Every Reputation shade, method and essential — designed by professional stylists.", "heroAMobile", () => true),
    C("luxury-hybrid-wefts", "Luxury Hybrid Wefts", "Deluxe Density", "Double drawn throughout for max thickness top to bottom. Ultra-thin, lays flat, cut anywhere.", "bkGolden", lines("hybrid")),
    C("reputation-keratin-tips", "Keratin Tips", "Strand-by-strand", "Individual strand application for long-lasting, discreet and fully customizable wear.", "lsSun", lines("ktip")),
    C("tape-in-extensions", "Tape In Wefts", "Fast & seamless", "Lightweight, seamless, and perfect for quick applications — one 33″ weft you can cut anywhere.", "lsBrunette", lines("tape")),
    C("clip-in-extensions", "Clip In Extensions", "Effortless hair, on your terms", "Perfect for occasion wear and when you need a little extra length & volume.", "lsClipin", lines("seamless", "laced")),
    C("the-weekend-collection", "The Weekend Collection", "Our easiest extensions yet", "Luxury Hair for the moments you want more of. Laced clip-ins, available ready to wear.", "mLaced", lines("laced")),
    C("new-arrivals", "New Arrivals", "Just in", "The newest Reputation shades and essentials.", "lsBlonde", (p) => p.isNew),
    C("best-sellers", "Best Sellers", "Most loved", "The shades and essentials our stylists and clients reorder most.", "ugIcy", (p) => p.bestSeller),
    C("blondes", "Blondes", "Shop by shade", "From platinum level 10s to rooted, lived-in blondes.", "bkPlatinum", (p) => groupsOf(p).includes("Blondes")),
    C("brondes", "Brondes", "Shop by shade", "Dimensional blondes and brondes with warm, sandy and smoky tones.", "bkBronde", (p) => groupsOf(p).includes("Brondes")),
    C("brunettes", "Brunettes", "Shop by shade", "Rich chocolates to our darkest level 3 brunettes and rich black.", "bkBrunette", (p) => groupsOf(p).includes("Brunettes")),
    C("last-chance-original-hybrids", "Last Chance: Original Hybrids", "Final pieces", "Our original hybrid packs — once they’re gone, they’re gone.", "shDirty", lines("original")),
    C("accessories", "Haircare & Accessories", "Reputation essentials", "The finishing touches we can’t leave the house without.", "edCare", lines("accessory")),
    C("haircare", "Haircare", "Reputation essentials", "Care for your extensions like a pro.", "edCare", lines("accessory")),
    C("pro-tools", "Pro Tools", "For Pro’s", "Installation essentials designed by stylists, for stylists.", "acKit", lines("tool")),
    C("professional-hair", "Pro Hair Collections", "For Pro’s", "Professional-grade hybrid wefts, keratin tips and tape wefts.", "edSalon", lines("hybrid", "ktip", "tape")),
    C("education", "Reputation Courses", "Education", "Learn the Reputation Extension Method™ with our founders.", "founders", lines("course")),
    C("consumer-collection", "For All", "Shop for myself", "Clip-ins, the Weekend Collection and essentials made for everyday wear.", "lsClipin", lines("seamless", "laced", "accessory")),
    C("black-friday", "Black Friday", "Black Friday now live", "Up to 75% off — savings on Tape Wefts, 15% off Clip In’s and more, for a limited time.", "heroA", (p) => onSale(p) || bfLines.includes(p.line)),
    C("for-the-jetsetter", "For the Jetsetters", "Holiday Shop", "Travel-ready hair and the essentials that live in her carry-on.", "edStreet",
      titles(["Reputation Seamless Clip In Extensions", 'Icy Blonde 22" Laced Clip In Extensions', 'Warm Brown 22" Laced Clip In Extensions', "Hot Girl Hair Oil", "Reputation Detangling Hairbrush", "Reputation Scrunchie"])),
    C("for-the-it-girls", "For the It Girls", "Holiday Shop", "Main-character volume in our most-requested shades.", "lsBlonde",
      titles(["CEO Deluxe Density Hybrid Weft Extensions", "It Girl Blonde Deluxe Density Hybrid Weft Extensions", "Trophy Wife Tape In Weft", 'Rooted Beige 20" Laced Clip In Extensions', "Reputation Seamless Clip In Extensions", "Reputation Creaseless Hair Clips"])),
    C("for-the-artists", "For the Artists", "Holiday Shop", "For the stylists: pro tools, kits and Reputation education.", "edSalon", lines("tool", "course")),
    C("little-luxuries", "Little Luxuries", "Holiday Shop", "Small gifts, big hair days.", "acOil",
      titles(["Hot Girl Hair Oil", "Reputation Detangling Hairbrush", "Reputation Scrunchie", "Reputation Creaseless Hair Clips", "Reputation Hair Grippers"])),
  ].map((c) => [c.handle, c]),
);

export const productsIn = (handle: string) => {
  const c = collections[handle];
  return c ? products.filter(c.match) : [];
};

/** Client page URLs (/pages/…) that are really collections → redirect targets. */
export const PAGE_ALIASES: Record<string, string> = {
  "hoiday-shop": "/pages/holiday-shop",
  "shop-all-hair-collections": "/collections/all",
  "clip-in-collection": "/collections/clip-in-extensions",
  "new-arrivals": "/collections/new-arrivals",
  "best-sellers": "/collections/best-sellers",
  "pro-tools": "/collections/pro-tools",
  "professional-hair": "/collections/professional-hair",
  "the-weekend-collection": "/collections/the-weekend-collection",
  haircare: "/collections/haircare",
  accessories: "/collections/accessories",
  "black-friday": "/collections/black-friday",
  "education-page-template": "/collections/education",
};

export function searchProducts(query: string): Product[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean).map((t) => (t.length > 3 && t.endsWith("s") ? t.slice(0, -1) : t));
  if (!terms.length) return [];
  return products.filter((p) => {
    const hay = [
      p.title,
      LINE_INFO[p.line].label,
      LINE_INFO[p.line].eyebrow,
      p.shade ?? "",
      p.family ? `${FAMILY[p.family].label} ${FAMILY[p.family].group}` : "",
      p.note ?? "",
      ...p.options.flatMap((o) => o.values),
    ]
      .join(" ")
      .toLowerCase()
      .replace(/-/g, " ");
    return terms.every((t) => hay.includes(t.replace(/-/g, " ")));
  });
}

/** Spec rows built from the client's FAQ + product copy. */
export function specsFor(p: Product): [string, string][] {
  const hair: [string, string] = ["Hair", "100% Remy human hair, ethically sourced"];
  switch (p.line) {
    case "hybrid":
    case "original":
      return [
        hair,
        ["Density", p.line === "hybrid" ? "Deluxe — double drawn throughout for max thickness" : "Original hybrid density"],
        ["Construction", "Hybrid weft: ultra-thin, lays flat, cut anywhere"],
        ["Weft length", "33″ — wraps the head about 2½ times"],
        ["Pack weight", "16–18″: 50g half / 100g full · 22–24″: 60g half / 120g full"],
        ["Per row", "Fine–medium hair: ½–¾ pack · Medium–thick: ¾–full pack"],
      ];
    case "tape":
      return [hair, ["Construction", "One long 33″ tape weft — cut anywhere"], ["Application", "Fast, efficient sandwich install"], ["Wear", "Lightweight and seamless"]];
    case "ktip":
      return [hair, ["Density", "Deluxe — double drawn throughout"], ["Bonds", "Keratin tips that mimic natural movement"], ["Packs", "Full pack 50 tips · Half pack 25 tips"]];
    case "seamless":
      return [hair, ["Weft", "Ultra-thin silicone wefts with snap clips"], ["Wear", "Clip in, clip out — in minutes"]];
    case "laced":
      return [hair, ["Construction", "Innovative lace weft for a flat, comfortable fit"], ["Finish", "Original packaging or Ready to Wear (washed & styled)"]];
    default:
      return [];
  }
}
