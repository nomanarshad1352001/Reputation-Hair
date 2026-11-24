// Sales boosters: campaign countdowns, spin-to-win, rewards progress, bundle tiers, delivery
// estimate, installments, before/after, notify-me, trust badges and discount codes.
// Every booster reads real data/config and stays honest: timers count to real campaign end dates,
// stock messages come from inventory, and codes actually discount the bag.
import { useEffect, useId, useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { Gem, Gift, Globe, Lock, MoveHorizontal, Scissors, Tag, Truck, X } from "lucide-react";
import { settings } from "@/theme/settings";
import { activeCampaign } from "@/data/products";
import type { ImgKey } from "@/data/images";
import type { Totals } from "@/lib/pricing";
import { useStore } from "@/lib/store";
import { deliveryEstimate, isEmail, load, money, pad, save, session, timeParts, useNow } from "@/lib/utils";
import { cn } from "@/utils/cn";
import { CodeReveal, Drawer, Img } from "@/components/ui";
import { PaymentBadge } from "@/components/BrandIcons";

const O = settings.offers;

/* ── Countdown ───────────────────────────────────────────────────────────── */
export function Countdown({ to, tone = "dark", size = "md", label = "Ends in" }: { to: number; tone?: "dark" | "light" | "blush"; size?: "sm" | "md" | "lg"; label?: string }) {
  const now = useNow(1000);
  const ms = to - now;
  if (ms <= 0) return null;
  const t = timeParts(ms);
  const cells: [number, string][] = [
    [t.d, "Days"],
    [t.h, "Hrs"],
    [t.m, "Min"],
    [t.s, "Sec"],
  ];
  const box = { dark: "bg-white/10 text-white ring-1 ring-white/15", light: "bg-white text-black ring-1 ring-black/10", blush: "bg-blush text-black" }[tone];
  const dims = { sm: "min-w-10 px-1.5 py-1.5", md: "min-w-[3.4rem] px-2 py-2", lg: "min-w-[4.6rem] px-3 py-3" }[size];
  const num = { sm: "text-base", md: "text-2xl", lg: "text-4xl" }[size];
  return (
    <div role="timer" aria-label={`${label} ${t.d} days, ${t.h} hours, ${t.m} minutes`} className="inline-flex items-center gap-1.5">
      {cells.map(([v, l]) => (
        <span key={l} className={cn("flex flex-col items-center rounded-xl leading-none", box, dims)}>
          <span className={cn("font-display tabular-nums", num)}>{pad(v)}</span>
          <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.18em] opacity-70">{l}</span>
        </span>
      ))}
    </div>
  );
}

export function InlineTimer({ to, className }: { to: number; className?: string }) {
  const now = useNow(1000);
  const ms = to - now;
  if (ms <= 0) return null;
  const t = timeParts(ms);
  return (
    <span role="timer" className={cn("tabular-nums", className)}>
      {t.d > 0 && `${t.d}d `}
      {pad(t.h)}:{pad(t.m)}:{pad(t.s)}
    </span>
  );
}

/* ── Campaign bar (top of every page) ────────────────────────────────────── */
export function CampaignBar() {
  const now = useNow(1000);
  const c = activeCampaign(now);
  const [hidden, setHidden] = useState(() => session("rep_bar") === "off");
  const [i, setI] = useState(0);
  const msgs = settings.evergreenMessages;
  useEffect(() => {
    if (c) return;
    const t = setInterval(() => setI((v) => (v + 1) % msgs.length), 5000);
    return () => clearInterval(t);
  }, [c, msgs.length]);
  if (hidden) return null;
  return (
    <div className="on-dark relative bg-black text-white" role="region" aria-label="Announcement">
      {c ? (
        <Link to={c.cta.to} className="wrap flex min-h-11 flex-wrap items-center justify-center gap-x-4 gap-y-0.5 py-2 !pr-11 text-center">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] sm:text-xs">{c.message}</span>
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-blush sm:text-xs">
            Ends in
            <InlineTimer to={Date.parse(c.ends)} className="rounded-full bg-white/12 px-2.5 py-0.5 font-medium tracking-[0.08em] text-white" />
          </span>
          <span className="hidden text-xs underline underline-offset-4 lg:inline">{c.cta.label} →</span>
        </Link>
      ) : (
        <p key={i} className="wrap animate-fade py-3 !pr-11 text-center text-[13px] tracking-[0.06em]">
          {msgs[i]}
        </p>
      )}
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          setHidden(true);
          session("rep_bar", "off");
        }}
        className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full opacity-70 transition-opacity hover:opacity-100 md:right-3"
      >
        <X size={15} aria-hidden="true" />
      </button>
    </div>
  );
}

/* ── Spin to win ─────────────────────────────────────────────────────────── */
const WHEEL_COLORS: [string, string][] = [
  ["#000000", "#ffffff"],
  ["#F6DDE4", "#000000"],
  ["#ffffff", "#000000"],
  ["#000000", "#ffffff"],
  ["#F6DDE4", "#000000"],
  ["#ffffff", "#000000"],
];

function Wheel({ rotation, spinning }: { rotation: number; spinning: boolean }) {
  const segs = O.wheel.segments;
  const seg = 360 / segs.length;
  const R = 140;
  const C = 150;
  const pt = (deg: number, r = R) => {
    const a = (deg * Math.PI) / 180;
    return [C + r * Math.sin(a), C - r * Math.cos(a)];
  };
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[17rem] sm:max-w-[20rem]">
      <svg
        viewBox="0 0 300 300"
        className="size-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.25)]"
        style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 5s cubic-bezier(0.15, 0.7, 0.1, 1)" : "none" }}
        aria-hidden="true"
      >
        <circle cx={C} cy={C} r={149} fill="#000" />
        {segs.map((s, i) => {
          const [x1, y1] = pt(i * seg);
          const [x2, y2] = pt((i + 1) * seg);
          const [bg, fg] = WHEEL_COLORS[i % WHEEL_COLORS.length];
          const words = s.label.split(" ");
          return (
            <g key={s.code + i}>
              <path d={`M${C},${C} L${x1},${y1} A${R},${R} 0 0 1 ${x2},${y2} Z`} fill={bg} stroke="#000" strokeWidth="1.5" />
              <g transform={`rotate(${i * seg + seg / 2} ${C} ${C})`}>
                <text x={C} y={words.length > 1 ? 52 : 60} textAnchor="middle" fill={fg} fontSize="14" fontWeight="600" letterSpacing="1.2" fontFamily="Jost, system-ui, sans-serif">
                  {words.map((w, k) => (
                    <tspan key={k} x={C} dy={k ? 16 : 0}>
                      {w}
                    </tspan>
                  ))}
                </text>
              </g>
            </g>
          );
        })}
        {Array.from({ length: 24 }, (_, i) => {
          const [x, y] = pt(i * 15, 145);
          return <circle key={i} cx={x} cy={y} r={2.3} fill={i % 2 ? "#F6DDE4" : "#ffffff"} />;
        })}
        <circle cx={C} cy={C} r={31} fill="#000" stroke="#F6DDE4" strokeWidth="3" />
        <text x={C} y={C + 5} textAnchor="middle" fill="#fff" fontSize="14" letterSpacing="2.5" fontFamily="'Bodoni Moda', serif">
          REP
        </text>
      </svg>
      <svg className="absolute left-1/2 top-[-10px] -translate-x-1/2 drop-shadow" width="36" height="44" viewBox="0 0 36 44" aria-hidden="true">
        <path d="M18 42 L4 14 Q18 -8 32 14 Z" fill="#000" stroke="#F6DDE4" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

const isBlockedPath = (p: string) => /^\/(products|cart|checkout)/.test(p);

export function SpinWheel() {
  const { wheelOpen, setWheelOpen } = useStore();
  const loc = useLocation();
  const segs = O.wheel.segments;
  const id = useId();
  const [won, setWon] = useState<{ code: string; label: string } | null>(() => load("rep_wheel", null));
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const blocked = isBlockedPath(loc.pathname);

  useEffect(() => {
    if (won || load("rep_wheel_seen", false) || blocked) return;
    const open = () => {
      setWheelOpen(true);
      save("rep_wheel_seen", true);
    };
    const t = setTimeout(open, O.wheel.delayMs);
    const onOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) open();
    };
    document.addEventListener("mouseout", onOut);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mouseout", onOut);
    };
  }, [won, blocked, setWheelOpen]);

  const spin = (e: FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setError("Please enter a valid email to spin.");
      return;
    }
    setError("");
    save("rep_subscribers", [...load<unknown[]>("rep_subscribers", []), { email: email.trim(), source: "spin-to-win" }]);
    const total = segs.reduce((n, s) => n + s.weight, 0);
    let r = Math.random() * total;
    let idx = 0;
    for (let i = 0; i < segs.length; i++) {
      r -= segs[i].weight;
      if (r <= 0) {
        idx = i;
        break;
      }
    }
    const seg = 360 / segs.length;
    setRotation(360 * 6 + (360 - (idx * seg + seg / 2)) + (Math.random() - 0.5) * seg * 0.6);
    setSpinning(true);
    window.setTimeout(() => {
      setSpinning(false);
      const w = { code: segs[idx].code, label: segs[idx].label };
      setWon(w);
      save("rep_wheel", w);
    }, 5300);
  };

  return (
    <Drawer open={wheelOpen} onClose={() => !spinning && setWheelOpen(false)} side="center" label="Spin to win" className="max-h-[94dvh]">
      <button type="button" onClick={() => !spinning && setWheelOpen(false)} aria-label="Close" className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full bg-white/80 hover:bg-white">
        <X size={18} aria-hidden="true" />
      </button>
      <div className="grid overflow-y-auto sm:grid-cols-[1.05fr_1fr]">
        <div className="relative flex items-center justify-center overflow-hidden bg-blush px-6 pb-6 pt-10 sm:p-10">
          <div className="pointer-events-none absolute -left-16 -top-16 size-56 rounded-full bg-white/40 blur-2xl" aria-hidden="true" />
          <Wheel rotation={rotation} spinning={spinning} />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-10">
          {won && !spinning ? (
            <div className="animate-fade-up" role="status">
              <p className="t-eyebrow text-muted">You won</p>
              <p className="mt-2 font-display text-4xl leading-none sm:text-5xl">{won.label}</p>
              <p className="mt-3 text-[15px] text-muted">{O.codes[won.code]?.label}. Your code is saved — apply it now or at checkout.</p>
              <div className="mt-5">
                <CodeReveal code={won.code} />
              </div>
              <button type="button" onClick={() => setWheelOpen(false)} className="mt-5 text-sm underline underline-offset-4">
                Keep shopping
              </button>
            </div>
          ) : (
            <form onSubmit={spin} noValidate>
              <p className="t-eyebrow text-muted">Exclusive welcome gift</p>
              <h2 className="mt-2 text-[2.1rem] leading-[1.02] sm:text-5xl">
                Spin to <em className="font-normal">win.</em>
              </h2>
              <p className="mt-3 text-[15px] text-muted">One spin per guest. Every slice is a real reward — free shipping, free clips or up to 15% off.</p>
              <label htmlFor={`${id}-e`} className="sr-only">
                Email address
              </label>
              <input id={`${id}-e`} type="email" autoComplete="email" inputMode="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} disabled={spinning} aria-invalid={!!error} className="field mt-5" />
              {error && (
                <p role="alert" className="mt-2 pl-5 text-sm font-medium">
                  {error}
                </p>
              )}
              <button type="submit" disabled={spinning} className="btn btn-primary mt-3 w-full">
                {spinning ? "Spinning…" : "Spin the wheel"}
              </button>
              <p className="mt-3 text-xs text-muted">
                By entering you agree to receive marketing emails from Reputation. Unsubscribe anytime. See our{" "}
                <Link to="/policies/privacy-policy" onClick={() => setWheelOpen(false)} className="underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          )}
        </div>
      </div>
    </Drawer>
  );
}

export function WheelTeaser() {
  const { setWheelOpen, wheelOpen, cartOpen } = useStore();
  const loc = useLocation();
  const [hidden, setHidden] = useState(() => session("rep_teaser") === "off");
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!scrolled || hidden || wheelOpen || cartOpen || isBlockedPath(loc.pathname) || load("rep_wheel", null)) return null;
  return (
    <div className="fixed bottom-4 left-4 z-40 flex animate-fade-up items-center rounded-full bg-black text-white shadow-[0_12px_30px_-8px_rgba(0,0,0,0.5)]">
      <button type="button" onClick={() => setWheelOpen(true)} className="flex h-12 items-center gap-2 pl-4 pr-2 text-[13px] font-medium uppercase tracking-[0.14em]">
        <Gift size={17} aria-hidden="true" className="text-blush" />
        Spin to win
      </button>
      <button
        type="button"
        aria-label="Hide spin to win"
        onClick={() => {
          setHidden(true);
          session("rep_teaser", "off");
        }}
        className="mr-1 grid size-9 place-items-center rounded-full text-white/70 hover:text-white"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

/* ── Installments messaging (Shop Pay Installments) ──────────────────────── */
export function Installments({ amount, className }: { amount: number; className?: string }) {
  const c = O.installments;
  if (amount < c.min) return null;
  return (
    <p className={cn("flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[15px] text-muted", className)}>
      or {c.count} interest-free payments of <strong className="font-medium text-black">{money(Math.round((amount / c.count) * 100) / 100)}</strong> with
      <PaymentBadge name="shoppay" />
    </p>
  );
}

/* ── Delivery estimate with order cutoff ─────────────────────────────────── */
export function DeliveryEstimate() {
  const now = useNow(1000);
  const d = deliveryEstimate(now, O.shipping);
  const t = timeParts(d.msLeft);
  return (
    <div className="flex gap-3 rounded-2xl border border-line p-4 text-[15px]">
      <Truck size={20} strokeWidth={1.5} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div>
        {d.shipsToday ? (
          <p>
            Order within{" "}
            <strong className="font-medium tabular-nums">
              {t.h}h {pad(t.m)}m
            </strong>{" "}
            to ship <strong className="font-medium">today</strong>
          </p>
        ) : (
          <p>
            Order now — ships <strong className="font-medium">{d.shipLabel}</strong>
          </p>
        )}
        <p className="text-muted">
          Estimated U.S. delivery:{" "}
          <strong className="font-medium text-black">
            {d.from} – {d.to}
          </strong>
        </p>
      </div>
    </div>
  );
}

/* ── Bundle & save selector ──────────────────────────────────────────────── */
export function BundleTiers({ qty, setQty, unit, max }: { qty: number; setQty: (n: number) => void; unit: number; max: number }) {
  const tiers = [{ packs: 1, percent: 0 }, ...O.bundleTiers];
  const top = tiers[tiers.length - 1].packs;
  return (
    <fieldset>
      <legend className="mb-3 flex w-full items-baseline justify-between gap-3 text-[15px]">
        <span className="font-medium">Bundle &amp; save</span>
        <span className="text-sm text-muted">Mix any shades &amp; methods</span>
      </legend>
      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Bundle quantity">
        {tiers.map((t) => {
          const on = qty === t.packs || (t.packs === top && qty > top);
          const disabled = t.packs > max;
          return (
            <button
              key={t.packs}
              type="button"
              role="radio"
              aria-checked={on}
              disabled={disabled}
              onClick={() => setQty(t.packs)}
              className={cn(
                "relative rounded-2xl border px-3 pb-3 pt-4 text-left transition-colors",
                on ? "border-black bg-blush-soft ring-1 ring-black" : "border-black/20 hover:border-black",
                disabled && "cursor-not-allowed opacity-40",
              )}
            >
              {t.percent > 0 && <span className="absolute -top-2.5 right-2 rounded-full bg-black px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">Save {t.percent}%</span>}
              <span className="block text-sm font-medium">
                {t.packs} {t.packs === 1 ? "pack" : "packs"}
              </span>
              <span className="block text-[13px] text-muted">{money(Math.round(unit * t.packs * (1 - t.percent / 100) * 100) / 100)}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ── Rewards progress (free shipping → free gift) ────────────────────────── */
export function RewardsBar({ totals }: { totals: Totals }) {
  const goal = O.gift.threshold;
  const shipAt = (O.freeShipping.threshold / goal) * 100;
  const pct = Math.min(100, (totals.discounted / goal) * 100);
  const msg = !totals.freeShipping ? (
    <>
      You’re <strong className="font-medium">{money(totals.shippingRemaining)}</strong> away from <strong className="font-medium">free {O.freeShipping.region} shipping</strong>
    </>
  ) : !totals.gift ? (
    <>
      Free shipping unlocked! Add <strong className="font-medium">{money(totals.giftRemaining)}</strong> for a <strong className="font-medium">free gift</strong>
    </>
  ) : (
    <>
      You’ve unlocked <strong className="font-medium">free shipping</strong> + a <strong className="font-medium">free gift</strong>
    </>
  );
  const marks = [
    { at: shipAt, Icon: Truck, on: totals.freeShipping, label: `Free shipping ${money(O.freeShipping.threshold)}` },
    { at: 100, Icon: Gift, on: totals.gift, label: `Free gift ${money(goal)}` },
  ];
  return (
    <div>
      <p className="text-[15px]" aria-live="polite">
        {msg}
      </p>
      <div className="relative mt-4 h-2 rounded-full bg-blush" role="progressbar" aria-label="Progress toward rewards" aria-valuemin={0} aria-valuemax={goal} aria-valuenow={Math.round(totals.discounted)}>
        <div className="h-full rounded-full bg-black transition-[width] duration-700 ease-luxe" style={{ width: `${pct}%` }} />
        {marks.map(({ at, Icon, on, label }) => (
          <span
            key={label}
            title={label}
            className={cn("absolute top-1/2 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white shadow-sm transition-colors", on ? "bg-black text-white" : "bg-blush-deep text-black")}
            style={{ left: `${Math.min(at, 96)}%` }}
          >
            <Icon size={13} aria-hidden="true" />
          </span>
        ))}
      </div>
      <div className="relative mt-3 h-4 text-[10px] font-medium uppercase tracking-wider text-muted" aria-hidden="true">
        <span className="absolute translate-x-3.5 whitespace-nowrap" style={{ right: `${100 - shipAt}%` }}>
          {marks[0].label}
        </span>
        <span className="absolute right-0 whitespace-nowrap">{marks[1].label}</span>
      </div>
    </div>
  );
}

export function ShippingHint({ add }: { add: number }) {
  const { totals } = useStore();
  const projected = totals.discounted + add;
  const left = O.freeShipping.threshold - projected;
  return (
    <p className="flex items-center gap-2 text-[15px] text-muted">
      <Gift size={16} strokeWidth={1.5} aria-hidden="true" className="text-black" />
      {left <= 0 ? (
        <span>
          This order ships <strong className="font-medium text-black">free</strong> in the U.S.
          {projected >= O.gift.threshold && <> — plus a free gift</>}
        </span>
      ) : (
        <span>
          Add <strong className="font-medium text-black">{money(left)}</strong> more for free U.S. shipping
        </span>
      )}
    </p>
  );
}

/* ── Before / after slider ───────────────────────────────────────────────── */
export function BeforeAfter({ before, after, label }: { before: ImgKey; after: ImgKey; label: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative aspect-square select-none overflow-hidden rounded-[1.75rem] bg-blush outline-offset-4 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-black">
      <Img k={after} className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Img k={before} className="absolute inset-0 size-full object-cover" />
      </div>
      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em]">Before</span>
      <span className="absolute right-4 top-4 rounded-full bg-black px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white">After</span>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,0.3)]" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-black shadow-lg">
          <MoveHorizontal size={20} aria-hidden="true" />
        </span>
      </div>
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(+e.target.value)} aria-label={`${label}: drag to compare before and after`} className="absolute inset-0 size-full cursor-ew-resize opacity-0" />
    </div>
  );
}

/* ── Back-in-stock alert ─────────────────────────────────────────────────── */
export function NotifyMe({ title }: { title: string }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  if (done)
    return (
      <p role="status" className="rounded-2xl bg-blush-soft p-4 text-[15px]">
        You’re on the list — we’ll email <strong className="font-medium">{email}</strong> the moment it’s back.
      </p>
    );
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!isEmail(email)) return setErr("Please enter a valid email address.");
        save("rep_restock", [...load<unknown[]>("rep_restock", []), { email, title }]);
        setDone(true);
      }}
      className="rounded-2xl border border-line p-4"
    >
      <p className="mb-3 text-[15px] font-medium">This option is sold out — get notified when it’s back</p>
      <div className="flex gap-2">
        <label htmlFor={`${id}-n`} className="sr-only">
          Email address
        </label>
        <input id={`${id}-n`} type="email" autoComplete="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="field !min-h-11 flex-1" />
        <button type="submit" className="btn btn-primary btn-sm">
          Notify me
        </button>
      </div>
      {err && (
        <p role="alert" className="mt-2 pl-4 text-sm font-medium">
          {err}
        </p>
      )}
    </form>
  );
}

/* ── Trust badges ────────────────────────────────────────────────────────── */
const TRUST = [
  { Icon: Gem, label: "100% Remy human hair" },
  { Icon: Scissors, label: "Designed by pro stylists" },
  { Icon: Globe, label: "Worldwide shipping" },
  { Icon: Lock, label: "Secure checkout" },
];

export function TrustBadges({ className }: { className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-2 sm:grid-cols-4", className)}>
      {TRUST.map(({ Icon, label }) => (
        <li key={label} className="flex flex-col items-center gap-2 rounded-2xl bg-blush-soft px-3 py-4 text-center text-[13px] leading-snug">
          <Icon size={22} strokeWidth={1.25} aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  );
}

export function TrustStrip() {
  return (
    <section aria-label="Why shop Reputation" className="border-y border-line bg-blush-soft">
      <ul className="wrap grid grid-cols-2 gap-x-4 gap-y-6 py-8 md:grid-cols-4 md:py-10">
        {TRUST.map(({ Icon, label }) => (
          <li key={label} className="flex items-center gap-3 text-[15px]">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white">
              <Icon size={19} strokeWidth={1.4} aria-hidden="true" />
            </span>
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Discount code field ─────────────────────────────────────────────────── */
export function CodeField() {
  const id = useId();
  const { code, applyCode, clearCode, totals } = useStore();
  const [val, setVal] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const saved = load<{ code: string; label: string } | null>("rep_wheel", null);
  return (
    <div>
      {code ? (
        <div className="flex items-center justify-between gap-3 rounded-full bg-blush-soft py-1.5 pl-4 pr-1.5 text-sm">
          <span className="flex min-w-0 items-center gap-2">
            <Tag size={15} aria-hidden="true" className="shrink-0" />
            <span className="truncate">
              <strong className="font-medium tracking-wider">{code}</strong> · {totals.code?.message}
            </span>
          </span>
          <button type="button" onClick={clearCode} className="shrink-0 rounded-full px-3 py-1.5 underline underline-offset-4 hover:bg-white" aria-label={`Remove code ${code}`}>
            Remove
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const r = applyCode(val);
            setMsg({ ok: r.ok, text: r.message });
            if (r.ok) setVal("");
          }}
          className="flex gap-2"
        >
          <label htmlFor={`${id}-c`} className="sr-only">
            Discount code
          </label>
          <input id={`${id}-c`} value={val} onChange={(e) => setVal(e.target.value)} placeholder="Discount code" autoComplete="off" className="field !min-h-11 flex-1 uppercase placeholder:normal-case" />
          <button type="submit" className="btn btn-outline btn-sm" disabled={!val.trim()}>
            Apply
          </button>
        </form>
      )}
      {!code && saved && (
        <button type="button" onClick={() => applyCode(saved.code)} className="mt-2 flex items-center gap-2 text-sm underline underline-offset-4">
          <Gift size={14} aria-hidden="true" /> Apply your {saved.code} spin-to-win reward
        </button>
      )}
      {msg && !msg.ok && !code && (
        <p role="alert" className="mt-2 pl-4 text-sm font-medium">
          {msg.text}
        </p>
      )}
    </div>
  );
}

/* ── Marquee ─────────────────────────────────────────────────────────────── */
export function Marquee({ items }: { items: string[] }) {
  return (
    <section aria-label="Brand promises" className="group overflow-hidden border-b border-line bg-white py-4 md:py-5">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {[0, 1].map((k) => (
          <ul key={k} aria-hidden={k === 1} className="flex shrink-0 items-center gap-10 pr-10">
            {items.map((t) => (
              <li key={t} className="flex items-center gap-10 whitespace-nowrap font-display text-xl italic md:text-[1.6rem]">
                {t}
                <span className="text-base not-italic text-blush-deep">✦</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
