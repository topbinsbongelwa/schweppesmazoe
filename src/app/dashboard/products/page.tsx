"use client";

import { FormEvent, useEffect, useState } from "react";
import { api, Product, ProductInput } from "../../../lib/api";
import styles from "./products.module.css";

const emptyProduct: ProductInput = { name: "", description: "", price: 0, category: "Mazoe", flavor: "", packSize: "", image: "", bgImage: "", inStock: true, stock: 0, featured: false, badge: "" };

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductInput>(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = async () => { setLoading(true); setError(""); try { setProducts(await api.products.getAll()); } catch (err) { setError(err instanceof Error ? err.message : "Could not load products."); } finally { setLoading(false); } };
  useEffect(() => {
    let active = true;
    api.products.getAll().then((data) => { if (active) setProducts(data); }).catch((err: unknown) => { if (active) setError(err instanceof Error ? err.message : "Could not load products."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map((product) => product.category).filter(Boolean)))];
  const visibleProducts = products.filter((product) => {
    const matchesQuery = `${product.name} ${product.flavor} ${product.category}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (category === "All" || product.category === category);
  });

  const updateField = (field: keyof ProductInput, value: string | number | boolean) => setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setError("");
    try { if (editingId) await api.products.update(editingId, form); else await api.products.create(form); setForm(emptyProduct); setEditingId(null); await loadProducts(); } catch (err) { setError(err instanceof Error ? err.message : "Could not save product."); } finally { setSaving(false); }
  };
  const edit = (product: Product) => { setEditingId(product._id); setForm({ ...product, badge: product.badge || "" }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const remove = async (id: string) => { if (!window.confirm("Delete this product?")) return; try { await api.products.remove(id); setProducts((current) => current.filter((product) => product._id !== id)); } catch (err) { setError(err instanceof Error ? err.message : "Could not delete product."); } };
  const toggle = async (product: Product, field: "inStock" | "featured") => { try { const updated = await api.products.update(product._id, { [field]: !product[field] }); setProducts((current) => current.map((item) => item._id === updated._id ? updated : item)); } catch (err) { setError(err instanceof Error ? err.message : "Could not update product."); } };

  return <section className={styles.page}>
    <header className={styles.header}><div><span className="eyebrow">Catalogue</span><h1>Products</h1><p>Manage the products shown in your MAZOE storefront.</p></div><button className={styles.addButton} type="button" onClick={() => { setEditingId(null); setForm(emptyProduct); }}>+ Add product</button></header>
    {error && <div className={styles.error} role="alert">{error}</div>}
    <form className={styles.form} onSubmit={submit}><div className={styles.formHeader}><h2>{editingId ? "Edit product" : "Add product"}</h2>{editingId && <button type="button" className={styles.cancel} onClick={() => { setEditingId(null); setForm(emptyProduct); }}>Cancel</button>}</div><div className={styles.fields}>
      {([["name", "Name"], ["description", "Description"], ["category", "Category"], ["flavor", "Flavor"], ["packSize", "Pack size"], ["image", "Image URL"], ["bgImage", "Background image URL"], ["price", "Price"], ["stock", "Stock quantity"]] as [keyof ProductInput, string][]).map(([field, label]) => <label key={field}>{label}<input required={field === "name" || field === "price"} type={field === "price" || field === "stock" ? "number" : "text"} min={field === "price" || field === "stock" ? "0" : undefined} step={field === "price" ? "0.01" : field === "stock" ? "1" : undefined} value={String(form[field])} onChange={(event) => updateField(field, field === "price" || field === "stock" ? Number(event.target.value) : event.target.value)} /></label>)}
      <label className={styles.checkbox}><input type="checkbox" checked={form.inStock} onChange={(event) => updateField("inStock", event.target.checked)} /> In stock</label><label className={styles.checkbox}><input type="checkbox" checked={form.featured} onChange={(event) => updateField("featured", event.target.checked)} /> Featured</label>
    </div><button className={styles.save} disabled={saving} type="submit">{saving ? "Saving..." : editingId ? "Save changes" : "Create product"}</button></form>
    <div className={styles.toolbar}><input aria-label="Search products" placeholder="Search products..." value={query} onChange={(event) => setQuery(event.target.value)} /><select aria-label="Filter by category" value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></div>
    <div className={styles.tableWrap}>{loading ? <p className={styles.message}>Loading products...</p> : visibleProducts.length === 0 ? <p className={styles.message}>No products match this view.</p> : <table><thead><tr><th>Product</th><th>Category</th><th>Flavor</th><th>Pack size</th><th>Price</th><th>Units left</th><th>Stock</th><th>Featured</th><th>Actions</th></tr></thead><tbody>{visibleProducts.map((product) => <tr key={product._id}><td><div className={styles.productCell}><span className={styles.thumbnail} style={{ backgroundImage: product.image ? `url("${product.image}")` : undefined }} />{product.name}</div></td><td>{product.category}</td><td>{product.flavor}</td><td>{product.packSize}</td><td>${product.price.toFixed(2)}</td><td>{product.stock}</td><td><button className={product.inStock && product.stock > 0 ? styles.statusOn : styles.statusOff} type="button" onClick={() => void toggle(product, "inStock")}>{product.inStock && product.stock > 0 ? "In stock" : "Out"}</button></td><td><button className={product.featured ? styles.statusOn : styles.statusOff} type="button" onClick={() => void toggle(product, "featured")}>{product.featured ? "Yes" : "No"}</button></td><td><button className={styles.action} type="button" onClick={() => edit(product)}>Edit</button><button className={styles.delete} type="button" onClick={() => void remove(product._id)}>Delete</button></td></tr>)}</tbody></table>}</div>
  </section>;
}