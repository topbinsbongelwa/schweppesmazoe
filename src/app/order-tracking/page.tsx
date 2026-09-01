"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "../../public/landing-shop-logo-.png";

const milestones = [
  { label: "Order confirmed", detail: "We have your order", time: "08:42" },
  { label: "Being prepared", detail: "Your drinks are being packed", time: "09:10" },
  { label: "On the way", detail: "Your driver is heading to you", time: "Now" },
  { label: "Delivered", detail: "Enjoy every pour", time: "Soon" },
];

export default function OrderTracking() {
  const [orderNumber, setOrderNumber] = useState("MZ-2048");
  const [searchedOrder, setSearchedOrder] = useState("MZ-2048");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [driverProgress, setDriverProgress] = useState(62);

  useEffect(() => {
    const saved = window.localStorage.getItem("mazoe-last-order");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { orderRef?: string };
        if (parsed.orderRef) {
          setOrderNumber(parsed.orderRef);
          setSearchedOrder(parsed.orderRef);
        }
      } catch {
        // ignore malformed saved order data
      }
    }

    const timer = window.setInterval(() => { setLastUpdated(new Date()); setDriverProgress((value) => value >= 90 ? 62 : value + 1); }, 3000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="tracking-page">
      <nav className="tracking-nav"><Link href="/" className="tracking-brand" aria-label="Schweppes Zimbabwe home"><Image src={logo} alt="Schweppes Zimbabwe Limited" width={180} height={100} priority /></Link><Link href="/shop" className="tracking-back">Back to shop <span aria-hidden="true">&#8599;</span></Link></nav>
      <section className="tracking-hero site-width">
        <div className="tracking-heading"><span className="eyebrow">Live delivery desk</span><h1>Your order is on the move.</h1><p>Follow your Mazoe delivery from our shelves to your doorstep.</p></div>
        <form className="tracking-search" onSubmit={(event) => { event.preventDefault(); setSearchedOrder(orderNumber || "MZ-2048"); }}><label htmlFor="order-number">Order number</label><div><input id="order-number" value={orderNumber} onChange={(event) => setOrderNumber(event.target.value.toUpperCase())} placeholder="e.g. MZ-2048" /><button type="submit">Track order <span aria-hidden="true">&#8594;</span></button></div></form>
      </section>
      <section className="tracking-board site-width">
        <div className="tracking-board-head"><div><span className="eyebrow">Order {searchedOrder}</span><h2>Arriving today</h2></div><span className="live-pill"><i /> Live update</span></div>
        <div className="live-map"><iframe title="Harare delivery area map" src="https://www.openstreetmap.org/export/embed.html?bbox=31.00%2C-17.90%2C31.15%2C-17.75&layer=mapnik" /><div className="map-route"><span className="map-origin">Warehouse</span><i style={{ left: `${driverProgress}%` }} /><span className="map-destination">Your door</span></div><div className="map-driver" style={{ left: `${driverProgress}%` }}><span className="map-pulse" /><b>Driver</b></div><div className="map-status"><span className="live-dot" /> Driver moving <small>Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small></div><span className="map-place">Harare, Zimbabwe</span></div>
        <div className="milestones">{milestones.map((milestone, index) => <div className={`milestone ${index < 3 ? "complete" : ""}`} key={milestone.label}><span className="milestone-dot">{index < 3 ? "✓" : ""}</span><div><strong>{milestone.label}</strong><p>{milestone.detail}</p></div><time>{milestone.time}</time></div>)}</div>
      </section>
    </main>
  );
}