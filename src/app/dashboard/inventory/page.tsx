"use client";

import { useEffect, useState } from "react";
import { api, Product } from "../../../lib/api";
import styles from "./inventory.module.css";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accessAllowed, setAccessAllowed] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem("mazoe-admin") === "true" || localStorage.getItem("mazoe-role") === "admin";
    if (!isAdmin) {
      setAccessAllowed(false);
      setLoading(false);
      return;
    }

    setAccessAllowed(true);
    const load = async () => {
      try {
        const data = await api.products.getAll();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load inventory.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  if (!accessAllowed) {
    return (
      <section className={styles.locked}>
        <span className="eyebrow">Restricted area</span>
        <h1>Admin access required.</h1>
        <p>This stock inventory page is only available to the store administrator.</p>
      </section>
    );
  }

  if (loading) return <section className={styles.page}><p>Loading inventory...</p></section>;

  if (error) return <section className={styles.page}><p className={styles.error}>{error}</p></section>;

  const totalUnits = products.reduce((sum, product) => sum + (product.stock || 0), 0);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className="eyebrow">Inventory</span>
          <h1>Shop stock</h1>
        </div>
        <div className={styles.summary}>
          <strong>{products.length}</strong>
          <span>Products</span>
        </div>
      </header>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span>Total units</span>
          <strong>{totalUnits}</strong>
        </div>
        <div className={styles.metric}>
          <span>Low stock</span>
          <strong>{products.filter((product) => product.stock <= 10).length}</strong>
        </div>
        <div className={styles.metric}>
          <span>Out of stock</span>
          <strong>{products.filter((product) => !product.inStock || product.stock <= 0).length}</strong>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Units</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${Number(product.price || 0).toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`${styles.badge} ${product.stock <= 0 || !product.inStock ? styles.badgeOut : product.stock <= 10 ? styles.badgeLow : styles.badgeGood}`}>
                    {product.stock <= 0 || !product.inStock ? "Out" : product.stock <= 10 ? "Low" : "Healthy"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
