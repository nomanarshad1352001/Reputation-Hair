import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Gift, Lock, Plus, ShoppingBag, Sparkles, Trash2, X } from "lucide-react";
import { settings } from "@/theme/settings";
import { describeVariant, firstAvailable, fromPrice, getByTitle, isHair, isSoldOut, products, type Product } from "@/data/products";
import { useStore, type CartLine } from "@/lib/store";
import type { Totals } from "@/lib/pricing";
import { money } from "@/lib/utils";
import { Drawer, Img, Qty } from "@/components/ui";
import { CodeField, Installments, RewardsBar } from "@/components/Boosters";
import { PaymentRow } from "@/components/BrandIcons";

const O = settings.offers;

/* ── Line item ───────────────────────────────────────────────────────────── */
export function LineItem({ line, onNavigate }: { line: CartLine; onNavigate?: () => void }) {
  const { setQty, remove } = useStore();
  const { product: p, variant: v } = line;
  return (
    <li className="flex gap-4 py-5">
      <Link to={`/products/${p.handle}`} onClick={onNavigate} className="h-28 w-[5.5rem] shrink-0 overflow-hidden rounded-xl bg-blush" tabIndex={-1} aria-hidden="true">
        <Img k={line.image} alt="" className="size-full object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <Link to={`/products/${p.handle}`} onClick={onNavigate} className="font-medium leading-snug hover:underline">
            {p.title}
          </Link>
          <p className="shrink-0 text-right">
            <span className="font-medium">{money(v.price * line.qty)}</span>
            {v.compareAt > v.price && <s className="block text-sm text-muted">{money(v.compareAt * line.qty)}</s>}
          </p>
        </div>
        {describeVariant(p, v) && <p className="mt-0.5 text-sm text-muted">{describeVariant(p, v)}</p>}
        {v.stock <= 5 && <p className="mt-0.5 text-sm font-medium">Only {v.stock} left</p>}
        <div className="mt-auto flex items-center justify-between pt-2">
          <Qty small value={line.qty} max={v.stock} onChange={(n) => setQty(line.key, n)} label={`Quantity for ${p.title}`} />
          <button type="button" onClick={() => remove(line.key)} aria-label={`Remove ${p.title} from bag`} className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-blush hover:text-black">
            <Trash2 size={17} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  );
}

export function GiftLine() {
  return (
    <li className="flex animate-fade-up items-center gap-4 py-5">
      <div className="relative h-20 w-[5.5rem] shrink-0 overflow-hidden rounded-xl bg-blush">
        <Img k={O.gift.image} alt="" className="size-full object-cover" />
        <span className="absolute left-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-black text-white">
          <Gift size={12} aria-hidden="true" />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium leading-snug">FREE {O.gift.title}</p>
        <p className="text-sm text-muted">Your gift with purchase · a {money(O.gift.value)} value</p>
      </div>
      <p className="font-medium">$0</p>
    </li>
  );
}

/** Complete-the-install suggestions based on what's in the bag. */
export function crossSell(lines: CartLine[], limit = 3): Product[] {
  const inBag = new Set(lines.map((l) => l.product.handle));
  const lineSet = new Set(lines.map((l) => l.product.line));
  const want: string[] = [];
  if (lineSet.has("hybrid") || lineSet.has("original")) want.push("Reputation Extension Clips - 10 Pack", "Reputation Cotton Thread", "Hot Girl Hair Oil");
  if (lineSet.has("ktip")) want.push("Reputation Hair Extension Pliers", "Hot Girl Hair Oil");
  if (lineSet.has("tape")) want.push("Reputation Detangling Hairbrush", "Hot Girl Hair Oil");
  if (lineSet.has("seamless") || lineSet.has("laced")) want.push("Hot Girl Hair Oil", "Reputation Detangling Hairbrush", "Reputation Scrunchie");
  const picked = [...new Set(want)].map((t) => getByTitle(t)).filter((p): p is Product => !!p && !inBag.has(p.handle) && !isSoldOut(p));
  const fill = products.filter((p) => p.bestSeller && !inBag.has(p.handle) && !isSoldOut(p) && (lines.some((l) => isHair(l.product)) ? !isHair(p) : true));
  return [...new Set([...picked, ...fill])].slice(0, limit);
}

export function UpsellRow({ p }: { p: Product }) {
  const { add } = useStore();
  const { price, compareAt } = fromPrice(p);
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-blush-soft p-3">
      <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-blush">
        <Img k={p.images[0]} alt="" className="size-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium">{p.title}</p>
        <p className="text-sm text-muted">
          {money(price)} {compareAt > price && <s>{money(compareAt)}</s>}
        </p>
      </div>
      <button type="button" onClick={() => add(p, firstAvailable(p), 1, false)} aria-label={`Add ${p.title} to bag`} className="grid size-11 shrink-0 place-items-center rounded-full border border-black transition-colors hover:bg-black hover:text-white">
        <Plus size={18} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}

/* ── Totals breakdown ────────────────────────────────────────────────────── */
export function TotalsBreakdown({ totals, large }: { totals: Totals; large?: boolean }) {
  return (
    <dl className="space-y-2 text-[15px]">
      <div className="flex justify-between">
        <dt>Subtotal</dt>
        <dd>{money(totals.merch)}</dd>
      </div>
      {totals.auto.map((a) => (
        <div key={a.label} className="flex justify-between gap-3 text-muted">
          <dt className="flex items-center gap-1.5">
            <Sparkles size={13} aria-hidden="true" /> {a.label}
          </dt>
          <dd className="shrink-0">−{money(a.amount)}</dd>
        </div>
      ))}
      {totals.code && totals.code.amount > 0 && (
        <div className="flex justify-between text-muted">
          <dt>Code {totals.code.code}</dt>
          <dd>−{money(totals.code.amount)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt>Shipping</dt>
        <dd>{totals.freeShipping ? "Free (U.S.)" : "Calculated at checkout"}</dd>
      </div>
      <div className={large ? "flex justify-between border-t border-black/15 pt-4 text-xl font-medium" : "flex justify-between pt-1 text-lg font-medium"}>
        <dt>Total</dt>
        <dd>{money(totals.total)}</dd>
      </div>
      {totals.totalSavings > 0 && (
        <p className="rounded-full bg-black px-4 py-2 text-center text-sm font-medium text-white">You’re saving {money(totals.totalSavings)} today</p>
      )}
    </dl>
  );
}

/* ── Cart drawer ─────────────────────────────────────────────────────────── */
export function CartDrawer() {
  const { lines, count, totals, cartOpen, setCartOpen } = useStore();
  const close = () => setCartOpen(false);
  const loc = useLocation();
  useEffect(() => setCartOpen(false), [loc.pathname, setCartOpen]);
  const suggestions = crossSell(lines, 3);

  return (
    <Drawer open={cartOpen} onClose={close} side="right" label="Shopping bag">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
        <h2 className="text-2xl">
          Your bag <span className="font-sans text-base text-muted">({count})</span>
        </h2>
        <button type="button" onClick={close} aria-label="Close bag" className="-mr-2 grid size-11 place-items-center rounded-full hover:bg-blush">
          <X size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-8 py-8 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-blush">
            <ShoppingBag size={24} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <p className="mt-5 font-display text-2xl">Your bag is empty</p>
          <p className="mt-2 text-muted">Find your perfect match.</p>
          <div className="mt-6 grid w-full gap-2.5">
            {settings.home.categories.tiles.map((t) => (
              <Link key={t.title} to={t.to} className="btn btn-outline btn-sm w-full">
                {t.title}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto px-5">
            <div className="border-b border-line pb-2 pt-4">
              <RewardsBar totals={totals} />
            </div>
            {totals.nextTier && totals.hairPacks > 0 && (
              <p className="mt-4 flex items-center gap-2 rounded-2xl bg-blush-soft px-4 py-3 text-sm">
                <Sparkles size={15} aria-hidden="true" />
                Add {totals.nextTier.packs - totals.hairPacks} more {totals.nextTier.packs - totals.hairPacks === 1 ? "pack" : "packs"} to save {totals.nextTier.percent}% with Bundle &amp; Save
              </p>
            )}
            <ul className="divide-y divide-line">
              {lines.map((l) => (
                <LineItem key={l.key} line={l} onNavigate={close} />
              ))}
              {totals.gift && <GiftLine />}
            </ul>
            {suggestions.length > 0 && (
              <div className="border-t border-line py-5">
                <p className="t-eyebrow mb-3 text-muted">Complete your look</p>
                <div className="space-y-2.5">
                  {suggestions.map((p) => (
                    <UpsellRow key={p.handle} p={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="shrink-0 space-y-4 border-t border-line p-5">
            <CodeField />
            <TotalsBreakdown totals={totals} />
            <Link to="/checkout" className="btn btn-primary w-full">
              <Lock size={15} aria-hidden="true" /> Checkout · {money(totals.total)}
            </Link>
            <Installments amount={totals.total} className="justify-center text-sm" />
            <div className="flex items-center justify-between gap-3">
              <PaymentRow names={["visa", "mastercard", "amex", "paypal", "applepay", "shoppay"]} />
              <Link to="/cart" className="shrink-0 text-sm underline underline-offset-4">
                View bag
              </Link>
            </div>
          </div>
        </>
      )}
    </Drawer>
  );
}
