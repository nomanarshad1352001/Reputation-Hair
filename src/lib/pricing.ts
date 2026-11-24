// Cart pricing engine. Mirrors how the live store would be configured with Shopify automatic
// discounts (campaign + bundle tiers), one discount code, free-shipping and gift-with-purchase thresholds.
import { settings, type CodeDef } from "@/theme/settings";
import { activeCampaign, isHair, type Product, type Variant } from "@/data/products";
import type { ImgKey } from "@/data/images";
import { round2 } from "@/lib/utils";

export interface CartLine {
  key: string;
  product: Product;
  variant: Variant;
  qty: number;
  image: ImgKey;
}

export interface Totals {
  merch: number;
  compareSavings: number;
  auto: { label: string; amount: number }[];
  code: null | { code: string; def: CodeDef; amount: number; active: boolean; message: string };
  discounted: number;
  hairPacks: number;
  tier: { packs: number; percent: number } | null;
  nextTier: { packs: number; percent: number } | null;
  freeShipping: boolean;
  shippingRemaining: number;
  gift: boolean;
  giftRemaining: number;
  totalSavings: number;
  total: number;
}

const O = settings.offers;

export function computeTotals(lines: CartLine[], code: string, now: number): Totals {
  const merch = round2(lines.reduce((n, l) => n + l.variant.price * l.qty, 0));
  const compareSavings = round2(lines.reduce((n, l) => n + Math.max(0, l.variant.compareAt - l.variant.price) * l.qty, 0));
  const auto: Totals["auto"] = [];

  // 1. Campaign automatic discounts (e.g. Black Friday: 15% off Clip In's)
  const campaign = activeCampaign(now);
  const afterCampaign = new Map<string, number>();
  for (const l of lines) afterCampaign.set(l.key, l.variant.price * l.qty);
  for (const d of campaign?.autoDiscounts ?? []) {
    let amount = 0;
    for (const l of lines) {
      if (!d.lines.includes(l.product.line)) continue;
      const off = l.variant.price * l.qty * (d.percent / 100);
      amount += off;
      afterCampaign.set(l.key, (afterCampaign.get(l.key) ?? 0) - off);
    }
    if (amount > 0) auto.push({ label: d.label, amount: round2(amount) });
  }

  // 2. Bundle & Save tiers on hair packs
  const hairLines = lines.filter((l) => isHair(l.product));
  const hairPacks = hairLines.reduce((n, l) => n + l.qty, 0);
  const tiers = [...O.bundleTiers].sort((a, b) => a.packs - b.packs);
  const tier = [...tiers].reverse().find((t) => hairPacks >= t.packs) ?? null;
  const nextTier = tiers.find((t) => hairPacks < t.packs) ?? null;
  if (tier) {
    const base = hairLines.reduce((n, l) => n + (afterCampaign.get(l.key) ?? 0), 0);
    auto.push({ label: `Bundle & Save · ${tier.percent}% off ${hairPacks} packs`, amount: round2(base * (tier.percent / 100)) });
  }

  const autoTotal = auto.reduce((n, a) => n + a.amount, 0);
  const afterAuto = Math.max(0, merch - autoTotal);

  // 3. Discount code
  let codeRes: Totals["code"] = null;
  const def = code ? O.codes[code] : undefined;
  if (code && def) {
    let amount = 0;
    let active = true;
    let message = def.label;
    if (def.type === "percent") amount = afterAuto * (def.value / 100);
    if (def.type === "amount") {
      active = afterAuto >= def.min;
      amount = active ? Math.min(def.value, afterAuto) : 0;
      if (!active) message = `Add ${fmtMoney(def.min - afterAuto)} more to use ${code}`;
    }
    codeRes = { code, def, amount: round2(amount), active, message };
  }

  const discounted = round2(Math.max(0, afterAuto - (codeRes?.amount ?? 0)));
  const freeShipping = discounted >= O.freeShipping.threshold || codeRes?.def.type === "shipping";
  const gift = lines.length > 0 && (discounted >= O.gift.threshold || codeRes?.def.type === "gift");

  return {
    merch,
    compareSavings,
    auto,
    code: codeRes,
    discounted,
    hairPacks,
    tier,
    nextTier,
    freeShipping,
    shippingRemaining: round2(Math.max(0, O.freeShipping.threshold - discounted)),
    gift,
    giftRemaining: round2(Math.max(0, O.gift.threshold - discounted)),
    totalSavings: round2(compareSavings + autoTotal + (codeRes?.amount ?? 0) + (gift ? O.gift.value : 0)),
    total: discounted,
  };
}

function fmtMoney(n: number) {
  return `$${(Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, "")}`;
}
