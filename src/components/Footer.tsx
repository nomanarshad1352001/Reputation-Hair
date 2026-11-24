import { Link } from "react-router-dom";
import { ArrowUp, Mail, MessageCircleHeart } from "lucide-react";
import { settings } from "@/theme/settings";
import { EmailForm } from "@/components/ui";
import { PaymentRow, SOCIAL_HOVER, SocialIcon } from "@/components/BrandIcons";
import { TrustStrip } from "@/components/Boosters";
import { Logo } from "@/components/Header";
import { cn } from "@/utils/cn";

export function Footer() {
  const f = settings.footer;
  const b = settings.brand;
  return (
    <>
      <TrustStrip />
      <footer className="on-dark relative overflow-hidden bg-black text-white">
        {/* Newsletter + VIP text club */}
        <div className="wrap grid gap-10 border-b border-white/15 py-14 md:py-20 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div>
            <p className="t-eyebrow text-blush">Newsletter</p>
            <h2 className="mt-4 max-w-2xl text-[2rem] leading-[1.04] md:text-[3.2rem]">
              Special offers, free giveaways &amp; <em className="font-normal">once-in-a-lifetime deals.</em>
            </h2>
            <p className="mt-4 max-w-md text-white/75">Join the list and get 10% off your first order — plus first access to every drop.</p>
            <div className="mt-7 max-w-lg">
              <EmailForm source="footer" cta="Join" dark />
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-white/[0.06] p-7 ring-1 ring-white/10 md:p-9">
            <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-blush/20 blur-2xl" aria-hidden="true" />
            <MessageCircleHeart size={28} strokeWidth={1.25} className="text-blush" aria-hidden="true" />
            <p className="t-eyebrow mt-5 text-blush">VIP Text Club</p>
            <p className="mt-3 font-display text-[1.9rem] leading-tight">Join the Reputation VIP Text Club</p>
            <p className="mt-3 text-white/75">Early access to launches &amp; restocks and VIP-only offers — straight to your phone.</p>
            <Link to="/pages/join-the-reputation-vip-text-club" className="btn btn-blush mt-7">
              Sign up here
            </Link>
          </div>
        </div>

        {/* Brand + link columns */}
        <div className="wrap grid gap-12 py-14 md:py-16 lg:grid-cols-[1.1fr_2fr] lg:gap-16">
          <div>
            <Logo light className="w-52" />
            <p className="mt-6 max-w-xs text-white/75">{b.tagline} Mother, daughter, built with love.</p>
            <a href={`mailto:${b.email}`} className="mt-5 inline-flex items-center gap-2 text-white/90 underline-offset-4 hover:text-white hover:underline">
              <Mail size={16} aria-hidden="true" /> {b.email}
            </a>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Social media">
              {b.social.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${s.name} (opens in a new tab)`}
                    className={cn("grid size-11 place-items-center rounded-full border border-white/25 transition-all duration-300 hover:-translate-y-0.5", SOCIAL_HOVER[s.name])}
                  >
                    <SocialIcon name={s.name} size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {f.columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="t-eyebrow mb-4 text-blush">{col.title}</h3>
                <ul className="space-y-0.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="link-grow inline-block py-1.5 text-[15px] text-white/80 hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Payments + legal */}
        <div className="wrap flex flex-col gap-6 border-t border-white/15 py-8 md:flex-row md:items-center md:justify-between">
          <PaymentRow names={f.payments} />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
            <span>
              © {new Date().getFullYear()} {b.legalName}
            </span>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="inline-flex items-center gap-1.5 hover:text-white">
              <ArrowUp size={14} aria-hidden="true" /> Back to top
            </button>
          </div>
        </div>

        <p aria-hidden="true" className="footer-wordmark pointer-events-none select-none whitespace-nowrap text-center font-display">
          REPUTATION
        </p>
      </footer>
    </>
  );
}
