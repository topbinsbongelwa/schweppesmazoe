"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { api, Product } from "../lib/api";

const FALLBACK_PRODUCTS: Product[] = [
  { _id: "orange", name: "Mazoe Orange Crush", description: "The iconic taste of real fruit flavour.", price: 21.51, category: "mazoe", flavor: "Orange Crush", packSize: "6 x 2L", image: "/products/mazoe-orange-crush.png", bgImage: "/products/mazoe-orange-crush.png", inStock: true, featured: true, badge: "Bestseller" },
  { _id: "blackberry", name: "Mazoe Blackberry", description: "Deep berry flavour for the whole family.", price: 19, category: "mazoe", flavor: "Blackberry", packSize: "6 x 2L", image: "/products/mazoe-blackberry.png", bgImage: "/products/mazoe-blackberry.png", inStock: true, featured: false, badge: "" },
  { _id: "cream", name: "Mazoe Cream Soda", description: "A smooth, creamy Mazoe original.", price: 15.8, category: "mazoe", flavor: "Cream Soda", packSize: "6 x 2L", image: "/products/mazoe-cream-soda.png", bgImage: "/products/mazoe-cream-soda.png", inStock: true, featured: false, badge: "New" },
  { _id: "raspberry", name: "Mazoe Raspberry", description: "Bright, sweet and tangy refreshment.", price: 15.8, category: "mazoe", flavor: "Raspberry", packSize: "6 x 2L", image: "/products/mazoe-raspberry.png", bgImage: "/products/mazoe-raspberry.png", inStock: true, featured: false, badge: "" },
];

type ProductsProps = { onAddToCart: (name: string) => void };

export default function Products({ onAddToCart }: ProductsProps) {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    api.products.getAll().then((data) => { if (data.length) setProducts(data); setConnected(true); }).catch(() => undefined).finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === "all" ? products : products.filter((product) => product.category === activeFilter);

  return (
    <section className="products-section" id="products">
      <div className="site-width">
        <div className="products-heading"><div><span className="eyebrow">From our shelves</span><h2>Find your flavour.</h2></div><div className="api-status"><span className={connected ? "status-dot live" : "status-dot"} />{connected ? "Live catalogue" : "Shop preview"}</div></div>
        <div className="filter-bar">{["all", "mazoe"].map((filter) => <button key={filter} className={activeFilter === filter ? "filter-button active" : "filter-button"} onClick={() => setActiveFilter(filter)}>{filter === "all" ? "All products" : "Mazoe"}</button>)}</div>
        <div className="product-grid">
          {loading ? [1, 2, 3, 4].map((item) => <div className="product-card loading-card" key={item} />) : filtered.map((product) => <article className="product-card" key={product._id}>
            <button className="product-image product-image-button" type="button" onClick={() => setSelectedProduct(product)} aria-label={`View ${product.name}`}>
              <span className="product-category">{product.badge || "Mazoe"}</span><Image src={product.image} alt={product.name} width={320} height={320} />
              <span className="image-hint">View pour</span>
            </button>
            <div className="product-details"><span className="product-flavour">{product.flavor}</span><h3>{product.name}</h3><p>{product.description}</p><div className="product-bottom"><strong>${product.price.toFixed(2)}</strong><span>{product.packSize}</span></div><button className="add-button" onClick={() => onAddToCart(product.name)}>Add to basket <span aria-hidden="true">&#8594;</span></button></div>
          </article>)}
        </div>
      </div>
      {selectedProduct && <div className="product-lightbox" role="presentation" onClick={() => setSelectedProduct(null)}>
        <div className="product-lightbox-panel" role="dialog" aria-modal="true" aria-label={selectedProduct.name} onClick={(event) => event.stopPropagation()}>
          <button className="lightbox-close" type="button" onClick={() => setSelectedProduct(null)} aria-label="Close product view">&#10005;</button>
          <div className="lightbox-art" style={{ background: selectedProduct.bgImage || "#f6ddc5" }}>
            <span className="lightbox-ring ring-one" /><span className="lightbox-ring ring-two" />
            <Image src={selectedProduct.image} alt="" width={560} height={560} priority />
          </div>
          <div className="lightbox-copy"><span className="eyebrow">{selectedProduct.flavor}</span><h3>{selectedProduct.name}</h3><p>{selectedProduct.description}</p><strong>${selectedProduct.price.toFixed(2)}</strong><button className="primary-button" type="button" onClick={() => { onAddToCart(selectedProduct.name); setSelectedProduct(null); }}>Add to basket <span aria-hidden="true">&#8594;</span></button></div>
        </div>
      </div>}
    </section>
  );
}
