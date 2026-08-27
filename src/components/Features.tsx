const features = [
  {
    title: "Freshly sourced",
    description: "Every bottle is chosen for the quality and taste families expect.",
  },
  {
    title: "Fast delivery",
    description: "Our ordering experience is designed to keep shelves stocked and customers happy.",
  },
  {
    title: "Loved locally",
    description: "Built around the flavours and moments that matter in Zimbabwe every day.",
  },
];

export default function Features() {
  return (
    <section className="features-section" aria-label="Brand features">
      <div className="section-heading">
        <span className="eyebrow">Why choose us</span>
        <h2>Refreshment crafted for daily life.</h2>
      </div>

      <div className="feature-grid">
        {features.map((feature) => (
          <article key={feature.title} className="feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>

      <style jsx>{`
        .features-section {
          padding: 32px 5vw 72px;
          background: #ffffff;
        }

        .section-heading {
          max-width: 620px;
          margin: 0 auto 28px;
          text-align: center;
        }

        .eyebrow {
          color: #ff9418;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        h2 {
          margin: 12px 0 0;
          color: #163b2d;
          font-family: Georgia, serif;
          font-size: clamp(2rem, 4vw, 3rem);
          line-height: 1.1;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feature-card {
          padding: 28px 22px;
          border: 1px solid rgba(22, 59, 45, 0.08);
          border-radius: 22px;
          background: linear-gradient(180deg, #ffffff 0%, #f7faf8 100%);
          box-shadow: 0 18px 32px rgba(16, 36, 31, 0.04);
        }

        .feature-card h3 {
          margin: 0 0 10px;
          color: #163b2d;
          font-size: 1.3rem;
        }

        .feature-card p {
          margin: 0;
          color: #536e68;
          line-height: 1.7;
        }

        @media (max-width: 900px) {
          .feature-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
