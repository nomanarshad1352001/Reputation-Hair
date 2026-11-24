import { useEffect, useState } from "react";

export function money(n: number) {
  const v = Math.round(n * 100) / 100;
  return Number.isInteger(v)
    ? `$${v.toLocaleString("en-US")}`
    : `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const round2 = (n: number) => Math.round(n * 100) / 100;

export const formatDate = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export function session(key: string, value?: string) {
  try {
    if (value === undefined) return sessionStorage.getItem(key);
    sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
  return null;
}

const SITE = "Reputation Hair Extensions";

/** Per-template SEO (Shopify: page_title / page_description). */
export function useSeo(title: string, description?: string) {
  useEffect(() => {
    document.title = title.includes(SITE) ? title : `${title} | ${SITE}`;
    if (description) document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [title, description]);
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/** Ticking clock for countdowns. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

export function timeParts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

export const pad = (n: number) => String(n).padStart(2, "0");

/* ── Delivery estimate (business days, merchant time zone) ───────────────── */
function zoned(now: number, timeZone: string) {
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const p = Object.fromEntries(f.formatToParts(new Date(now)).map((x) => [x.type, x.value]));
  return { y: +p.year, mo: +p.month, d: +p.day, h: +p.hour % 24, mi: +p.minute, s: +p.second };
}

const DAY = 86400000;
const isBiz = (t: number) => {
  const w = new Date(t).getUTCDay();
  return w !== 0 && w !== 6;
};
function addBiz(t: number, n: number) {
  let x = t;
  let left = n;
  while (left > 0) {
    x += DAY;
    if (isBiz(x)) left--;
  }
  return x;
}
const fmt = (t: number) => new Date(t).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

export function deliveryEstimate(now: number, cfg: { cutoffHour: number; timeZone: string; transitMin: number; transitMax: number }) {
  const z = zoned(now, cfg.timeZone);
  const today = Date.UTC(z.y, z.mo - 1, z.d);
  const shipsToday = isBiz(today) && z.h < cfg.cutoffHour;
  const msLeft = shipsToday ? ((cfg.cutoffHour - z.h) * 3600 - z.mi * 60 - z.s) * 1000 : 0;
  let shipDay = today;
  if (!shipsToday) {
    shipDay = today + DAY;
    while (!isBiz(shipDay)) shipDay += DAY;
  }
  const shipLabel = shipsToday ? "today" : shipDay - today === DAY ? "tomorrow" : new Date(shipDay).toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
  return { shipsToday, msLeft, shipLabel, from: fmt(addBiz(shipDay, cfg.transitMin)), to: fmt(addBiz(shipDay, cfg.transitMax)) };
}
