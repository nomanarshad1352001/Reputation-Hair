import { useEffect } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { StoreProvider } from "@/lib/store";
import { useSeo } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { QuickAdd } from "@/components/ProductCard";
import { CampaignBar, SpinWheel, WheelTeaser } from "@/components/Boosters";
import {
  BestSellers,
  BlogTeaser,
  BrandMarquee,
  Categories,
  Deals,
  Difference,
  FoundersStory,
  HeroSlider,
  HolidayGifting,
  InstagramFeed,
  NewsletterCta,
  PressStrip,
  Reviews,
  ShopFor,
  Transformations,
  VipOffer,
  WeekendBanner,
} from "@/sections/home";
import CollectionPage, { SearchPage } from "@/pages/Collection";
import ProductPage from "@/pages/Product";
import CartPage, { CheckoutPage } from "@/pages/Cart";
import { AccountPage, ArticlePage, BlogPage, NotFound, PageRouter, PolicyPage } from "@/pages/Content";

/* Homepage: every section has a visibility toggle + content in theme/settings.ts */
function Home() {
  useSeo(
    "Reputation Hair Extensions | Premium Human Hair Extension",
    "Shop premium 100% Remy human hair extensions, including clip-ins, wefts, and tape-ins. Natural volume, seamless blend, and long-lasting quality.",
  );
  return (
    <>
      <HeroSlider />
      <BrandMarquee />
      <PressStrip />
      <Categories />
      <Deals />
      <VipOffer />
      <BestSellers />
      <Transformations />
      <Difference />
      <ShopFor />
      <Reviews />
      <FoundersStory />
      <WeekendBanner />
      <HolidayGifting />
      <BlogTeaser />
      <InstagramFeed />
      <NewsletterCta />
    </>
  );
}

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function Shell() {
  return (
    <>
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-full focus:bg-black focus:px-5 focus:py-3 focus:text-white"
      >
        Skip to content
      </a>
      <ScrollManager />
      <CampaignBar />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections/:handle" element={<CollectionPage />} />
          <Route path="/products/:handle" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/blogs/introducing-reputation-extensions" element={<BlogPage />} />
          <Route path="/blogs/introducing-reputation-extensions/:slug" element={<ArticlePage />} />
          <Route path="/blogs/:blog" element={<Navigate to="/blogs/introducing-reputation-extensions" replace />} />
          <Route path="/pages/:slug" element={<PageRouter />} />
          <Route path="/policies/:handle" element={<PolicyPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <QuickAdd />
      <SpinWheel />
      <WheelTeaser />
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <StoreProvider>
        <Shell />
      </StoreProvider>
    </HashRouter>
  );
}
