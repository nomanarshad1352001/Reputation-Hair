import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import {
  campaignPercent,
  describeVariant,
  FAMILY,
  findVariant,
  firstAvailable,
  fromPrice,
  imageFor,
  isSoldOut,
  LINE_INFO,
  maxPercent,
  swatchFor,
  type Product,
  type Variant,
} from "@/data/products";
import { useStore } from "@/lib/store";
import { money, useNow } from "@/lib/utils";
import { cn } from "@/utils/cn";
import { Drawer, Img, Stars } from "@/components/ui";
import { Installments } from "@/components/Boosters";

/* ── Price ───────────────────────────────────────────────────────────────── */
export function Price({ price, compareAt, from, className }: { price: number; compareAt: number; from?: boolean; className?: string }) {
  const sale = compareAt > price;
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2", className)}>
      <span className="sr-only">{sale ? "Sale price" : "Price"}</span>
      <span className="font-medium">
        {from && <span className="font-normal">From </span>}
        {money(price)}
      </span>
      {sale && (
        <>
          <span className="sr-only">Regular price</span>
          <s className="text-muted">{money(compareAt)}</s>
        </>
      )}
    </p>
  );
}

export function Badges({ p, className }: { p: Product; className?: string }) {
  const now = useNow(60000);
  const list: [string, string][] = [];
  const camp = campaignPercent(p, now);
  if (isSoldOut(p)) list.push(["Sold out", "bg-white text-black"]);
  else if (maxPercent(p) > 0) list.push([`Save ${maxPercent(p)}%`, "bg-black text-white"]);
  else if (camp) list.push([`${camp.campaign.label} −${camp.percent}%`, "bg-black text-white"]);
  if (p.bestSeller) list.push(["Best seller", "bg-blush text-black"]);
  else if (p.isNew) list.push(["New", "bg-white text-black"]);
  if (!list.length) return null;
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {list.slice(0, 2).map(([label, cls]) => (
        <li key={label} className={cn("rounded-full px-2.5 py-1 text-[10.5px] font-medium uppercase leading-none tracking-[0.12em] shadow-sm", cls)}>
          {label}
        </li>
      ))}
    </ul>
  );
}

/* ── Product card ────────────────────────────────────────────────────────── */
export function ProductCard({ p }: { p: Product }) {
  const { setQuickAdd } = useStore();
  const now = useNow(60000);
  const { price, compareAt, varies } = fromPrice(p);
  const camp = campaignPercent(p, now);
  const soldOut = isSoldOut(p);
  const colorOpt = p.options.find((o) => o.name === "Color");
  const swatches = colorOpt && colorOpt.values.every((v) => swatchFor(v)) ? colorOpt.values : p.family && p.shade ? [p.shade] : [];
  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-blush">
        <Link to={`/products/${p.handle}`} tabIndex={-1} className="block size-full" aria-hidden="true">
          <Img k={p.images[0]} alt="" className="size-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.04]" />
          {p.images[1] && <Img k={p.images[1]} alt="" className="absolute inset-0 hidden size-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 lg:block" />}
        </Link>
        <Badges p={p} className="pointer-events-none absolute left-2.5 right-12 top-2.5" />
        {!soldOut && p.line !== "course" && (
          <button type="button" className="quick-add" onClick={() => setQuickAdd(p)} aria-label={`Quick add ${p.title}`}>
            <Plus size={18} strokeWidth={1.75} className="qa-icon" aria-hidden="true" />
            <span className="qa-label">Quick add</span>
          </button>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">{LINE_INFO[p.line].label}</p>
        <h3 className="line-clamp-2 font-sans text-[15px] font-medium leading-snug tracking-normal md:text-base">
          <Link to={`/products/${p.handle}`} className="link-grow">
            {p.title}
          </Link>
        </h3>
        {p.rating > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-muted">
            <Stars value={p.rating} size={12} />
            <span aria-hidden="true">({p.reviewCount})</span>
            <span className="sr-only">{p.reviewCount} reviews</span>
          </div>
        )}
        <Price price={price} compareAt={compareAt} from={varies} className="text-[15px]" />
        {camp && !soldOut && <p className="text-[13px] font-medium">Extra {camp.percent}% off in bag</p>}
        {swatches.length > 0 && (
          <ul className="flex items-center gap-1.5 pt-1" aria-label="Shades">
            {swatches.slice(0, 8).map((s) => (
              <li key={s} title={s} className="size-4 rounded-full border border-black/15" style={{ background: swatchFor(s) ?? undefined }}>
                <span className="sr-only">{s}</span>
              </li>
            ))}
            {swatches.length === 1 && p.family && <li className="text-[13px] text-muted">{FAMILY[p.family].label}</li>}
          </ul>
        )}
      </div>
    </article>
  );
}

/* ── Carousel (1.5-up peek mobile · 4-up desktop) ────────────────────────── */
export function ProductCarousel({ items, label }: { items: Product[]; label: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: "smooth" });
  const arrow = "absolute top-[32%] z-10 hidden size-12 place-items-center rounded-full border border-line bg-white shadow-md transition-colors hover:bg-black hover:text-white lg:grid";
  return (
    <div className="relative">
      <ul ref={ref} aria-label={label} className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 md:-mx-10 md:gap-6 md:scroll-px-10 md:px-10">
        {items.map((p) => (
          <li key={p.handle} className="w-[62%] shrink-0 snap-start sm:w-[38%] lg:w-[calc(25%-1.125rem)]">
            <ProductCard p={p} />
          </li>
        ))}
      </ul>
      {items.length > 4 && (
        <>
          <button type="button" className={cn(arrow, "-left-6")} onClick={() => scroll(-1)} aria-label="Scroll products left">
            <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button type="button" className={cn(arrow, "-right-6")} onClick={() => scroll(1)} aria-label="Scroll products right">
            <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}

/* ── Variant picker (generic: swatches for shades/colors, pills otherwise) ─ */
export function VariantPicker({ p, variant, onChange, onGuide }: { p: Product; variant: Variant; onChange: (v: Variant) => void; onGuide?: () => void }) {
  if (!p.options.length) return null;
  const pill = (on: boolean, off: boolean) =>
    cn(
      "min-h-11 rounded-full border px-4 text-[15px] transition-colors duration-200",
      on ? "border-black bg-black text-white" : "border-black/25 bg-white hover:border-black",
      off && !on && "border-dashed text-muted line-through",
      off && on && "line-through",
    );
  const select = (oi: number, value: string) => {
    const want = variant.options.map((o, i) => (i === oi ? value : o));
    const next = findVariant(p, want) ?? p.variants.find((v) => v.options[oi] === value && v.available) ?? p.variants.find((v) => v.options[oi] === value);
    if (next) onChange(next);
  };
  return (
    <div className="space-y-6">
      {p.options.map((o, oi) => {
        const isSwatch = o.values.every((v) => swatchFor(v));
        return (
          <fieldset key={o.name}>
            <legend className="mb-3 flex w-full items-baseline justify-between text-[15px]">
              <span>
                <span className="font-medium">{o.name === "Color" && isSwatch && p.line === "seamless" ? "Shade" : o.name}:</span> <span className="text-muted">{variant.options[oi]}</span>
              </span>
              {o.name === "Length" && onGuide && (
                <button type="button" onClick={onGuide} className="text-sm underline underline-offset-4">
                  Pack guide
                </button>
              )}
            </legend>
            <div className={cn("flex flex-wrap", isSwatch ? "-m-1 gap-1" : "gap-2")} role="radiogroup" aria-label={o.name}>
              {o.values.map((val) => {
                const candidate = findVariant(p, variant.options.map((x, i) => (i === oi ? val : x))) ?? p.variants.find((v) => v.options[oi] === val);
                const out = !candidate?.available;
                const on = variant.options[oi] === val;
                return isSwatch ? (
                  <button
                    key={val}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-label={`${val}${out ? ", sold out" : ""}`}
                    title={val}
                    onClick={() => select(oi, val)}
                    className={cn("relative size-12 rounded-full border p-1 transition-colors", on ? "border-black" : "border-transparent hover:border-black/30")}
                  >
                    <span className="block size-full rounded-full border border-black/10" style={{ background: swatchFor(val) ?? undefined }} />
                    {out && <span className="absolute inset-0 m-auto h-px w-9 rotate-45 bg-black/60" aria-hidden="true" />}
                  </button>
                ) : (
                  <button key={val} type="button" role="radio" aria-checked={on} aria-label={`${val}${out ? ", sold out" : ""}`} onClick={() => select(oi, val)} className={pill(on, out)}>
                    {val}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}

/* ── Stock message: driven by inventory only ─────────────────────────────── */
export function StockNote({ v }: { v: Variant }) {
  if (!v.available) return <p className="text-[15px] text-muted">This option is sold out.</p>;
  if (v.stock <= 5)
    return (
      <p className="flex items-center gap-2 text-[15px] font-medium">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-black/40" />
          <span className="relative inline-flex size-2.5 rounded-full bg-black" />
        </span>
        Only {v.stock} left — selling fast
      </p>
    );
  return (
    <p className="flex items-center gap-2 text-[15px] text-muted">
      <span className="size-2 rounded-full bg-[#3f8f5b]" aria-hidden="true" />
      In stock, ready to ship
    </p>
  );
}

/* ── Quick add sheet ─────────────────────────────────────────────────────── */
export function QuickAdd() {
  const { quickAdd, setQuickAdd } = useStore();
  const [shown, setShown] = useState<Product | null>(null);
  useEffect(() => {
    if (quickAdd) setShown(quickAdd);
  }, [quickAdd]);
  return (
    <Drawer open={!!quickAdd} onClose={() => setQuickAdd(null)} side="sheet" label="Quick add">
      {shown && <QuickAddBody key={shown.handle} p={shown} onClose={() => setQuickAdd(null)} />}
    </Drawer>
  );
}

function QuickAddBody({ p, onClose }: { p: Product; onClose: () => void }) {
  const { add } = useStore();
  const [v, setV] = useState<Variant>(() => firstAvailable(p));
  return (
    <div className="grid min-h-0 flex-1 md:grid-cols-2">
      <div className="hidden bg-blush md:block">
        <Img k={imageFor(p, v)} className="size-full max-h-[80dvh] object-cover" />
      </div>
      <div className="flex min-h-0 flex-col">
        <div className="flex items-start gap-4 border-b border-line p-5">
          <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-blush md:hidden">
            <Img k={imageFor(p, v)} alt="" className="size-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">{LINE_INFO[p.line].label}</p>
            <h2 className="mt-1 text-xl leading-tight md:text-2xl">{p.title}</h2>
            <Price price={v.price} compareAt={v.compareAt} className="mt-1.5" />
          </div>
          <button type="button" onClick={onClose} aria-label="Close quick add" className="-mr-2 -mt-2 grid size-11 shrink-0 place-items-center rounded-full hover:bg-blush">
            <X size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
          <VariantPicker p={p} variant={v} onChange={setV} />
          <StockNote v={v} />
          <Installments amount={v.price} />
        </div>
        <div className="border-t border-line p-5">
          <button type="button" className="btn btn-primary w-full" disabled={!v.available} onClick={() => add(p, v, 1)}>
            {v.available ? `Add to bag · ${money(v.price)}` : "Sold out"}
          </button>
          <Link to={`/products/${p.handle}`} onClick={onClose} className="mt-3 block text-center text-sm underline underline-offset-4">
            View full details
          </Link>
          <p className="sr-only" aria-live="polite">
            Selected: {describeVariant(p, v)}
          </p>
        </div>
      </div>
    </div>
  );
}
