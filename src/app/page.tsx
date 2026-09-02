"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "../public/landing-shop-logo-.png";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Products from "../components/Products";
import type { Product } from "../lib/api";
import { addCartItem, cartCount as getCartCount, readCart } from "../lib/cart";

function Icon({ name }: { name: "account" | "cart" | "menu" }) {
  const paths = {
    account: <><circle cx="12" cy="8" r="3.25" /><path d="M5.5 20c.5-3.2 2.7-5 6.5-5s6 1.8 6.5 5" /></>,
    cart: <><circle cx="9" cy="20" r="1.25" /><circle cx="18" cy="20" r="1.25" /><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 1.9-1.4L21 8H6" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  };

  return <svg aria-hidden="true" className="shop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    const syncCart = () => setCartCount(getCartCount(readCart()));
    syncCart();
    window.addEventListener("mazoe-cart-updated", syncCart);
    return () => window.removeEventListener("mazoe-cart-updated", syncCart);
  }, []);
  const addToCart = (product: Product) => { addCartItem({ name: product.name, price: product.price, image: product.image }, product.stock); };
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="shop-top-bar"><div className="shop-top-bar-inner"><span>Call Us: +2638688002173</span><span>|</span><span>Whatsapp Us: +263773079763</span><div className="shop-top-links"><Link href="/cart">Wishlist</Link><span>|</span><Link href="/checkout">Checkout</Link></div></div></div>
      <header className="shop-main-header">
        <Link href="/" className="shop-brand" aria-label="Schweppes Zimbabwe home"><Image src={logo} alt="Schweppes Zimbabwe Limited" width={180} height={100} priority /></Link>
        <div className="shop-search"><input type="search" placeholder="Search for products..." aria-label="Search for products" /></div>
        <div className="shop-header-actions"><Link href="/shop" aria-label="Account"><Icon name="account" /></Link><Link href="/checkout" aria-label={`Cart, ${cartCount} items`}><Icon name="cart" /><b>{cartCount}</b></Link></div>
        <button className="shop-menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Toggle navigation"><Icon name="menu" /></button>
      </header>
      <nav className={`shop-navigation ${menuOpen ? "open" : ""}`}>
        <div className="catalogue-menu">
          <button type="button" className="catalogue-link" aria-expanded={catalogueOpen} onClick={() => setCatalogueOpen((open) => !open)}><Icon name="menu" /> View Full Catalogue</button>
          {catalogueOpen && <div className="catalogue-dropdown">
            <Link href="/catalogue" onClick={() => { setCatalogueOpen(false); closeMenu(); }}>All products</Link>
            <Link href="/shop/mazoe_" onClick={() => { setCatalogueOpen(false); closeMenu(); }}>Mazoe</Link>
            <Link href="/shop/minute_maid" onClick={() => { setCatalogueOpen(false); closeMenu(); }}>Minute Maid</Link>
            <Link href="/shop/still_water" onClick={() => { setCatalogueOpen(false); closeMenu(); }}>Still Water</Link>
            <Link href="/shop/fruitade_" onClick={() => { setCatalogueOpen(false); closeMenu(); }}>Fruitade</Link>
          </div>}
        </div>
        <Link href="#products" onClick={closeMenu}>MAZOE</Link><span>|</span><Link href="/shop/minute_maid" onClick={closeMenu}>MINUTE MAID</Link><span>|</span><Link href="/shop/still_water" onClick={closeMenu}>STILL WATER</Link><span>|</span><Link href="/shop/fruitade_" onClick={closeMenu}>FRUITADE</Link><span>|</span><Link href="/order-tracking" onClick={closeMenu}>Track Your Order</Link>
      </nav>
      <main><Hero /><Products onAddToCart={addToCart} /><section className="story-section" id="story"><div className="site-width story-grid"><div><span className="eyebrow">The Mazoe way</span><h2>Goodness in every pour.</h2></div><p>From family tables to sunny afternoons, Mazoe brings a little more joy to the everyday. Made with real fruit flavour and a taste Zimbabwe has grown up loving.</p></div></section><section className="delivery-section" id="delivery"><div className="site-width delivery-grid"><div><span className="eyebrow">Click. Shop. Sip.</span><h2>Your favourites, delivered.</h2></div><div className="delivery-note"><p>We deliver all over Zimbabwe and accept cash on delivery.</p><Link href="/shop">Explore the full range <span aria-hidden="true">&#8599;</span></Link></div></div></section></main>
      <Footer />
    </>
  );
}
