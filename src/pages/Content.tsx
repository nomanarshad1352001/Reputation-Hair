import { useState, type ComponentType, type FormEvent, type ReactNode } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, Check, Clock, Mail, MapPin, MessageCircleHeart, Scissors } from "lucide-react";
import { settings } from "@/theme/settings";
import { care, education, faqs, founders, methods, policies, posts, salons, whyStylists } from "@/data/content";
import { PAGE_ALIASES, products, productsIn } from "@/data/products";
import type { ImgKey } from "@/data/images";
import { formatDate, isEmail, load, save, useSeo } from "@/lib/utils";
import { Accordion, Crumbs, EmailForm, Img } from "@/components/ui";
import { ProductCarousel } from "@/components/ProductCard";
import { PostCard } from "@/sections/home";

/* ── Shared ──────────────────────────────────────────────────────────────── */
function PageHero({ title, intro, crumbs, eyebrow, image }: { title: string; intro?: string; crumbs: { label: string; to?: string }[]; eyebrow?: string; image?: ImgKey }) {
  return (
    <section className="bg-blush">
      <div className={image ? "wrap grid items-center gap-8 py-9 md:grid-cols-2 md:gap-14 md:py-16" : "wrap py-9 md:py-16"}>
        <div>
          <Crumbs items={[{ label: "Home", to: "/" }, ...crumbs]} />
          {eyebrow && <p className="t-eyebrow mt-6">{eyebrow}</p>}
          <h1 className="t-h1 mt-4 max-w-3xl">{title}</h1>
          {intro && <p className="t-lead mt-4 max-w-xl">{intro}</p>}
        </div>
        {image && (
          <div className="aspect-[5/4] overflow-hidden rounded-[2rem]">
            <Img k={image} eager className="size-full object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}

function Success({ children }: { children: ReactNode }) {
  return (
    <div role="status" className="flex items-start gap-4 rounded-3xl bg-blush p-6 md:p-8">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-black text-white">
        <Check size={18} aria-hidden="true" />
      </span>
      <div>{children}</div>
    </div>
  );
}

function Field({ id, label, value, onChange, error, type = "text", autoComplete, placeholder, textarea }: { id: string; label: string; value: string; onChange: (v: string) => void; error?: string; type?: string; autoComplete?: string; placeholder?: string; textarea?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[15px] font-medium">
        {label}
      </label>
      {textarea ? (
        <textarea id={id} className="field" value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} />
      ) : (
        <input id={id} type={type} autoComplete={autoComplete} placeholder={placeholder} className="field" value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} />
      )}
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 pl-5 text-sm font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

const US_MAP = "https://www.openstreetmap.org/export/embed.html?bbox=-125.5%2C24.0%2C-66.5%2C50.0&layer=mapnik";

/* ── About ───────────────────────────────────────────────────────────────── */
export function AboutPage() {
  useSeo("About Us — Luxury Hair, built by stylists", founders.about[0]);
  return (
    <>
      <section className="bg-blush">
        <div className="wrap grid items-center gap-8 py-9 md:grid-cols-2 md:gap-14 md:py-16">
          <div>
            <Crumbs items={[{ label: "Home", to: "/" }, { label: "About us" }]} />
            <p className="t-eyebrow mt-6">About us</p>
            <h1 className="t-display mt-4">
              Luxury hair, <em className="font-normal">built by stylists.</em>
            </h1>
            <p className="t-lead mt-5 max-w-md">Get to know Reputation &amp; our founders.</p>
          </div>
          <div className="aspect-square overflow-hidden rounded-[2rem]">
            <Img k="founders" eager className="size-full object-cover" />
          </div>
        </div>
      </section>

      <section id="founders" className="section scroll-mt-32" aria-labelledby="f-h">
        <div className="wrap grid gap-10 md:grid-cols-[1fr_1.25fr] md:gap-20">
          <div>
            <p className="t-eyebrow text-muted">Meet the founders</p>
            <h2 id="f-h" className="t-h2 mt-3">
              {founders.names}
            </h2>
            <p className="mt-5 font-display text-3xl italic">{founders.signature}</p>
          </div>
          <div className="t-lead space-y-5 text-muted">
            {founders.about.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <p className="text-black">{founders.tagline}</p>
          </div>
        </div>
      </section>

      <section className="section bg-blush-soft" aria-labelledby="story-h">
        <div className="wrap grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-blush md:order-2">
            <Img k="edSalon" className="size-full object-cover" />
          </div>
          <div>
            <p className="t-eyebrow mb-4 text-muted">Our story</p>
            <h2 id="story-h" className="t-h1">
              {founders.heading}
            </h2>
            <div className="t-lead mt-6 space-y-4 text-muted">
              {founders.story.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="why" className="section scroll-mt-32" aria-labelledby="why-h">
        <div className="wrap">
          <div className="mb-10 text-center md:mb-14">
            <p className="t-eyebrow mb-3 text-muted">Our methods</p>
            <h2 id="why-h" className="t-h2">
              100% Remy human hair, four ways
            </h2>
          </div>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {methods.map((m) => (
              <li key={m.title}>
                <Link to={m.to} className="group block">
                  <div className="aspect-square overflow-hidden rounded-3xl bg-blush">
                    <Img k={m.image} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <h3 className="t-h3 mt-4">{m.title}</h3>
                  <p className="mt-1 text-[15px] text-muted">{m.body}</p>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-14 grid gap-8 rounded-3xl bg-blush p-7 md:grid-cols-[1fr_1.4fr] md:p-12">
            <h3 className="t-h2">Why stylists love Reputation</h3>
            <div>
              <ul className="space-y-3">
                {whyStylists.map((w) => (
                  <li key={w} className="flex items-start gap-3 text-[17px]">
                    <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-black text-white">
                      <Check size={12} aria-hidden="true" />
                    </span>
                    {w}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-muted">Each color is custom-developed to reflect real salon techniques like balayage, rooted blondes, dimensional brunettes, and lived-in color.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="on-dark section bg-black text-white" aria-labelledby="edu-h">
        <div className="wrap grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="t-eyebrow text-blush">Hair extension education &amp; training</p>
            <h2 id="edu-h" className="t-h1 mt-4">
              Education is at the core of our brand.
            </h2>
            <p className="t-lead mt-5 text-white/80">{education.intro}</p>
            <Link to="/collections/education" className="btn btn-blush mt-8">
              Reputation Courses
            </Link>
          </div>
          <div className="rounded-3xl bg-white/[0.06] p-7 ring-1 ring-white/10 md:p-9">
            <p className="t-eyebrow text-blush">What we teach</p>
            <ul className="mt-5 space-y-4">
              {education.teach.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[17px]">
                  <Scissors size={18} className="mt-1 shrink-0 text-blush" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-white/70">{education.goal}</p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="salon-h">
        <div className="wrap">
          <p className="t-eyebrow mb-3 text-muted">Luxury salon experience &amp; community</p>
          <h2 id="salon-h" className="t-h2">
            Two studios, one Reputation standard
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {salons.map((s) => (
              <li key={s.name} className="rounded-3xl border border-line p-7">
                <p className="t-eyebrow text-muted">{s.location}</p>
                <h3 className="t-h3 mt-2">{s.name}</h3>
                <p className="mt-1 text-[15px]">Led by {s.lead}</p>
                <p className="mt-3 text-muted">{s.body}</p>
              </li>
            ))}
          </ul>
          <Link to="/pages/store-locator" className="btn btn-outline mt-8">
            Salon locator <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}

/* ── Contact ─────────────────────────────────────────────────────────────── */
export function ContactPage() {
  useSeo("Contact Us", "Need help? Email us at Reputationextensions@gmail.com or send a message.");
  const [f, setF] = useState({ name: "", email: "", order: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.name.trim()) er.name = "Please tell us your name.";
    if (!isEmail(f.email)) er.email = "Please enter a valid email address.";
    if (f.message.trim().length < 10) er.message = "Please add a little more detail so we can help.";
    setErrors(er);
    if (Object.keys(er).length) return;
    save("rep_messages", [...load<unknown[]>("rep_messages", []), { ...f, at: new Date().toISOString() }]);
    setDone(true);
  };
  return (
    <>
      <PageHero title="Need help? We’re here." intro={`Email us at ${settings.brand.email} or send a note below — it goes straight to our team.`} crumbs={[{ label: "Contact" }]} eyebrow="Contact us" />
      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            {done ? (
              <Success>
                <p className="font-display text-2xl">Message sent.</p>
                <p className="mt-1">
                  Thank you, {f.name.split(" ")[0]}. We’ll reply to {f.email} as soon as we can.
                </p>
              </Success>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="c-name" label="Name" autoComplete="name" value={f.name} onChange={(v) => setF({ ...f, name: v })} error={errors.name} />
                  <Field id="c-email" label="Email" type="email" autoComplete="email" value={f.email} onChange={(v) => setF({ ...f, email: v })} error={errors.email} />
                </div>
                <Field id="c-order" label="Order number (optional)" placeholder="#1001" value={f.order} onChange={(v) => setF({ ...f, order: v })} />
                <Field id="c-message" label="How can we help?" textarea value={f.message} onChange={(v) => setF({ ...f, message: v })} error={errors.message} />
                <button type="submit" className="btn btn-primary w-full sm:w-auto">
                  Send message
                </button>
              </form>
            )}
          </div>
          <div>
            <ul className="space-y-6">
              {[
                { Icon: Mail, label: "Email", value: settings.brand.email, href: `mailto:${settings.brand.email}` },
                { Icon: MapPin, label: "Studios", value: "Washington State · Dallas, Texas" },
                { Icon: Clock, label: "Shipping", value: "Worldwide — rates at checkout" },
              ].map(({ Icon, label, value, href }) => (
                <li key={label} className="flex gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-blush">
                    <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="t-eyebrow text-muted">{label}</p>
                    {href ? (
                      <a href={href} className="mt-1 block text-lg underline-offset-4 hover:underline">
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1 text-lg">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 overflow-hidden rounded-3xl border border-line">
              <iframe title="Map of the United States" src={US_MAP} loading="lazy" className="block h-72 w-full grayscale" />
            </div>
            <p className="mt-4 text-muted">
              Looking for a quick answer?{" "}
              <Link to="/pages/faqs" className="text-black underline underline-offset-4">
                Visit the FAQ
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── FAQ ─────────────────────────────────────────────────────────────────── */
export function FaqPage() {
  useSeo("FAQ", "Pack weights, hair per row, weft length, shipping and more.");
  return (
    <>
      <PageHero title="Frequently asked questions" intro="Everything you need to know about Reputation hair, packs, shipping and pro pricing." crumbs={[{ label: "FAQ" }]} eyebrow="FAQ at Reputation" />
      <section className="section">
        <div className="wrap max-w-3xl space-y-12">
          {faqs.map((g) => (
            <div key={g.group}>
              <h2 className="t-h3 mb-4">{g.group}</h2>
              <Accordion items={g.items.map((i) => ({ title: i.q, content: <p>{i.a}</p> }))} />
            </div>
          ))}
          <div className="rounded-3xl bg-blush p-7 text-center md:p-10">
            <p className="font-display text-2xl md:text-3xl">Still have a question?</p>
            <Link to="/pages/contact" className="btn btn-primary mt-5">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Home care guide ─────────────────────────────────────────────────────── */
export function CareGuidePage() {
  useSeo("Hair Care Guide — How to care for your extensions at home", "Daily care, wash day, heat styling and pool & beach care for Reputation extensions.");
  let n = 0;
  return (
    <>
      <PageHero title="How to care for your hair at home." intro="Reputation Extensions home care — the routine our stylists give every client." crumbs={[{ label: "Hair care guide" }]} eyebrow="Reputation Extensions home care" image="edCare" />
      <section className="section">
        <div className="wrap max-w-4xl space-y-14">
          {care.map((s) => (
            <div key={s.title}>
              <h2 className="t-h2">{s.title}</h2>
              <ol className="mt-6 divide-y divide-line border-y border-line">
                {s.items.map((it) => {
                  n += 1;
                  return (
                    <li key={it.h} className="grid gap-2 py-7 md:grid-cols-[5rem_14rem_1fr] md:items-baseline md:gap-8">
                      <span className="font-display text-4xl italic text-blush-deep" aria-hidden="true">
                        {String(n).padStart(2, "0")}
                      </span>
                      <h3 className="t-h3">{it.h}</h3>
                      <p className="text-muted">{it.p}</p>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
          <div className="flex flex-col items-center gap-4 rounded-3xl bg-blush-soft p-8 text-center md:p-12">
            <p className="font-display text-2xl md:text-3xl">Stock up on the essentials</p>
            <Link to="/collections/accessories" className="btn btn-primary">
              Shop haircare &amp; accessories
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Blog ────────────────────────────────────────────────────────────────── */
export function BlogPage() {
  useSeo("The Reputation Blog", "Trends, gifting edits, essentials and stories from behind the chair.");
  const [lead, ...rest] = posts;
  return (
    <>
      <PageHero title="Notes from behind the chair" intro="Trends, gifting edits, essentials and stories from the Reputation team." crumbs={[{ label: "Blog" }]} eyebrow="Reputation blog" />
      <section className="section">
        <div className="wrap">
          <article className="group mb-14 md:mb-20">
            <Link to={`/blogs/introducing-reputation-extensions/${lead.slug}`} className="grid items-center gap-6 md:grid-cols-2 md:gap-12">
              <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-blush">
                <Img k={lead.image} eager className="size-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-105" />
              </div>
              <div>
                <p className="text-sm text-muted">
                  <span className="t-eyebrow text-black">{lead.tag}</span> <span aria-hidden="true">·</span> <time dateTime={lead.date}>{formatDate(lead.date)}</time>
                </p>
                <h2 className="t-h1 mt-3">{lead.title}</h2>
                <p className="t-lead mt-4 text-muted">{lead.excerpt}</p>
                <span className="t-eyebrow link-line mt-6 inline-block">Read the story</span>
              </div>
            </Link>
          </article>
          <ul className="grid gap-12 md:grid-cols-3 md:gap-8">
            {rest.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export function ArticlePage() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);
  useSeo(post ? post.title : "Article not found", post?.excerpt);
  if (!post) return <NotFound />;
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
  return (
    <>
      <article>
        <header className="bg-blush">
          <div className="wrap max-w-4xl py-9 text-center md:py-16">
            <div className="flex justify-center">
              <Crumbs items={[{ label: "Home", to: "/" }, { label: "Blog", to: "/blogs/introducing-reputation-extensions" }, { label: post.tag }]} />
            </div>
            <h1 className="t-h1 mt-6">{post.title}</h1>
            <p className="mt-5 text-[15px]">
              <time dateTime={post.date}>{formatDate(post.date)}</time> <span aria-hidden="true">·</span> {post.readMins} min read
            </p>
          </div>
        </header>
        <div className="wrap max-w-4xl">
          <div className="-mt-6 aspect-[16/10] overflow-hidden rounded-3xl bg-blush md:-mt-10">
            <Img k={post.image} eager className="size-full object-cover" />
          </div>
        </div>
        <div className="wrap t-lead max-w-2xl py-10 md:py-16">
          <div className="prose-rep">
            {post.body.map((b, i) => (
              <div key={i} className="prose-rep">
                {b.h && <h2>{b.h}</h2>}
                <p className="text-muted">{b.p}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-3 border-t border-line pt-8">
            {post.shop && (
              <Link to={post.shop.to} className="btn btn-primary">
                {post.shop.label}
              </Link>
            )}
            <Link to="/blogs/introducing-reputation-extensions" className="btn btn-outline">
              All posts
            </Link>
          </div>
        </div>
      </article>
      <section className="section border-t border-line">
        <div className="wrap">
          <h2 className="t-h2 mb-8">Keep reading</h2>
          <ul className="grid gap-12 md:grid-cols-3 md:gap-8">
            {more.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

/* ── Policies ────────────────────────────────────────────────────────────── */
export function PolicyPage() {
  const { handle = "" } = useParams();
  const policy = policies[handle];
  useSeo(policy ? policy.title : "Page not found", policy?.intro);
  if (!policy) return <NotFound />;
  return (
    <>
      <PageHero title={policy.title} intro={policy.intro} crumbs={[{ label: policy.title }]} eyebrow="Legal" />
      <section className="section">
        <div className="wrap grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-16">
          <nav aria-label="Policies" className="min-w-0 lg:sticky lg:top-36 lg:self-start">
            <ul className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-0 lg:px-0">
              {Object.entries(policies).map(([h, pol]) => (
                <li key={h} className="shrink-0">
                  <Link
                    to={`/policies/${h}`}
                    aria-current={h === handle ? "page" : undefined}
                    className={
                      h === handle
                        ? "inline-flex min-h-11 items-center rounded-full bg-black px-4 text-[15px] text-white lg:px-5"
                        : "inline-flex min-h-11 items-center rounded-full border border-line px-4 text-[15px] hover:border-black lg:border-0 lg:px-5 lg:hover:bg-blush"
                    }
                  >
                    {pol.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="prose-rep max-w-2xl">
            {policy.sections.map((s) => (
              <div key={s.h} className="prose-rep">
                <h2>{s.h}</h2>
                {s.p.map((p) => (
                  <p key={p.slice(0, 24)} className="text-muted">
                    {p}
                  </p>
                ))}
              </div>
            ))}
            <p className="!mt-10 border-t border-line pt-6">
              Questions? <Link to="/pages/contact">Contact us</Link> — we’re happy to help.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Rep Pro application ─────────────────────────────────────────────────── */
export function ProApplicationPage() {
  useSeo("Become a Rep Pro — Pro Pricing Application", "Licensed stylists: apply for Reputation pro pricing.");
  const [f, setF] = useState({ name: "", salon: "", license: "", state: "", email: "", phone: "", instagram: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.name.trim()) er.name = "Please enter your name.";
    if (!f.license.trim()) er.license = "Please enter your cosmetology license number.";
    if (!isEmail(f.email)) er.email = "Please enter a valid email address.";
    setErrors(er);
    if (Object.keys(er).length) return;
    save("rep_pro_applications", [...load<unknown[]>("rep_pro_applications", []), { ...f, at: new Date().toISOString() }]);
    setDone(true);
  };
  return (
    <>
      <PageHero title="Become a Rep Pro" intro="Licensed stylist or salon owner? Apply for pro pricing on Reputation hair, tools and education." crumbs={[{ label: "For Pro’s" }, { label: "Pro Pricing Application" }]} eyebrow="Pro Pricing Application" image="edSalon" />
      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          {done ? (
            <Success>
              <p className="font-display text-2xl">Application received.</p>
              <p className="mt-1">Thank you, {f.name.split(" ")[0]}! Our team will review your details and email {f.email} with next steps.</p>
            </Success>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
              <Field id="p-name" label="Full name" autoComplete="name" value={f.name} onChange={set("name")} error={errors.name} />
              <Field id="p-salon" label="Salon / business name" autoComplete="organization" value={f.salon} onChange={set("salon")} />
              <Field id="p-license" label="License number" value={f.license} onChange={set("license")} error={errors.license} />
              <Field id="p-state" label="State" autoComplete="address-level1" value={f.state} onChange={set("state")} />
              <Field id="p-email" label="Email" type="email" autoComplete="email" value={f.email} onChange={set("email")} error={errors.email} />
              <Field id="p-phone" label="Phone" type="tel" autoComplete="tel" value={f.phone} onChange={set("phone")} />
              <div className="sm:col-span-2">
                <Field id="p-ig" label="Instagram handle (optional)" placeholder="@yoursalon" value={f.instagram} onChange={set("instagram")} />
              </div>
              <button type="submit" className="btn btn-primary sm:col-span-2 sm:justify-self-start">
                Submit application
              </button>
            </form>
          )}
          <aside className="rounded-3xl bg-blush-soft p-7 md:p-9">
            <p className="t-eyebrow text-muted">Why Rep Pro</p>
            <ul className="mt-5 space-y-3">
              {["Pro pricing on hybrid wefts, K-tips & tape wefts", "Custom salon shades that make color matching easy", "Pro tools and install essentials", "Education with Kathy & Liv"].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <Check size={16} className="mt-1 shrink-0" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
            <Link to="/collections/education" className="btn btn-outline mt-7">
              View courses
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}

/* ── VIP Text Club ───────────────────────────────────────────────────────── */
export function VipClubPage() {
  useSeo("Join the Reputation VIP Text Club", "Early access to launches and restocks plus VIP-only offers.");
  return (
    <>
      <PageHero title="Join the Reputation VIP Text Club" intro="Early access to launches & restocks, VIP-only offers and giveaways — straight to your phone. Plus 10% off your first order." crumbs={[{ label: "VIP Text Club" }]} eyebrow="VIP Text Club" image="heroB" />
      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <MessageCircleHeart size={32} strokeWidth={1.25} aria-hidden="true" />
            <h2 className="t-h2 mt-4">Sign up here</h2>
            <div className="mt-6 max-w-md">
              <EmailForm source="vip-text-club-page" cta="Join the club" withPhone />
            </div>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-muted">{settings.home.vip.privacy}</p>
          </div>
          <ul className="space-y-4 self-center">
            {["First access to new shades & The Weekend Collection drops", "Restock alerts on your favorite shades", "VIP-only offers, giveaways and holiday early access", "Styling tips straight from Kathy & Liv"].map((t) => (
              <li key={t} className="flex items-start gap-3 rounded-2xl bg-blush-soft p-5 text-[17px]">
                <Check size={18} className="mt-1 shrink-0" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

/* ── Salon locator ───────────────────────────────────────────────────────── */
export function SalonLocatorPage() {
  useSeo("Salon Locator", "Find Reputation's studios and stylists.");
  return (
    <>
      <PageHero title="Salon locator" intro="Book with the stylists behind Reputation, or ask your stylist to become a Rep Pro." crumbs={[{ label: "Salon Locator" }]} eyebrow="Find Reputation" />
      <section className="section">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <ul className="space-y-5">
            {salons.map((s) => (
              <li key={s.name} className="rounded-3xl border border-line p-7">
                <p className="t-eyebrow flex items-center gap-2 text-muted">
                  <MapPin size={14} aria-hidden="true" /> {s.location}
                </p>
                <h2 className="t-h3 mt-2">{s.name}</h2>
                <p className="mt-1 text-[15px]">Led by {s.lead}</p>
                <p className="mt-3 text-muted">{s.body}</p>
                <a href={settings.brand.social[0].url} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm mt-5">
                  Book via Instagram
                </a>
              </li>
            ))}
            <li className="rounded-3xl bg-blush p-7">
              <h2 className="t-h3">Are you a stylist?</h2>
              <p className="mt-2 text-muted">Offer Reputation in your salon with pro pricing and education.</p>
              <Link to="/pages/pro-discount-form" className="btn btn-primary btn-sm mt-5">
                Become a Rep Pro
              </Link>
            </li>
          </ul>
          <div className="overflow-hidden rounded-3xl border border-line">
            <iframe title="Map of Reputation studio locations in the United States" src={US_MAP} loading="lazy" className="block h-full min-h-[24rem] w-full grayscale" />
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Holiday shop ────────────────────────────────────────────────────────── */
export function HolidayShopPage() {
  useSeo("The Holiday Shop — Who are you gifting this season?", "Curated gifts for the jetsetters, the it girls, the artists and little luxuries.");
  const edits = ["for-the-jetsetter", "for-the-it-girls", "for-the-artists", "little-luxuries"];
  const holiday = settings.nav.find((n) => n.label === "Holiday Shop");
  return (
    <>
      <PageHero title="Who are you gifting this season?" intro="Curated gifts for every hair girl on your list — from travel-ready clip-ins to little luxuries." crumbs={[{ label: "Holiday Shop" }]} eyebrow="The Holiday Shop" image="heroB" />
      <nav aria-label="Gift edits" className="sticky top-14 z-20 border-b border-line bg-white/95 backdrop-blur lg:top-[7.5rem]">
        <ul className="no-scrollbar wrap flex gap-2 overflow-x-auto py-3">
          {holiday?.cards?.map((c, i) => (
            <li key={c.title} className="shrink-0">
              <a href={`#edit-${edits[i]}`} onClick={(e) => { e.preventDefault(); document.getElementById(`edit-${edits[i]}`)?.scrollIntoView({ behavior: "smooth" }); }} className="inline-flex h-10 items-center rounded-full bg-blush-soft px-4 text-sm font-medium hover:bg-blush">
                For {c.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {edits.map((h, i) => {
        const card = holiday?.cards?.[i];
        const items = productsIn(h);
        return (
          <section key={h} id={`edit-${h}`} className="section scroll-mt-40 overflow-hidden border-b border-line" aria-labelledby={`h-${h}`}>
            <div className="wrap">
              <div className="mb-8 flex items-end justify-between gap-6">
                <div className="flex items-center gap-5">
                  {card && (
                    <div className="hidden size-20 overflow-hidden rounded-2xl sm:block">
                      <Img k={card.image} alt="" className="size-full object-cover" />
                    </div>
                  )}
                  <div>
                    <p className="t-eyebrow text-muted">For</p>
                    <h2 id={`h-${h}`} className="t-h2">
                      {card?.title}
                    </h2>
                  </div>
                </div>
                <Link to={`/collections/${h}`} className="t-eyebrow link-line mb-1 shrink-0">
                  Shop all
                </Link>
              </div>
              <ProductCarousel items={items} label={`Gifts for ${card?.title ?? h}`} />
            </div>
          </section>
        );
      })}
    </>
  );
}

/* ── Track order / account ───────────────────────────────────────────────── */
export function TrackOrderPage() {
  useSeo("Track Your Order");
  const [order, setOrder] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<"" | "error" | "sent">("");
  return (
    <>
      <PageHero title="Track your order" intro="Enter your order number and the email you checked out with." crumbs={[{ label: "Track order" }]} eyebrow="Need help?" />
      <section className="section">
        <div className="wrap max-w-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setMsg(order.trim() && isEmail(email) ? "sent" : "error");
            }}
            noValidate
            className="space-y-5"
          >
            <Field id="t-order" label="Order number" placeholder="#1001" value={order} onChange={setOrder} />
            <Field id="t-email" label="Email" type="email" autoComplete="email" value={email} onChange={setEmail} />
            <button type="submit" className="btn btn-primary w-full">
              Track order
            </button>
          </form>
          <div aria-live="polite" className="mt-6">
            {msg === "error" && <p className="font-medium">Please enter your order number and a valid email address.</p>}
            {msg === "sent" && (
              <Success>
                <p className="font-medium">Preview mode</p>
                <p className="mt-1 text-[15px]">On the live store this opens your Shopify order status page with real-time carrier tracking.</p>
              </Success>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export function AccountPage() {
  useSeo("My Account");
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [err, setErr] = useState(false);
  return (
    <section className="section">
      <div className="wrap max-w-md text-center">
        <p className="t-eyebrow mb-3 text-muted">My account</p>
        <h1 className="t-h1">Welcome back</h1>
        <p className="mt-3 text-muted">Sign in with a one-time code sent to your email — no password needed.</p>
        {sent ? (
          <div className="mt-8 text-left">
            <Success>
              <p className="font-medium">Preview mode</p>
              <p className="mt-1 text-[15px]">On the live store, Shopify customer accounts email a secure sign-in code to {email}.</p>
            </Success>
          </div>
        ) : (
          <form
            noValidate
            className="mt-8 space-y-4 text-left"
            onSubmit={(e) => {
              e.preventDefault();
              if (isEmail(email)) setSent(true);
              else setErr(true);
            }}
          >
            <Field id="a-email" label="Email" type="email" autoComplete="email" value={email} onChange={setEmail} error={err ? "Please enter a valid email address." : undefined} />
            <button type="submit" className="btn btn-primary w-full">
              Continue
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ── 404 ─────────────────────────────────────────────────────────────────── */
export function NotFound() {
  useSeo("Page not found");
  return (
    <>
      <section className="bg-blush">
        <div className="wrap py-16 text-center md:py-24">
          <p className="t-eyebrow">Error 404</p>
          <h1 className="t-display mt-4">
            Not a strand <em className="font-normal">in sight.</em>
          </h1>
          <p className="t-lead mx-auto mt-5 max-w-md">The page you’re looking for has moved or no longer exists. Let’s get you back to the good stuff.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn btn-primary">
              Back to home
            </Link>
            <Link to="/collections/all" className="btn btn-outline">
              Shop all <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <ul className="mx-auto mt-10 flex max-w-xl flex-wrap justify-center gap-x-6 gap-y-2">
            {settings.home.categories.tiles.map((t) => (
              <li key={t.title}>
                <Link to={t.to} className="link-line">
                  {t.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section overflow-hidden">
        <div className="wrap">
          <h2 className="t-h2 mb-8">Best sellers</h2>
          <ProductCarousel items={products.filter((p) => p.bestSeller)} label="Best sellers" />
        </div>
      </section>
    </>
  );
}

/* ── /pages/:slug router (mirrors reputationextensions.com URLs) ─────────── */
const PAGES: Record<string, ComponentType> = {
  "about-us": AboutPage,
  contact: ContactPage,
  faqs: FaqPage,
  "hair-extension-home-care": CareGuidePage,
  "track-order": TrackOrderPage,
  "pro-discount-form": ProApplicationPage,
  "join-the-reputation-vip-text-club": VipClubPage,
  "store-locator": SalonLocatorPage,
  "holiday-shop": HolidayShopPage,
};

export function PageRouter() {
  const { slug = "" } = useParams();
  const alias = PAGE_ALIASES[slug];
  if (alias) return <Navigate to={alias} replace />;
  const Page = PAGES[slug];
  return Page ? <Page key={slug} /> : <NotFound />;
}
