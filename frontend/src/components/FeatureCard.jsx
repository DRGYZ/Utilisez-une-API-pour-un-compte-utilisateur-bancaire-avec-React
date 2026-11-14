export default function FeatureCard({ icon, alt, title, children }) {
  return (
    <article className="feature-card feature-item">
      <div className="feature-icon-wrap">
        <img src={icon} alt={alt} className="feature-icon-img feature-icon" />
      </div>
      <h3 className="feature-title feature-item-title">{title}</h3>
      <p className="feature-desc">{children}</p>
    </article>
  )
}
