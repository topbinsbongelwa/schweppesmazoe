"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, DashboardStats } from "../../lib/api";
import styles from "./dashboard-overview.module.css";

const emptyStats: DashboardStats = { products: 0, orders: 0, customers: 0, revenue: 0, recentOrders: [], topProducts: [], lowStock: [], salesTrend: [], inventory: { units: 0, products: 0, low: 0 } };

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { let active = true; const loadStats = () => api.dashboard.getStats().then((data) => { if (active) setStats(data); }).catch((err: unknown) => { if (active) setError(err instanceof Error ? err.message : "Could not load dashboard."); }).finally(() => { if (active) setLoading(false); }); loadStats(); const refresh = window.setInterval(loadStats, 60000); return () => { active = false; window.clearInterval(refresh); }; }, []);

  const trend = stats.salesTrend.length ? stats.salesTrend : Array.from({ length: 7 }, (_, index) => ({ _id: String(index), revenue: 0, orders: 0 }));
  const peak = Math.max(...trend.map((day) => day.revenue), 1);
  const maxStock = Math.max(...stats.lowStock.map((product) => product.stock), 10);

  return <section className={styles.page}>
    <header className={styles.header}><div><span className="eyebrow">MAZOE admin / overview</span><h1>Good morning.</h1><p>Your store at a glance, from sales momentum to bottles on hand.</p></div><Link href="/dashboard/products" className={styles.primary}>Manage catalogue <span aria-hidden="true">-&gt;</span></Link></header>
    {error && <p className={styles.error} role="alert">{error}</p>}
    <div className={styles.stats}>{[["Revenue", `$${stats.revenue.toFixed(2)}`, "All time", "/dashboard/analytics"], ["Orders", stats.orders, "All time", "/dashboard/orders"], ["Customers", stats.customers, "Registered", "/dashboard/customers"], ["Units in stock", stats.inventory.units, `${stats.inventory.low} need attention`, "/dashboard/inventory"]].map(([label, value, note, href]) => <Link href={String(href)} className={styles.stat} key={String(label)}><span>{label}</span><strong>{loading ? "..." : value}</strong><small>{note}</small></Link>)}</div>
    <div className={styles.dashboardGrid}>
      <section className={`${styles.panel} ${styles.salesPanel}`}><div className={styles.panelHead}><div><span className="eyebrow">Sales pulse</span><h2>Revenue this week</h2></div><span className={styles.period}>Last 7 days</span></div><div className={styles.chart}>{trend.map((day) => <div className={styles.chartColumn} key={day._id}><span className={styles.chartValue}>${Math.round(day.revenue)}</span><div className={styles.bar} style={{ height: `${Math.max(day.revenue / peak * 100, day.revenue ? 12 : 3)}%` }} /><small>{stats.salesTrend.length ? new Date(`${day._id}T12:00:00`).toLocaleDateString("en", { weekday: "short" }) : "-"}</small></div>)}</div></section>
      <section className={`${styles.panel} ${styles.inventoryPanel}`}><div className={styles.panelHead}><div><span className="eyebrow">Inventory watch</span><h2>Stock levels</h2></div><Link href="/dashboard/inventory">View all</Link></div><div className={styles.inventoryTotal}><strong>{stats.inventory.units}</strong><span>units across {stats.inventory.products} products</span></div>{stats.lowStock.length ? stats.lowStock.slice(0, 4).map((product) => <div className={styles.stockRow} key={product._id}><div><strong>{product.name}</strong><small>{product.stock} units remaining</small></div><div className={styles.stockTrack}><i style={{ width: `${Math.max(product.stock / maxStock * 100, 7)}%` }} /></div></div>) : <p className={styles.empty}>{loading ? "Checking stock..." : "All products are well stocked."}</p>}</section>
    </div>
    <div className={styles.columns}><section className={styles.panel}><div className={styles.panelHead}><div><span className="eyebrow">Activity</span><h2>Recent orders</h2></div><Link href="/dashboard/orders">View all</Link></div>{stats.recentOrders.length ? stats.recentOrders.map((order) => <div className={styles.row} key={order._id}><div><strong>#{order._id.slice(-7).toUpperCase()}</strong><small>{order.items?.length || 0} item(s)</small></div><b>${Number(order.totalAmount || 0).toFixed(2)}</b><span className={styles.badge}>{order.status || "pending"}</span></div>) : <p className={styles.empty}>{loading ? "Loading activity..." : "No orders yet."}</p>}</section><section className={styles.panel}><div className={styles.panelHead}><div><span className="eyebrow">Best sellers</span><h2>Moving fastest</h2></div><Link href="/dashboard/products">Catalogue</Link></div>{stats.topProducts.length ? stats.topProducts.map((product) => <div className={styles.row} key={product._id}><div><strong>{product._id}</strong><small>{product.units} units sold</small></div><b>${Number(product.revenue || 0).toFixed(2)}</b></div>) : <p className={styles.empty}>Sales will appear here after your first order.</p>}</section></div>
  </section>;
}