"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { api, Order, User } from "../../lib/api";
import { cartCount, readCart } from "../../lib/cart";
import styles from "./account.module.css";

const TOKEN_KEY = "mazoe-token";
const USER_KEY = "mazoe-user";

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState(0);

  const loadAccount = async (token: string) => { try { const profile = await api.auth.profile(token); setUser(profile); localStorage.setItem(USER_KEY, JSON.stringify(profile)); setOrders(await api.orders.getAll(token)); } catch { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); setUser(null); setError("Your session has expired. Please sign in again."); } };
  useEffect(() => { const token = localStorage.getItem(TOKEN_KEY); const saved = localStorage.getItem(USER_KEY); Promise.resolve().then(() => { setCartItems(cartCount(readCart())); if (saved) setUser(JSON.parse(saved) as User); if (token) void loadAccount(token); }); }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setLoading(true); setError(""); const data = new FormData(event.currentTarget); try { const response = mode === "login" ? await api.auth.login({ email: String(data.get("email")), password: String(data.get("password")) }) : await api.auth.register({ name: String(data.get("name")), email: String(data.get("email")), password: String(data.get("password")) }); localStorage.setItem(TOKEN_KEY, response.token); await loadAccount(response.token); } catch (err) { setError(err instanceof Error ? err.message : "Could not sign in."); } finally { setLoading(false); } };
  const logout = () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); setUser(null); setOrders([]); };

  return <main className={styles.page}><header className={styles.header}><Link href="/shop" className={styles.back}>&lt;- Back to shop</Link><span className="eyebrow">Your MAZOE account</span><Link href="/checkout" className={styles.cart}>Basket ({cartItems})</Link></header>{user ? <section className={styles.content}><div className={styles.intro}><div><span className="eyebrow">Welcome back</span><h1>{user.name}.</h1><p>{user.email}</p></div><button type="button" onClick={logout}>Sign out</button></div><div className={styles.cards}><div className={styles.card}><span>Orders placed</span><strong>{orders.length}</strong></div><div className={styles.card}><span>Basket items</span><strong>{cartItems}</strong></div><Link href="/shop" className={styles.shopCard}><span>Need a refill?</span><strong>Shop the range -&gt;</strong></Link></div><section className={styles.orders}><div className={styles.sectionHead}><div><span className="eyebrow">Your history</span><h2>Recent orders</h2></div><Link href="/order-tracking">Track an order</Link></div>{orders.length ? orders.map((order) => <article className={styles.order} key={order._id}><div><strong>Order #{order._id.slice(-7).toUpperCase()}</strong><small>{new Date(order.createdAt).toLocaleDateString()} - {order.items?.length || 0} item(s)</small></div><b>${Number(order.totalAmount || 0).toFixed(2)}</b><span>{order.status || "pending"}</span></article>) : <p className={styles.muted}>Your order history will appear here after checkout.</p>}</section></section> : <section className={styles.auth}><span className="eyebrow">Customer dashboard</span><h1>{mode === "login" ? "Welcome back." : "Create your account."}</h1><p>Keep your orders, delivery details and next pour in one place.</p><form onSubmit={submit}>{mode === "register" && <label>Name<input name="name" required autoComplete="name" /></label>}<label>Email<input name="email" type="email" required autoComplete="email" /></label><label>Password<input name="password" type="password" required minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>{error && <p className={styles.error} role="alert">{error}</p>}<button disabled={loading} type="submit">{loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}</button></form><button className={styles.switch} type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>{mode === "login" ? "New to MAZOE? Create an account" : "Already have an account? Sign in"}</button></section>}</main>;
}
