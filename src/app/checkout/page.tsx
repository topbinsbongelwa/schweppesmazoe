"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, startTransition, useEffect, useState } from "react";
import { api } from "../../lib/api";
import { CartItem, readCart, writeCart } from "../../lib/cart";
import logo from "../../public/landing-shop-logo-.png";
import "./checkout.module.css";

const payments = [
  { value: "cash on delivery", label: "Cash on delivery", detail: "Pay your driver when your order arrives." },
  { value: "ecocash", label: "EcoCash", detail: "We will share payment instructions after confirmation." },
  { value: "oneMoney", label: "OneMoney", detail: "A simple mobile money checkout." },
  { value: "card", label: "Card or PayPal", detail: "Pay securely online." },
];

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash on delivery");
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState("4242");
  const [newCardNumber, setNewCardNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    startTransition(() => setItems(readCart()));
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const updateQuantity = (name: string, change: number) => {
    const next = items.map((item) => item.name === name ? { ...item, quantity: item.quantity + change } : item).filter((item) => item.quantity > 0);
    setItems(next);
    writeCart(next);
  };

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const shippingAddress = `${form.get("name")}, ${form.get("phone")}, ${form.get("address")}`;
    try {
      await api.orders.create("", {
        items: items.map((item) => ({ product: item.name, quantity: item.quantity, price: item.price })),
        shippingAddress,
        paymentMethod,
        ...(paymentMethod === "card" ? { cardLast4: selectedCard } : {}),
        totalAmount: Number(total.toFixed(2)),
      });
      writeCart([]);
      setSubmitted(true);
    } catch {
      setError("We could not send that order right now. Please try again or call us on +263 868 800 2173.");
    }
  }

  if (submitted) return <main className="checkout-page"><div className="checkout-success"><span className="checkout-kicker">Order received</span><h1>Your drinks are on their way.</h1><p>We have your request and will contact you to confirm delivery and payment.</p><Link href="/order-tracking" className="checkout-submit">Track your order <span>→</span></Link></div></main>;

  const choosePayment = (value: string) => {
    if (value === "card") {
      setCardDialogOpen(true);
      return;
    }
    setPaymentMethod(value);
  };

  const confirmCard = () => {
    const digits = newCardNumber.replace(/\D/g, "");
    if (newCardNumber && digits.length < 12) return;
    setSelectedCard(newCardNumber ? digits.slice(-4) : selectedCard);
    setPaymentMethod("card");
    setNewCardNumber("");
    setCardDialogOpen(false);
  };

  return (
    <main className="checkout-page">
      <header className="checkout-header"><Link href="/shop" className="checkout-back">← Back to shop</Link><Link href="/" className="checkout-logo" aria-label="Schweppes Zimbabwe home"><Image src={logo} alt="Schweppes Zimbabwe Limited" width={145} height={84} priority /></Link><span className="checkout-step">Your tasting counter / 02</span></header>
      <div className="checkout-layout">
        <section className="checkout-form-wrap">
          <span className="checkout-kicker">Your tasting counter</span><h1>Tell us where to send the good stuff.</h1><p className="checkout-intro">A few quick questions, just like a shop assistant would ask at the counter.</p>
          <form onSubmit={placeOrder}>
            <fieldset><legend>01 / Who are we serving?</legend><div className="checkout-fields"><label>Full name<input name="name" required placeholder="Your name" /></label><label>Phone number<input name="phone" type="tel" required placeholder="+263 ..." /></label></div></fieldset>
            <fieldset><legend>02 / Where should we deliver?</legend><label>Delivery address<textarea name="address" required placeholder="House number, street, suburb, city" rows={3} /></label><label className="select-label">Best time to arrive<select name="time"><option>Morning, 8am - 12pm</option><option>Afternoon, 12pm - 4pm</option><option>Evening, 4pm - 7pm</option></select></label></fieldset>
            <fieldset><legend>03 / How would you like to pay?</legend><div className="payment-choices">{payments.map((payment) => <label className={`payment-choice ${paymentMethod === payment.value ? "selected" : ""}`} key={payment.value}><input type="radio" name="payment" value={payment.value} checked={paymentMethod === payment.value} onChange={(event) => choosePayment(event.target.value)} /><span><strong>{payment.label}</strong><small>{payment.detail}</small></span></label>)}</div>{paymentMethod === "card" && <button className="change-card" type="button" onClick={() => setCardDialogOpen(true)}>Card ending in {selectedCard} <span>Change</span></button>}</fieldset>
            {error && <p className="checkout-error" role="alert">{error}</p>}
            <button className="checkout-submit" type="submit" disabled={!items.length}>Place my order <span>→</span></button>
          </form>
        </section>
        <aside className="order-summary"><span className="checkout-kicker">What you picked</span><h2>{items.length ? "Your basket" : "Your basket is empty"}</h2>{items.length ? <>{items.map((item) => <div className="summary-item" key={item.name}><Image src={item.image} alt="" width={72} height={72} /><div><strong>{item.name}</strong><small>${item.price.toFixed(2)} each</small><div className="quantity"><button type="button" onClick={() => updateQuantity(item.name, -1)} aria-label={`Remove one ${item.name}`}>−</button><span>{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.name, 1)} aria-label={`Add one ${item.name}`}>+</button></div></div></div>)}<div className="summary-total"><span>Estimated total</span><strong>${total.toFixed(2)}</strong></div></> : <Link href="/shop" className="summary-shop-link">Choose a drink <span>→</span></Link>}</aside>
      </div>
      {cardDialogOpen && <div className="card-dialog-backdrop" role="presentation" onClick={() => setCardDialogOpen(false)}><div className="card-dialog" role="dialog" aria-modal="true" aria-labelledby="card-dialog-title" onClick={(event) => event.stopPropagation()}><button className="card-dialog-close" type="button" onClick={() => setCardDialogOpen(false)} aria-label="Close card options">×</button><span className="checkout-kicker">Secure checkout</span><h2 id="card-dialog-title">Choose a card</h2><p className="card-dialog-intro">Select a saved card or add a new one. Your full card number is never stored with the order.</p><div className="saved-cards"><label className={`saved-card ${!newCardNumber && selectedCard === "4242" ? "selected" : ""}`}><input type="radio" name="saved-card" checked={!newCardNumber && selectedCard === "4242"} onChange={() => { setSelectedCard("4242"); setNewCardNumber(""); }} /><span><strong>Visa</strong><small>•••• 4242</small></span></label><label className={`saved-card ${!newCardNumber && selectedCard === "1088" ? "selected" : ""}`}><input type="radio" name="saved-card" checked={!newCardNumber && selectedCard === "1088"} onChange={() => { setSelectedCard("1088"); setNewCardNumber(""); }} /><span><strong>Mastercard</strong><small>•••• 1088</small></span></label></div><label className="new-card-field">Use a different card<input inputMode="numeric" autoComplete="cc-number" value={newCardNumber} onChange={(event) => setNewCardNumber(event.target.value)} placeholder="Card number" /></label><button className="card-dialog-confirm" type="button" onClick={confirmCard} disabled={Boolean(newCardNumber) && newCardNumber.replace(/\D/g, "").length < 12}>Use this card <span>→</span></button></div></div>}
    </main>
  );
}