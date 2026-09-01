"use client";

import { useEffect, useState } from "react";
import { api, Product } from "../../../lib/api";
import styles from "./inventory.module.css";

const ADMIN_PASSKEY = "schweppesadmin";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orderedUnits, setOrderedUnits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accessAllowed, setAccessAllowed] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [passError, setPassError] = useState("");

  const loadInventory = async () => {
    try {
      setLoading(true);
      const [inventoryData, statsData] = await Promise.all([
        api.products.getAll(),
        api.dashboard.getStats(),
      ]);
      setProducts(inventoryData);
      setOrderedUnits(statsData.orderedUnits || 0);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load inventory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem("mazoe-admin") === "true" || localStorage.getItem("mazoe-role") === "admin";
    if (!isAdmin) {
      setAccessAllowed(false);
      setLoading(false);
      return;
    }

    setAccessAllowed(true);
    void loadInventory();
  }, []);

  const unlockInventory = () => {
    const trimmed = passkey.trim();
    if (trimmed.toLowerCase() !== ADMIN_PASSKEY) {
      setPassError("Incorrect passkey. Try the admin key to unlock inventory.");
      return;
    }

    localStorage.setItem("mazoe-admin", "true");
    localStorage.setItem("mazoe-role", "admin");
    setPassError("");
    setAccessAllowed(true);
    void loadInventory();
  };

  if (!accessAllowed) {
    return (
      <section className={styles.locked}>
        <span className="eyebrow">Restricted area</span>
        <h1>Admin access required.</h1>
        <p>Enter the admin passkey to view available stock and stock ordered.</p>
        <div style={{ maxWidth: 360, marginTop: 24 }}>
          <input
            type="password"
            value={passkey}
            onChange={(event) => setPasskey(event.target.value)}
            placeholder="Admin passkey"
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #d9d9d9" }}
          />
          <button
            type="button"
            onClick={unlockInventory}
            style={{ marginTop: 12, width: "100%", padding: "12px 16px", border: 0, borderRadius: 10, background: "#ef7622", color: "#fff", fontWeight: 700, cursor: "pointer" }}
          >
            Unlock inventory
          </button>
          {passError && <p style={{ marginTop: 12, color: "#b4493d", fontWeight: 600 }}>{passError}</p>}
        </div>
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
          <span>Available units</span>
          <strong>{totalUnits}</strong>
        </div>
        <div className={styles.metric}>
          <span>Ordered units</span>
          <strong>{orderedUnits}</strong>
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
