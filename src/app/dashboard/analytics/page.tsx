"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, DashboardStats } from "../../../lib/api";
import styles from "./analytics.module.css";

const emptyStats: DashboardStats = {
  products: 0,
  orders: 0,
  customers: 0,
  revenue: 0,
  recentOrders: [],
  topProducts: [],
  lowStock: [],
  salesTrend: [],
  inventory: { units: 0, products: 0, low: 0 },
  orderedUnits: 0,
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadStats = () =>
      api.dashboard
        .getStats()
        .then((data) => {
          if (active) setStats(data);
        })
        .catch((err: unknown) => {
          if (active)
            setError(
              err instanceof Error ? err.message : "Could not load analytics."
            );
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    loadStats();
    const refresh = window.setInterval(loadStats, 60000);
    return () => {
      active = false;
      window.clearInterval(refresh);
    };
  }, []);

  const trend = stats.salesTrend.length
    ? stats.salesTrend
    : Array.from({ length: 7 }, (_, index) => ({
        _id: String(index),
        revenue: 0,
        orders: 0,
      }));

  const totalRevenue = trend.reduce((sum, day) => sum + day.revenue, 0);
  const avgDailyRevenue = trend.length > 0 ? totalRevenue / trend.length : 0;
  const totalOrders = trend.reduce((sum, day) => sum + day.orders, 0);
  const avgOrderValue =
    totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const conversionRate =
    stats.customers > 0
      ? ((stats.orders / stats.customers) * 100).toFixed(2)
      : "0.00";

  const peak = Math.max(...trend.map((day) => day.revenue), 1);
  const peakDay = trend.find((day) => day.revenue === peak);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className="eyebrow">ANALYTICS / INSIGHTS</span>
          <h1>Shop Performance</h1>
          <p>Detailed analysis of your store's sales, customer behavior, and product performance.</p>
        </div>
        <Link href="/dashboard" className={styles.back}>
          ← Dashboard
        </Link>
      </header>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Total Revenue (7 days)</div>
          <div className={styles.metricValue}>
            {loading ? "..." : `$${totalRevenue.toFixed(2)}`}
          </div>
          <div className={styles.metricInfo}>
            Avg: ${avgDailyRevenue.toFixed(2)}/day
          </div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Total Orders (7 days)</div>
          <div className={styles.metricValue}>
            {loading ? "..." : totalOrders}
          </div>
          <div className={styles.metricInfo}>
            Avg: ${avgOrderValue.toFixed(2)}/order
          </div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Conversion Rate</div>
          <div className={styles.metricValue}>
            {loading ? "..." : `${conversionRate}%`}
          </div>
          <div className={styles.metricInfo}>
            {stats.orders} orders from {stats.customers} customers
          </div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Peak Sales Day</div>
          <div className={styles.metricValue}>
            {loading
              ? "..."
              : peakDay
              ? new Date(`${peakDay._id}T12:00:00`).toLocaleDateString("en", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })
              : "-"}
          </div>
          <div className={styles.metricInfo}>
            ${peak.toFixed(2)} in revenue
          </div>
        </div>
      </div>

      <div className={styles.chartsContainer}>
        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <span className="eyebrow">Sales Analysis</span>
              <h2>7-Day Revenue Trend</h2>
            </div>
          </div>
          <div className={styles.detailedChart}>
            {trend.map((day, idx) => (
              <div className={styles.dayColumn} key={day._id}>
                <div className={styles.dayContent}>
                  <div
                    className={styles.barLarge}
                    style={{
                      height: `${Math.max((day.revenue / peak) * 100, day.revenue ? 10 : 3)}%`,
                    }}
                    title={`$${day.revenue.toFixed(2)}`}
                  />
                  <small className={styles.dayLabel}>
                    {stats.salesTrend.length
                      ? new Date(`${day._id}T12:00:00`).toLocaleDateString("en", {
                          weekday: "short",
                        })
                      : "-"}
                  </small>
                </div>
                <div className={styles.dayStats}>
                  <div className={styles.revenue}>${Math.round(day.revenue)}</div>
                  <div className={styles.orders}>{day.orders} orders</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <span className="eyebrow">Product Performance</span>
              <h2>Top Sellers</h2>
            </div>
            <Link href="/dashboard/products">View All</Link>
          </div>
          <div className={styles.productsList}>
            {stats.topProducts.length ? (
              stats.topProducts.map((product, idx) => (
                <div className={styles.productRow} key={product._id}>
                  <div className={styles.productRank}>#{idx + 1}</div>
                  <div className={styles.productInfo}>
                    <strong>{product._id}</strong>
                    <small>{product.units} units sold</small>
                  </div>
                  <div className={styles.productRevenue}>
                    ${Number(product.revenue || 0).toFixed(2)}
                  </div>
                  <div
                    className={styles.productBar}
                    style={{
                      width: `${(product.units / Math.max(...stats.topProducts.map(p => p.units), 1)) * 100}%`,
                    }}
                  />
                </div>
              ))
            ) : (
              <p className={styles.empty}>No sales data available yet.</p>
            )}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <span className="eyebrow">Inventory Status</span>
              <h2>Low Stock Alert</h2>
            </div>
            <Link href="/dashboard/inventory">Manage</Link>
          </div>
          <div className={styles.inventoryList}>
            <div className={styles.inventorySummary}>
              <div className={styles.inventoryStat}>
                <span>{stats.inventory.units}</span>
                <small>Total units</small>
              </div>
              <div className={styles.inventoryStat}>
                <span>{stats.inventory.products}</span>
                <small>Products</small>
              </div>
              <div className={styles.inventoryStat}>
                <span className={styles.alert}>{stats.inventory.low}</span>
                <small>Low stock</small>
              </div>
            </div>
            {stats.lowStock.length ? (
              <div className={styles.lowStockItems}>
                {stats.lowStock.slice(0, 5).map((product) => (
                  <div className={styles.lowStockRow} key={product._id}>
                    <div>
                      <strong>{product.name}</strong>
                      <small>{product.stock} units remaining</small>
                    </div>
                    <div
                      className={styles.stockIndicator}
                      style={{
                        backgroundColor:
                          product.stock <= 5 ? "#e53e3e" : "#ed8936",
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.empty}>All products well stocked!</p>
            )}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <span className="eyebrow">Customer Insights</span>
              <h2>Key Metrics</h2>
            </div>
          </div>
          <div className={styles.insightsList}>
            <div className={styles.insightItem}>
              <div className={styles.insightLabel}>Active Customers</div>
              <div className={styles.insightValue}>
                {loading ? "..." : stats.customers}
              </div>
            </div>
            <div className={styles.insightItem}>
              <div className={styles.insightLabel}>Total Orders</div>
              <div className={styles.insightValue}>
                {loading ? "..." : stats.orders}
              </div>
            </div>
            <div className={styles.insightItem}>
              <div className={styles.insightLabel}>Items Ordered</div>
              <div className={styles.insightValue}>
                {loading ? "..." : stats.orderedUnits}
              </div>
            </div>
            <div className={styles.insightItem}>
              <div className={styles.insightLabel}>All-Time Revenue</div>
              <div className={styles.insightValue}>
                {loading ? "..." : `$${stats.revenue.toFixed(2)}`}
              </div>
            </div>
            <div className={styles.insightItem}>
              <div className={styles.insightLabel}>Avg Order Value</div>
              <div className={styles.insightValue}>
                {loading ? "..." : `$${avgOrderValue.toFixed(2)}`}
              </div>
            </div>
            <div className={styles.insightItem}>
              <div className={styles.insightLabel}>Product Catalog</div>
              <div className={styles.insightValue}>
                {loading ? "..." : stats.products}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className={styles.panel}>
        <div className={styles.panelHead}>
          <div>
            <span className="eyebrow">Activity</span>
            <h2>Recent Orders</h2>
          </div>
          <Link href="/dashboard/orders">View All</Link>
        </div>
        <div className={styles.ordersList}>
          {stats.recentOrders.length ? (
            stats.recentOrders.slice(0, 8).map((order) => (
              <div className={styles.orderRow} key={order._id}>
                <div className={styles.orderId}>
                  <strong>#{order._id.slice(-7).toUpperCase()}</strong>
                  <small>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <div className={styles.orderDetails}>
                  <span>{order.items?.length || 0} item(s)</span>
                  <span>${Number(order.totalAmount || 0).toFixed(2)}</span>
                </div>
                <div
                  className={`${styles.orderStatus} ${styles[order.status || "pending"]}`}
                >
                  {order.status || "pending"}
                </div>
              </div>
            ))
          ) : (
            <p className={styles.empty}>No orders yet.</p>
          )}
        </div>
      </section>
    </section>
  );
}
