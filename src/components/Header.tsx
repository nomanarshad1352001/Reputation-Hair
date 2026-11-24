import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronRight, Mail, Menu, Search, ShoppingBag, Sparkles, User, X } from "lucide-react";
import { settings, type NavItem } from "@/theme/settings";
import { activeCampaign, collections, fromPrice, LINE_INFO, products, searchProducts } from "@/data/products";
import { posts } from "@/data/content";
import { LOGO } from "@/data/images";
import { useStore } from "@/lib/store";
import { money, useNow } from "@/lib/utils";
import { cn } from "@/utils/cn";
import { Drawer, Img } from "@/components/ui";
import { SocialIcon } from "@/components/BrandIcons";
import { Countdown } from "@/components/Boosters";

/* ── Logo (client's own wordmark) ────────────────────────────────────────── */
export function Logo({ light, className }: { light?: boolean; className?: string }) {
  return (
    <Link to="/" aria-label="Reputation Hair Extension Co. — home" className={cn("block shrink-0", className)}>
      <img src={light ? LOGO.white : LOGO.black} alt="Reputation Hair Extension Co." width={600} height={100} className="h-auto w-full" />
    </Link>
  );
}

/* ── Campaign promo card (mega menu + mobile drawer) ─────────────────────── */
function PromoCard({ className }: { className?: string }) {
  const now = useNow(1000);
  const c = activeCampaign(now);
  if (!c) return null;
  return (
    <Link to={c.cta.to} className={cn("on-dark group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-black p-5 text-white", className)}>
      <Img k="heroA" alt="" className="absolute inset-0 size-full object-cover object-right opacity-40 transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" aria-hidden="true" />
      <div className="relative">
        <p className="t-eyebrow text-blush">{c.label}</p>
        <p className="mt-2 font-display text-2xl leading-tight">{c.short}</p>
      </div>
      <div className="relative mt-8">
        <Countdown to={Date.parse(c.ends)} size="sm" />
        <span className="t-eyebrow mt-4 flex items-center gap-2">
          {c.cta.label} <ArrowRight size={14} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

/* ── Header ──────────────────────────────────────────────────────────────── */
export function Header() {
  const { count, totals, setCartOpen } = useStore();
  const loc = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const prevCount = useRef(count);

  useEffect(() => {
    setMenu(null);
    setMobileOpen(false);
    setSearchOpen(false);
  }, [loc.pathname, loc.search]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 600);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  const active = menu !== null ? settings.nav[menu] : null;
  const icon = "relative grid size-11 place-items-center rounded-full transition-colors hover:bg-blush";

  return (
    <>
      <header
        className={cn("sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-shadow duration-300", scrolled ? "shadow-[0_10px_30px_-14px_rgba(0,0,0,0.25)]" : "border-b border-line")}
        onMouseLeave={() => setMenu(null)}
        onKeyDown={(e) => e.key === "Escape" && setMenu(null)}
      >
        {/* Utility strip (desktop) */}
        <div className={cn("hidden overflow-hidden bg-blush-soft text-[12px] text-muted transition-[max-height,opacity] duration-300 lg:block", scrolled ? "max-h-0 opacity-0" : "max-h-9 opacity-100")}>
          <div className="wrap flex h-9 items-center justify-between">
            <ul className="flex gap-6">
              {["100% Remy human hair", "Designed by professional stylists", "Worldwide shipping"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Sparkles size={12} aria-hidden="true" className="text-black" />
                  {t}
                </li>
              ))}
            </ul>
            <ul className="flex gap-5">
              {[
                { label: "Salon Locator", to: "/pages/store-locator" },
                { label: "Become a Rep Pro", to: "/pages/pro-discount-form" },
                { label: "Help", to: "/pages/faqs" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-black hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main row */}
        <div className={cn("wrap grid grid-cols-[1fr_auto_1fr] items-center gap-3 transition-[height] duration-300 ease-luxe", scrolled ? "h-14 lg:h-16" : "h-16 lg:h-20")}>
          <div className="-ml-2 flex items-center lg:ml-0">
            <button type="button" className={cn(icon, "lg:hidden")} aria-label="Open menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}>
              <Menu size={22} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button type="button" className={cn(icon, "lg:hidden")} aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Search size={21} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => setSearchOpen(true)} className="hidden h-11 w-full max-w-[17rem] items-center gap-3 rounded-full border border-line bg-white px-4 text-left text-sm text-muted transition-colors hover:border-black lg:flex">
              <Search size={17} strokeWidth={1.5} aria-hidden="true" className="text-black" />
              Search shades, wefts, clip-ins…
            </button>
          </div>

          <Logo className={cn("transition-[width] duration-300 ease-luxe", scrolled ? "w-[8.5rem] lg:w-44" : "w-36 lg:w-56")} />

          <div className="-mr-2 flex items-center justify-end lg:mr-0">
            <Link to="/account" className={cn(icon, "hidden sm:grid")} aria-label="Account">
              <User size={21} strokeWidth={1.5} aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open bag, ${count} ${count === 1 ? "item" : "items"}`}
              className="relative flex h-11 items-center gap-2 rounded-full px-2.5 transition-colors hover:bg-blush lg:border lg:border-line lg:pl-4 lg:pr-4"
            >
              <span className={cn("relative", bump && "animate-[bump_0.6s_ease]")}>
                <ShoppingBag size={21} strokeWidth={1.5} aria-hidden="true" />
                {count > 0 && <span className="absolute -right-2 -top-1.5 grid min-w-[18px] place-items-center rounded-full bg-black px-1 text-[10px] font-medium leading-[18px] text-white">{count}</span>}
              </span>
              <span className="hidden text-sm font-medium tabular-nums lg:inline">{money(totals.total)}</span>
            </button>
          </div>
        </div>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden border-t border-line lg:block">
          <ul className="wrap flex h-12 items-center justify-center gap-7 xl:gap-10">
            {settings.nav.map((item, i) => {
              const hasMenu = !!(item.columns || item.cards);
              return (
                <li key={item.label} onMouseEnter={() => setMenu(hasMenu ? i : null)}>
                  <Link
                    to={item.to}
                    onFocus={() => setMenu(hasMenu ? i : null)}
                    aria-haspopup={hasMenu ? "true" : undefined}
                    aria-expanded={hasMenu ? menu === i : undefined}
                    className={cn(
                      "whitespace-nowrap text-[12.5px] font-medium uppercase tracking-[0.16em]",
                      item.highlight
                        ? "inline-flex items-center gap-2 rounded-full bg-black px-4 py-1.5 text-white transition-colors hover:bg-blush hover:text-black"
                        : cn("link-grow py-2", menu === i && "!bg-[length:100%_1px]"),
                    )}
                  >
                    {item.highlight && <span className="size-1.5 animate-pulse rounded-full bg-blush" aria-hidden="true" />}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile quick links */}
        <div className={cn("overflow-hidden transition-[max-height,opacity] duration-300 lg:hidden", scrolled ? "max-h-0 opacity-0" : "max-h-14 border-t border-line opacity-100")}>
          <ul className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-2.5">
            {settings.quickLinks.map((l, i) => (
              <li key={l.label} className="shrink-0">
                <Link to={l.to} className={cn("inline-flex h-8 items-center rounded-full px-3.5 text-[13px] font-medium", i === 0 ? "bg-black text-white" : "bg-blush-soft text-black")}>
                  {i === 0 && <span className="mr-1.5 size-1.5 animate-pulse rounded-full bg-blush" aria-hidden="true" />}
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {active && (active.columns || active.cards) && <MegaMenu key={active.label} item={active} />}
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

/* ── Mega menu ───────────────────────────────────────────────────────────── */
function MegaMenu({ item }: { item: NavItem }) {
  const now = useNow(60000);
  const showPromo = !!item.promo && !!activeCampaign(now);
  const cards = item.cards?.slice(0, showPromo ? 1 : item.cards.length) ?? [];
  return (
    <div className="absolute inset-x-0 top-full hidden animate-fade border-b border-line bg-white shadow-[0_30px_40px_-30px_rgba(0,0,0,0.25)] lg:block">
      <div className="wrap py-10">
        {item.heading && <p className="mb-7 font-display text-[2rem] leading-none">{item.heading}</p>}
        <div className="flex gap-10">
          {item.columns && (
            <div className="grid flex-1 auto-cols-fr grid-flow-col gap-8">
              {item.columns.map((col) => (
                <div key={col.title}>
                  <p className="t-eyebrow mb-4 text-muted">{col.title}</p>
                  <ul className="space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <Link to={l.to} className="group inline-flex items-center gap-2.5 text-base">
                          {l.swatch && <span className="size-4 rounded-full border border-black/10" style={{ background: l.swatch }} aria-hidden="true" />}
                          <span className="link-grow">{l.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {cards.length > 0 && (
            <div className={cn("grid gap-5", item.columns ? (showPromo ? "w-[22%] grid-cols-1" : "w-[44%] grid-cols-2") : "flex-1 grid-cols-4")}>
              {cards.map((c) => (
                <Link key={c.title} to={c.to} className="group block">
                  <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-blush">
                    <Img k={c.image} className="size-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-105" />
                  </div>
                  <p className="mt-3 font-medium">{c.title}</p>
                  <p className="text-sm text-muted">{c.caption}</p>
                </Link>
              ))}
            </div>
          )}
          {showPromo && <PromoCard className="w-[22%]" />}
        </div>
      </div>
    </div>
  );
}

/* ── Mobile drawer: two levels with back navigation ──────────────────────── */
function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sub, setSub] = useState<number | null>(null);
  const last = useRef(0);
  if (sub !== null) last.current = sub;
  const item = settings.nav[last.current];

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setSub(null), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const row = "flex min-h-14 w-full items-center justify-between border-b border-line px-5 text-left";

  return (
    <Drawer open={open} onClose={onClose} side="left" label="Menu">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
        <Logo className="w-32" />
        <button type="button" onClick={onClose} aria-label="Close menu" className="-mr-2 grid size-11 place-items-center rounded-full hover:bg-blush">
          <X size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div inert={sub !== null} className={cn("absolute inset-0 overflow-y-auto transition-transform duration-300 ease-luxe", sub !== null && "-translate-x-full")}>
          <div className="p-4 pb-2">
            <PromoCard className="min-h-[11rem]" />
          </div>
          <ul>
            {settings.nav.map((n, i) => (
              <li key={n.label}>
                {n.columns || n.cards ? (
                  <button type="button" className={row} onClick={() => setSub(i)}>
                    <span className="font-display text-[1.35rem]">{n.label}</span>
                    <ChevronRight size={18} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                ) : (
                  <Link to={n.to} className={row}>
                    <span className="flex items-center gap-2 font-display text-[1.35rem]">
                      {n.highlight && <span className="size-2 animate-pulse rounded-full bg-black" aria-hidden="true" />}
                      {n.label}
                    </span>
                    <ChevronRight size={18} strokeWidth={1.5} aria-hidden="true" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <p className="t-eyebrow px-5 pb-3 pt-7 text-muted">Find your perfect match</p>
          <ul className="grid grid-cols-2 gap-3 px-5">
            {settings.home.categories.tiles.map((t) => (
              <li key={t.title}>
                <Link to={t.to} className="group relative block aspect-square overflow-hidden rounded-2xl bg-blush">
                  <Img k={t.image} alt="" className="size-full object-cover" />
                  <span className="absolute inset-x-2 bottom-2 rounded-full bg-white/90 px-3 py-1.5 text-center text-[13px] font-medium backdrop-blur">{t.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="px-5 py-6 text-base">
            {[
              { label: "Hair Care Guide", to: "/pages/hair-extension-home-care" },
              { label: "FAQ", to: "/pages/faqs" },
              { label: "Track Order", to: "/pages/track-order" },
              { label: "Contact Us", to: "/pages/contact" },
              { label: "Account", to: "/account" },
            ].map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="block py-2.5 text-muted">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-line px-5 py-6">
            <a href={`mailto:${settings.brand.email}`} className="flex items-center gap-2 text-[15px]">
              <Mail size={16} aria-hidden="true" /> {settings.brand.email}
            </a>
            <div className="-ml-2 mt-4 flex gap-1">
              {settings.brand.social.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noreferrer" aria-label={`${s.name} (opens in a new tab)`} className="grid size-11 place-items-center rounded-full hover:bg-blush">
                  <SocialIcon name={s.name} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div inert={sub === null} className={cn("absolute inset-0 overflow-y-auto bg-white transition-transform duration-300 ease-luxe", sub === null && "translate-x-full")}>
          <button type="button" onClick={() => setSub(null)} className="flex min-h-14 w-full items-center gap-3 border-b border-line bg-blush-soft px-5 text-left">
            <ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" />
            <span className="t-eyebrow">Back</span>
            <span className="ml-auto font-display text-lg">{item.label}</span>
          </button>
          <div className="px-5 py-6">
            {item.heading && <p className="mb-5 font-display text-2xl leading-tight">{item.heading}</p>}
            <Link to={item.to} className="btn btn-primary w-full">
              Shop all {item.label}
            </Link>
            {item.columns?.map((col) => (
              <div key={col.title} className="mt-7">
                <p className="t-eyebrow mb-2 text-muted">{col.title}</p>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="flex min-h-12 items-center gap-3 border-b border-line text-[17px]">
                        {l.swatch && <span className="size-4 rounded-full border border-black/10" style={{ background: l.swatch }} aria-hidden="true" />}
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {item.cards && (
              <div className="mt-7 grid grid-cols-2 gap-3">
                {item.cards.map((c) => (
                  <Link key={c.title} to={c.to} className="block">
                    <div className="aspect-[4/5] overflow-hidden rounded-xl bg-blush">
                      <Img k={c.image} className="size-full object-cover" />
                    </div>
                    <p className="mt-2 text-sm font-medium leading-tight">{c.title}</p>
                    <p className="text-[13px] text-muted">{c.caption}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
}

/* ── Predictive search ───────────────────────────────────────────────────── */
function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    setQ("");
    const t = setTimeout(() => input.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const term = q.trim();
  const results = useMemo(() => (term.length > 1 ? searchProducts(term) : []), [term]);
  const lower = term.toLowerCase();
  const cols = term.length > 1 ? Object.values(collections).filter((c) => c.title.toLowerCase().includes(lower)).slice(0, 5) : [];
  const articles = term.length > 1 ? posts.filter((p) => (p.title + p.tag).toLowerCase().includes(lower)).slice(0, 2) : [];
  const trending = products.filter((p) => p.bestSeller).slice(0, 4);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (term) navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className={cn("fixed inset-0 z-50", !open && "pointer-events-none")} inert={!open}>
      <div onClick={onClose} className={cn("absolute inset-0 bg-black/50 transition-opacity duration-300", open ? "opacity-100" : "opacity-0")} />
      <div role="dialog" aria-modal="true" aria-label="Search" className={cn("absolute inset-x-0 top-0 max-h-dvh overflow-y-auto bg-white shadow-2xl transition-[translate,opacity] duration-300 ease-luxe", open ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0")}>
        <div className="wrap py-4 md:py-8">
          <form role="search" onSubmit={submit} className="flex items-center gap-2 border-b border-black pb-2">
            <Search size={20} strokeWidth={1.5} className="shrink-0" aria-hidden="true" />
            <label htmlFor="predictive-search" className="sr-only">
              Search products
            </label>
            <input
              ref={input}
              id="predictive-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search shades, wefts, clip-ins…"
              autoComplete="off"
              className="h-12 min-w-0 flex-1 bg-transparent font-display text-xl outline-none placeholder:text-muted md:text-3xl"
            />
            <button type="button" onClick={onClose} aria-label="Close search" className="-mr-2 grid size-11 shrink-0 place-items-center rounded-full hover:bg-blush">
              <X size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </form>

          <div aria-live="polite" className="pb-4 pt-6">
            {term.length < 2 ? (
              <div className="grid gap-8 md:grid-cols-[14rem_1fr]">
                <div>
                  <p className="t-eyebrow mb-3 text-muted">Popular searches</p>
                  <ul className="flex flex-wrap gap-2 md:flex-col md:gap-1">
                    {settings.search.popular.map((s) => (
                      <li key={s}>
                        <button type="button" onClick={() => setQ(s)} className="rounded-full border border-line px-4 py-2 text-[15px] transition-colors hover:border-black md:border-0 md:px-0 md:py-1 md:hover:underline">
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="t-eyebrow mb-3 text-muted">Trending now</p>
                  <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {trending.map((p) => (
                      <li key={p.handle}>
                        <Link to={`/products/${p.handle}`} className="group block">
                          <div className="aspect-[4/5] overflow-hidden rounded-xl bg-blush">
                            <Img k={p.images[0]} alt="" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          </div>
                          <p className="mt-2 line-clamp-2 text-[15px] font-medium leading-snug">{p.title}</p>
                          <p className="text-sm text-muted">From {money(fromPrice(p).price)}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : results.length === 0 && cols.length === 0 ? (
              <div className="py-6">
                <p className="font-display text-2xl">No results for “{term}”</p>
                <p className="mt-2 text-muted">Try a shade name like “CEO” or a method like “tape in”.</p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-[1fr_16rem]">
                <div>
                  <p className="t-eyebrow mb-2 text-muted">Products</p>
                  <ul className="divide-y divide-line">
                    {results.slice(0, 5).map((p) => {
                      const { price, compareAt } = fromPrice(p);
                      return (
                        <li key={p.handle}>
                          <Link to={`/products/${p.handle}`} className="group flex items-center gap-4 py-3">
                            <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-blush">
                              <Img k={p.images[0]} alt="" className="size-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium leading-snug group-hover:underline">{p.title}</p>
                              <p className="text-sm text-muted">{LINE_INFO[p.line].label}</p>
                            </div>
                            <p className="shrink-0 text-right text-[15px]">
                              {money(price)}
                              {compareAt > price && <s className="block text-sm text-muted">{money(compareAt)}</s>}
                            </p>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  {results.length > 0 && (
                    <Link to={`/search?q=${encodeURIComponent(term)}`} className="btn btn-primary mt-5 w-full sm:w-auto">
                      View all {results.length} {results.length === 1 ? "result" : "results"}
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  )}
                </div>
                <div className="space-y-6">
                  {cols.length > 0 && (
                    <div>
                      <p className="t-eyebrow mb-2 text-muted">Collections</p>
                      <ul className="space-y-2">
                        {cols.map((c) => (
                          <li key={c.handle}>
                            <Link to={`/collections/${c.handle}`} className="link-grow">
                              {c.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {articles.length > 0 && (
                    <div>
                      <p className="t-eyebrow mb-2 text-muted">From the blog</p>
                      <ul className="space-y-2">
                        {articles.map((a) => (
                          <li key={a.slug}>
                            <Link to={`/blogs/introducing-reputation-extensions/${a.slug}`} className="link-grow">
                              {a.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
