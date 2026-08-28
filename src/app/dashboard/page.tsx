"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, DashboardStats } from "../../lib/api";
import styles from "./dashboard-overview.module.css";

const emptyStats: DashboardStats = { products: 0, orders: 0, customers: 0, revenue: 0, recentOrders: [], topProducts: [], lowStock: [] };

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.dashboard.getStats().then((data) => { if (active) setStats(data); }).catch((err: unknown) => { if (active) setError(err instanceof Error ? err.message : "Could not load dashboard."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return <section className={styles.page}><header className={styles.header}><div><span className="eyebrow">MAZOE admin</span><h1>Good morning.</h1><p>Here is how your store is moving today.</p></div><Link href="/dashboard/products" className={styles.primary}>Manage catalogue <span aria-hidden="true">-&gt;</span></Link></header>
    {error && <p className={styles.error} role="alert">{error}</p>}
    <div className={styles.stats}>{[["Products", stats.products, "/dashboard/products"], ["Orders", stats.orders, "/dashboard/orders"], ["Customers", stats.customers, "/dashboard/customers"], ["Revenue", `$${stats.revenue.toFixed(2)}`, "/dashboard/analytics"]].map(([label, value, href]) => <Link href={String(href)} className={styles.stat} key={String(label)}><span>{label}</span><strong>{loading ? "..." : value}</strong><small>View details -&gt;</small></Link>)}</div>
    <div className={styles.columns}><section className={styles.panel}><div className={styles.panelHead}><div><span className="eyebrow">Activity</span><h2>Recent orders</h2></div><Link href="/dashboard/orders">View all</Link></div>{stats.recentOrders.length ? stats.recentOrders.map((order) => <div className={styles.row} key={order._id}><div><strong>#{order._id.slice(-7).toUpperCase()}</strong><small>{order.items?.length || 0} item(s)</small></div><b>${Number(order.totalAmount || 0).toFixed(2)}</b><span className={styles.badge}>{order.status || "pending"}</span></div>) : <p className={styles.empty}>{loading ? "Loading activity..." : "No orders yet."}</p>}</section>
  <section className={styles.panel}><div className={styles.panelHead}><div><span className="eyebrow">Attention</span><h2>Low stock</h2></div><Link href="/dashboard/inventory">Inventory</Link></div>{stats.lowStock.length ? stats.lowStock.map((product) => <div className={styles.row} key={product._id}><div><strong>{product.name}</strong><small>{product.category}</small></div><span className={styles.low}>Low stock</span></div>) : <p className={styles.empty}>{loading ? "Checking inventory..." : "No low-stock products."}</p>}</section></div>
  </section>;
}
