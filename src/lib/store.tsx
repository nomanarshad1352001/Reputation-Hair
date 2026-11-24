import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct, imageFor, variantById, type Product, type Variant } from "@/data/products";
import { settings } from "@/theme/settings";
import { computeTotals, type CartLine, type Totals } from "@/lib/pricing";
import { load, save } from "@/lib/utils";

export type { CartLine } from "@/lib/pricing";

interface StoredItem {
  handle: string;
  variantId: string;
  qty: number;
}

interface Store {
  lines: CartLine[];
  count: number;
  totals: Totals;
  add: (p: Product, v: Variant, qty?: number, open?: boolean) => void;
  addMany: (items: { p: Product; v: Variant; qty: number }[]) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  code: string;
  applyCode: (code: string) => { ok: boolean; message: string };
  clearCode: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  quickAdd: Product | null;
  setQuickAdd: (p: Product | null) => void;
  wheelOpen: boolean;
  setWheelOpen: (v: boolean) => void;
  recent: string[];
  pushRecent: (handle: string) => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<StoredItem[]>(() => load<StoredItem[]>("rep_bag", []).filter((i) => i && i.variantId));
  const [code, setCode] = useState<string>(() => load("rep_code", ""));
  const [cartOpen, setCartOpen] = useState(false);
  const [quickAdd, setQuickAdd] = useState<Product | null>(null);
  const [wheelOpen, setWheelOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>(() => load("rep_recent", []));

  useEffect(() => save("rep_bag", items), [items]);
  useEffect(() => save("rep_code", code), [code]);
  useEffect(() => save("rep_recent", recent), [recent]);

  const lines = useMemo<CartLine[]>(
    () =>
      items.flatMap((it) => {
        const product = getProduct(it.handle);
        const variant = product && variantById(product, it.variantId);
        if (!product || !variant) return [];
        return [{ key: variant.id, product, variant, qty: it.qty, image: imageFor(product, variant) }];
      }),
    [items],
  );

  const add = useCallback((p: Product, v: Variant, qty = 1, open = true) => {
    if (!v.available) return;
    setItems((prev) => {
      const found = prev.find((it) => it.variantId === v.id);
      if (found) return prev.map((it) => (it === found ? { ...it, qty: Math.min(v.stock, it.qty + qty) } : it));
      return [...prev, { handle: p.handle, variantId: v.id, qty: Math.min(v.stock, qty) }];
    });
    setQuickAdd(null);
    if (open) setCartOpen(true);
  }, []);

  const addMany = useCallback((list: { p: Product; v: Variant; qty: number }[]) => {
    setItems((prev) => {
      let next = [...prev];
      for (const { p, v, qty } of list) {
        if (!v.available) continue;
        const found = next.find((it) => it.variantId === v.id);
        next = found
          ? next.map((it) => (it === found ? { ...it, qty: Math.min(v.stock, it.qty + qty) } : it))
          : [...next, { handle: p.handle, variantId: v.id, qty: Math.min(v.stock, qty) }];
      }
      return next;
    });
    setCartOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      prev.flatMap((it) => {
        if (it.variantId !== key) return [it];
        const p = getProduct(it.handle);
        const max = p ? variantById(p, it.variantId)?.stock ?? 1 : 1;
        const n = Math.max(0, Math.min(max, qty));
        return n === 0 ? [] : [{ ...it, qty: n }];
      }),
    );
  }, []);

  const remove = useCallback((key: string) => setItems((prev) => prev.filter((it) => it.variantId !== key)), []);

  const applyCode = useCallback((raw: string) => {
    const c = raw.trim().toUpperCase();
    const def = settings.offers.codes[c];
    if (!def) return { ok: false, message: "That code isn’t valid. Check the spelling and try again." };
    setCode(c);
    return { ok: true, message: `${c} applied — ${def.label}` };
  }, []);

  const clearCode = useCallback(() => setCode(""), []);
  const pushRecent = useCallback((h: string) => setRecent((prev) => [h, ...prev.filter((x) => x !== h)].slice(0, 10)), []);

  const value = useMemo<Store>(() => {
    const totals = computeTotals(lines, code, Date.now());
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      totals,
      add,
      addMany,
      setQty,
      remove,
      code,
      applyCode,
      clearCode,
      cartOpen,
      setCartOpen,
      quickAdd,
      setQuickAdd,
      wheelOpen,
      setWheelOpen,
      recent,
      pushRecent,
    };
  }, [lines, code, add, addMany, setQty, remove, applyCode, clearCode, cartOpen, quickAdd, wheelOpen, recent, pushRecent]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
