import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { collections, fromPrice, groupsOf, isSoldOut, lengthsOf, METHOD_FILTERS, onSale, products, productsIn, searchProducts, type Product } from "@/data/products";
import { settings } from "@/theme/settings";
import { useSeo } from "@/lib/utils";
import { cn } from "@/utils/cn";
import { Crumbs, Drawer, Img } from "@/components/ui";
import { ProductCard, ProductCarousel } from "@/components/ProductCard";
import { NotFound } from "@/pages/Content";

const PRICE = [
  { id: "under-50", label: "Under $50", min: 0, max: 50 },
  { id: "50-350", label: "$50 – $350", min: 50, max: 350 },
  { id: "350-450", label: "$350 – $450", min: 350, max: 450 },
  { id: "450-plus", label: "$450 and up", min: 450, max: Infinity },
];
const SHADE_GROUPS = [
  { id: "Blondes", swatch: "linear-gradient(135deg,#f0e2c3,#c3955a)" },
  { id: "Brondes", swatch: "linear-gradient(135deg,#c9aa80,#5b3f2e)" },
  { id: "Brunettes", swatch: "linear-gradient(135deg,#5c3e2c,#100c0b)" },
];
const SORTS: [string, string][] = [
  ["featured", "Featured"],
  ["best-selling", "Best selling"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["newest", "Newest"],
];
const FILTER_KEYS = ["stock", "sale", "price", "method", "shade", "length"];
const PAGE = 8;

function useFilters() {
  const [sp, setSp] = useSearchParams();
  const list = (k: string) => sp.get(k)?.split(",").filter(Boolean) ?? [];
  const update = (fn: (n: URLSearchParams) => void) => {
    const n = new URLSearchParams(sp);
    fn(n);
    setSp(n, { replace: true });
  };
  const toggle = (k: string, v: string) =>
    update((n) => {
      const cur = new Set(list(k));
      if (cur.has(v)) cur.delete(v);
      else cur.add(v);
      if (cur.size) n.set(k, [...cur].join(","));
      else n.delete(k);
    });
  const setOne = (k: string, v: string) => update((n) => (v ? n.set(k, v) : n.delete(k)));
  const clear = () => update((n) => FILTER_KEYS.forEach((k) => n.delete(k)));
  return { sp, list, toggle, setOne, clear };
}
type Filters = ReturnType<typeof useFilters>;

function FilterPanel({ f, base }: { f: Filters; base: Product[] }) {
  const facets = useMemo(() => {
    const methods = METHOD_FILTERS.filter((m) => base.some((p) => m.lines.includes(p.line)));
    const shades = SHADE_GROUPS.filter((g) => base.some((p) => groupsOf(p).includes(g.id as never)));
    const lengths = [...new Set(base.flatMap(lengthsOf))].sort((a, b) => a - b);
    return { methods, shades, lengths };
  }, [base]);

  const check = (k: string, v: string, label: string) => (
    <label key={v} className="flex min-h-11 cursor-pointer items-center gap-3 text-base">
      <input type="checkbox" checked={f.list(k).includes(v)} onChange={() => f.toggle(k, v)} className="size-5 shrink-0 rounded accent-black" />
      {label}
    </label>
  );
  const group = "mb-6 border-b border-line pb-4";
  const legend = "t-eyebrow mb-2";

  return (
    <div>
      <fieldset className={group}>
        <legend className={legend}>Availability</legend>
        {check("stock", "1", "In stock only")}
        {check("sale", "1", "On sale")}
      </fieldset>
      {facets.methods.length > 1 && (
        <fieldset className={group}>
          <legend className={legend}>Method</legend>
          {facets.methods.map((m) => check("method", m.id, m.label))}
        </fieldset>
      )}
      {facets.shades.length > 0 && (
        <fieldset className={group}>
          <legend className={legend}>Shade</legend>
          {facets.shades.map((g) => {
            const on = f.list("shade").includes(g.id);
            return (
              <button key={g.id} type="button" aria-pressed={on} onClick={() => f.toggle("shade", g.id)} className="flex min-h-11 w-full items-center gap-3 text-left text-base">
                <span className={cn("grid size-8 shrink-0 place-items-center rounded-full border p-[3px] transition-colors", on ? "border-black" : "border-transparent")}>
                  <span className="size-full rounded-full border border-black/15" style={{ background: g.swatch }} />
                </span>
                <span className={cn(on && "font-medium")}>{g.id}</span>
              </button>
            );
          })}
        </fieldset>
      )}
      {facets.lengths.length > 0 && (
        <fieldset className={group}>
          <legend className={legend}>Length</legend>
          <div className="grid grid-cols-5 gap-2 lg:grid-cols-4">
            {facets.lengths.map((l) => {
              const on = f.list("length").includes(String(l));
              return (
                <button
                  key={l}
                  type="button"
                  aria-pressed={on}
                  aria-label={`${l} inches`}
                  onClick={() => f.toggle("length", String(l))}
                  className={cn("min-h-11 rounded-full border text-[15px] tabular-nums transition-colors", on ? "border-black bg-black text-white" : "border-black/25 hover:border-black")}
                >
                  {l}″
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
      <fieldset className={cn(group, "mb-0 border-b-0")}>
        <legend className={legend}>Price</legend>
        {PRICE.map((r) => check("price", r.id, r.label))}
      </fieldset>
    </div>
  );
}

export function ProductListing({ base }: { base: Product[] }) {
  const f = useFilters();
  const [drawer, setDrawer] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const key = f.sp.toString();
  useEffect(() => setShown(PAGE), [key]);
  const sort = f.sp.get("sort") ?? "featured";

  const filtered = useMemo(() => {
    const stock = f.list("stock").length > 0;
    const sale = f.list("sale").length > 0;
    const price = PRICE.filter((r) => f.list("price").includes(r.id));
    const method = METHOD_FILTERS.filter((m) => f.list("method").includes(m.id)).flatMap((m) => m.lines);
    const shade = f.list("shade");
    const length = f.list("length").map(Number);
    const out = base.filter((p) => {
      const from = fromPrice(p).price;
      if (stock && isSoldOut(p)) return false;
      if (sale && !onSale(p)) return false;
      if (price.length && !price.some((r) => from >= r.min && from < r.max)) return false;
      if (method.length && !method.includes(p.line)) return false;
      if (shade.length && !groupsOf(p).some((g) => shade.includes(g))) return false;
      if (length.length && !lengthsOf(p).some((l) => length.includes(l))) return false;
      return true;
    });
    const order = new Map(base.map((p, i) => [p.handle, i]));
    const by: Record<string, (a: Product, b: Product) => number> = {
      featured: (a, b) => (order.get(a.handle) ?? 0) - (order.get(b.handle) ?? 0),
      "best-selling": (a, b) => a.salesRank - b.salesRank,
      "price-asc": (a, b) => fromPrice(a).price - fromPrice(b).price,
      "price-desc": (a, b) => fromPrice(b).price - fromPrice(a).price,
      newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
    };
    return [...out].sort(by[sort] ?? by.featured);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, key]);

  const methodLabel = (id: string) => METHOD_FILTERS.find((m) => m.id === id)?.label ?? id;
  const chips = [
    ...f.list("stock").map((v) => ({ k: "stock", v, label: "In stock" })),
    ...f.list("sale").map((v) => ({ k: "sale", v, label: "On sale" })),
    ...f.list("method").map((v) => ({ k: "method", v, label: methodLabel(v) })),
    ...f.list("shade").map((v) => ({ k: "shade", v, label: v })),
    ...f.list("length").map((v) => ({ k: "length", v, label: `${v}″` })),
    ...f.list("price").map((v) => ({ k: "price", v, label: PRICE.find((r) => r.id === v)?.label ?? v })),
  ];

  return (
    <div className="wrap pb-16 md:pb-24">
      <div className="sticky top-14 z-30 -mx-5 flex items-center justify-between gap-3 border-b border-line bg-white/95 px-5 py-3 backdrop-blur md:-mx-10 md:px-10 lg:static lg:mx-0 lg:border-0 lg:px-0 lg:py-6">
        <button type="button" onClick={() => setDrawer(true)} className="btn btn-outline btn-sm lg:hidden">
          <SlidersHorizontal size={16} aria-hidden="true" />
          Filter{chips.length > 0 && ` (${chips.length})`}
        </button>
        <p className="hidden text-[15px] text-muted lg:block" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="hidden text-[15px] text-muted sm:block">
            Sort by
          </label>
          <select id="sort" aria-label="Sort products" value={sort} onChange={(e) => f.setOne("sort", e.target.value === "featured" ? "" : e.target.value)} className="h-11 rounded-full border border-black bg-white pl-4 pr-9 text-[15px]">
            {SORTS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 grid gap-10 lg:mt-0 lg:grid-cols-[15rem_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-36 max-h-[calc(100dvh-10rem)] overflow-y-auto pr-3">
            <FilterPanel f={f} base={base} />
          </div>
        </aside>
        <div>
          {chips.length > 0 && (
            <ul className="mb-5 flex flex-wrap items-center gap-2" aria-label="Active filters">
              {chips.map((c) => (
                <li key={c.k + c.v}>
                  <button type="button" onClick={() => f.toggle(c.k, c.v)} aria-label={`Remove filter ${c.label}`} className="flex min-h-10 items-center gap-1.5 rounded-full bg-blush pl-4 pr-3 text-[15px] transition-colors hover:bg-blush-deep">
                    {c.label}
                    <X size={14} aria-hidden="true" />
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={f.clear} className="px-2 text-[15px] underline underline-offset-4">
                  Clear all
                </button>
              </li>
            </ul>
          )}
          <p className="mb-4 text-[15px] text-muted lg:hidden" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
          {filtered.length === 0 ? (
            <div className="rounded-3xl bg-blush-soft px-6 py-16 text-center">
              <p className="font-display text-3xl">No matches — yet.</p>
              <p className="mx-auto mt-3 max-w-sm text-muted">Try removing a filter or two. New shades are added regularly.</p>
              <button type="button" onClick={f.clear} className="btn btn-primary mt-6">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-12 xl:grid-cols-4">
                {filtered.slice(0, shown).map((p) => (
                  <li key={p.handle} className="animate-fade-up">
                    <ProductCard p={p} />
                  </li>
                ))}
              </ul>
              <div className="mt-12 text-center">
                <p className="text-[15px] text-muted">
                  Showing {Math.min(shown, filtered.length)} of {filtered.length}
                </p>
                <div className="mx-auto mt-3 h-0.5 w-40 overflow-hidden rounded bg-line" aria-hidden="true">
                  <div className="h-full bg-black transition-[width] duration-500" style={{ width: `${(Math.min(shown, filtered.length) / filtered.length) * 100}%` }} />
                </div>
                {shown < filtered.length && (
                  <button type="button" className="btn btn-outline mt-6" onClick={() => setShown((s) => s + PAGE)}>
                    Load more
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Drawer open={drawer} onClose={() => setDrawer(false)} side="left" label="Filters" className="lg:hidden">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-5">
          <span className="t-eyebrow">Filter</span>
          <button type="button" onClick={() => setDrawer(false)} aria-label="Close filters" className="-mr-2 grid size-11 place-items-center rounded-full hover:bg-blush">
            <X size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <FilterPanel f={f} base={base} />
        </div>
        <div className="flex shrink-0 gap-3 border-t border-line p-4">
          <button type="button" className="btn btn-outline btn-sm flex-1" onClick={f.clear} disabled={chips.length === 0}>
            Clear
          </button>
          <button type="button" className="btn btn-primary btn-sm flex-[2]" onClick={() => setDrawer(false)}>
            Show {filtered.length} {filtered.length === 1 ? "result" : "results"}
          </button>
        </div>
      </Drawer>
    </div>
  );
}

export default function CollectionPage() {
  const { handle = "all" } = useParams();
  const col = collections[handle];
  useSeo(col ? col.title : "Collection not found", col?.seo);
  const base = useMemo(() => productsIn(handle), [handle]);
  if (!col) return <NotFound />;
  return (
    <>
      <section className="relative overflow-hidden bg-blush">
        <div className="wrap flex items-stretch gap-5 md:gap-10">
          <div className="flex-1 py-8 md:py-16">
            <Crumbs items={[{ label: "Home", to: "/" }, { label: col.title }]} />
            <p className="t-eyebrow mt-6 text-muted">{col.eyebrow}</p>
            <h1 className="t-h1 mt-3">{col.title}</h1>
            <p className="t-lead mt-3 max-w-md">{col.intro}</p>
          </div>
          <div className="relative my-6 w-28 shrink-0 overflow-hidden rounded-2xl sm:w-44 md:my-0 md:w-[44%] md:rounded-none">
            <Img k={col.image} eager className="absolute inset-0 size-full object-cover object-[50%_20%]" />
          </div>
        </div>
      </section>
      <ProductListing key={handle} base={base} />
    </>
  );
}

export function SearchPage() {
  const [sp, setSp] = useSearchParams();
  const q = sp.get("q") ?? "";
  const [val, setVal] = useState(q);
  useEffect(() => setVal(q), [q]);
  useSeo(q ? `Search: ${q}` : "Search");
  const results = useMemo(() => searchProducts(q), [q]);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSp(val.trim() ? { q: val.trim() } : {});
  };
  return (
    <>
      <section className="bg-blush">
        <div className="wrap max-w-3xl py-10 text-center md:py-16">
          <h1 className="t-h1">{q ? <>Results for “{q}”</> : "Search"}</h1>
          <form role="search" onSubmit={submit} className="relative mx-auto mt-6 max-w-xl">
            <label htmlFor="search-page" className="sr-only">
              Search products
            </label>
            <input id="search-page" type="search" value={val} onChange={(e) => setVal(e.target.value)} placeholder="Search shades, wefts, clip-ins…" className="field pr-14" />
            <button type="submit" aria-label="Submit search" className="absolute right-1.5 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black text-white">
              <Search size={18} aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>
      {results.length > 0 ? (
        <ProductListing key={q} base={results} />
      ) : (
        <div className="wrap section">
          <div className="mx-auto max-w-xl text-center">
            <p className="font-display text-3xl">{q ? "We couldn’t find a match." : "What are you looking for?"}</p>
            <p className="mt-3 text-muted">Try one of these popular searches.</p>
            <ul className="mt-5 flex flex-wrap justify-center gap-2">
              {settings.search.popular.map((s) => (
                <li key={s}>
                  <Link to={`/search?q=${encodeURIComponent(s)}`} className="inline-flex min-h-11 items-center rounded-full border border-black px-5 transition-colors hover:bg-black hover:text-white">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-16">
            <h2 className="t-h3 mb-6">Best sellers</h2>
            <ProductCarousel items={products.filter((p) => p.bestSeller)} label="Best sellers" />
          </div>
        </div>
      )}
    </>
  );
}
