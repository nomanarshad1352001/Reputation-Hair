// ─────────────────────────────────────────────────────────────────────────────
// THEME SETTINGS: the single source of truth for merchandisable content and offers.
// Mirrors the Shopify theme editor: every section exposes image, heading, body, CTA and a
// `visible` toggle. Copy is taken from reputationextensions.com unless marked PROPOSED.
// ─────────────────────────────────────────────────────────────────────────────
import type { ImgKey } from "@/data/images";

export interface NavLink {
  label: string;
  to: string;
  swatch?: string;
}
export interface MegaCard {
  image: ImgKey;
  title: string;
  caption: string;
  to: string;
}
export interface NavItem {
  label: string;
  to: string;
  highlight?: boolean;
  heading?: string;
  columns?: { title: string; links: NavLink[] }[];
  cards?: MegaCard[];
  promo?: boolean;
}
export interface Campaign {
  id: string;
  label: string;
  message: string;
  short: string;
  starts: string;
  ends: string;
  cta: { label: string; to: string };
  /** Shopify automatic discounts that run with the campaign */
  autoDiscounts: { lines: string[]; percent: number; label: string }[];
  hero: { eyebrow: string; title: string; accent: string; body: string };
}
export type CodeDef =
  | { type: "percent"; value: number; label: string }
  | { type: "amount"; value: number; min: number; label: string }
  | { type: "shipping"; label: string }
  | { type: "gift"; label: string };

export const settings = {
  brand: {
    name: "Reputation",
    legalName: "Reputation Hair Extension Co.",
    email: "Reputationextensions@gmail.com",
    instagramHandle: "@reputationextensions",
    tagline: "Luxury Hair, built by stylists.",
    social: [
      { name: "Instagram", url: "https://instagram.com/reputationextensions" },
      { name: "TikTok", url: "https://www.tiktok.com/t/ZTdoAQX9o" },
      { name: "YouTube", url: "https://www.youtube.com/watch?v=GtDPjlUToKU" },
      { name: "Facebook", url: "https://www.facebook.com/" }, // TODO: client to supply page URL
      { name: "Pinterest", url: "https://www.pinterest.com/" }, // TODO: client to supply profile URL
    ],
    youtubeId: "GtDPjlUToKU",
  },

  /** Countdown campaigns. The active one (by date) drives every timer on the site. When none is active,
   *  timers hide automatically; they never reset or fake urgency. */
  campaigns: [
    {
      id: "black-friday",
      label: "Black Friday",
      message: "BLACK FRIDAY NOW LIVE | UP TO 75% OFF",
      short: "Black Friday · Up to 75% off",
      starts: "2026-11-20T00:00:00-06:00",
      ends: "2026-12-01T00:00:00-06:00",
      cta: { label: "Explore Sale", to: "/collections/black-friday" },
      autoDiscounts: [{ lines: ["laced", "seamless"], percent: 15, label: "Black Friday · 15% off Clip In’s" }],
      hero: {
        eyebrow: "Black Friday now live",
        title: "Up to 75% off",
        accent: "luxury hair.",
        body: "Savings on Tape Wefts, 15% off Clip In’s and our best-loved shades — for a limited time only.",
      },
    },
    {
      id: "holiday",
      label: "Holiday Shop",
      message: "WHO ARE YOU GIFTING THIS SEASON? SHOP THE HOLIDAY SHOP",
      short: "The Holiday Shop is open",
      starts: "2026-12-01T00:00:00-06:00",
      ends: "2026-12-25T00:00:00-06:00",
      cta: { label: "Shop Holiday", to: "/pages/holiday-shop" },
      autoDiscounts: [],
      hero: {
        eyebrow: "The Holiday Shop",
        title: "Gift better",
        accent: "hair days.",
        body: "Curated gifts for the jetsetters, the it girls, the artists — and little luxuries for everyone else.",
      },
    },
    {
      id: "new-year",
      label: "New Year",
      message: "NEW YEAR. NEW HAIR. NEW ENERGY.",
      short: "New Year. New Hair. New Energy.",
      starts: "2026-12-26T00:00:00-06:00",
      ends: "2027-02-01T00:00:00-06:00",
      cta: { label: "Shop the edit", to: "/collections/all" },
      autoDiscounts: [],
      hero: {
        eyebrow: "New Year. New Hair. New Energy.",
        title: "Hair that earns",
        accent: "its reputation.",
        body: "Premium European hair, selected for its softness, shine, and naturally seamless blend.",
      },
    },
  ] as Campaign[],

  evergreenMessages: [
    "100% Remy human hair — designed by professional stylists",
    "Worldwide shipping — rates available at checkout",
    "Join the Reputation VIP Text Club for early access",
  ],

  /** Sales boosters. PROPOSED values: confirm margins with the client before launch. */
  offers: {
    freeShipping: { threshold: 300, region: "U.S." },
    gift: { threshold: 500, title: "Reputation Creaseless Hair Clips", value: 16, image: "acClips" as ImgKey },
    bundleTiers: [
      { packs: 2, percent: 5 },
      { packs: 3, percent: 10 },
    ],
    installments: { provider: "Shop Pay", count: 4, min: 50 },
    shipping: { cutoffHour: 13, timeZone: "America/Chicago", transitMin: 3, transitMax: 6 },
    codes: {
      WELCOME10: { type: "percent", value: 10, label: "10% off your order" },
      SPIN5: { type: "percent", value: 5, label: "5% off your order" },
      SPIN10: { type: "percent", value: 10, label: "10% off your order" },
      SPIN15: { type: "percent", value: 15, label: "15% off your order" },
      SAVE25: { type: "amount", value: 25, min: 300, label: "$25 off orders $300+" },
      SHIPFREE: { type: "shipping", label: "Free U.S. shipping" },
      CLIPSGIFT: { type: "gift", label: "Free Creaseless Hair Clips" },
    } as Record<string, CodeDef>,
    wheel: {
      delayMs: 9000,
      segments: [
        { label: "5% OFF", code: "SPIN5", weight: 30 },
        { label: "FREE SHIPPING", code: "SHIPFREE", weight: 22 },
        { label: "10% OFF", code: "SPIN10", weight: 20 },
        { label: "FREE CLIPS", code: "CLIPSGIFT", weight: 15 },
        { label: "$25 OFF", code: "SAVE25", weight: 10 },
        { label: "15% OFF", code: "SPIN15", weight: 3 },
      ],
    },
    signupCode: "WELCOME10",
  },

  nav: [
    { label: "Black Friday", to: "/collections/black-friday", highlight: true },
    {
      label: "Shop Hair",
      to: "/collections/all",
      promo: true,
      columns: [
        {
          title: "Hair Collections",
          links: [
            { label: "Luxury Hybrid Wefts", to: "/collections/luxury-hybrid-wefts" },
            { label: "Keratin Tips", to: "/collections/reputation-keratin-tips" },
            { label: "Tape In Wefts", to: "/collections/tape-in-extensions" },
            { label: "Clip In Extensions", to: "/collections/clip-in-extensions" },
            { label: "NEW: The Weekend Collection", to: "/collections/the-weekend-collection" },
          ],
        },
        {
          title: "Shop by Shade",
          links: [
            { label: "Blondes", to: "/collections/blondes", swatch: "linear-gradient(135deg,#f0e2c3,#c3955a)" },
            { label: "Brondes", to: "/collections/brondes", swatch: "linear-gradient(135deg,#c9aa80,#5b3f2e)" },
            { label: "Brunettes", to: "/collections/brunettes", swatch: "linear-gradient(135deg,#5c3e2c,#100c0b)" },
          ],
        },
        {
          title: "Discover",
          links: [
            { label: "New Arrivals", to: "/collections/new-arrivals" },
            { label: "Best Sellers", to: "/collections/best-sellers" },
            { label: "Last Chance: Original Hybrids", to: "/collections/last-chance-original-hybrids" },
            { label: "Haircare & Accessories", to: "/collections/accessories" },
            { label: "Shop All", to: "/collections/all" },
          ],
        },
      ],
      cards: [
        { image: "lsBlonde", title: "Luxury Hybrid Wefts", caption: "Deluxe density, double drawn", to: "/collections/luxury-hybrid-wefts" },
        { image: "mLaced", title: "The Weekend Collection", caption: "Our easiest extensions yet", to: "/collections/the-weekend-collection" },
      ],
    },
    {
      label: "Holiday Shop",
      to: "/pages/holiday-shop",
      heading: "Who are you gifting this season?",
      cards: [
        { image: "edStreet", title: "The Jetsetters", caption: "Travel-ready hair", to: "/collections/for-the-jetsetter" },
        { image: "lsBlonde", title: "The It Girls", caption: "Main-character volume", to: "/collections/for-the-it-girls" },
        { image: "edSalon", title: "The Artists", caption: "For the stylists", to: "/collections/for-the-artists" },
        { image: "acOil", title: "Little Luxuries", caption: "Stocking-stuffer sized", to: "/collections/little-luxuries" },
      ],
    },
    { label: "Weekend Collection", to: "/collections/the-weekend-collection" },
    {
      label: "For Pros",
      to: "/collections/professional-hair",
      columns: [
        {
          title: "For Pro’s",
          links: [
            { label: "Pro Hair Collections", to: "/collections/professional-hair" },
            { label: "Pro Tools", to: "/collections/pro-tools" },
            { label: "Reputation Courses", to: "/collections/education" },
            { label: "Become a Rep Pro", to: "/pages/pro-discount-form" },
          ],
        },
      ],
      cards: [
        { image: "edSalon", title: "Reputation Courses", caption: "The Reputation Extension Method™", to: "/collections/education" },
        { image: "acKit", title: "Pro Tools", caption: "Install essentials", to: "/collections/pro-tools" },
      ],
    },
    {
      label: "Learn",
      to: "/pages/hair-extension-home-care",
      columns: [
        {
          title: "Learn",
          links: [
            { label: "Hair Care Guide", to: "/pages/hair-extension-home-care" },
            { label: "FAQ", to: "/pages/faqs" },
            { label: "Blog", to: "/blogs/introducing-reputation-extensions" },
          ],
        },
      ],
      cards: [
        { image: "lsClipin", title: "The Clip-In Era", caption: "Effortless hair, on your terms", to: "/blogs/introducing-reputation-extensions/the-clip-in-era" },
        { image: "bkBronde", title: "Build Your Blend", caption: "This season’s Rep blends", to: "/blogs/introducing-reputation-extensions/get-the-look-build-your-blend" },
      ],
    },
    {
      label: "About",
      to: "/pages/about-us",
      columns: [
        {
          title: "About",
          links: [
            { label: "Our Story", to: "/pages/about-us" },
            { label: "Meet the Founders", to: "/pages/about-us#founders" },
            { label: "Why Reputation", to: "/pages/about-us#why" },
            { label: "Salon Locator", to: "/pages/store-locator" },
            { label: "Contact Us", to: "/pages/contact" },
          ],
        },
      ],
      cards: [
        { image: "founders", title: "Meet the Founders", caption: "Mother, daughter, built with love", to: "/pages/about-us#founders" },
        { image: "edSalon", title: "Created Behind the Chair", caption: "Luxury hair, built by stylists", to: "/pages/about-us" },
      ],
    },
  ] as NavItem[],

  quickLinks: [
    { label: "Black Friday", to: "/collections/black-friday" },
    { label: "Hybrid Wefts", to: "/collections/luxury-hybrid-wefts" },
    { label: "K Tips", to: "/collections/reputation-keratin-tips" },
    { label: "Tape Ins", to: "/collections/tape-in-extensions" },
    { label: "Clip Ins", to: "/collections/clip-in-extensions" },
    { label: "Weekend", to: "/collections/the-weekend-collection" },
    { label: "Holiday", to: "/pages/holiday-shop" },
    { label: "For Pros", to: "/collections/professional-hair" },
  ],

  search: { popular: ["CEO", "Bossy Blonde", "Tape In", "Clip In", "Brunette", "Hair Oil"] },

  home: {
    press: { visible: true, heading: "As seen in", logos: ["BET", "Cosmopolitan", "CNN", "Seventeen", "Allure"] }, // placeholders: confirm genuine features
    marquee: ["100% Remy Human Hair", "Designed by Professionals", "Deluxe Double-Drawn Density", "Custom Salon Shades", "Worldwide Shipping", "Ethically Sourced"],
    categories: {
      visible: true,
      eyebrow: "Shop Hair Collections",
      heading: "Find Your Perfect Match.",
      tiles: [
        { title: "Clip In’s", to: "/collections/clip-in-extensions", image: "lsClipin" as ImgKey, inset: "mClipin" as ImgKey },
        { title: "Luxury Hybrid Wefts", to: "/collections/luxury-hybrid-wefts", image: "bkGolden" as ImgKey, inset: "shHoney" as ImgKey },
        { title: "Tape Wefts", to: "/collections/tape-in-extensions", image: "lsBrunette" as ImgKey, inset: "mTape" as ImgKey },
        { title: "K Tips", to: "/collections/reputation-keratin-tips", image: "lsSun" as ImgKey, inset: "mKtip" as ImgKey },
      ],
    },
    deals: { visible: true, eyebrow: "Black Friday deals", heading: "The sale everyone waits for." },
    vip: {
      visible: true,
      image: "heroB" as ImgKey,
      eyebrow: "Exclusive VIP welcome offer",
      heading: "Join the Reputation VIP Text Club",
      body: "Be first to know about drops, restocks and VIP-only offers — and get 10% off your first order instantly.",
      cta: "Unlock 10% off",
      privacy: "By signing up you agree to receive recurring marketing texts and emails from Reputation. Consent is not a condition of purchase. Msg & data rates may apply. Reply STOP to unsubscribe.",
    },
    bestSellers: { visible: true, eyebrow: "Most loved", heading: "Best Sellers", cta: { label: "View all", to: "/collections/best-sellers" } },
    transformations: { visible: true, eyebrow: "Real transformations", heading: "Real clients. Real stylists. Real Reputation hair." },
    difference: { visible: true, heading: "The Reputation Difference" },
    shopFor: { visible: true },
    reviews: { visible: true, eyebrow: "Loved by stylists & clients", heading: "Confidence in every strand", rating: 4.9 },
    founders: { visible: true },
    weekend: { visible: true },
    holiday: { visible: true, heading: "Who are you gifting this season?" },
    blog: { visible: true, eyebrow: "The Reputation Blog", heading: "Notes from behind the chair", cta: { label: "Read the blog", to: "/blogs/introducing-reputation-extensions" } },
    instagram: {
      visible: true,
      heading: "For the moments that become memories.",
      tiles: ["ugIcy", "bkGolden", "ugSalon", "lsSun", "ugHoney", "founders", "ugBrunette", "lsBlonde"] as ImgKey[],
    },
    newsletter: {
      // Off by default: the footer opens with the same sign-up, so two forms would stack on the homepage.
      visible: false,
      eyebrow: "Newsletter",
      heading: "Special offers, free giveaways & once-in-a-lifetime deals.",
      body: "Join to get special offers, free giveaways, and once-in-a-lifetime deals — plus 10% off your first order.",
      cta: "Join",
    },
  },

  footer: {
    columns: [
      {
        title: "Shop",
        links: [
          { label: "Luxury Hybrid Wefts", to: "/collections/luxury-hybrid-wefts" },
          { label: "Keratin Tips", to: "/collections/reputation-keratin-tips" },
          { label: "Tape In Wefts", to: "/collections/tape-in-extensions" },
          { label: "Clip In Extensions", to: "/collections/clip-in-extensions" },
          { label: "The Weekend Collection", to: "/collections/the-weekend-collection" },
          { label: "Best Sellers", to: "/collections/best-sellers" },
        ],
      },
      {
        title: "Learn",
        links: [
          { label: "Hair Care Guide", to: "/pages/hair-extension-home-care" },
          { label: "FAQ", to: "/pages/faqs" },
          { label: "Blog", to: "/blogs/introducing-reputation-extensions" },
          { label: "Reputation Courses", to: "/collections/education" },
          { label: "Become a Rep Pro", to: "/pages/pro-discount-form" },
        ],
      },
      {
        title: "Need help?",
        links: [
          { label: "About us", to: "/pages/about-us" },
          { label: "Contact us", to: "/pages/contact" },
          { label: "FAQs", to: "/pages/faqs" },
          { label: "Salon Locator", to: "/pages/store-locator" },
          { label: "Track Order", to: "/pages/track-order" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy Policy", to: "/policies/privacy-policy" },
          { label: "Refund Policy", to: "/policies/refund-policy" },
          { label: "Terms of Service", to: "/policies/terms-of-service" },
          { label: "Shipping Policy", to: "/policies/shipping-policy" },
          { label: "Accessibility", to: "/policies/accessibility" },
        ],
      },
    ],
    payments: ["visa", "mastercard", "amex", "discover", "paypal", "applepay", "googlepay", "shoppay", "diners", "jcb"],
  },
};

export type Settings = typeof settings;
