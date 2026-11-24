import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Expand, Plus, Sparkles, Star, X } from "lucide-react";
import {
  activeCampaign,
  campaignPercent,
  describeVariant,
  firstAvailable,
  getProduct,
  groupsOf,
  imageFor,
  isHair,
  LINE_INFO,
  noteFor,
  products,
  specsFor,
  type Product,
  type Variant,
} from "@/data/products";
import { care, faqs, reviews as siteReviews } from "@/data/content";
import { ALT, IMG } from "@/data/images";
import { settings } from "@/theme/settings";
import { useStore } from "@/lib/store";
import { formatDate, load, money, save, useNow, useSeo } from "@/lib/utils";
import { cn } from "@/utils/cn";
import { Accordion, Crumbs, Img, Qty, Stars } from "@/components/ui";
import { Badges, ProductCarousel, StockNote, VariantPicker } from "@/components/ProductCard";
import { BundleTiers, Countdown, DeliveryEstimate, Installments, NotifyMe, ShippingHint, TrustBadges } from "@/components/Boosters";
import { PaymentRow } from "@/components/BrandIcons";
import { crossSell } from "@/components/CartDrawer";
import { NotFound } from "@/pages/Content";

export default function ProductPage() {
  const { handle } = useParams();
  const p = getProduct(handle);
  if (!p) return <NotFound />;
  return <ProductView key={p.handle} p={p} />;
}

/* ── Gallery: swipe on mobile · thumbnails + hover zoom on desktop ───────── */
function Gallery({ p, idx, setIdx }: { p: Product; idx: number; setIdx: (i: number) => void }) {
  const scroller = useRef<HTMLDivElement>(null);
  const programmatic = useRef(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const n = p.images.length;
  const go = (d: number) => setIdx((idx + d + n) % n);

  useEffect(() => {
    const el = scroller.current;
    if (!el || !el.clientWidth) return;
    const target = idx * el.clientWidth;
    if (Math.abs(el.scrollLeft - target) > 4) {
      programmatic.current = true;
      el.scrollTo({ left: target, behavior: "smooth" });
      const t = setTimeout(() => (programmatic.current = false), 600);
      return () => clearTimeout(t);
    }
  }, [idx]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setIdx((idx + 1) % n);
      if (e.key === "ArrowLeft") setIdx((idx - 1 + n) % n);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox, idx, n, setIdx]);

  const onScroll = () => {
    const el = scroller.current;
    if (!el || programmatic.current) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== idx) setIdx(i);
  };
  const navBtn = "grid size-11 place-items-center rounded-full bg-white/90 shadow-md backdrop-blur transition-colors hover:bg-black hover:text-white";

  return (
    <div>
      <div className="relative -mx-5 md:mx-0 md:overflow-hidden md:rounded-3xl lg:hidden">
        <div ref={scroller} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto" aria-label="Product images" role="group">
          {p.images.map((k, i) => (
            <div key={k} className="aspect-[4/5] w-full shrink-0 snap-center bg-blush">
              <Img k={k} eager={i === 0} className="size-full object-cover" />
            </div>
          ))}
        </div>
        <Badges p={p} className="pointer-events-none absolute left-4 top-4" />
        <button type="button" onClick={() => setLightbox(true)} aria-label="View image full screen" className={cn(navBtn, "absolute right-4 top-4")}>
          <Expand size={17} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {p.images.map((k, i) => (
            <button key={k} type="button" onClick={() => setIdx(i)} aria-label={`Show image ${i + 1} of ${n}`} aria-current={i === idx} className="grid size-6 place-items-center">
              <span className={cn("h-1.5 rounded-full transition-all duration-300", i === idx ? "w-5 bg-black" : "w-1.5 bg-black/30")} />
            </button>
          ))}
        </div>
      </div>

      <div className="hidden gap-4 lg:grid lg:grid-cols-[5rem_1fr]">
        <ul className="flex max-h-[44rem] flex-col gap-3 overflow-y-auto no-scrollbar">
          {p.images.map((k, i) => (
            <li key={k}>
              <button
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Show image ${i + 1} of ${n}`}
                aria-current={i === idx}
                className={cn("block aspect-[4/5] w-full overflow-hidden rounded-xl border bg-blush transition-colors", i === idx ? "border-black" : "border-transparent hover:border-black/30")}
              >
                <Img k={k} alt="" className="size-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
        <div className="relative">
          <button
            type="button"
            onClick={() => setLightbox(true)}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
            }}
            onMouseLeave={() => setZoom(null)}
            aria-label="Open image full screen"
            className="block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-3xl bg-blush"
          >
            <img
              key={p.images[idx]}
              src={IMG[p.images[idx]]}
              alt={ALT[p.images[idx]]}
              className="size-full animate-fade object-cover transition-transform duration-300 ease-out"
              style={zoom ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            />
          </button>
          <Badges p={p} className="pointer-events-none absolute left-4 top-4" />
          {n > 1 && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button type="button" className={navBtn} onClick={() => go(-1)} aria-label="Previous image">
                <ChevronLeft size={18} strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button type="button" className={navBtn} onClick={() => go(1)} aria-label="Next image">
                <ChevronRight size={18} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>

      {lightbox && (
        <div role="dialog" aria-modal="true" aria-label="Image viewer" className="on-dark fixed inset-0 z-[60] flex animate-fade items-center justify-center bg-black/95 p-4">
          <img src={IMG[p.images[idx]]} alt={ALT[p.images[idx]]} className="max-h-full max-w-full rounded-xl object-contain" />
          <button type="button" autoFocus onClick={() => setLightbox(false)} aria-label="Close image viewer" className="absolute right-4 top-4 grid size-12 place-items-center rounded-full bg-white text-black">
            <X size={20} aria-hidden="true" />
          </button>
          {n > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white text-black">
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next image" className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white text-black">
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Complete the install (frequently bought together) ───────────────────── */
function CompleteTheInstall({ p, v }: { p: Product; v: Variant }) {
  const { addMany } = useStore();
  const addons = crossSell([{ key: v.id, product: p, variant: v, qty: 1, image: p.images[0] }], 3);
  const [checked, setChecked] = useState<Record<string, boolean>>(() => Object.fromEntries(addons.map((a) => [a.handle, true])));
  if (!addons.length) return null;
  const picked = addons.filter((a) => checked[a.handle]);
  const total = v.price + picked.reduce((n, a) => n + firstAvailable(a).price, 0);
  return (
    <section className="section border-t border-line" aria-labelledby="fbt-heading">
      <div className="wrap grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-center lg:gap-14">
        <div className="min-w-0">
          <p className="t-eyebrow mb-3 text-muted">Frequently bought together</p>
          <h2 id="fbt-heading" className="t-h2">
            Complete the install
          </h2>
          <ul className="mt-8 flex items-center gap-2 overflow-x-auto no-scrollbar sm:gap-4">
            {[p, ...addons].map((x, i) => (
              <li key={x.handle} className="flex shrink-0 items-center gap-2 sm:gap-4">
                {i > 0 && <Plus size={18} className="text-muted" aria-hidden="true" />}
                <Link to={`/products/${x.handle}`} className={cn("block size-24 overflow-hidden rounded-2xl bg-blush transition-opacity sm:size-32", i > 0 && !checked[x.handle] && "opacity-35")}>
                  <Img k={i === 0 ? imageFor(p, v) : x.images[0]} alt={x.title} className="size-full object-cover" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-blush-soft p-6">
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-[15px]">
              <input type="checkbox" checked disabled className="mt-1 size-5 accent-black" aria-label={`${p.title} (this item)`} />
              <span className="flex-1">
                <strong className="font-medium">This item:</strong> {p.title}
              </span>
              <span>{money(v.price)}</span>
            </li>
            {addons.map((a) => (
              <li key={a.handle}>
                <label className="flex cursor-pointer items-start gap-3 text-[15px]">
                  <input type="checkbox" checked={!!checked[a.handle]} onChange={() => setChecked((c) => ({ ...c, [a.handle]: !c[a.handle] }))} className="mt-1 size-5 accent-black" />
                  <span className="flex-1">{a.title}</span>
                  <span>{money(firstAvailable(a).price)}</span>
                </label>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex justify-between border-t border-black/10 pt-4 text-lg font-medium">
            <span>Total</span>
            <span>{money(total)}</span>
          </p>
          <button type="button" disabled={!v.available} onClick={() => addMany([{ p, v, qty: 1 }, ...picked.map((a) => ({ p: a, v: firstAvailable(a), qty: 1 }))])} className="btn btn-primary mt-4 w-full">
            Add {picked.length + 1} to bag
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── Product view ────────────────────────────────────────────────────────── */
function ProductView({ p }: { p: Product }) {
  const { add, pushRecent, recent } = useStore();
  const navigate = useNavigate();
  const [v, setV] = useState<Variant>(() => firstAvailable(p));
  const [qty, setQty] = useState(1);
  const [idx, setIdx] = useState(0);
  const [acc, setAcc] = useState(0);
  const [sticky, setSticky] = useState(false);
  const atc = useRef<HTMLDivElement>(null);
  const accRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLElement>(null);
  const now = useNow(60000);
  const camp = campaignPercent(p, now);
  const active = activeCampaign(now);
  const hair = isHair(p);
  const saving = v.compareAt > v.price ? v.compareAt - v.price : 0;
  const note = noteFor(p, v);
  const showTimer = !!active && (saving > 0 || !!camp);

  useSeo(p.title, p.description.slice(0, 155));
  useEffect(() => pushRecent(p.handle), [p.handle, pushRecent]);

  useEffect(() => {
    const el = atc.current;
    if (!el) return;
    const footer = document.querySelector("footer");
    let atcSeen = true;
    let footerSeen = false;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === el) atcSeen = e.isIntersecting;
        else footerSeen = e.isIntersecting;
      }
      setSticky(!atcSeen && !footerSeen);
    });
    io.observe(el);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, []);

  const change = (next: Variant) => {
    if (p.line === "seamless") {
      const i = p.images.indexOf(imageFor(p, next));
      if (i >= 0) setIdx(i);
    }
    setV(next);
    setQty(1);
  };

  const related = [
    ...products.filter((x) => x.line === p.line && x.handle !== p.handle),
    ...products.filter((x) => x.line !== p.line && x.bestSeller && groupsOf(x).some((g) => groupsOf(p).includes(g))),
  ].slice(0, 8);
  const recents = recent.filter((h) => h !== p.handle).flatMap((h) => getProduct(h) ?? []);
  const packFaq = faqs[0].items;

  const openGuide = () => {
    setAcc(2);
    accRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const accordion = [
    {
      title: "Description",
      content: (
        <div className="space-y-3">
          {note && (
            <p>
              <strong className="font-medium text-black">{p.shade ?? v.options[0]}:</strong> {note}
            </p>
          )}
          <p>{p.description}</p>
        </div>
      ),
    },
    ...(specsFor(p).length
      ? [
          {
            title: "Specifications",
            content: (
              <dl className="divide-y divide-line">
                {specsFor(p).map(([k, val]) => (
                  <div key={k} className="flex gap-4 py-2.5">
                    <dt className="w-28 shrink-0 text-black">{k}</dt>
                    <dd>{val}</dd>
                  </div>
                ))}
              </dl>
            ),
          },
        ]
      : []),
    ...(hair
      ? [
          {
            title: "Pack & Length Guide",
            content: (
              <div className="space-y-4">
                {packFaq.slice(0, 3).map((f) => (
                  <div key={f.q}>
                    <p className="font-medium text-black">{f.q}</p>
                    <p>{f.a}</p>
                  </div>
                ))}
              </div>
            ),
          },
          {
            title: "Hair Care",
            content: (
              <div className="space-y-2.5">
                {care[0].items.concat(care[2].items.slice(3)).map((c) => (
                  <p key={c.h}>
                    <span className="font-medium text-black">{c.h}.</span> {c.p}
                  </p>
                ))}
                <Link to="/pages/hair-extension-home-care" className="inline-block pt-1 text-black underline underline-offset-4">
                  Read the full home care guide
                </Link>
              </div>
            ),
          },
        ]
      : []),
    {
      title: "Shipping & Returns",
      content: (
        <div className="space-y-3">
          <p>Worldwide shipping — rates available at checkout. Free U.S. shipping on orders over {money(settings.offers.freeShipping.threshold)}.</p>
          <p>
            All sales are final — we don’t offer refunds or exchanges once a purchase is complete, so please review your order carefully.{" "}
            <Link to="/policies/refund-policy" className="text-black underline underline-offset-4">
              Refund Policy
            </Link>
          </p>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="wrap pt-4 md:pt-6">
        <Crumbs items={[{ label: "Home", to: "/" }, { label: LINE_INFO[p.line].label, to: `/collections/${LINE_INFO[p.line].collection}` }, { label: p.title }]} />
      </div>

      <div className="wrap grid gap-7 pb-14 pt-4 md:grid-cols-2 md:gap-8 lg:gap-14 lg:pb-24 lg:pt-5">
        <div className="min-w-0 md:sticky md:top-28 md:self-start lg:static">
          <Gallery p={p} idx={idx} setIdx={setIdx} />
        </div>

        <div className="min-w-0 lg:sticky lg:top-32 lg:self-start">
          <p className="t-eyebrow text-muted">{LINE_INFO[p.line].eyebrow}</p>
          <h1 className="mt-2 text-[2rem] leading-[1.05] md:text-[2.2rem] lg:text-[2.6rem]">{p.title}</h1>

          {p.rating > 0 && (
            <button type="button" onClick={() => reviewsRef.current?.scrollIntoView({ behavior: "smooth" })} className="mt-3 flex items-center gap-2 text-[15px]">
              <Stars value={p.rating} size={15} />
              <span className="underline underline-offset-4">
                {p.rating.toFixed(1)} · {p.reviewCount} reviews
              </span>
            </button>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="flex items-baseline gap-2.5">
              <span className="sr-only">{saving > 0 ? "Sale price" : "Price"}</span>
              <span className="text-[1.75rem] font-medium leading-none">{money(v.price)}</span>
              {saving > 0 && (
                <>
                  <span className="sr-only">Regular price</span>
                  <s className="text-lg text-muted">{money(v.compareAt)}</s>
                </>
              )}
            </p>
            {saving > 0 && <span className="rounded-full bg-black px-3 py-1.5 text-[13px] font-medium leading-none text-white">Save {money(saving)}</span>}
          </div>
          {camp && (
            <p className="mt-3 inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-2xl bg-blush px-4 py-2 text-[15px]">
              <Sparkles size={15} aria-hidden="true" />
              <span>
                {camp.campaign.label} price: <strong className="font-medium">{money(Math.round(v.price * (1 - camp.percent / 100) * 100) / 100)}</strong>
              </span>
              <span className="text-muted">−{camp.percent}% applied in bag</span>
            </p>
          )}
          <Installments amount={v.price} className="mt-3" />

          {showTimer && active && (
            <div className="on-dark mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-black px-4 py-3 text-white">
              <p className="text-sm">
                <span className="t-eyebrow text-blush">{active.label}</span>
                <span className="block text-white/80">pricing ends in</span>
              </p>
              <Countdown to={Date.parse(active.ends)} size="sm" label={`${active.label} pricing ends in`} />
            </div>
          )}

          <div className="mt-6 space-y-6 border-t border-line pt-6">
            <VariantPicker p={p} variant={v} onChange={change} onGuide={hair ? openGuide : undefined} />
            {note && p.line === "seamless" && <p className="-mt-2 text-[15px] italic text-muted">“{note}”</p>}
            {hair && v.available && <BundleTiers qty={qty} setQty={setQty} unit={v.price} max={v.stock} />}
          </div>

          <div className="mt-6" aria-live="polite">
            <StockNote v={v} />
          </div>

          {v.available ? (
            <>
              <div ref={atc} className="mt-4 flex gap-3">
                <Qty value={qty} max={Math.max(1, v.stock)} onChange={setQty} />
                <button type="button" className="btn btn-primary min-w-0 flex-1 !px-5" onClick={() => add(p, v, qty)}>
                  Add to bag<span className="hidden sm:inline"> · {money(v.price * qty)}</span>
                </button>
              </div>
              <button
                type="button"
                className="btn btn-outline mt-3 w-full"
                onClick={() => {
                  add(p, v, qty, false);
                  navigate("/checkout");
                }}
              >
                Buy it now
              </button>
            </>
          ) : (
            <div ref={atc} className="mt-4">
              <NotifyMe title={`${p.title} — ${describeVariant(p, v)}`} />
            </div>
          )}

          <div className="mt-5 space-y-4">
            {v.available && <ShippingHint add={v.price * qty} />}
            {p.line !== "course" && <DeliveryEstimate />}
          </div>

          <TrustBadges className="mt-6" />
          <PaymentRow names={settings.footer.payments.slice(0, 8)} className="mt-5" />

          <div ref={accRef} className="mt-8">
            <Accordion items={accordion} open={acc} onChange={setAcc} />
          </div>
        </div>
      </div>

      {hair && <CompleteTheInstall p={p} v={v} />}

      {p.rating > 0 && <ReviewsSection p={p} innerRef={reviewsRef} />}

      <section className="section overflow-hidden">
        <div className="wrap">
          <h2 className="t-h2 mb-8">You may also like</h2>
          <ProductCarousel items={related} label="Related products" />
        </div>
      </section>

      {recents.length > 0 && (
        <section className="overflow-hidden border-t border-line py-14 md:py-20">
          <div className="wrap">
            <h2 className="t-h2 mb-8">Recently viewed</h2>
            <ProductCarousel items={recents} label="Recently viewed products" />
          </div>
        </section>
      )}

      <div
        inert={!sticky}
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 pt-3 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.3)] backdrop-blur transition-transform duration-300 ease-luxe lg:hidden",
          "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
          sticky ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-blush">
            <Img k={imageFor(p, v)} alt="" className="size-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-medium leading-tight">{p.title}</p>
            <p className="truncate text-[13px] text-muted">{describeVariant(p, v) || LINE_INFO[p.line].label}</p>
          </div>
          <button type="button" className="btn btn-primary btn-sm shrink-0 !px-5" disabled={!v.available} onClick={() => add(p, v, qty)}>
            {v.available ? `Add · ${money(v.price * qty)}` : "Sold out"}
          </button>
        </div>
      </div>
    </>
  );
}

/* ── Reviews (sample + locally submitted, with photo upload) ─────────────── */
interface LocalReview {
  name: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  photo?: string;
}

const GENERIC: Omit<LocalReview, "photo">[] = [
  { name: "Brooke H.", rating: 5, title: "Softest hair I’ve worn", text: "Full from the weft to the ends and it blended perfectly with my lived-in color. My stylist was impressed.", date: "2026-11-08" },
  { name: "Alyssa P.", rating: 5, title: "Worth every penny", text: "Zero shedding after the first wash and it holds a curl beautifully. Already planning my next install.", date: "2026-10-21" },
  { name: "Renee D.", rating: 4, title: "Beautiful color", text: "Gorgeous, natural shine. I went with one length longer than usual and love the movement.", date: "2026-10-04" },
];

function ReviewsSection({ p, innerRef }: { p: Product; innerRef: React.RefObject<HTMLElement | null> }) {
  const key = `rep_reviews_${p.handle}`;
  const [mine, setMine] = useState<LocalReview[]>(() => load(key, []));
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", title: "", text: "", rating: 5 });
  const [photo, setPhoto] = useState<string>();
  const [error, setError] = useState("");
  const own = siteReviews.filter((r) => r.product === p.title);
  const dist = p.rating >= 4.9 ? [90, 8, 1, 1, 0] : p.rating >= 4.8 ? [84, 12, 3, 1, 0] : [78, 16, 4, 1, 1];

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) {
      setError("Please add your name and a few words about the hair.");
      return;
    }
    const next = [{ ...form, date: new Date().toISOString().slice(0, 10), photo }, ...mine];
    setMine(next);
    save(key, next.map((r) => ({ ...r, photo: r.photo && r.photo.length < 400_000 ? r.photo : undefined })));
    setForm({ name: "", title: "", text: "", rating: 5 });
    setPhoto(undefined);
    setError("");
    setOpen(false);
  };

  return (
    <section ref={innerRef} id="reviews" className="section scroll-mt-24 bg-blush-soft" aria-labelledby="pdp-reviews">
      <div className="wrap grid gap-10 lg:grid-cols-[20rem_1fr] lg:gap-16">
        <div>
          <h2 id="pdp-reviews" className="t-h2">
            Reviews
          </h2>
          <div className="mt-5 flex items-center gap-4">
            <span className="font-display text-6xl leading-none">{p.rating.toFixed(1)}</span>
            <div>
              <Stars value={p.rating} size={18} />
              <p className="mt-1 text-[15px] text-muted">Based on {p.reviewCount} reviews</p>
            </div>
          </div>
          <ul className="mt-6 space-y-2" aria-label="Rating breakdown">
            {dist.map((pct, i) => (
              <li key={i} className="flex items-center gap-3 text-[15px]">
                <span className="w-8 tabular-nums">{5 - i} ★</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-blush">
                  <span className="block h-full rounded-full bg-black" style={{ width: `${pct}%` }} />
                </span>
                <span className="w-10 text-right tabular-nums text-muted">{pct}%</span>
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn-outline mt-7 w-full" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            Write a review
          </button>
        </div>
        <div>
          {open && (
            <form onSubmit={submit} noValidate className="mb-8 animate-fade-up rounded-3xl bg-white p-6 md:p-8">
              <h3 className="t-h3">Share your experience</h3>
              <fieldset className="mt-5">
                <legend className="mb-2 text-[15px] font-medium">Your rating</legend>
                <div className="flex gap-1" role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" role="radio" aria-checked={form.rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => setForm({ ...form, rating: n })} className="grid size-11 place-items-center">
                      <Star size={26} strokeWidth={1.25} fill={n <= form.rating ? "#000" : "none"} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="rv-name" className="mb-1.5 block text-[15px] font-medium">
                    Name
                  </label>
                  <input id="rv-name" className="field" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="rv-title" className="mb-1.5 block text-[15px] font-medium">
                    Headline
                  </label>
                  <input id="rv-title" className="field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="rv-text" className="mb-1.5 block text-[15px] font-medium">
                  Review
                </label>
                <textarea id="rv-text" className="field" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <label htmlFor="rv-photo" className="btn btn-outline btn-sm">
                  {photo ? "Change photo" : "Add a photo"}
                </label>
                <input id="rv-photo" type="file" accept="image/*" onChange={onFile} className="sr-only" />
                {photo && <img src={photo} alt="Your uploaded photo preview" className="size-16 rounded-xl object-cover" />}
              </div>
              {error && (
                <p role="alert" className="mt-4 text-[15px] font-medium">
                  {error}
                </p>
              )}
              <button type="submit" className="btn btn-primary mt-6">
                Submit review
              </button>
            </form>
          )}
          <ul className="divide-y divide-line border-y border-line">
            {mine.map((r, i) => (
              <ReviewRow key={`m${i}`} r={r} tag="Your review" />
            ))}
            {own.map((r) => (
              <ReviewRow key={r.name} r={{ ...r, photo: IMG[r.photo] }} photoAlt={ALT[r.photo]} />
            ))}
            {GENERIC.slice(0, own.length ? 2 : 3).map((r) => (
              <ReviewRow key={r.name} r={r} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ReviewRow({ r, tag, photoAlt }: { r: LocalReview; tag?: string; photoAlt?: string }) {
  return (
    <li className="flex gap-5 py-7">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Stars value={r.rating} size={14} />
          <span className="text-sm text-muted">Verified buyer</span>
          {tag && <span className="rounded-full bg-blush px-2.5 py-1 text-[11px] font-medium uppercase leading-none tracking-wider">{tag}</span>}
        </div>
        {r.title && <p className="mt-2.5 font-display text-xl">{r.title}</p>}
        <p className="mt-1.5 text-muted">{r.text}</p>
        <p className="mt-3 text-sm">
          <span className="font-medium">{r.name}</span>
          <span className="text-muted">
            {" "}
            · <time dateTime={r.date}>{formatDate(r.date)}</time>
          </span>
        </p>
      </div>
      {r.photo && <img src={r.photo} alt={photoAlt ?? `Photo shared by ${r.name}`} loading="lazy" className="size-24 shrink-0 rounded-2xl object-cover object-top md:size-32" />}
    </li>
  );
}
