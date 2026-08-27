import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="site-width hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">The original Zimbabwean refreshment</span>
          <h1>Make room for <em>goodness.</em></h1>
          <p>Fruit-forward flavour, made for the people and moments that make every day worth celebrating.</p>
          <div className="hero-actions"><Link href="/shop" className="primary-button">Shop Now <span aria-hidden="true">&#8599;</span></Link><Link href="#story" className="text-link">Why Mazoe <span aria-hidden="true">&#8594;</span></Link></div>
          <div className="hero-proof"><span>01</span><i /><span>Made with real fruit flavour</span></div>
        </div>
        <div className="hero-art" aria-label="Mazoe Orange Crush product">
          <div className="art-label">Orange Crush<br /><strong>6 x 2L</strong></div>
          <div className="art-circle" />
          <Image src="/products/mazoe-orange-crush.png" alt="Mazoe Orange Crush" width={540} height={540} priority className="hero-bottle" />
          <span className="art-caption">A taste of home</span>
        </div>
      </div>
    </section>
  );
}
