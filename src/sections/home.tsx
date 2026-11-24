// Homepage sections, each driven by theme/settings.ts (content + visibility toggle) — one per
// editable Symmetry section. Copy comes from reputationextensions.com unless noted.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { settings } from "@/theme/settings";
import { ALT, IMG, type ImgKey } from "@/data/images";
import { activeCampaign, getByTitle, maxPercent, onSale, products, productsIn } from "@/data/products";
import { confidence, founders, pillars, posts, reviews, type Post } from "@/data/content";
import { formatDate, useNow } from "@/lib/utils";
import { cn } from "@/utils/cn";
import { Drawer, EmailForm, Img, SectionHead, Stars } from "@/components/ui";
import { ProductCarousel } from "@/components/ProductCard";
import { BeforeAfter, Countdown, Marquee } from "@/components/Boosters";
import { SocialIcon } from "@/components/BrandIcons";

const H = settings.home;

/* ── Hero carousel ───────────────────────────────────────────────────────── */
interface Slide {
  id: string;
  layout: "full" | "split";
  image: ImgKey;
  mobile: ImgKey;
  position?: string;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  ctas: { label: string; to: string }[];
  countdown?: number;
  chips?: { label: string; to: string }[];
  signature?: string;
}

const DURATION = 7000;

export function HeroSlider() {
  const now = useNow(60000);
  const c = activeCampaign(now);
  const fallback = settings.campaigns[settings.campaigns.length - 1].hero;
  const slides: Slide[] = [
    {
      id: "campaign",
      layout: "full",
      image: "heroA",
      mobile: "heroAMobile",
      ...(c ? c.hero : fallback),
      countdown: c ? Date.parse(c.ends) : undefined,
      ctas: c
        ? [
            { label: c.cta.label, to: c.cta.to },
            { label: "Shop Hair Collections", to: "/collections/all" },
          ]
        : [
            { label: "Shop Hair Collections", to: "/collections/all" },
            { label: "Best Sellers", to: "/collections/best-sellers" },
          ],
    },
    {
      id: "holiday",
      layout: "split",
      image: "heroB",
      mobile: "heroBMobile",
      position: "md:object-[68%_center]",
      eyebrow: "The Holiday Shop",
      title: "Who are you",
      accent: "gifting this season?",
      body: "Curated gifts for every hair girl on your list — from travel-ready clip-ins to little luxuries.",
      chips: [
        { label: "The Jetsetters", to: "/collections/for-the-jetsetter" },
        { label: "The It Girls", to: "/collections/for-the-it-girls" },
        { label: "The Artists", to: "/collections/for-the-artists" },
        { label: "Little Luxuries", to: "/collections/little-luxuries" },
      ],
      ctas: [{ label: "Shop all Holiday", to: "/pages/holiday-shop" }],
    },
    {
      id: "founders",
      layout: "split",
      image: "founders",
      mobile: "founders",
      position: "md:object-[50%_30%]",
      eyebrow: "Created behind the chair",
      title: "Luxury hair,",
      accent: "built by stylists.",
      body: `${founders.story[0]} ${founders.tagline}`,
      signature: founders.signature,
      ctas: [{ label: "Meet the Founders", to: "/pages/about-us#founders" }],
    },
  ];
  const n = slides.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced] = useState(() => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false));
  const touch = useRef<number | null>(null);

  useEffect(() => {
    if (paused || reduced) return;
    const t = setTimeout(() => setI((v) => (v + 1) % n), DURATION);
    return () => clearTimeout(t);
  }, [i, paused, reduced, n]);

  const go = (d: number) => setI((v) => (v + d + n) % n);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative overflow-hidden bg-blush"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
    >
      <div className="grid">
        {slides.map((s, k) => (
          <div
            key={s.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${k + 1} of ${n}`}
            inert={k !== i}
            className={cn("[grid-area:1/1] transition-opacity duration-700 ease-luxe", k === i ? "z-10 opacity-100" : "z-0 opacity-0")}
          >
            <SlideView s={s} active={k === i} first={k === 0} />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-5 z-20">
        <div className="wrap flex items-center gap-2">
          {slides.map((s, k) => (
            <button key={s.id} type="button" aria-label={`Go to slide ${k + 1}`} aria-current={k === i} onClick={() => setI(k)} className="group flex h-6 w-14 items-center">
              <span className="block h-[3px] w-full overflow-hidden rounded-full bg-black/15">
                <span
                  key={`${i}-${paused}`}
                  className={cn("block h-full bg-black", k === i ? (paused || reduced ? "w-full" : "animate-progress") : "w-0")}
                  style={k === i && !paused && !reduced ? { animationDuration: `${DURATION}ms` } : undefined}
                />
              </span>
            </button>
          ))}
          <div className="ml-auto hidden gap-2 md:flex">
            <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="grid size-11 place-items-center rounded-full border border-black/30 bg-white/70 backdrop-blur transition-colors hover:bg-black hover:text-white">
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next slide" className="grid size-11 place-items-center rounded-full border border-black/30 bg-white/70 backdrop-blur transition-colors hover:bg-black hover:text-white">
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SlideView({ s, active, first }: { s: Slide; active: boolean; first: boolean }) {
  const Heading = first ? "h1" : "h2";
  const text = (
    <div key={active ? "on" : "off"} className={active ? "animate-fade-up [animation-delay:150ms]" : "opacity-0"}>
      <p className="t-eyebrow">{s.eyebrow}</p>
      <Heading className="mt-4 text-[clamp(2.6rem,11vw,3.6rem)] leading-[0.98] tracking-[-0.02em] md:text-[clamp(2.8rem,5vw,5.2rem)]">
        {s.title} <em className="block font-normal">{s.accent}</em>
      </Heading>
      <p className="t-lead mt-5 max-w-md">{s.body}</p>
      {s.countdown && (
        <div className="mt-6">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted">Sale ends in</p>
          <Countdown to={s.countdown} tone="light" size="md" label="Sale ends in" />
        </div>
      )}
      {s.chips && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {s.chips.map((c) => (
            <li key={c.label}>
              <Link to={c.to} className="inline-flex h-10 items-center rounded-full border border-black/70 bg-white/60 px-4 text-sm backdrop-blur transition-colors hover:bg-black hover:text-white">
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {s.signature && <p className="mt-5 font-display text-2xl italic">{s.signature}</p>}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        {s.ctas.map((c, k) => (
          <Link key={c.label} to={c.to} className={cn("btn w-full sm:w-auto", k === 0 ? "btn-primary" : "btn-outline")}>
            {c.label}
            {k === 0 && <ArrowRight size={16} aria-hidden="true" />}
          </Link>
        ))}
      </div>
    </div>
  );

  if (s.layout === "full") {
    return (
      <div className="relative md:h-[clamp(34rem,47vw,47rem)]">
        <div className="relative overflow-hidden md:absolute md:inset-0">
          <picture>
            <source media="(min-width: 768px)" srcSet={IMG[s.image]} />
            <img
              src={IMG[s.mobile]}
              alt={ALT[s.image]}
              fetchPriority={first ? "high" : "auto"}
              decoding="async"
              className={cn("aspect-[5/6] w-full object-cover object-top md:aspect-auto md:h-full md:object-[85%_8%]", active && "animate-kenburns")}
            />
          </picture>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-blush to-transparent md:hidden" aria-hidden="true" />
          <div className="absolute inset-y-0 left-0 hidden w-3/5 bg-gradient-to-r from-blush/80 via-blush/40 to-transparent md:block" aria-hidden="true" />
        </div>
        <div className="wrap relative -mt-20 pb-20 md:mt-0 md:flex md:h-full md:items-center md:pb-0">
          <div className="md:max-w-[35rem]">{text}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="grid md:h-[clamp(34rem,47vw,47rem)] md:grid-cols-2">
      <div className="relative overflow-hidden md:order-2">
        <img src={IMG[s.mobile]} alt={ALT[s.image]} loading="lazy" decoding="async" className="aspect-square w-full object-cover md:hidden" />
        <img src={IMG[s.image]} alt="" aria-hidden="true" loading="lazy" decoding="async" className={cn("hidden size-full object-cover md:block", s.position, active && "animate-kenburns")} />
      </div>
      <div className="flex items-center px-5 pb-20 pt-8 md:px-12 md:py-12 lg:px-20">
        <div className="max-w-[35rem]">{text}</div>
      </div>
    </div>
  );
}

/* ── Marquee + press ─────────────────────────────────────────────────────── */
export function BrandMarquee() {
  return <Marquee items={H.marquee} />;
}

const PRESS_STYLE: Record<string, string> = {
  BET: "font-sans text-[1.6rem] font-semibold tracking-[0.28em]",
  Cosmopolitan: "font-sans text-[1.05rem] font-medium uppercase tracking-[0.2em]",
  CNN: "font-sans text-[1.7rem] font-semibold tracking-tight",
  Seventeen: "font-sans text-[1.45rem] font-semibold lowercase tracking-tight",
  Allure: "font-display text-[1.9rem] lowercase italic",
};

export function PressStrip() {
  const p = H.press;
  if (!p.visible) return null;
  return (
    <section aria-label={p.heading} className="border-b border-line py-7">
      <div className="wrap md:flex md:items-center md:gap-12">
        <p className="t-eyebrow mb-4 shrink-0 text-center text-muted md:mb-0">{p.heading}</p>
        <ul className="no-scrollbar -mx-5 flex snap-x items-center gap-10 overflow-x-auto px-5 md:mx-0 md:flex-1 md:justify-between md:px-0">
          {p.logos.map((name) => (
            <li key={name} className={cn("shrink-0 snap-center leading-none text-[#6a6366]", PRESS_STYLE[name] ?? "font-display text-2xl")}>
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Find your perfect match ─────────────────────────────────────────────── */
export function Categories() {
  const c = H.categories;
  if (!c.visible) return null;
  return (
    <section className="section" aria-labelledby="cat-heading">
      <div className="wrap">
        <div className="mb-8 text-center md:mb-12">
          <p className="t-eyebrow mb-3 text-muted">{c.eyebrow}</p>
          <h2 id="cat-heading" className="t-h2">
            {c.heading}
          </h2>
        </div>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-6 lg:grid-cols-4">
          {c.tiles.map((t) => (
            <li key={t.title}>
              <Link to={t.to} className="group block text-center">
                <div className="relative">
                  <div className="aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-blush md:rounded-[1.75rem]">
                    <Img k={t.image} className="size-full object-cover transition-transform duration-[900ms] ease-luxe group-hover:scale-105" />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 size-[4.5rem] -translate-x-1/2 overflow-hidden rounded-full border-[3px] border-white bg-blush shadow-[0_6px_18px_rgba(0,0,0,0.14)] transition-transform duration-500 ease-luxe group-hover:-translate-y-1 md:-bottom-11 md:size-[6.5rem] md:border-4">
                    <Img k={t.inset} alt="" className="size-full scale-110 object-cover" />
                  </div>
                </div>
                <h3 className="mt-11 text-[1.25rem] md:mt-16 md:text-[1.65rem]">{t.title}</h3>
                <span className="t-eyebrow link-line mt-2 inline-block">Shop now</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Campaign deals with countdown ───────────────────────────────────────── */
export function Deals() {
  const now = useNow(60000);
  const c = activeCampaign(now);
  const [tab, setTab] = useState(0);
  if (!H.deals.visible) return null;
  const tape = productsIn("tape-in-extensions");
  const clip = products.filter((p) => p.line === "laced" || p.line === "seamless");
  const tabs =
    c && c.id === "black-friday"
      ? [
          { label: `Tape Wefts · Save ${Math.max(...tape.map(maxPercent))}%`, items: tape },
          { label: "15% off Clip In’s", items: clip },
          { label: "All Black Friday", items: productsIn("black-friday") },
        ]
      : [{ label: "On sale now", items: products.filter(onSale) }];
  const t = tabs[Math.min(tab, tabs.length - 1)];
  return (
    <section className="section overflow-hidden bg-blush-soft" aria-labelledby="deals-heading">
      <div className="wrap">
        <div className="mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="t-eyebrow mb-3 text-muted">{c ? `${c.label} deals` : "Deals"}</p>
            <h2 id="deals-heading" className="t-h2">
              {c ? H.deals.heading : "On sale now"}
            </h2>
          </div>
          {c && (
            <div className="flex flex-col items-start gap-2 md:items-end">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">Ends in</p>
              <Countdown to={Date.parse(c.ends)} tone="light" size="md" label={`${c.label} ends in`} />
            </div>
          )}
        </div>
        <div className="no-scrollbar -mx-5 mb-8 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0" role="group" aria-label="Filter deals">
          {tabs.map((x, k) => (
            <button key={x.label} type="button" aria-pressed={k === tab} onClick={() => setTab(k)} className={cn("h-11 shrink-0 rounded-full border px-5 text-sm font-medium transition-colors", k === tab ? "border-black bg-black text-white" : "border-black/20 bg-white hover:border-black")}>
              {x.label}
            </button>
          ))}
        </div>
        <ProductCarousel key={tab} items={t.items} label={t.label} />
        <div className="mt-10 text-center">
          <Link to={c ? c.cta.to : "/collections/all"} className="btn btn-primary">
            {c ? c.cta.label : "Shop all"} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── VIP text club ───────────────────────────────────────────────────────── */
export function VipOffer() {
  const v = H.vip;
  if (!v.visible) return null;
  return (
    <section className="on-dark bg-black text-white" aria-labelledby="vip-heading">
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[36rem]">
          <Img k={v.image} className="absolute inset-0 size-full object-cover object-[65%_center]" />
        </div>
        <div className="flex flex-col justify-center px-5 py-14 md:px-12 md:py-20 lg:px-20">
          <p className="t-eyebrow text-blush">{v.eyebrow}</p>
          <h2 id="vip-heading" className="mt-4 text-[2.3rem] leading-[1.02] md:text-[3.4rem]">
            {v.heading}
          </h2>
          <p className="mt-5 max-w-md text-white/80">{v.body}</p>
          <div className="mt-7 max-w-md">
            <EmailForm source="vip-text-club" cta={v.cta} dark withPhone />
          </div>
          <p className="mt-4 max-w-md text-xs leading-relaxed text-white/60">
            {v.privacy}{" "}
            <Link to="/policies/privacy-policy" className="underline underline-offset-2">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Best sellers ────────────────────────────────────────────────────────── */
export function BestSellers() {
  const b = H.bestSellers;
  if (!b.visible) return null;
  const items = products.filter((p) => p.bestSeller).sort((a, z) => a.salesRank - z.salesRank);
  return (
    <section className="section overflow-hidden">
      <div className="wrap">
        <SectionHead
          align="left"
          eyebrow={b.eyebrow}
          heading={b.heading}
          action={
            <Link to={b.cta.to} className="t-eyebrow link-line mb-1 shrink-0">
              {b.cta.label}
            </Link>
          }
        />
        <ProductCarousel items={items} label="Best-selling products" />
      </div>
    </section>
  );
}

/* ── Transformations (before / after) ────────────────────────────────────── */
const PAIRS = [
  { tab: "Blonde", before: "baBlondeBefore" as ImgKey, after: "baBlondeAfter" as ImgKey, shop: { label: "Shop CEO hybrids", title: "CEO Deluxe Density Hybrid Weft Extensions" } },
  { tab: "Brunette", before: "baBrunetteBefore" as ImgKey, after: "baBrunetteAfter" as ImgKey, shop: { label: "Shop Bad B Brunette", title: "Bad B Brunette Deluxe Density Hybrid Weft Extensions" } },
];

export function Transformations() {
  const t = H.transformations;
  const [i, setI] = useState(0);
  if (!t.visible) return null;
  const pair = PAIRS[i];
  const shop = getByTitle(pair.shop.title);
  return (
    <section className="section" aria-labelledby="tr-heading">
      <div className="wrap grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="md:order-2">
          <BeforeAfter key={pair.tab} before={pair.before} after={pair.after} label={`${pair.tab} transformation`} />
        </div>
        <div>
          <p className="t-eyebrow mb-4 text-muted">{t.eyebrow}</p>
          <h2 id="tr-heading" className="t-h1">
            {t.heading}
          </h2>
          <p className="t-lead mt-5 max-w-md text-muted">Drag the slider to see what Deluxe Density hybrids — double drawn for max thickness top to bottom — can do in a single install.</p>
          <div className="mt-7 flex gap-2" role="group" aria-label="Choose a transformation">
            {PAIRS.map((p, k) => (
              <button key={p.tab} type="button" aria-pressed={k === i} onClick={() => setI(k)} className={cn("h-11 rounded-full border px-5 text-sm font-medium transition-colors", k === i ? "border-black bg-black text-white" : "border-black/25 hover:border-black")}>
                {p.tab}
              </button>
            ))}
          </div>
          {shop && (
            <Link to={`/products/${shop.handle}`} className="btn btn-outline mt-7">
              {pair.shop.label} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── The Reputation Difference ───────────────────────────────────────────── */
export function Difference() {
  if (!H.difference.visible) return null;
  return (
    <section aria-labelledby="diff-heading">
      <div className="section bg-blush">
        <div className="wrap">
          <h2 id="diff-heading" className="t-h2 text-center">
            {H.difference.heading}
          </h2>
          <ol className="mt-10 grid gap-5 md:mt-14 md:grid-cols-3 md:gap-8">
            {pillars.map((p, i) => (
              <li key={p.title} className="rounded-3xl bg-white p-7 transition-transform duration-500 ease-luxe hover:-translate-y-1 md:p-9">
                <span className="font-display text-5xl italic text-blush-deep" aria-hidden="true">
                  0{i + 1}
                </span>
                <h3 className="t-h3 mt-5">{p.title}</h3>
                <p className="mt-3 text-muted">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="on-dark relative isolate overflow-hidden bg-black text-white">
        <Img k="lsSun" className="absolute inset-0 -z-10 size-full object-cover object-[50%_30%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/35 to-transparent" aria-hidden="true" />
        <div className="wrap py-24 md:py-36">
          <div className="max-w-xl">
            <p className="t-eyebrow text-blush">Our promise</p>
            <h2 className="t-h1 mt-4">{confidence.heading}</h2>
            <p className="t-lead mt-5 text-white/85">{confidence.body}</p>
            <Link to="/collections/all" className="btn btn-light mt-8">
              Shop Hair Collections
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Shop Rep Pro / Shop for myself ──────────────────────────────────────── */
export function ShopFor() {
  if (!H.shopFor.visible) return null;
  const tiles = [
    { title: "Shop Rep Pro", body: "Professional hybrid wefts, keratin tips, tape wefts, pro tools and education.", image: "edSalon" as ImgKey, to: "/collections/professional-hair", extra: { label: "Pro Pricing Application", to: "/pages/pro-discount-form" } },
    { title: "Shop for myself", body: "Clip-ins, The Weekend Collection and the essentials for everyday luxury.", image: "lsClipin" as ImgKey, to: "/collections/consumer-collection" },
  ];
  return (
    <section className="section" aria-label="Shop by customer">
      <div className="wrap grid gap-4 md:grid-cols-2 md:gap-6">
        {tiles.map((t) => (
          <div key={t.title} className="on-dark group relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-[1.75rem] p-7 text-white md:min-h-[34rem] md:p-10">
            <Img k={t.image} className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-[1200ms] ease-luxe group-hover:scale-105" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/30 to-transparent" aria-hidden="true" />
            <h2 className="t-h2">{t.title}</h2>
            <p className="mt-3 max-w-sm text-white/85">{t.body}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={t.to} className="btn btn-light">
                Explore now
              </Link>
              {t.extra && (
                <Link to={t.extra.to} className="btn border-white text-white hover:bg-white hover:text-black">
                  {t.extra.label}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Reviews ─────────────────────────────────────────────────────────────── */
export function Reviews() {
  const r = H.reviews;
  const ref = useRef<HTMLUListElement>(null);
  if (!r.visible) return null;
  const total = products.reduce((n, p) => n + p.reviewCount, 0);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * (ref.current.clientWidth * 0.7), behavior: "smooth" });
  const arrow = "grid size-12 place-items-center rounded-full border border-black transition-colors hover:bg-black hover:text-white";
  return (
    <section className="section overflow-hidden bg-blush-soft" aria-labelledby="reviews-heading">
      <div className="wrap grid gap-10 lg:grid-cols-[20rem_1fr] lg:gap-14">
        <div className="text-center lg:text-left">
          <p className="t-eyebrow mb-3 text-muted">{r.eyebrow}</p>
          <h2 id="reviews-heading" className="t-h2">
            {r.heading}
          </h2>
          <div className="mt-6 flex items-center justify-center gap-4 lg:justify-start">
            <span className="font-display text-6xl leading-none">{r.rating}</span>
            <div className="text-left">
              <Stars value={r.rating} size={18} />
              <p className="mt-1 text-[15px] text-muted">from {total.toLocaleString("en-US")} reviews</p>
            </div>
          </div>
          <div className="mt-8 hidden gap-3 lg:flex">
            <button type="button" className={arrow} onClick={() => scroll(-1)} aria-label="Previous reviews">
              <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button type="button" className={arrow} onClick={() => scroll(1)} aria-label="Next reviews">
              <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
        <ul ref={ref} aria-label="Customer reviews" className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 md:-mx-10 md:scroll-px-10 md:px-10 lg:mx-0 lg:-mr-10 lg:scroll-px-0 lg:pl-0">
          {reviews.map((rev) => {
            const prod = getByTitle(rev.product);
            return (
              <li key={rev.name} className="flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-3xl bg-white sm:w-[46%] lg:w-[21rem]">
                <div className="aspect-[5/4] overflow-hidden bg-blush">
                  <Img k={rev.photo} className="size-full object-cover object-[50%_25%]" />
                </div>
                <figure className="flex flex-1 flex-col p-6">
                  <Stars value={rev.rating} size={15} />
                  <blockquote className="mt-3 flex-1">
                    <p className="font-display text-xl leading-snug">“{rev.title}”</p>
                    <p className="mt-2 text-muted">{rev.text}</p>
                  </blockquote>
                  <figcaption className="mt-5 border-t border-line pt-4 text-[15px]">
                    <span className="font-medium">{rev.name}</span> <span className="text-muted">· Verified buyer</span>
                    {prod && (
                      <Link to={`/products/${prod.handle}`} className="mt-1 block truncate text-sm underline underline-offset-4">
                        {prod.title}
                      </Link>
                    )}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ── Created behind the chair (founders + video) ─────────────────────────── */
export function FoundersStory() {
  const [video, setVideo] = useState(false);
  if (!H.founders.visible) return null;
  return (
    <section className="section" aria-labelledby="founders-heading">
      <div className="wrap grid items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
        <div className="relative">
          <div className="absolute -bottom-4 -right-4 hidden h-2/3 w-2/3 rounded-[2rem] bg-blush md:block" aria-hidden="true" />
          <div className="relative aspect-square overflow-hidden rounded-[1.75rem] bg-blush md:rounded-[2rem]">
            <Img k="founders" className="size-full object-cover" />
            <button type="button" onClick={() => setVideo(true)} className="group absolute bottom-5 left-5 flex items-center gap-3 rounded-full bg-white/90 py-2 pl-2 pr-5 text-sm font-medium backdrop-blur transition-colors hover:bg-white">
              <span className="grid size-10 place-items-center rounded-full bg-black text-white transition-transform group-hover:scale-110">
                <Play size={16} fill="currentColor" aria-hidden="true" />
              </span>
              Watch the story
            </button>
          </div>
        </div>
        <div>
          <p className="t-eyebrow mb-4 text-muted">Meet the founders</p>
          <h2 id="founders-heading" className="t-h1">
            {founders.heading}
          </h2>
          <div className="t-lead mt-6 max-w-lg space-y-4 text-muted">
            {founders.story.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
            <p className="text-black">{founders.tagline}</p>
          </div>
          <p className="mt-5 font-display text-3xl italic">{founders.signature}</p>
          <Link to="/pages/about-us#founders" className="btn btn-primary mt-8">
            Our story <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <Drawer open={video} onClose={() => setVideo(false)} side="center" label="Reputation video" className="bg-black">
        <button type="button" onClick={() => setVideo(false)} aria-label="Close video" className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full bg-white text-black">
          <X size={18} aria-hidden="true" />
        </button>
        {video && (
          <div className="aspect-video w-full">
            <iframe
              title="Reputation Hair Extensions video"
              src={`https://www.youtube-nocookie.com/embed/${settings.brand.youtubeId}?autoplay=1&rel=0`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="size-full"
            />
          </div>
        )}
      </Drawer>
    </section>
  );
}

/* ── The Weekend Collection banner ───────────────────────────────────────── */
export function WeekendBanner() {
  if (!H.weekend.visible) return null;
  return (
    <section className="on-dark overflow-hidden bg-black text-white" aria-labelledby="weekend-heading">
      <div className="grid md:grid-cols-2">
        <div className="flex flex-col justify-center px-5 py-16 md:px-12 md:py-24 lg:px-20">
          <p className="t-eyebrow text-blush">Introducing our easiest extensions yet!</p>
          <h2 id="weekend-heading" className="mt-4 text-[2.6rem] leading-none md:text-[4rem]">
            The Weekend <em className="font-normal">Collection</em>
          </h2>
          <p className="t-lead mt-5 max-w-md text-white/85">Luxury Hair for the moments you want more of. Laced clip-ins in 19 salon shades — available ready to wear, washed &amp; styled.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/collections/the-weekend-collection" className="btn btn-blush">
              Explore the collection
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <Img k="lsClipin" className="aspect-[3/4] size-full object-cover md:aspect-auto" />
          <div className="grid grid-rows-2 gap-1">
            <Img k="mLaced" className="size-full object-cover" />
            <Img k="lsSun" className="size-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Holiday gifting ─────────────────────────────────────────────────────── */
export function HolidayGifting() {
  if (!H.holiday.visible) return null;
  const holiday = settings.nav.find((n) => n.label === "Holiday Shop");
  return (
    <section className="section overflow-hidden" aria-labelledby="holiday-heading">
      <div className="wrap">
        <SectionHead
          align="left"
          eyebrow="The Holiday Shop"
          heading={H.holiday.heading}
          id="holiday-heading"
          action={
            <Link to="/pages/holiday-shop" className="t-eyebrow link-line mb-1 hidden shrink-0 sm:block">
              Shop all Holiday
            </Link>
          }
        />
        <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0">
          {holiday?.cards?.map((c) => (
            <li key={c.title} className="w-[70%] shrink-0 snap-start md:w-auto">
              <Link to={c.to} className="group relative block aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-blush">
                <Img k={c.image} className="size-full object-cover transition-transform duration-[900ms] ease-luxe group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden="true" />
                <div className="on-dark absolute inset-x-5 bottom-5 text-white">
                  <p className="text-sm text-white/80">For</p>
                  <h3 className="font-display text-[1.7rem] leading-tight">{c.title}</h3>
                  <span className="t-eyebrow mt-2 inline-flex items-center gap-2">
                    Shop <ArrowRight size={13} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Blog teaser ─────────────────────────────────────────────────────────── */
export function PostCard({ post, className }: { post: Post; className?: string }) {
  return (
    <article className={cn("group", className)}>
      <Link to={`/blogs/introducing-reputation-extensions/${post.slug}`} className="block">
        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-blush">
          <Img k={post.image} className="size-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-105" />
        </div>
        <p className="mt-4 text-sm text-muted">
          <span className="t-eyebrow text-black">{post.tag}</span>
          <span className="mx-2" aria-hidden="true">
            ·
          </span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
        <h3 className="mt-2 text-[1.45rem] leading-tight md:text-[1.6rem]">{post.title}</h3>
        <p className="mt-2 text-muted">{post.excerpt}</p>
        <span className="t-eyebrow link-line mt-4 inline-block">Read more</span>
      </Link>
    </article>
  );
}

export function BlogTeaser() {
  const b = H.blog;
  if (!b.visible) return null;
  return (
    <section className="section overflow-hidden border-t border-line">
      <div className="wrap">
        <SectionHead
          align="left"
          eyebrow={b.eyebrow}
          heading={b.heading}
          action={
            <Link to={b.cta.to} className="t-eyebrow link-line mb-1 hidden shrink-0 sm:block">
              {b.cta.label}
            </Link>
          }
        />
        <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
          {posts.slice(0, 3).map((p) => (
            <li key={p.slug} className="w-[80%] shrink-0 snap-start md:w-auto">
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Instagram ───────────────────────────────────────────────────────────── */
export function InstagramFeed() {
  const ig = H.instagram;
  if (!ig.visible) return null;
  const url = settings.brand.social[0].url;
  return (
    <section className="pb-16 md:pb-24" aria-labelledby="ig-heading">
      <div className="wrap mb-8 text-center">
        <p className="t-eyebrow mb-3 text-muted">Real clients. Real stylists. Real Reputation hair.</p>
        <h2 id="ig-heading" className="t-h2">
          {ig.heading}
        </h2>
        <a href={url} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm mt-5">
          <SocialIcon name="Instagram" size={16} /> Follow {settings.brand.instagramHandle}
        </a>
      </div>
      <ul className="grid grid-cols-4 gap-1 px-1 md:gap-2 md:px-2 lg:grid-cols-8">
        {ig.tiles.map((k, i) => (
          <li key={k + i}>
            <a href={url} target="_blank" rel="noreferrer" aria-label={`View on Instagram: ${ALT[k]} (opens in a new tab)`} className="group relative block aspect-square overflow-hidden rounded-lg bg-blush md:rounded-xl">
              <Img k={k} alt="" className="size-full object-cover object-top transition-transform duration-700 ease-luxe group-hover:scale-110" />
              <span className="absolute inset-0 grid place-items-center bg-black/35 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <SocialIcon name="Instagram" size={24} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Newsletter CTA ──────────────────────────────────────────────────────── */
export function NewsletterCta() {
  const n = H.newsletter;
  if (!n.visible) return null;
  return (
    <section className="relative overflow-hidden bg-blush py-16 md:py-24" aria-labelledby="nl-heading">
      <div className="pointer-events-none absolute -left-24 top-1/2 size-80 -translate-y-1/2 rounded-full bg-white/50 blur-3xl" aria-hidden="true" />
      <div className="wrap relative max-w-2xl text-center">
        <p className="t-eyebrow mb-4">{n.eyebrow}</p>
        <h2 id="nl-heading" className="t-h1">
          {n.heading}
        </h2>
        <p className="t-lead mx-auto mt-4 max-w-md">{n.body}</p>
        <div className="mx-auto mt-8 max-w-lg text-left">
          <EmailForm source="newsletter" cta={n.cta} />
        </div>
        <p className="mt-4 text-sm text-muted">
          By subscribing you agree to our{" "}
          <Link to="/policies/privacy-policy" className="underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
