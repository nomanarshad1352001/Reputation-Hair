import { Link } from "react-router-dom";
import { ArrowRight, Lock, ShoppingBag, Sparkles } from "lucide-react";
import { settings } from "@/theme/settings";
import { describeVariant, products } from "@/data/products";
import { useStore } from "@/lib/store";
import { money, useSeo } from "@/lib/utils";
import { Crumbs, Img } from "@/components/ui";
import { crossSell, GiftLine, LineItem, TotalsBreakdown, UpsellRow } from "@/components/CartDrawer";
import { CodeField, Installments, RewardsBar, TrustBadges } from "@/components/Boosters";
import { PaymentRow } from "@/components/BrandIcons";
import { ProductCarousel } from "@/components/ProductCard";

function Summary({ cta }: { cta?: boolean }) {
  const { totals } = useStore();
  return (
    <div className="space-y-5 rounded-3xl bg-blush-soft p-6 md:p-8">
      <h2 className="t-h3">Order summary</h2>
      {cta && <CodeField />}
      <TotalsBreakdown totals={totals} large />
      <p className="text-sm text-muted">Taxes calculated at checkout. All sales are final.</p>
      {cta && (
        <>
          <Link to="/checkout" className="btn btn-primary w-full">
            <Lock size={15} aria-hidden="true" />
            Secure checkout
          </Link>
          <Installments amount={totals.total} className="justify-center text-sm" />
          <PaymentRow names={settings.footer.payments} className="justify-center" />
        </>
      )}
    </div>
  );
}

export default function CartPage() {
  const { lines, count, totals } = useStore();
  useSeo("Your bag");
  const upsell = crossSell(lines, 2);
  const also = crossSell(lines, 8);
  return (
    <div className="wrap py-8 md:py-14">
      <Crumbs items={[{ label: "Home", to: "/" }, { label: "Bag" }]} />
      <h1 className="t-h1 mt-4">
        Your bag {count > 0 && <span className="font-sans text-lg text-muted">({count})</span>}
      </h1>
      {lines.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-blush-soft px-6 py-16 text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-blush">
            <ShoppingBag size={24} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <p className="mt-5 font-display text-3xl">Nothing here yet</p>
          <p className="mt-2 text-muted">Start with the shades everyone’s reordering.</p>
          <Link to="/collections/best-sellers" className="btn btn-primary mt-6">
            Shop best sellers
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_25rem] lg:gap-14">
          <div>
            <div className="rounded-2xl border border-line p-5 pb-3">
              <RewardsBar totals={totals} />
            </div>
            {totals.nextTier && totals.hairPacks > 0 && (
              <p className="mt-4 flex items-center gap-2 rounded-2xl bg-blush-soft px-4 py-3 text-[15px]">
                <Sparkles size={15} aria-hidden="true" />
                Add {totals.nextTier.packs - totals.hairPacks} more {totals.nextTier.packs - totals.hairPacks === 1 ? "pack" : "packs"} to save {totals.nextTier.percent}% with Bundle &amp; Save
              </p>
            )}
            <ul className="mt-2 divide-y divide-line border-b border-line">
              {lines.map((l) => (
                <LineItem key={l.key} line={l} />
              ))}
              {totals.gift && <GiftLine />}
            </ul>
            {upsell.length > 0 && (
              <div className="mt-8">
                <h2 className="t-eyebrow mb-3 text-muted">Complete your look</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {upsell.map((p) => (
                    <UpsellRow key={p.handle} p={p} />
                  ))}
                </div>
              </div>
            )}
            <TrustBadges className="mt-8" />
          </div>
          <div className="lg:sticky lg:top-36 lg:self-start">
            <Summary cta />
            <Link to="/collections/all" className="mt-5 flex items-center justify-center gap-2 text-[15px] underline underline-offset-4">
              Continue shopping <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
      <section className="mt-16 overflow-hidden md:mt-24">
        <h2 className="t-h2 mb-8">You may also like</h2>
        <ProductCarousel items={also.length ? also : products.filter((p) => p.bestSeller)} label="Recommended products" />
      </section>
    </div>
  );
}

/* Checkout hand-off — on the live store this is Shopify's hosted checkout. */
export function CheckoutPage() {
  const { lines, totals } = useStore();
  useSeo("Checkout");
  return (
    <div className="wrap py-8 md:py-14">
      <Crumbs items={[{ label: "Home", to: "/" }, { label: "Bag", to: "/cart" }, { label: "Checkout" }]} />
      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_25rem] lg:gap-14">
        <div>
          <h1 className="t-h1">Checkout</h1>
          <div className="mt-6 rounded-3xl border border-line p-6 md:p-8">
            <p className="flex items-center gap-2 font-medium">
              <Lock size={17} aria-hidden="true" />
              This is where Shopify takes over.
            </p>
            <p className="mt-3 text-muted">
              You’re viewing a storefront preview, so no payment is taken here. On the live store this hands off to Shopify’s secure checkout with Shop Pay, Apple Pay, Google Pay and PayPal, live shipping rates, tax and the
              discounts shown in your bag.
            </p>
            <PaymentRow names={settings.footer.payments} className="mt-5" />
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/cart" className="btn btn-outline">
                Back to bag
              </Link>
              <Link to="/collections/all" className="btn btn-primary">
                Continue shopping
              </Link>
            </div>
          </div>
          {lines.length > 0 && (
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {lines.map((l) => (
                <li key={l.key} className="flex items-center gap-4 py-4">
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-blush">
                    <Img k={l.image} alt="" className="size-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{l.product.title}</p>
                    <p className="text-sm text-muted">
                      {describeVariant(l.product, l.variant)} · Qty {l.qty}
                    </p>
                  </div>
                  <p className="font-medium">{money(l.variant.price * l.qty)}</p>
                </li>
              ))}
              {totals.gift && <GiftLine />}
            </ul>
          )}
        </div>
        <div className="lg:sticky lg:top-36 lg:self-start">
          <Summary />
        </div>
      </div>
    </div>
  );
}
