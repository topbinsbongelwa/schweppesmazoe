"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import logo from "../../public/landing-shop-logo-.png";
import { api } from "../../lib/api";
import { addCartItem, cartCount as getCartCount, readCart } from "../../lib/cart";

export const PRODUCTS: Product[] = [
  { name: "Mazoe Orange Crush 6X2L", price: 21.51, category: "Mazoe", image: "/products/mazoe-orange-crush.png", bgColor: "#ffddd2", badge: "Popular" },
  { name: "Mazoe Blackberry 6X2L", price: 19.0, category: "Mazoe", image: "/products/mazoe-blackberry.png", bgColor: "#d9c8f5" },
  { name: "Mazoe Cream Soda 6X2L", price: 15.8, category: "Mazoe", image: "/products/mazoe-cream-soda.png", bgColor: "#ffeac2" },
  { name: "Mazoe Raspberry 6X2L", price: 15.8, category: "Mazoe", image: "/products/mazoe-raspberry.png", bgColor: "#ffb9c1" },
  { name: "Minute Maid Delight Apple Grape 12x400ml", price: 9.99, category: "Minute Maid", image: "/products/mm-apple-grape.png", bgColor: "#cdeecf" },
  { name: "Minute Maid Delight Orange 12x400ml", price: 9.99, category: "Minute Maid", image: "/products/mm-delight-orange.png", bgColor: "#ffddd2" },
  { name: "Minute Maid Delight Guava 12x400ml", price: 9.99, category: "Minute Maid", image: "/products/mm-delight-guava.png", bgColor: "#ffe2c9" },
  { name: "Minute Maid Delight Tropical 12x400ml", price: 9.99, category: "Minute Maid", image: "/products/mm-delight-tropical.png", bgColor: "#ffeabf" },
  { name: "Minute Maid Delight Pulpy Orange 12x400ml", price: 9.99, category: "Minute Maid", image: "/products/mm-delight-pulpy-orange.png", bgColor: "#ffd8b1" },
  { name: "Minute Maid Refresh Orange 12X400ML", price: 5.0, category: "Minute Maid", image: "/products/mm-refresh-orange.png", bgColor: "#ffddd2" },
  { name: "Minute Maid Refresh Berry 12x400ml", price: 5.0, category: "Minute Maid", image: "/products/mm-berry.png", bgColor: "#d9c8f5" },
  { name: "Minute Maid Refresh Lemon 12x400ml", price: 5.0, category: "Minute Maid", image: "/products/mm-lemon.png", bgColor: "#fff3b0" },
  { name: "Bon Aqua Still Water 12X500ML", price: 2.36, category: "Still Water", image: "/products/bonaqua-500ml.png", bgColor: "#c2ebff" },
  { name: "Bon Aqua Still Water 2X5L", price: 3.5, category: "Still Water", image: "/products/bonaqua-5l.png", bgColor: "#c2ebff" },
  { name: "Fruitade Lemon & Lime 6X2L", price: 13.5, category: "Fruitade", image: "/products/fruitade-lemon.png", bgColor: "#d7f7c9" },
  { name: "Fruitade Orange 6X2L", price: 13.5, category: "Fruitade", image: "/products/fruitade-orange.png", bgColor: "#ffdbb5" },
  { name: "Appletiser Glass", price: 29.5, category: "Fruitade", image: "/products/appletiser-glass.png", bgColor: "#fff3c4" },
  { name: "Appletiser Can", price: 25.0, category: "Fruitade", image: "/products/appletiser-can.png", bgColor: "#fff3c4" },
  { name: "Powerade Mountain Blast", price: 30.0, category: "Fruitade", image: "/products/powerade-mountain.png", bgColor: "#c2ebff" },
  { name: "Powerade jagged ice", price: 30.0, category: "Fruitade", image: "/products/powerade-jagged.png", bgColor: "#c9eaff" },
  { name: "Powerade Naartjie", price: 30.0, category: "Fruitade", image: "/products/powerade-naartjie.png", bgColor: "#ffd8b1" },
];

type Product = {
  name: string;
  price: number;
  category: string;
  image: string;
  bgColor: string;
  stock?: number;
  badge?: string;
};

const FRUITADE_IMAGES = PRODUCTS
  .filter((product) => product.category === "Fruitade")
  .map((product) => product.image);

function Icon({ name }: { name: "account" | "cart" | "phone" | "message" | "menu" }) {
  const paths = {
    account: <><circle cx="12" cy="8" r="3.25" /><path d="M5.5 20c.5-3.2 2.7-5 6.5-5s6 1.8 6.5 5" /></>,
    cart: <><circle cx="9" cy="20" r="1.25" /><circle cx="18" cy="20" r="1.25" /><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 1.9-1.4L21 8H6" /></>,
    phone: <path d="M6.6 3.8 9.3 3l1.7 4.2-1.8 1.5a14 14 0 0 0 6.1 6.1l1.5-1.8 4.2 1.7-.8 2.7a2.1 2.1 0 0 1-2.3 1.5C10.4 17.7 6.3 13.6 5.1 6.1a2.1 2.1 0 0 1 1.5-2.3Z" />,
    message: <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-3.3-.6L4 20l1.5-4.1A7.1 7.1 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" />,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  };

  return <svg aria-hidden="true" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

const HERO_BANNERS = [
  {
    title: "Mazoe",
    subtitle: "A world of flavors",
    cta: "Shop Now",
    image:
      "https://cdn-ilcmcif.nitrocdn.com/pHNUJvOYUQuTVrPspbMcIntckJrfALSP/assets/images/optimized/rev-f871864/shop.schweppes.co.zw/wp-content/uploads/2024/12/mazoe-bbb.jpg",
    link: "/shop/mazoe_",
  },
  {
    title: "Bonaqua",
    subtitle: "Live first",
    cta: "Shop Now",
    image:
      "https://cdn-ilcmcif.nitrocdn.com/pHNUJvOYUQuTVrPspbMcIntckJrfALSP/assets/images/optimized/rev-f871864/shop.schweppes.co.zw/wp-content/uploads/2025/01/schweppes-elements-bonaqua-banner.jpg",
    link: "/shop/still_water",
  },
  {
    title: "Minute Maid Delight",
    subtitle: "Break times filled with sensations",
    cta: "Shop Now",
    image:
      "https://cdn-ilcmcif.nitrocdn.com/pHNUJvOYUQuTVrPspbMcIntckJrfALSP/assets/images/optimized/rev-f871864/shop.schweppes.co.zw/wp-content/uploads/2024/12/sh-slide-4.jpg",
    link: "/shop/minute_maid",
  },
  {
    title: "Fruitade",
    subtitle: "Sip, Savor, Smile",
    cta: "Shop Now",
    image:
      "https://cdn-ilcmcif.nitrocdn.com/pHNUJvOYUQuTVrPspbMcIntckJrfALSP/assets/images/optimized/rev-f871864/shop.schweppes.co.zw/wp-content/uploads/2024/12/fruitade-b.jpg",
    link: "/shop/fruitade_",
  },
];

const CATEGORIES = ["All", "Mazoe", "Minute Maid", "Still Water", "Fruitade"];

const CATEGORY_ALIASES: Record<string, string> = {
  mazoe: "Mazoe",
  minute_maid: "Minute Maid",
  "minute maid": "Minute Maid",
  still_water: "Still Water",
  "still water": "Still Water",
  fruitade: "Fruitade",
};

function normalizeCategory(category: string) {
  const key = category.trim().toLowerCase();
  return CATEGORY_ALIASES[key] || category.trim();
}

export const CATEGORY_BY_SLUG: Record<string, string> = {
  mazoe_: "Mazoe",
  minute_maid: "Minute Maid",
  still_water: "Still Water",
  fruitade_: "Fruitade",
};

export default function ShopPage({ initialCategory = "All" }: { initialCategory?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const [activeHero, setActiveHero] = useState(0);
  const [activeFruitadeImage, setActiveFruitadeImage] = useState(0);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState(initialCategory);
  const [cartCount, setCartCount] = useState(0);
  const [cartShake, setCartShake] = useState(false);
  const [cartPouring, setCartPouring] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState(PRODUCTS);

  useEffect(() => {
    const syncCart = () => setCartCount(getCartCount(readCart()));
    syncCart();
    window.addEventListener("mazoe-cart-updated", syncCart);
    return () => window.removeEventListener("mazoe-cart-updated", syncCart);
  }, []);

  useEffect(() => {
    api.products.getAll().then((data) => {
      if (data.length) {
        setProducts(data.map((product) => ({
          ...product,
          category: normalizeCategory(product.category),
          bgColor: "#f7e5ce",
        })));
      }
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHero((current) => (current + 1) % HERO_BANNERS.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveFruitadeImage((current) => (current + 1) % FRUITADE_IMAGES.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, []);

  const confirmAddToCart = () => {
    if (!selectedProduct) return;
    const { name } = selectedProduct;
    const existingQuantity = readCart().find((item) => item.name === name)?.quantity || 0;
    if (selectedProduct.stock !== undefined && existingQuantity >= selectedProduct.stock) {
      setToast(`${name} is out of stock`);
      setSelectedProduct(null);
      return;
    }
    addCartItem({ name, price: selectedProduct.price, image: selectedProduct.image }, selectedProduct.stock);
    setCartShake(true);
    setCartPouring(true);
    setToast(name);
    setSelectedProduct(null);
    setTimeout(() => setCartShake(false), 500);
    setTimeout(() => setCartPouring(false), 900);
  };

  const triggerCartPour = () => {
    setCartPouring(true);
    setTimeout(() => setCartPouring(false), 900);
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const filtered = products.filter((p) => {
    const inCat = activeCat === "All" || p.category === activeCat;
    const inSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return inCat && inSearch;
  });

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-inner">
          <span className="contact-info">
            <span className="contact-icon"><Icon name="phone" /></span>
            Call Us: +2638688002173
          </span>
          <span className="sep">&nbsp;|&nbsp;</span>
          <span className="contact-info">
            <span className="contact-icon"><Icon name="message" /></span>
            Whatsapp Us: +263773079763
          </span>
          <div className="top-right">
            <Link href="/dashboard/inventory" className="top-link">Inventory</Link>
            <span className="sep">&nbsp;|&nbsp;</span>
            <Link href="/checkout" className="top-link">Checkout</Link>
          </div>
        </div>
      </div>

      <header className="main-header">
        <Link href="/" className="brand">
          <Image
            src={logo}
            alt="Schweppes Shop"
            width={180}
            height={60}
            priority
            style={{ width: "auto", height: 60 }}
          />
        </Link>

        <form className="search-box" onSubmit={(event) => { event.preventDefault(); document.getElementById("shop-results")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search products"
          />
          <button type="submit" aria-label="Search products">&#8594;</button>
        </form>

        <div className="header-actions">
          <Link href="/account" className="header-icon" aria-label="Account">
            <Icon name="account" />
          </Link>
          <Link
            href="/checkout"
            className={`header-icon cart-btn ${cartShake ? "cart-shake" : ""} ${cartPouring ? "pouring" : ""}`}
            aria-label={`Cart, ${cartCount} items`}
            onClick={triggerCartPour}
          >
            <span className="cart-juice" aria-hidden="true">
              <span className="cart-stream" />
              <span className="cart-drop cart-drop-one" />
              <span className="cart-drop cart-drop-two" />
              <span className="cart-splash" />
            </span>
            <Icon name="cart" />
            <b>{cartCount}</b>
          </Link>
        </div>

        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <Icon name="menu" />
        </button>
      </header>

      <nav className={`navigation ${menuOpen ? "open" : ""}`}>
        <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <span className="nav-sep">|</span>
        <Link href="/shop/mazoe_" onClick={() => setMenuOpen(false)}>MAZOE</Link>
        <span className="nav-sep">|</span>
        <Link href="/shop/minute_maid" onClick={() => setMenuOpen(false)}>MINUTE MAID</Link>
        <span className="nav-sep">|</span>
        <Link href="/shop/still_water" onClick={() => setMenuOpen(false)}>STILL WATER</Link>
        <span className="nav-sep">|</span>
        <Link href="/shop/fruitade_" onClick={() => setMenuOpen(false)}>FRUITADE</Link>
        <span className="nav-sep">|</span>
        <Link href="/order-tracking" onClick={() => setMenuOpen(false)}>Track Your Order</Link>
        <button type="button" className="catalogue-button" aria-expanded={catalogueOpen} onClick={() => setCatalogueOpen((open) => !open)}>
          &#9776; View Full Catalogue
        </button>
        {catalogueOpen && <div className="catalogue-panel">
          <div className="catalogue-panel-image">
            <Image src="/products/mazoe-orange-crush.png" alt="Mazoe Orange Crush" width={420} height={420} />
          </div>
          <div className="catalogue-panel-links">
            <Link href="/catalogue" onClick={() => setCatalogueOpen(false)}>All Products</Link>
            <Link href="/shop/mazoe_" onClick={() => setCatalogueOpen(false)}>Mazoe</Link>
            <Link href="/shop/minute_maid" onClick={() => setCatalogueOpen(false)}>Minute Maid</Link>
            <Link href="/shop/still_water" onClick={() => setCatalogueOpen(false)}>Still Water</Link>
            <Link href="/shop/fruitade_" onClick={() => setCatalogueOpen(false)}>Fruitade</Link>
          </div>
        </div>}
      </nav>

      <section className="hero-section">
        {HERO_BANNERS.map((b, i) => <Link key={i} href={b.link} className={`hero-card ${i === activeHero ? "active" : ""}`} aria-hidden={i !== activeHero} tabIndex={i === activeHero ? 0 : -1}>
          {b.title === "Fruitade" ? <div className="hero-media fruitade-media">
            {FRUITADE_IMAGES.map((image, imageIndex) => <span key={image} className={imageIndex === activeFruitadeImage ? "fruitade-product active" : "fruitade-product"} style={{ backgroundImage: `url(${image})` }} aria-hidden="true" />)}
          </div> : <div className="hero-media" style={{ backgroundImage: `url(${b.image})` }} />}
          <div className="hero-content"><h2>{b.title}</h2><p>{b.subtitle}</p><span className="hero-cta">{b.cta} &rarr;</span></div>
        </Link>)}
        <div className="hero-dots" aria-label="Featured products">
          {HERO_BANNERS.map((b, i) => <button key={b.title} type="button" className={i === activeHero ? "active" : ""} aria-label={`Show ${b.title}`} onClick={() => setActiveHero(i)} />)}
        </div>
      </section>

      <section className="shop-section" id="shop-results">
        <div className="shop-head">
          <h1>Shop our range</h1>
          <p>Click, shop and ship with ease.</p>
        </div>

        <div className="filter-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeCat === cat ? "active" : ""}`}
              onClick={() => setActiveCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="product-grid" key={`${activeCat}-${search}`}>
          {filtered.map((p, i) => (
            <div key={`${p.name}-${i}`} className="product-card spill-card" style={{ "--spill-delay": `${Math.min(i, 7) * 55}ms` } as CSSProperties}>
              <button className="product-thumb product-thumb-button" type="button" style={{ background: p.bgColor }} onClick={() => setSelectedProduct(p)} aria-label={`View ${p.name}`}>
                {p.badge && <span className="badge">{p.badge}</span>}
                <Image
                  src={p.image}
                  alt={p.name}
                  width={300}
                  height={300}
                  className="prod-img"
                />
                <span className="image-hint">View pour</span>
              </button>
              <h3 className="prod-name">{p.name}</h3>
              <div className="prod-price">
                <span className="currency">$</span>
                {p.price.toFixed(2)}
              </div>
              <div className={`stock-note ${(p.stock ?? 1) === 0 ? "out" : ""}`}>
                {p.stock === 0 ? "Out of stock" : p.stock === undefined ? "Stock available" : `${p.stock} left`}
              </div>
              <button
                className="add-btn"
                aria-label={`Add ${p.name} to cart`}
                disabled={p.stock === 0}
                onClick={() => setSelectedProduct(p)}
              >
                <span className="add-label">Add to Cart</span>
                <span className="add-arrow">&rarr;</span>
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="no-results">No products found.</p>
          )}
        </div>
      </section>

      <section className="deals-section">
        <div className="deals-inner">
          <span className="deals-eyebrow">Amazing Deals</span>
          <h2>Click, Shop and Ship with Ease!</h2>
          <p>Place your order and have it delivered straight to your doorstep</p>
          <div className="deals-points">
            <span>&#10003; We deliver all over Zimbabwe</span>
            <span>&#10003; We accept Cash on delivery</span>
          </div>
          <Link href="/shop" className="shop-btn">Shop Now <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="newsletter">
        <div className="newsletter-inner">
          <h2>Join Our Community</h2>
          <p>Subscribe to our newsletter and stay up-to-date on the latest news, offers and discounts.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>

      <footer className="shop-footer">
        <div className="footer-col about">
          <h3>Schweppes Holdings Africa Limited</h3>
          <p>We are a leading manufacturer and distributor of liquid food and beverages.</p>
          <a href="https://schweppes.co.zw/" target="_blank" rel="noreferrer">Visit our corporate website &rarr;</a>
        </div>
        <div className="footer-col">
          <h3>Quick Links</h3>
          <Link href="/terms">Terms and conditions</Link>
          <Link href="/faq">Frequently Asked Questions</Link>
          <Link href="/contact-us">Contact Us</Link>
        </div>
        <div className="footer-col">
          <h3>Categories</h3>
          <Link href="/shop/mazoe_">Mazoe</Link>
          <Link href="/shop/minute_maid">Minute Maid</Link>
          <Link href="/shop/still_water">Still Water</Link>
          <Link href="/shop/fruitade_">Fruitade</Link>
        </div>
        <div className="footer-col">
          <h3>Contact Us</h3>
          <p>Address: 67a Woolwich Rd Willowvale Harare</p>
          <p>Email: feedback@schweppes.co.zw</p>
          <p>WhatsApp: +263773079763</p>
          <div className="shop-payment-methods" aria-label="Accepted payment methods">
            <span className="ecocash">Eco<span>Cash</span></span>
            <span className="onemoney"><i>One</i>Money</span>
            <span className="zipit">ZIPIT</span>
            <span className="innbucks">InnBucks</span>
            <span className="paypal">PayPal</span>
            <span className="mastercard"><i /><b /></span>
            <span className="visa">VISA</span>
          </div>
        </div>
      </footer>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Schweppes Holdings Africa Limited. All Rights Reserved.
      </div>

      {toast && <div className={`cart-toast ${toast.endsWith("out of stock") ? "cart-toast-error" : ""}`} role="status">{toast.endsWith("out of stock") ? toast : `${toast} added to cart`}</div>}

      {selectedProduct && (
        <div className="cart-confirm-backdrop" role="presentation" onClick={() => setSelectedProduct(null)}>
          <div
            className="cart-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-confirm-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="spill-stage" style={{ background: selectedProduct.bgColor }}>
              <span className="spill-stream" aria-hidden="true" />
              <span className="spill-drop spill-drop-one" aria-hidden="true" />
              <span className="spill-drop spill-drop-two" aria-hidden="true" />
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                width={340}
                height={340}
                className="spill-product"
              />
              <span className="spill-splash" aria-hidden="true" />
            </div>
            <div className="cart-confirm-copy">
              <span className="confirm-kicker">Ready to pour</span>
              <h2 id="cart-confirm-title">Add {selectedProduct.name}?</h2>
              <p>{selectedProduct.stock === 0 ? "This product is currently out of stock." : `Only ${selectedProduct.stock ?? "a few"} left in the store.`}</p>
              <div className="cart-confirm-actions">
                <button type="button" className="cancel-btn" onClick={() => setSelectedProduct(null)}>Cancel</button>
                <button type="button" className="confirm-btn" disabled={selectedProduct.stock === 0} onClick={confirmAddToCart}>Add to Cart <span aria-hidden="true">&rarr;</span></button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        * { box-sizing: border-box; }
        body { margin: 0; }

        .top-bar {
          background: var(--orange);
          color: #fff;
          font-size: 13px;
        }
        .top-bar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 9px 28px;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .contact-info { display: flex; align-items: center; gap: 6px; }
        .contact-icon { color: var(--yellow); }
        .icon { width: 20px; height: 20px; display: block; }
        .sep { opacity: 0.5; }
        .top-right { margin-left: auto; display: flex; align-items: center; gap: 6px; }
        .top-link { color: #fff; text-decoration: none; }
        .top-link:hover { color: var(--yellow); }

        .main-header {
          padding: 18px 28px;
          display: flex;
          align-items: center;
          gap: 30px;
          background: #fff;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .brand { flex-shrink: 0; }

        .search-box {
          flex: 1;
          max-width: 600px;
          height: 48px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 18px;
          border-radius: 40px;
          background: #f1f1f1;
          border: 1px solid transparent;
          transition: border-color 0.2s;
        }
        .search-box:focus-within { border-color: var(--orange); background: #fff; }
        .search-box input { flex: 1; border: 0; outline: 0; background: transparent; font-size: 15px; }
        .search-box button { border: 0; color: var(--orange); background: transparent; cursor: pointer; font-size: 18px; }

        .header-actions { display: flex; gap: 10px; margin-left: auto; }
        .header-icon {
          position: relative;
          width: 56px;
          height: 56px;
          border: 0;
          border-radius: 50%;
          background: #f5f5f5;
          color: #555;
          display: grid;
          place-items: center;
          font-size: 22px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, color 0.2s, transform 0.2s ease;
        }
        .header-icon:hover {
          background: var(--orange);
          color: #fff;
          transform: translateY(-2px) scale(1.06);
        }
        .header-icon .icon {
          width: 30px;
          height: 30px;
          transition: transform 0.25s ease, filter 0.25s ease;
        }
        .header-icon:hover .icon {
          transform: scale(1.12) rotate(-6deg);
          filter: drop-shadow(0 6px 12px rgba(239, 118, 34, 0.3));
        }
        .header-icon b {
          position: absolute;
          top: -5px;
          right: -4px;
          min-width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--orange);
          color: #fff;
          font-size: 12px;
          display: grid;
          place-items: center;
          padding: 0 5px;
        }
        .cart-btn {
          overflow: visible;
          isolation: isolate;
        }
        .cart-juice {
          position: absolute;
          left: 50%;
          top: 55%;
          width: 46px;
          height: 54px;
          pointer-events: none;
          transform: translate(-50%, -50%);
          opacity: 0;
        }
        .cart-stream {
          position: absolute;
          left: 50%;
          top: 12px;
          width: 11px;
          height: 24px;
          border-radius: 14px;
          background: linear-gradient(180deg, rgba(255, 189, 93, 0.9), rgba(239, 118, 34, 0.94));
          transform: translateX(-50%) rotate(12deg);
          box-shadow: 0 0 10px rgba(239, 118, 34, 0.45);
        }
        .cart-drop {
          position: absolute;
          width: 10px;
          height: 14px;
          border-radius: 70% 30% 70% 30%;
          background: linear-gradient(180deg, rgba(255, 219, 128, 0.98), rgba(239, 118, 34, 0.94));
          opacity: 0;
        }
        .cart-drop-one { left: 18px; top: 22px; }
        .cart-drop-two { right: 14px; top: 28px; width: 8px; height: 12px; }
        .cart-splash {
          position: absolute;
          left: 50%;
          bottom: 4px;
          width: 22px;
          height: 10px;
          border: 3px solid rgba(247, 148, 29, 0.85);
          border-top-color: transparent;
          border-radius: 50%;
          transform: translateX(-50%) scale(0.7);
          opacity: 0;
        }
        .cart-btn:hover .cart-juice,
        .cart-btn.pouring .cart-juice {
          opacity: 1;
          animation: cart-juice-flow 0.9s ease-in-out;
        }
        .cart-btn:hover .cart-stream,
        .cart-btn.pouring .cart-stream { animation: cart-stream-pour 0.9s ease-in-out; }
        .cart-btn:hover .cart-drop-one,
        .cart-btn.pouring .cart-drop-one { animation: cart-drop-1 0.9s ease-in-out; }
        .cart-btn:hover .cart-drop-two,
        .cart-btn.pouring .cart-drop-two { animation: cart-drop-2 0.9s 0.12s ease-in-out; }
        .cart-btn:hover .cart-splash,
        .cart-btn.pouring .cart-splash { animation: cart-splash-pop 0.9s ease-in-out; }
        @keyframes cart-juice-flow {
          0% { opacity: 0; transform: translate(-50%, -42%) scale(0.8); }
          18% { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%, 6%) scale(1.1); }
        }
        @keyframes cart-stream-pour {
          0%, 20% { opacity: 0; height: 10px; }
          38%, 72% { opacity: 1; height: 26px; }
          100% { opacity: 0; height: 14px; }
        }
        @keyframes cart-drop-1 {
          0%, 30% { opacity: 0; transform: translateY(-8px) scale(0.4); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateY(18px) scale(1); }
        }
        @keyframes cart-drop-2 {
          0%, 38% { opacity: 0; transform: translateY(-10px) scale(0.3); }
          58% { opacity: 1; }
          100% { opacity: 0; transform: translateY(22px) scale(0.9); }
        }
        @keyframes cart-splash-pop {
          0%, 30% { opacity: 0; transform: translateX(-50%) scale(0.45); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateX(-50%) scale(1.1); }
        }
        @media (max-width: 640px) {
          .header-icon { width: 44px; height: 44px; }
          .header-icon .icon { width: 24px; height: 24px; }
        }

        .menu-button { display: none; border: 0; background: transparent; font-size: 26px; color: var(--green); cursor: pointer; }

        .navigation {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          padding: 12px 20px;
          background: var(--orange);
        }
        .navigation a {
          color: #fff;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.03em;
          padding: 6px 8px;
          transition: color 0.2s;
        }
        .navigation a:hover { color: var(--green); }
        .nav-sep { color: rgba(255,255,255,0.4); }
        .catalogue-button {
          background: #fff;
          color: var(--orange) !important;
          border-radius: 20px;
          padding: 8px 18px !important;
          margin-left: 8px;
        }
        .catalogue-button:hover { color: var(--green) !important; }

        .hero-section {
          max-width: 1280px;
          margin: 32px auto;
          padding: 0 28px;
          position: relative;
          height: 390px;
        }
        .hero-card {
          position: relative;
          height: 320px;
          border-radius: 14px;
          width: 100%; 
          border: 0;
          text-decoration: none;
          display: block;
          position: absolute;
          inset: 0 28px;
          height: 100%;
          overflow: hidden;
          opacity: 0;
          transform: scale(1.02);
          transition: opacity 1.1s ease-in-out, transform 6.2s ease-out;
          pointer-events: none;
        }
        .hero-card.active {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
        }
        .hero-media {
          position: absolute;
          cursor: zoom-in;
          inset: 0;
          border-radius: inherit;
          background-size: cover;
          background-position: center;
          transition: transform 6.2s ease-out;
        }
        .fruitade-media { background: linear-gradient(90deg, rgba(246,242,233,.96) 0%, rgba(246,242,233,.55) 42%, rgba(245,200,75,.2) 100%); }
        .fruitade-product { position: absolute; inset: 0; background-repeat: no-repeat; background-position: 72% center; background-size: min(42%, 420px); opacity: 0; transform: translateX(18px) scale(.98); transition: opacity .9s ease-in-out, transform 1.2s ease-out; }
        .fruitade-product.active { opacity: 1; transform: translateX(0) scale(1); }
        .hero-card.active .hero-media { transform: scale(1.08); }
        .product-thumb-button .prod-img { transition: transform 0.55s cubic-bezier(.2,.8,.2,1); }
        .product-thumb-button:hover .prod-img, .product-thumb-button:focus-visible .prod-img { transform: scale(1.1) rotate(3deg); }
        .product-thumb-button .image-hint { position: absolute; right: 12px; bottom: 12px; padding: 6px 8px; color: #1f5b49; background: rgba(255,255,255,.86); font: 700 9px Arial, sans-serif; opacity: 0; transform: translateY(6px); transition: .25s ease; }
        .product-thumb-button:hover .image-hint, .product-thumb-button:focus-visible .image-hint { opacity: 1; transform: translateY(0); }
        .hero-card:hover .hero-media { transform: scale(1.11); }
        .hero-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 22px;
          background: linear-gradient(to top, rgba(24,61,53,0.72), rgba(24,61,53,0.08));
          color: #fff;
        }
        .hero-content h2 { font-size: 24px; margin: 0 0 6px; }
        .hero-content p { margin: 0 0 14px; font-size: 13px; opacity: 0.9; }
        .hero-cta {
          align-self: flex-start;
          background: var(--orange);
          color: #fff;
          padding: 9px 18px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
        }
        .hero-dots { position: absolute; z-index: 3; left: 50%; bottom: 18px; display: flex; gap: 8px; transform: translateX(-50%); }
        .hero-dots button { width: 9px; height: 9px; padding: 0; border: 0; border-radius: 50%; background: rgba(255,255,255,.55); cursor: pointer; }
        .hero-dots button.active { background: var(--orange); transform: scale(1.35); }
        .catalogue-panel { position: absolute; z-index: 20; top: calc(100% + 10px); right: 28px; left: 28px; display: grid; grid-template-columns: minmax(260px, 38%) 1fr; min-height: 360px; padding: 24px 30px; color: #7b8580; background: rgba(255,255,255,.98); box-shadow: 0 22px 45px rgba(0,0,0,.18); }
        .catalogue-panel-image { display: grid; place-items: center; background: #f8e5c4; }
        .catalogue-panel-image img { width: min(100%, 320px); height: 300px; object-fit: contain; }
        .catalogue-panel-links { display: grid; grid-template-columns: 1fr 1fr; align-content: center; gap: 26px 50px; padding: 20px 50px; font-size: 18px; }
        .catalogue-panel-links a { color: #7b8580; font-weight: 500; }
        .catalogue-panel-links a:hover { color: var(--orange); }

        .shop-section {
          max-width: 1280px;
          margin: 20px auto 0;
          padding: 40px 28px;
        }
        .shop-head { text-align: center; margin-bottom: 26px; }
        .shop-head h1 { font-size: 30px; margin: 0 0 6px; }
        .shop-head p { color: #666; margin: 0; }

        .filter-bar { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin-bottom: 34px; }
        .filter-btn {
          padding: 9px 24px;
          border: 1px solid #ddd;
          border-radius: 24px;
          background: #fff;
          color: #444;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-btn:hover { border-color: var(--orange); color: var(--orange); }
        .filter-btn.active { background: var(--orange); border-color: var(--orange); color: #fff; }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }
        .product-card {
          border: 1px solid #eee;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.25s, transform 0.25s;
        }
        .spill-card {
          animation: spill-up 0.65s cubic-bezier(.16, 1, .3, 1) var(--spill-delay) both;
        }
        .product-card:hover { box-shadow: 0 10px 30px rgba(0,0,0,0.12); transform: translateY(-4px); }
        .product-thumb {
          position: relative;
          height: 245px;
          padding: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          overflow: hidden;
        }
        .prod-img {
          width: 92%;
          height: 92%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }
        .product-card:hover .prod-img { transform: scale(1.02); }
        .badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: var(--orange);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 12px;
        }
        .prod-name {
          padding: 14px 16px 4px;
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.35;
          min-height: 42px;
        }
        .prod-price { padding: 4px 16px; font-size: 20px; font-weight: 800; color: var(--green); }
        .currency { color: var(--orange); font-size: 16px; }
        .stock-note { padding: 0 16px; color: #287249; font-size: 12px; font-weight: 700; }
        .stock-note.out { color: #b4493d; }
        .add-btn {
          margin: 10px 16px 16px;
          padding: 11px;
          border: 0;
          border-radius: 24px;
          background: var(--orange);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .add-btn:hover { background: #dd7f06; }
        .add-btn:disabled, .confirm-btn:disabled { cursor: not-allowed; opacity: .5; }
        .cart-toast { position: fixed; z-index: 250; right: 24px; bottom: 24px; padding: 14px 18px; border-radius: 8px; color: #fff; background: var(--green); box-shadow: 0 12px 30px rgba(24, 61, 53, .2); font-size: 14px; font-weight: 700; animation: toast-in .25s ease-out both; }
        .cart-toast-error { background: #b4493d; }
        .no-results { grid-column: 1 / -1; text-align: center; color: #888; }

        .cart-confirm-backdrop {
          position: fixed;
          z-index: 200;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 24px;
          background: rgba(17, 28, 54, 0.72);
          animation: modal-fade-in 0.22s ease-out both;
        }
        .cart-confirm-modal {
          width: min(860px, 100%);
          display: grid;
          grid-template-columns: minmax(280px, 0.95fr) minmax(300px, 1.05fr);
          overflow: hidden;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);
          animation: modal-rise-in 0.35s cubic-bezier(.2,.8,.2,1) both;
        }
        .spill-stage {
          position: relative;
          min-height: 390px;
          display: grid;
          place-items: center;
          overflow: hidden;
        }
        .spill-stage::before {
          content: "";
          position: absolute;
          width: 230px;
          height: 230px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.28);
          transform: translate(-35px, 48px);
        }
        .spill-product {
          position: relative;
          z-index: 2;
          width: min(78%, 330px);
          height: auto;
          filter: drop-shadow(18px 22px 12px rgba(27, 39, 85, 0.2));
          animation: spill-bottle 1.8s ease-in-out infinite;
        }
        .spill-stream {
          position: absolute;
          z-index: 1;
          width: 13px;
          height: 108px;
          border-radius: 50%;
          background: var(--orange);
          opacity: 0;
          transform: translate(42px, 90px) rotate(18deg);
          transform-origin: top;
          animation: pour-stream 1.8s ease-in-out infinite;
        }
        .spill-drop {
          position: absolute;
          z-index: 3;
          width: 12px;
          height: 18px;
          border-radius: 70% 30% 70% 30%;
          background: var(--orange);
          opacity: 0;
        }
        .spill-drop-one { transform: translate(92px, -55px) rotate(35deg); animation: spill-drop-one 1.8s ease-in-out infinite; }
        .spill-drop-two { width: 8px; height: 13px; transform: translate(128px, -25px) rotate(25deg); animation: spill-drop-two 1.8s 0.35s ease-in-out infinite; }
        .spill-splash {
          position: absolute;
          z-index: 1;
          bottom: 54px;
          width: 125px;
          height: 24px;
          border: 4px solid rgba(247, 148, 29, 0.72);
          border-top-color: transparent;
          border-radius: 50%;
          animation: splash-pulse 1.8s ease-in-out infinite;
        }
        .cart-confirm-copy { padding: 58px 56px 52px; align-self: center; }
        .confirm-kicker { color: var(--orange); font-size: 12px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }
        .cart-confirm-copy h2 { margin: 12px 0 14px; color: var(--green); font-size: clamp(30px, 4vw, 46px); line-height: 1.05; }
        .cart-confirm-copy p { max-width: 340px; margin: 0; color: #666; font-size: 16px; line-height: 1.6; }
        .cart-confirm-actions { display: flex; gap: 12px; margin-top: 34px; }
        .cancel-btn, .confirm-btn { padding: 13px 20px; border-radius: 24px; font-size: 14px; font-weight: 700; cursor: pointer; }
        .cancel-btn { border: 1px solid #d7d7d7; color: #555; background: #fff; }
        .confirm-btn { border: 1px solid var(--orange); color: #fff; background: var(--orange); }
        .confirm-btn:hover { background: #dd7f06; }
        .confirm-btn span { margin-left: 8px; font-size: 18px; }

        @keyframes modal-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes toast-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes modal-rise-in { from { opacity: 0; transform: translateY(18px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes spill-up { from { opacity: 0; clip-path: inset(100% 0 0); transform: translateY(34px) scale(.97); } to { opacity: 1; clip-path: inset(0); transform: translateY(0) scale(1); } }
        @keyframes spill-bottle { 0%, 100% { transform: translate(0, 0) rotate(2deg); } 32% { transform: translate(-13px, 10px) rotate(-8deg); } 58% { transform: translate(9px, -5px) rotate(6deg); } }
        @keyframes pour-stream { 0%, 18% { opacity: 0; height: 40px; } 35%, 70% { opacity: .9; height: 112px; } 88%, 100% { opacity: 0; height: 55px; } }
        @keyframes spill-drop-one { 0%, 25% { opacity: 0; transform: translate(65px, -28px) scale(.5) rotate(35deg); } 55% { opacity: 1; } 100% { opacity: 0; transform: translate(45px, 115px) scale(1.1) rotate(85deg); } }
        @keyframes spill-drop-two { 0%, 30% { opacity: 0; transform: translate(128px, -25px) scale(.4) rotate(25deg); } 60% { opacity: .9; } 100% { opacity: 0; transform: translate(153px, 105px) scale(.9) rotate(70deg); } }
        @keyframes splash-pulse { 0%, 100% { opacity: .25; transform: scale(.75); } 45%, 70% { opacity: 1; transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) {
          .cart-confirm-backdrop, .cart-confirm-modal, .spill-card, .spill-product, .spill-stream, .spill-drop, .spill-splash { animation: none; }
          .fruitade-product { transition: none; }
          .spill-stream, .spill-drop { opacity: .7; }
          .spill-splash { opacity: .65; }
        }

        .deals-section {
          background: var(--green);
          color: #fff;
          margin-top: 60px;
        }
        .deals-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 70px 28px;
          text-align: center;
        }
        .deals-eyebrow { color: var(--orange); font-weight: 700; letter-spacing: 0.1em; font-size: 13px; text-transform: uppercase; }
        .deals-inner h2 { font-size: 34px; margin: 12px 0 8px; }
        .deals-inner p { color: #d4d4d4; margin: 0 0 20px; }
        .deals-points { display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; margin-bottom: 26px; }
        .deals-points span { color: #a7d7f0; font-size: 14px; }
        .shop-btn {
          padding: 13px 32px;
          border: 0;
          border-radius: 26px;
          background: var(--orange);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }
        .shop-btn:hover { background: #fff; color: var(--green); }

        .newsletter { background: var(--orange); color: #fff; }
        .newsletter-inner {
          max-width: 720px;
          margin: 0 auto;
          padding: 60px 28px;
          text-align: center;
        }
        .newsletter-inner h2 { margin: 0 0 8px; font-size: 28px; }
        .newsletter-inner p { margin: 0 0 22px; opacity: 0.95; }
        .newsletter-form { display: flex; gap: 10px; justify-content: center; }
        .newsletter-form input {
          flex: 1;
          max-width: 380px;
          padding: 13px 18px;
          border: 0;
          border-radius: 26px;
          font-size: 15px;
          outline: 0;
        }
        .newsletter-form button {
          padding: 13px 26px;
          border: 0;
          border-radius: 26px;
          background: var(--green);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        .shop-footer {
          max-width: 1280px;
          margin: 0 auto;
          padding: 60px 28px 30px;
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.4fr;
          gap: 40px;
          color: #333;
        }
        .footer-col h3 { margin: 0 0 14px; font-size: 16px; color: var(--green); }
        .footer-col p { margin: 0 0 8px; font-size: 14px; line-height: 1.6; color: #555; }
        .footer-col a {
          display: block;
          color: #555;
          text-decoration: none;
          font-size: 14px;
          margin-bottom: 9px;
        }
        .footer-col a:hover { color: var(--orange); }
        .shop-payment-methods { display: flex; align-items: center; flex-wrap: wrap; gap: 10px 14px; margin-top: 20px; padding: 12px; background: #f7f7f7; color: #173b69; }
        .shop-payment-methods > span { font-size: 11px; font-weight: 800; white-space: nowrap; }
        .shop-payment-methods .ecocash { color: #279269; }
        .shop-payment-methods .ecocash span, .shop-payment-methods .onemoney i { color: var(--orange); font-style: normal; }
        .shop-payment-methods .paypal, .shop-payment-methods .visa { font-size: 15px; }
        .shop-payment-methods .mastercard { position: relative; width: 28px; height: 17px; }
        .shop-payment-methods .mastercard i, .shop-payment-methods .mastercard b { position: absolute; top: 0; width: 16px; height: 16px; border-radius: 50%; }
        .shop-payment-methods .mastercard i { left: 1px; background: #eb001b; }
        .shop-payment-methods .mastercard b { left: 10px; background: #f79e1b; opacity: .9; }
        .footer-bottom {
          text-align: center;
          padding: 18px;
          border-top: 1px solid #eee;
          color: #888;
          font-size: 13px;
        }

        @media (max-width: 1024px) {
          .hero-section { grid-template-columns: repeat(2, 1fr); }
          .product-grid { grid-template-columns: repeat(2, 1fr); }
          .shop-footer { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .main-header { flex-wrap: wrap; }
          .header-actions { display: flex; order: 2; margin-left: 0; }
          .header-icon { width: 40px; height: 40px; }
          .menu-button { display: block; margin-left: auto; }
          .navigation { display: none; flex-direction: column; align-items: stretch; gap: 6px; }
          .navigation.open { display: flex; }
          .nav-sep { display: none; }
          .hero-section, .product-grid { grid-template-columns: 1fr; }
          .search-box { order: 3; flex-basis: 100%; }
          .catalogue-panel { position: fixed; top: 126px; right: 16px; bottom: 16px; left: 16px; grid-template-columns: 1fr; overflow-y: auto; }
          .catalogue-panel-image img { height: 190px; }
          .catalogue-panel-links { grid-template-columns: 1fr; gap: 16px; padding: 24px 12px; }
          .newsletter-form { flex-direction: column; align-items: stretch; }
          .shop-footer { grid-template-columns: 1fr; }
          .cart-confirm-modal { grid-template-columns: 1fr; max-height: calc(100vh - 32px); overflow-y: auto; }
          .spill-stage { min-height: 245px; }
          .cart-confirm-copy { padding: 30px 24px 26px; }
          .cart-confirm-actions { margin-top: 24px; }
          .cancel-btn, .confirm-btn { flex: 1; padding-inline: 12px; }
        }
      `}</style>
    </>
  );
}
