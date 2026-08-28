import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./dashboard.module.css";

const navigation = [
  ["Dashboard", "/dashboard"],
  ["Products", "/dashboard/products"],
  ["Orders", "/dashboard/orders"],
  ["Customers", "/dashboard/customers"],
  ["Inventory", "/dashboard/inventory"],
  ["Analytics", "/dashboard/analytics"],
  ["Settings", "/dashboard/settings"],
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <Link className={styles.logo} href="/dashboard">MAZ<span>OE</span></Link>
        <p className={styles.label}>Workspace</p>
        <nav className={styles.nav} aria-label="Dashboard navigation">
          {navigation.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <div className={styles.profile}><span className={styles.avatar}>AM</span><div><strong>Admin</strong><small>Store manager</small></div></div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}