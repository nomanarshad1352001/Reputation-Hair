import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Check, Copy, Plus, Star } from "lucide-react";
import { ALT, IMG, type ImgKey } from "@/data/images";
import { settings } from "@/theme/settings";
import { useStore } from "@/lib/store";
import { cn } from "@/utils/cn";
import { isEmail, load, save } from "@/lib/utils";

/* ── Image ───────────────────────────────────────────────────────────────── */
export function Img({ k, alt, className, eager }: { k: ImgKey; alt?: string; className?: string; eager?: boolean }) {
  return <img src={IMG[k]} alt={alt ?? ALT[k]} loading={eager ? "eager" : "lazy"} decoding="async" draggable={false} className={className} />;
}

/* ── Stars ───────────────────────────────────────────────────────────────── */
export function Stars({ value, size = 14, className }: { value: number; size?: number; className?: string }) {
  const row = (cls: string) => (
    <span className={cn("flex gap-0.5", cls)} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={size} fill="currentColor" strokeWidth={0} className="shrink-0" />
      ))}
    </span>
  );
  return (
    <span className={cn("relative inline-flex", className)} role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      {row("text-black/15")}
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${(value / 5) * 100}%` }}>
        {row("text-black")}
      </span>
    </span>
  );
}

/* ── Section heading ─────────────────────────────────────────────────────── */
export function SectionHead({ eyebrow, heading, body, align = "center", action, id }: { eyebrow?: string; heading: string; body?: string; align?: "center" | "left"; action?: ReactNode; id?: string }) {
  return (
    <div className={cn("mb-8 md:mb-12", align === "center" ? "text-center" : "flex items-end justify-between gap-6")}>
      <div>
        {eyebrow && <p className="t-eyebrow mb-3 text-muted">{eyebrow}</p>}
        <h2 id={id} className="t-h2">
          {heading}
        </h2>
        {body && <p className={cn("mt-3 text-muted", align === "center" && "mx-auto max-w-xl")}>{body}</p>}
      </div>
      {action}
    </div>
  );
}

/* ── Accordion ───────────────────────────────────────────────────────────── */
export function Accordion({ items, open: controlled, onChange, defaultOpen = -1 }: { items: { title: string; content: ReactNode }[]; open?: number; onChange?: (i: number) => void; defaultOpen?: number }) {
  const [inner, setInner] = useState(defaultOpen);
  const open = controlled ?? inner;
  const set = onChange ?? setInner;
  const id = useId();
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.title}>
            <h3 className="font-sans tracking-normal">
              <button type="button" aria-expanded={isOpen} aria-controls={`${id}-${i}`} id={`${id}-b-${i}`} onClick={() => set(isOpen ? -1 : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-medium">
                {it.title}
                <Plus size={18} strokeWidth={1.5} className={cn("shrink-0 transition-transform duration-300", isOpen && "rotate-45")} aria-hidden="true" />
              </button>
            </h3>
            <div id={`${id}-${i}`} role="region" aria-labelledby={`${id}-b-${i}`} inert={!isOpen} className={cn("grid transition-[grid-template-rows] duration-300 ease-luxe", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <div className="overflow-hidden">
                <div className="pb-6 pr-6 text-muted">{it.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Drawer / sheet with focus trap ──────────────────────────────────────── */
const SIDES = {
  left: ["inset-y-0 left-0 w-[88%] max-w-sm", "-translate-x-full"],
  right: ["inset-y-0 right-0 w-[92%] max-w-md", "translate-x-full"],
  sheet: [
    "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-3xl md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:w-[min(92vw,54rem)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl",
    "translate-y-full md:-translate-y-[46%] md:opacity-0",
  ],
  center: ["inset-x-3 top-1/2 -translate-y-1/2 rounded-3xl sm:inset-x-auto sm:left-1/2 sm:w-[min(94vw,52rem)] sm:-translate-x-1/2", "opacity-0 scale-95"],
} as const;

export function Drawer({ open, onClose, side = "right", label, children, className }: { open: boolean; onClose: () => void; side?: keyof typeof SIDES; label: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !ref.current) return;
      const focusable = [...ref.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(
        (el) => !el.closest("[inert]") && el.offsetParent !== null,
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const lastFocus = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      lastFocus?.focus?.();
    };
  }, [open, onClose]);

  const [base, closed] = SIDES[side];
  return (
    <div className={cn("fixed inset-0 z-50", !open && "pointer-events-none")} inert={!open}>
      <div onClick={onClose} className={cn("absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300", open ? "opacity-100" : "opacity-0")} />
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={cn("absolute flex flex-col overflow-hidden bg-white shadow-2xl outline-none transition-[translate,opacity,scale] duration-[380ms] ease-luxe", base, !open && closed, className)}
      >
        {children}
      </div>
    </div>
  );
}

/* ── Code chip with copy + apply ─────────────────────────────────────────── */
export function CodeReveal({ code, dark }: { code: string; dark?: boolean }) {
  const { applyCode, code: applied } = useStore();
  const [copied, setCopied] = useState(false);
  const isApplied = applied === code;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={cn("inline-flex h-11 items-center rounded-full border border-dashed px-5 font-medium tracking-[0.2em]", dark ? "border-blush text-blush" : "border-black")}>{code}</span>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(code).catch(() => undefined);
          setCopied(true);
        }}
        className={cn("inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm", dark ? "bg-white/10 hover:bg-white/20" : "bg-blush hover:bg-blush-deep")}
      >
        {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
        {copied ? "Copied" : "Copy"}
      </button>
      <button type="button" disabled={isApplied} onClick={() => applyCode(code)} className={cn("btn btn-sm", dark ? "btn-blush" : "btn-primary")}>
        {isApplied ? "Applied to bag ✓" : "Apply to my bag"}
      </button>
    </div>
  );
}

/* ── Email capture (stores locally; maps to Shopify customer form / Klaviyo) ─ */
export function EmailForm({ source, cta, dark, withPhone, onDone }: { source: string; cta: string; dark?: boolean; withPhone?: boolean; onDone?: () => void }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const code = settings.offers.signupCode;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    const list = load<{ email: string; phone?: string; source: string }[]>("rep_subscribers", []);
    save("rep_subscribers", [...list, { email: email.trim(), phone: phone.trim() || undefined, source }]);
    setError("");
    setDone(true);
    onDone?.();
  };

  if (done) {
    return (
      <div role="status" className={cn("space-y-3", dark ? "text-white" : "text-black")}>
        <p className="flex items-start gap-3 text-base">
          <span className={cn("mt-0.5 grid size-6 shrink-0 place-items-center rounded-full", dark ? "bg-blush text-black" : "bg-black text-white")}>
            <Check size={14} strokeWidth={2.5} aria-hidden="true" />
          </span>
          You’re in! Here’s 10% off your first order:
        </p>
        <CodeReveal code={code} dark={dark} />
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="w-full">
      <div className={cn("flex flex-col gap-3", !withPhone && "sm:flex-row")}>
        <div className="flex-1">
          <label htmlFor={`${id}-e`} className="sr-only">
            Email address
          </label>
          <input id={`${id}-e`} type="email" autoComplete="email" inputMode="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={cn("field", dark && "border-white")} />
        </div>
        {withPhone && (
          <div>
            <label htmlFor={`${id}-p`} className="sr-only">
              Mobile number (optional)
            </label>
            <input id={`${id}-p`} type="tel" autoComplete="tel" placeholder="Mobile number (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} className={cn("field", dark && "border-white")} />
          </div>
        )}
        <button type="submit" className={cn("btn shrink-0", dark ? "btn-blush" : "btn-primary")}>
          {cta}
        </button>
      </div>
      {error && (
        <p id={`${id}-err`} role="alert" className={cn("mt-2 pl-5 text-sm", dark ? "text-blush" : "text-black")}>
          {error}
        </p>
      )}
    </form>
  );
}

/* ── Quantity stepper ────────────────────────────────────────────────────── */
export function Qty({ value, max, onChange, small, label = "Quantity" }: { value: number; max: number; onChange: (n: number) => void; small?: boolean; label?: string }) {
  const b = cn("grid place-items-center transition-colors hover:bg-blush disabled:opacity-30 disabled:hover:bg-transparent", small ? "size-9" : "size-12");
  return (
    <div className="inline-flex items-center rounded-full border border-black" role="group" aria-label={label}>
      <button type="button" className={cn(b, "rounded-l-full")} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        −
      </button>
      <span className={cn("text-center tabular-nums", small ? "w-7 text-sm" : "w-9")} aria-live="polite">
        {value}
      </span>
      <button type="button" className={cn(b, "rounded-r-full")} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}

/* ── Breadcrumbs ─────────────────────────────────────────────────────────── */
export function Crumbs({ items, className }: { items: { label: string; to?: string }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm text-muted", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((c, i) => (
          <li key={c.label + i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {c.to ? (
              <Link to={c.to} className="link-grow">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-black">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
