// Editorial content taken from reputationextensions.com (About, FAQ, Home Care, Blog, Refund Policy).
// Reviews are SAMPLE content for layout only — replace with real reviews from the reviews app.
import type { ImgKey } from "@/data/images";

export const founders = {
  names: "Kathy Nunez & Olivia “Liv” Jacques",
  signature: "Xx, Liv & Kathy",
  tagline: "Mother, daughter built with love.",
  heading: "Created Behind the Chair",
  story: [
    "We built Reputation Extensions because we knew there had to be a better option.",
    "After years of working with inconsistent hair quality, we created a collection that delivers the softness, durability, and natural blend we always wanted for our own clients.",
    "Today, Reputation is trusted by professional stylists and women who refuse to compromise on quality.",
  ],
  about: [
    "Reputation Hair Extensions was founded by Kathy Nunez and Olivia “Liv” Jacques, a mother-daughter duo passionate about delivering luxury hair extensions and exceptional salon experiences.",
    "As professional hairstylists, Kathy and Liv have built their careers behind the chair, specializing in hair extensions, balayage, blonding, and modern lived-in color. Their hands-on experience working with real clients has allowed them to perfect techniques that create seamless, natural-looking transformations.",
    "Kathy is known for her signature bright, dimensional blondes, while Liv specializes in effortless lived-in color, creating soft, low-maintenance looks that grow out beautifully.",
  ],
};

export const pillars = [
  { title: "Uncompromising Quality.", body: "Premium European hair selected for its softness, shine, and naturally seamless blend." },
  { title: "Designed by Professionals.", body: "Created by expert extension specialists who understand what exceptional hair should look and feel like." },
  { title: "Effortless Luxury.", body: "Beautiful hair that moves naturally, styles with ease, and complements every part of your lifestyle." },
];

export const confidence = {
  heading: "Confidence in Every Strand",
  body: "From the first install to every wear after, our extensions are crafted to look as incredible in real life as they do on camera.",
};

export const methods = [
  { title: "Hybrid Wefts", body: "Ideal for volume, fullness, and customization.", to: "/collections/luxury-hybrid-wefts", image: "shHoney" as ImgKey },
  { title: "Keratin Tips", body: "Individual strand application for long-lasting wear.", to: "/collections/reputation-keratin-tips", image: "mKtip" as ImgKey },
  { title: "Tape-In Wefts", body: "Lightweight, seamless, and perfect for quick applications.", to: "/collections/tape-in-extensions", image: "mTape" as ImgKey },
  { title: "Clip In’s", body: "Perfect for occasion wear and when you need a little extra length & volume.", to: "/collections/clip-in-extensions", image: "mClipin" as ImgKey },
];

export const whyStylists = [
  "100% ethically sourced Remy human hair",
  "Long-lasting and reusable with proper care",
  "Minimal shedding and tangling",
  "Lightweight, natural-looking results",
  "Perfect for adding length, volume, and thickness",
];

export const education = {
  intro: "Education is at the core of our brand. We are committed to helping hairstylists, salon owners, and beauty professionals grow their skills and confidence.",
  teach: [
    "Tape-in, weft, and keratin tip installation techniques",
    "Color matching and custom blending",
    "Client consultation and maintenance education",
    "How to grow a successful hair extension business",
  ],
  goal: "Our goal is to provide real-world, salon-tested knowledge that helps stylists deliver consistent, high-end results.",
};

export const salons = [
  { name: "Studio One", lead: "Kathy Nunez", location: "Washington State", body: "Kathy’s home salon — bright, dimensional blondes and luxury extension installs." },
  { name: "Studio Two", lead: "Olivia “Liv” Jacques", location: "Dallas, Texas", body: "Liv’s sister salon, expanding the Reputation standard with effortless lived-in color." },
];

/* ── Reviews (SAMPLE) ────────────────────────────────────────────────────── */
export interface Review {
  name: string;
  rating: number;
  title: string;
  text: string;
  photo: ImgKey;
  product: string; // product title
  date: string;
}

export const reviews: Review[] = [
  { name: "Ashley M.", rating: 5, title: "The blend is unreal", text: "My stylist installed CEO hybrids and nobody can tell where my hair ends. The softest hair I’ve ever worn.", photo: "ugIcy", product: "CEO Deluxe Density Hybrid Weft Extensions", date: "2026-11-12" },
  { name: "Daniela R.", rating: 5, title: "Salon-level color", text: "Bronde Baddie matched my lived-in color perfectly, and the weft is so thin it lays completely flat.", photo: "ugSalon", product: "Bronde Baddie Deluxe Density Hybrid Weft Extensions", date: "2026-11-03" },
  { name: "Jasmine K.", rating: 5, title: "Five minutes, full glam", text: "The seamless clip-ins in Trophy Wife are my secret weapon. Clip in, fluff, out the door.", photo: "ugHoney", product: "Reputation Seamless Clip In Extensions", date: "2026-10-28" },
  { name: "Taylor B.", rating: 5, title: "Rich, glossy brunette", text: "Bad B Brunette tape-ins are so glossy and full. A month in and barely any shedding.", photo: "ugBrunette", product: "Bad B Brunette Tape In Weft", date: "2026-10-19" },
  { name: "Monica L.", rating: 4, title: "Weekend hair, every day", text: "The laced clip-ins are so comfortable, and the Ready to Wear finish saved me so much time.", photo: "ugChestnut", product: 'Warm Brown 22" Laced Clip In Extensions', date: "2026-10-02" },
];

/* ── Blog (client posts) ─────────────────────────────────────────────────── */
export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  readMins: number;
  image: ImgKey;
  body: { h?: string; p: string }[];
  shop?: { label: string; to: string };
}

export const posts: Post[] = [
  {
    slug: "our-mothers-day-edit",
    title: "Our Mother’s Day Edit",
    excerpt: "Mother’s Day gifting, but make it intentional.",
    tag: "Gifting",
    date: "2026-04-30",
    readMins: 3,
    image: "founders",
    body: [
      { h: "Who’s your mother?", p: "Mother’s Day gifting, but make it intentional. She’s the one who does the most without making it a thing. Always put together, always ahead, always the reason everything runs smoothly." },
      { p: "Mother’s Day isn’t about more stuff. It’s about giving her the kind of upgrade she wouldn’t necessarily buy for herself — but absolutely deserves. This year, we’re gifting better hair days." },
      { h: "For the mom who has everything", p: "Refined. Elevated. Already two steps ahead. The kind of staples that live on her counter and quietly do the most." },
    ],
    shop: { label: "Shop little luxuries", to: "/collections/little-luxuries" },
  },
  {
    slug: "the-clip-in-era",
    title: "The Clip-In Era: Effortless Hair, On Your Terms",
    excerpt: "Clip-ins, but not as you remember them.",
    tag: "Clip In’s",
    date: "2026-04-17",
    readMins: 3,
    image: "lsClipin",
    body: [
      { h: "Get to know Reputation Clip In’s", p: "There’s something about Reputation hair that changes everything: extra length & fullness where it matters, luxurious colors to blend & choose from, & multiple weft options available." },
      { p: "We’ve made access to Reputation hair easier than ever. Enter: clip-ins, but not as you remember them. Pop them in when you need them, take them out when you don’t." },
    ],
    shop: { label: "Shop Clip In’s", to: "/collections/clip-in-extensions" },
  },
  {
    slug: "get-the-look-build-your-blend",
    title: "Get the Look: Build Your Blend with Reputation",
    excerpt: "This season’s trending colors & the Rep blends to send your stylist.",
    tag: "Get the look",
    date: "2026-04-06",
    readMins: 4,
    image: "bkBronde",
    body: [
      { p: "We’ve been keeping up so you don’t have to. Keep scrolling to find this season’s trending hair colors & the Rep blends you can send to your stylist for your next install." },
      { h: "Blended & Blonde", p: "Low-maintenance blonde is having a moment this season. Think rooted blondes, high-contrast dimension & subtle lowlights that grow out like a dream. Get the look: shop Reputation’s Mane Character & Hustler for this beautiful blend." },
      { p: "Mane Character: our level 6 rooted blonde with golden tones. Hustler: chocolate brown with partial cool-tone highlights." },
      { h: "Lived-In Brunette", p: "The girls are adding dimension this season. Think brunette, but add a touch of brightness for a dimensional, lived-in bronde." },
    ],
    shop: { label: "Shop Brondes", to: "/collections/brondes" },
  },
  {
    slug: "whats-in-our-bag",
    title: "What’s in our bag (and why you need it)",
    excerpt: "The Reputation essentials we can’t leave the house without.",
    tag: "Essentials",
    date: "2026-04-02",
    readMins: 3,
    image: "edCare",
    body: [
      { p: "Great hair is one thing; taking care of it is everything. Get to know the Reputation essentials we can’t leave the house without — perfect for on-the-go, traveling + more." },
      { h: "Hot Girl Hair Oil", p: "Our weightless, high-gloss hair oil designed to smooth, soften & add instant shine to your length without ever looking heavy. Perfect for extensions & natural hair, it helps reduce the look of frizz and flyaways while leaving hair feeling expensive and polished." },
      { h: "Reputation Detangling Brush", p: "Our favorite high-quality, professional-grade detangling brush for everyday use. An essential for maintaining your extensions & natural hair." },
    ],
    shop: { label: "Shop essentials", to: "/collections/accessories" },
  },
  {
    slug: "spring-hair-inspo",
    title: "Spring Hair Inspo at Reputation",
    excerpt: "From soft dimension to bright & beautiful blondes — this season’s top trends.",
    tag: "Trends",
    date: "2026-04-02",
    readMins: 3,
    image: "lsSun",
    body: [
      { h: "Does your hair need a refresh?", p: "Here are the shades everyone’s leaning into right now, from soft dimension to bright & beautiful blondes — and how Reputation can help you achieve your hair goals." },
      { h: "The 90’s Blonde", p: "A soft, creamy blonde with subtle dimension and a lived-in finish — this throwback shade brings effortless brightness without feeling overdone. Get the look: shop Reputation’s Bossy Blonde & It Girl Blonde." },
      { h: "The Warm Bronde", p: "A seamless blend of brunette and blonde with golden undertones, warm bronde delivers that sunlit, in-between color that flatters everyone." },
    ],
    shop: { label: "Shop Blondes", to: "/collections/blondes" },
  },
  {
    slug: "introducing-reputation-extensions",
    title: "Introducing Reputation Extensions",
    excerpt: "Welcome to the new standard of hair extensions.",
    tag: "Our story",
    date: "2026-03-24",
    readMins: 2,
    image: "edSalon",
    body: [
      { h: "Welcome to the new standard of hair extensions", p: "Reputation Hair Extensions is a boutique hair extension company founded by mother-daughter duo Kathy Nunez and Olivia (Liv) Jacques, both professional hairstylists based in Washington State and Texas." },
      { p: "Their expertise in luxury hair services and modern hair color led them to create custom-blended extensions that replicate their signature and most requested hair colors. Built from real salon experience, every product is designed to perform seamlessly in both application and wear. This is hair that works with you." },
      { h: "Explore our hair collections", p: "Our collections are designed to give stylists flexibility across techniques and client needs." },
    ],
    shop: { label: "Shop Hair Collections", to: "/collections/all" },
  },
];

/* ── FAQ (client FAQ + answers from client About / policy pages) ─────────── */
export const faqs: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: "Hair & packs",
    items: [
      { q: "How many grams are in a pack?", a: "16″: half pack 50g / full pack 100g. 18″: half pack 50g / full pack 100g. 22″: half pack 60g / full pack 120g. 24″: half pack 60g / full pack 120g." },
      { q: "How much hair per row?", a: "Fine – medium hair: one half pack to ¾ pack. Medium – thick hair: ¾ pack to a full pack." },
      { q: "How long are your wefts?", a: "Our wefts are 33″ long and typically wrap around your client’s head 2½ times, depending on their head size." },
      { q: "What hair do you use?", a: "All Reputation extensions are made from 100% ethically sourced Remy human hair, ensuring natural movement, long-lasting softness, and a flawless blend." },
      { q: "Which installation methods do you offer?", a: "Hybrid Wefts (ideal for volume, fullness and customization), Keratin Tips (individual strand application for long-lasting wear), Tape-In Wefts (lightweight, seamless and quick to apply) and Clip In’s (perfect for occasion wear)." },
    ],
  },
  {
    group: "Orders & shipping",
    items: [
      { q: "Do you ship worldwide?", a: "Yes — we ship anywhere. Rates are available at checkout." },
      { q: "Can I return or exchange my order?", a: "Please note that all sales made on this website are final. We do not offer refunds or exchanges once a purchase has been completed, so we encourage you to review your order carefully — and contact us with any questions before completing your purchase." },
    ],
  },
  {
    group: "Pros & education",
    items: [
      { q: "Do you offer pro pricing for stylists?", a: "Yes. Licensed professionals can apply to become a Rep Pro through our Pro Pricing Application." },
      { q: "Do you offer extension education?", a: "Yes — we teach tape-in, weft and keratin tip installation, color matching and custom blending, client consultation and maintenance, and how to grow a successful extension business." },
    ],
  },
];

/* ── Home care guide (client page) ───────────────────────────────────────── */
export const care: { title: string; items: { h: string; p: string }[] }[] = [
  {
    title: "Daily Care",
    items: [
      { h: "Brush gently, twice a day", p: "Use an extension-friendly brush morning and night to prevent tangles and matting. Hold the hair at the root while brushing, always starting at the ends and working your way up." },
      { h: "Never sleep with wet hair", p: "Always allow your hair to dry completely before bed. Sleeping with damp hair can lead to tangling, matting, and unnecessary stress on your extensions." },
      { h: "Protect while you sleep", p: "Wear your hair in a loose braid or low ponytail before bed to minimize friction. For even more protection, switch to a silk pillowcase to help reduce frizz and breakage." },
    ],
  },
  {
    title: "Wash Day Routine",
    items: [
      { h: "Hydrate, don’t strip", p: "Wash your extensions with a moisturizing, sulfate-free shampoo and conditioner. Treat them to a deeply hydrating hair mask once a week to maintain softness and shine." },
      { h: "Skip protein & bond builders", p: "Avoid products containing protein or bond-building ingredients unless specifically recommended by your stylist. They can cause extension hair to feel dry, stiff, or brittle over time." },
      { h: "Dry with care", p: "After washing, gently blot your hair with a microfiber towel instead of rubbing. Rubbing creates friction that can lead to tangling and damage." },
    ],
  },
  {
    title: "Heat Styling",
    items: [
      { h: "Prep before styling", p: "Before blow drying or heat styling, apply a leave-in conditioner and gently detangle your hair." },
      { h: "Always use heat protectant", p: "Heat protection is essential to maintaining healthy, beautiful extensions. Never style without it." },
      { h: "Finish with hair oil", p: "Once styling is complete, apply a small amount of lightweight hair oil through the mid-lengths and ends for added softness, shine, and frizz control." },
      { h: "Pro tip", p: "Keep hot tools at 350°F (177°C) or below whenever possible to help preserve the quality and longevity of your extensions." },
    ],
  },
  {
    title: "Pool, Beach & Summer Care",
    items: [
      { h: "Before swimming", p: "Wet your hair thoroughly with clean, non-chlorinated water before entering a pool, hot tub, or the ocean. Hair acts like a sponge — if it’s already saturated with clean water, it absorbs less chlorine and salt." },
      { h: "After swimming", p: "Rinse your hair immediately with fresh water, then shampoo and condition as soon as possible to remove chlorine, salt, and minerals." },
      { h: "Wear mineral sunscreen", p: "Some chemical sunscreens can discolor hair extensions, especially lighter shades. Choose a mineral sunscreen whenever possible, and avoid getting sunscreen directly on your hair." },
    ],
  },
];

/* ── Policies ────────────────────────────────────────────────────────────── */
export interface Policy {
  title: string;
  intro: string;
  sections: { h: string; p: string[] }[];
}

export const policies: Record<string, Policy> = {
  "refund-policy": {
    title: "Refund Policy",
    intro: "Disclaimer: All Sales Final.",
    sections: [
      {
        h: "All sales final",
        p: [
          "Please note that all sales made on this website are final. We do not offer refunds or exchanges once a purchase has been completed.",
          "We encourage you to review your order carefully before finalizing your purchase. If you have any questions or concerns, please feel free to contact us prior to completing your transaction. Thank you for your understanding!",
        ],
      },
    ],
  },
  "shipping-policy": {
    title: "Shipping Policy",
    intro: "Worldwide shipping — ship anywhere, rates available at checkout.",
    sections: [
      { h: "Where we ship", p: ["We ship anywhere in the world. Shipping rates and delivery options for your address are shown at checkout."] },
      { h: "Free U.S. shipping", p: ["Standard U.S. shipping is free on qualifying orders over the threshold shown in your bag."] },
      { h: "Questions", p: ["Need help with an order? Email us at Reputationextensions@gmail.com."] },
    ],
  },
  "privacy-policy": {
    title: "Privacy Policy",
    intro: "How Reputation collects, uses and protects your information.",
    sections: [
      { h: "Information we collect", p: ["Details you provide (such as name, email, phone and shipping address), your order history, and standard device and browsing data collected through cookies."] },
      { h: "How we use it", p: ["To fulfil orders, provide support, send marketing you have opted into, prevent fraud and improve our store."] },
      { h: "Your choices", p: ["You can unsubscribe from marketing at any time and request access to, correction of, or deletion of your data by emailing Reputationextensions@gmail.com."] },
    ],
  },
  "terms-of-service": {
    title: "Terms of Service",
    intro: "The terms that apply when you use this site and place an order.",
    sections: [
      { h: "Using this site", p: ["By using this site and placing an order you agree to these terms and to our Refund Policy."] },
      { h: "Products & color", p: ["We do our best to display shades accurately; slight variation is natural with human hair and screens. Prices are shown in USD and may change without notice."] },
      { h: "Intellectual property", p: ["All content on this site is owned by Reputation Hair Extension Co. and may not be used without written permission."] },
    ],
  },
  accessibility: {
    title: "Accessibility Statement",
    intro: "Luxury hair should be for everyone — and so should shopping for it.",
    sections: [
      { h: "Our commitment", p: ["Reputation aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA."] },
      { h: "What we’ve done", p: ["Text meets AA contrast; every image has descriptive alternative text; everything works by keyboard with visible focus; headings follow a logical order; and animation respects your reduced-motion setting."] },
      { h: "Feedback", p: ["If any part of this site is difficult to use, email Reputationextensions@gmail.com and we’ll help you complete your order."] },
    ],
  },
};
