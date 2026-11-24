// Official brand marks (Simple Icons, CC0) for social links and accepted payment methods.
import { useId } from "react";
import {
  siAmericanexpress,
  siApplepay,
  siDinersclub,
  siDiscover,
  siFacebook,
  siGooglepay,
  siInstagram,
  siJcb,
  siMastercard,
  siPaypal,
  siPinterest,
  siTiktok,
  siVisa,
  siYoutube,
  type SimpleIcon,
} from "simple-icons";
import { cn } from "@/utils/cn";

const SOCIAL: Record<string, SimpleIcon> = {
  Instagram: siInstagram,
  TikTok: siTiktok,
  Facebook: siFacebook,
  Pinterest: siPinterest,
  YouTube: siYoutube,
};

export const SOCIAL_HOVER: Record<string, string> = {
  Instagram: "hover:bg-[linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)] hover:text-white hover:border-transparent",
  TikTok: "hover:bg-white hover:text-black hover:border-white",
  Facebook: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
  Pinterest: "hover:bg-[#E60023] hover:text-white hover:border-[#E60023]",
  YouTube: "hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]",
};

export function SocialIcon({ name, size = 18 }: { name: string; size?: number }) {
  const ic = SOCIAL[name] ?? siInstagram;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={ic.path} />
    </svg>
  );
}

const PAY: Record<string, { label: string; bg: string; fg: string; icon?: SimpleIcon; border?: boolean; pad?: number }> = {
  visa: { label: "Visa", bg: "#ffffff", fg: "#1434CB", icon: siVisa, border: true, pad: 6 },
  amex: { label: "American Express", bg: "#1F72CD", fg: "#ffffff", icon: siAmericanexpress, pad: 8 },
  discover: { label: "Discover", bg: "#ffffff", fg: "#231F20", icon: siDiscover, border: true, pad: 5 },
  paypal: { label: "PayPal", bg: "#ffffff", fg: "#003087", icon: siPaypal, border: true, pad: 9 },
  applepay: { label: "Apple Pay", bg: "#000000", fg: "#ffffff", icon: siApplepay, pad: 5 },
  googlepay: { label: "Google Pay", bg: "#ffffff", fg: "#3C4043", icon: siGooglepay, border: true, pad: 5 },
  diners: { label: "Diners Club", bg: "#ffffff", fg: "#004C97", icon: siDinersclub, border: true, pad: 9 },
  jcb: { label: "JCB", bg: "#ffffff", fg: "#0B4EA2", icon: siJcb, border: true, pad: 8 },
  mastercard: { label: "Mastercard", bg: "#ffffff", fg: "#000", icon: siMastercard, border: true },
  shoppay: { label: "Shop Pay", bg: "#5A31F4", fg: "#ffffff" },
};

export const payLabel = (name: string) => PAY[name]?.label ?? name;

export function PaymentBadge({ name, className }: { name: string; className?: string }) {
  const id = useId();
  const p = PAY[name];
  if (!p) return null;
  const W = 38;
  const H = 24;
  let inner: React.ReactNode;
  if (name === "mastercard") {
    inner = (
      <>
        <defs>
          <clipPath id={`${id}-mc`}>
            <circle cx="15.5" cy="12" r="6.5" />
          </clipPath>
        </defs>
        <circle cx="15.5" cy="12" r="6.5" fill="#EB001B" />
        <circle cx="22.5" cy="12" r="6.5" fill="#F79E1B" />
        <circle cx="22.5" cy="12" r="6.5" fill="#FF5F00" clipPath={`url(#${id}-mc)`} />
      </>
    );
  } else if (name === "shoppay") {
    inner = (
      <>
        <text x="5" y="15.6" fill="#fff" fontSize="9" fontWeight="800" fontFamily="system-ui,-apple-system,Segoe UI,sans-serif" letterSpacing="-0.3">
          shop
        </text>
        <rect x="24" y="6.5" width="10.5" height="11" rx="2.5" fill="#fff" />
        <text x="25.1" y="14.8" fill="#5A31F4" fontSize="6.4" fontWeight="800" fontFamily="system-ui,-apple-system,Segoe UI,sans-serif">
          Pay
        </text>
      </>
    );
  } else if (p.icon) {
    const pad = p.pad ?? 6;
    const size = H - pad;
    inner = (
      <svg x={(W - size * 1.25) / 2} y={pad / 2} width={size * 1.25} height={size} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
        <path d={p.icon.path} fill={p.fg} />
      </svg>
    );
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={p.label} className={cn("shrink-0", className)}>
      <rect x="0.5" y="0.5" width={W - 1} height={H - 1} rx="4" fill={p.bg} stroke={p.border ? "#d9d4d6" : p.bg} />
      {inner}
    </svg>
  );
}

export function PaymentRow({ names, className }: { names: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-1.5", className)} aria-label="Accepted payment methods">
      {names.map((n) => (
        <li key={n} title={payLabel(n)}>
          <PaymentBadge name={n} />
        </li>
      ))}
    </ul>
  );
}
